import { supabase } from "@/lib/supabase";
import { Roadmap } from "./projectAnalysisService";

export interface RoadmapHistoryItem {
  id: string;
  name: string;
  description: string;
  roadmapData: Roadmap;
  createdAt: string;
  createdBy: string;
  status: "active" | "archived" | "deleted";
}

/**
 * Get all saved roadmaps
 */
export const getSavedRoadmaps = async (): Promise<RoadmapHistoryItem[]> => {
  try {
    // Check if Supabase client is properly initialized
    if (!supabase || !supabase.from) {
      console.warn("Supabase client not properly initialized");
      return [];
    }

    // First check if the table exists by trying to get a single row
    const { error: tableCheckError } = await supabase
      .from("project_roadmaps")
      .select("id")
      .limit(1);

    // If we get a specific error about the relation not existing, return empty array
    if (
      tableCheckError &&
      (tableCheckError.message.includes(
        'relation "project_roadmaps" does not exist',
      ) ||
        tableCheckError.message.includes("Supabase credentials not found") ||
        tableCheckError.message.includes("JWT") ||
        tableCheckError.message.includes("auth") ||
        tableCheckError.message.includes("connection"))
    ) {
      console.warn(
        "project_roadmaps table does not exist yet or credentials issue:",
        tableCheckError.message,
      );
      return [];
    }

    const { data, error } = await supabase
      .from("project_roadmaps")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching saved roadmaps:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      roadmapData: item.roadmap_data,
      createdAt: item.created_at,
      createdBy: item.created_by,
      status: item.status,
    }));
  } catch (error) {
    console.error("Error in getSavedRoadmaps:", error);
    return [];
  }
};

/**
 * Get a specific roadmap by ID
 */
export const getRoadmapById = async (
  id: string,
): Promise<RoadmapHistoryItem | null> => {
  try {
    const { data, error } = await supabase
      .from("project_roadmaps")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching roadmap by ID:", error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      roadmapData: data.roadmap_data,
      createdAt: data.created_at,
      createdBy: data.created_by,
      status: data.status,
    };
  } catch (error) {
    console.error("Error in getRoadmapById:", error);
    return null;
  }
};

/**
 * Archive a roadmap
 */
export const archiveRoadmap = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("project_roadmaps")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error archiving roadmap:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in archiveRoadmap:", error);
    return false;
  }
};

/**
 * Delete a roadmap
 */
export const deleteRoadmap = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("project_roadmaps")
      .update({ status: "deleted", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error deleting roadmap:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteRoadmap:", error);
    return false;
  }
};

/**
 * Compare two roadmaps and identify differences
 */
export const compareRoadmaps = (roadmap1: Roadmap, roadmap2: Roadmap): any => {
  // Enhanced implementation with more detailed comparison
  const phases1Names = new Set(roadmap1.phases.map((p) => p.name));
  const phases2Names = new Set(roadmap2.phases.map((p) => p.name));

  const addedPhases = roadmap2.phases.filter((p) => !phases1Names.has(p.name));
  const removedPhases = roadmap1.phases.filter(
    (p) => !phases2Names.has(p.name),
  );

  const commonPhaseNames = [...phases1Names].filter((name) =>
    phases2Names.has(name),
  );
  const modifiedPhases = commonPhaseNames
    .map((name) => {
      const phase1 = roadmap1.phases.find((p) => p.name === name);
      const phase2 = roadmap2.phases.find((p) => p.name === name);

      if (!phase1 || !phase2) return null;

      // Enhanced task comparison with more details
      const taskChanges = {
        added: phase2.tasks.filter((t) => !phase1.tasks.includes(t)),
        removed: phase1.tasks.filter((t) => !phase2.tasks.includes(t)),
        unchanged: phase1.tasks.filter((t) => phase2.tasks.includes(t)),
      };

      // Detailed property comparisons
      const priorityChanged = phase1.priority !== phase2.priority;
      const durationChanged = phase1.duration !== phase2.duration;
      const descriptionChanged = phase1.description !== phase2.description;

      // Compare dependencies if they exist
      const dependenciesChanged =
        phase1.dependencies && phase2.dependencies
          ? JSON.stringify(phase1.dependencies.sort()) !==
            JSON.stringify(phase2.dependencies.sort())
          : phase1.dependencies || phase2.dependencies
            ? true
            : false;

      const dependencyChanges =
        phase1.dependencies && phase2.dependencies
          ? {
              added: phase2.dependencies.filter(
                (d) => !phase1.dependencies.includes(d),
              ),
              removed: phase1.dependencies.filter(
                (d) => !phase2.dependencies.includes(d),
              ),
            }
          : { added: [], removed: [] };

      if (
        taskChanges.added.length > 0 ||
        taskChanges.removed.length > 0 ||
        priorityChanged ||
        durationChanged ||
        descriptionChanged ||
        dependenciesChanged
      ) {
        return {
          name,
          taskChanges,
          priorityChanged: priorityChanged
            ? { from: phase1.priority, to: phase2.priority }
            : null,
          durationChanged: durationChanged
            ? { from: phase1.duration, to: phase2.duration }
            : null,
          descriptionChanged,
          dependenciesChanged: dependenciesChanged ? dependencyChanges : null,
          // Add metadata for analysis
          metadata: {
            taskCount: {
              before: phase1.tasks.length,
              after: phase2.tasks.length,
            },
            taskChangePercentage:
              phase1.tasks.length > 0
                ? ((taskChanges.added.length + taskChanges.removed.length) /
                    phase1.tasks.length) *
                  100
                : 0,
            priorityLevel: {
              before: getPriorityLevel(phase1.priority),
              after: getPriorityLevel(phase2.priority),
            },
            priorityChange: priorityChanged
              ? getPriorityLevel(phase2.priority) -
                getPriorityLevel(phase1.priority)
              : 0,
          },
        };
      }

      return null;
    })
    .filter(Boolean);

  // Calculate overall statistics
  const totalTasksBefore = roadmap1.phases.reduce(
    (sum, phase) => sum + phase.tasks.length,
    0,
  );
  const totalTasksAfter = roadmap2.phases.reduce(
    (sum, phase) => sum + phase.tasks.length,
    0,
  );

  // Count added and removed tasks
  const addedTasksCount =
    addedPhases.reduce((sum, phase) => sum + phase.tasks.length, 0) +
    modifiedPhases.reduce(
      (sum, phase) => sum + phase.taskChanges.added.length,
      0,
    );

  const removedTasksCount =
    removedPhases.reduce((sum, phase) => sum + phase.tasks.length, 0) +
    modifiedPhases.reduce(
      (sum, phase) => sum + phase.taskChanges.removed.length,
      0,
    );

  return {
    addedPhases,
    removedPhases,
    modifiedPhases,
    summaryChanged: roadmap1.summary !== roadmap2.summary,
    statistics: {
      phaseCount: {
        before: roadmap1.phases.length,
        after: roadmap2.phases.length,
      },
      taskCount: { before: totalTasksBefore, after: totalTasksAfter },
      addedTasksCount,
      removedTasksCount,
      changePercentage:
        totalTasksBefore > 0
          ? ((addedTasksCount + removedTasksCount) / totalTasksBefore) * 100
          : 0,
    },
  };
};

// Helper function to convert priority string to numeric level for comparison
function getPriorityLevel(priority: string): number {
  switch (priority.toLowerCase()) {
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
}

// Export the service object for use in components
export const roadmapHistoryService = {
  getSavedRoadmaps,
  getRoadmapById,
  archiveRoadmap,
  deleteRoadmap,
  compareRoadmaps,
};
