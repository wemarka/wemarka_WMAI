import { supabase } from "@/lib/supabase";

/**
 * Validate if previous phases are complete before beginning a new phase
 * @param phaseNumber The phase number to validate (e.g., 3 for Phase 3)
 * @returns An object with validation result and message
 */
export const validatePhasePrerequisites = async (
  phaseNumber: number,
): Promise<{ valid: boolean; message: string }> => {
  try {
    if (phaseNumber <= 1) {
      // Phase 1 has no prerequisites
      return { valid: true, message: "No prerequisites needed for Phase 1" };
    }

    // Check all previous phases
    const { data: previousPhases, error } = await supabase
      .from("project_stages")
      .select("*")
      .lt("order", phaseNumber) // Assuming phases have an 'order' field
      .order("order", { ascending: true });

    if (error) {
      console.error("Error fetching previous phases:", error);
      return {
        valid: false,
        message: `Error validating prerequisites: ${error.message}`,
      };
    }

    // If we can't find previous phases, use phase names as fallback
    if (!previousPhases || previousPhases.length === 0) {
      const phaseNames = [];
      for (let i = 1; i < phaseNumber; i++) {
        phaseNames.push(`Phase ${i}`);
      }

      const { data: namedPhases, error: nameError } = await supabase
        .from("project_stages")
        .select("*")
        .in("name", phaseNames);

      if (nameError || !namedPhases || namedPhases.length === 0) {
        console.error("Error fetching phases by name:", nameError);
        return {
          valid: false,
          message: "Could not find previous phases to validate",
        };
      }

      // Check if all previous phases are complete
      const incompletePhases = namedPhases.filter(
        (phase) => phase.status !== "completed",
      );
      if (incompletePhases.length > 0) {
        const incompleteNames = incompletePhases.map((p) => p.name).join(", ");
        return {
          valid: false,
          message: `Cannot proceed: ${incompleteNames} must be completed first`,
        };
      }
    } else {
      // Check if all previous phases are complete
      const incompletePhases = previousPhases.filter(
        (phase) => phase.status !== "completed",
      );
      if (incompletePhases.length > 0) {
        const incompleteNames = incompletePhases.map((p) => p.name).join(", ");
        return {
          valid: false,
          message: `Cannot proceed: ${incompleteNames} must be completed first`,
        };
      }
    }

    return { valid: true, message: "All prerequisites are complete" };
  } catch (error) {
    console.error("Error in validatePhasePrerequisites:", error);
    return {
      valid: false,
      message: `Error validating prerequisites: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};

/**
 * Update a project stage status to 'in-progress' and set any other in-progress stages to 'planned'
 * @param stageId The ID of the stage to set as in-progress
 * @param validatePrerequisites Whether to validate prerequisites before beginning the stage
 */
export const beginProjectStage = async (
  stageId: string,
  validatePrerequisites: boolean = false,
): Promise<{ success: boolean; message: string }> => {
  try {
    // First, get the stage details to check phase number if validation is requested
    if (validatePrerequisites) {
      const { data: stage, error: stageError } = await supabase
        .from("project_stages")
        .select("*")
        .eq("id", stageId)
        .single();

      if (stageError || !stage) {
        console.error("Error fetching stage details:", stageError);
        return {
          success: false,
          message: "Could not fetch stage details for validation",
        };
      }

      // Extract phase number from name (e.g., "Phase 3" -> 3)
      const phaseMatch = stage.name.match(/Phase\s+(\d+)/i);
      if (phaseMatch && phaseMatch[1]) {
        const phaseNumber = parseInt(phaseMatch[1], 10);

        // Validate prerequisites
        const validation = await validatePhasePrerequisites(phaseNumber);
        if (!validation.valid) {
          return { success: false, message: validation.message };
        }
      }
    }

    // Start a transaction to ensure data consistency
    const { error } = await supabase.rpc("begin_project_stage", {
      stage_id: stageId,
    });

    if (error) {
      console.error("Error beginning project stage with RPC:", error);

      // Fallback implementation if the RPC doesn't exist
      // First, update any current in-progress stages to planned
      const { error: updateError } = await supabase
        .from("project_stages")
        .update({ status: "planned" })
        .eq("status", "in-progress");

      if (updateError) {
        console.error(
          "Error updating existing in-progress stages:",
          updateError,
        );
        return { success: false, message: "Failed to update existing stages" };
      }

      // Then set the requested stage to in-progress
      const { error: setError } = await supabase
        .from("project_stages")
        .update({ status: "in-progress" })
        .eq("id", stageId);

      if (setError) {
        console.error("Error setting stage to in-progress:", setError);
        return {
          success: false,
          message: "Failed to set stage to in-progress",
        };
      }
    }

    return { success: true, message: "Stage successfully set to in-progress" };
  } catch (error) {
    console.error("Error in beginProjectStage:", error);
    return {
      success: false,
      message: `Error beginning project stage: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};

/**
 * Get a project stage by name
 * @param stageName The name of the stage to find
 */
export const getProjectStageByName = async (
  stageName: string,
): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from("project_stages")
      .select("*")
      .ilike("name", `%${stageName}%`)
      .single();

    if (error) {
      console.error("Error fetching project stage by name:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getProjectStageByName:", error);
    return null;
  }
};

/**
 * Check if a specific task is unlocked based on phase status
 * @param taskName The name of the task to check
 * @returns Whether the task is unlocked
 */
export const isTaskUnlocked = async (taskName: string): Promise<boolean> => {
  try {
    // Map tasks to their required phases
    const taskPhaseMap: Record<string, string> = {
      PerformanceMetricsDashboard: "Phase 3",
      // Add other task-phase mappings as needed
    };

    const requiredPhase = taskPhaseMap[taskName];
    if (!requiredPhase) {
      // If task is not in the map, default to unlocked
      return true;
    }

    // Check if the required phase is in-progress or completed
    const phase = await getProjectStageByName(requiredPhase);
    if (!phase) {
      return false;
    }

    return phase.status === "in-progress" || phase.status === "completed";
  } catch (error) {
    console.error(`Error checking if task ${taskName} is unlocked:`, error);
    return false;
  }
};

export const projectStageService = {
  beginProjectStage,
  getProjectStageByName,
  validatePhasePrerequisites,
  isTaskUnlocked,
};
