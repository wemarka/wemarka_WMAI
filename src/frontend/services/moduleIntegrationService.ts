import { supabase } from "@/lib/supabase";

/**
 * Service for managing integrations between different modules
 */
export interface ModuleIntegration {
  id?: string;
  sourceModuleId: string;
  sourceModuleName: string;
  targetModuleId: string;
  targetModuleName: string;
  integrationType: "data" | "navigation" | "workflow" | "notification";
  integrationDetails: Record<string, any>;
  status: "active" | "inactive" | "pending";
}

/**
 * Create a new module integration
 */
export const createModuleIntegration = async (
  integration: Omit<ModuleIntegration, "id">,
): Promise<{ data: ModuleIntegration | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from("module_integrations")
      .insert({
        source_module_id: integration.sourceModuleId,
        source_module_name: integration.sourceModuleName,
        target_module_id: integration.targetModuleId,
        target_module_name: integration.targetModuleName,
        integration_type: integration.integrationType,
        integration_details: integration.integrationDetails,
        status: integration.status,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating module integration:", error);
      return { data: null, error };
    }

    return {
      data: {
        id: data.id,
        sourceModuleId: data.source_module_id,
        sourceModuleName: data.source_module_name,
        targetModuleId: data.target_module_id,
        targetModuleName: data.target_module_name,
        integrationType: data.integration_type,
        integrationDetails: data.integration_details,
        status: data.status,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error in createModuleIntegration:", error);
    return { data: null, error };
  }
};

/**
 * Get all integrations for a specific module
 */
export const getModuleIntegrations = async (
  moduleName: string,
): Promise<{ data: ModuleIntegration[]; error: any }> => {
  try {
    const { data, error } = await supabase
      .from("module_integrations")
      .select("*")
      .or(
        `source_module_name.eq.${moduleName},target_module_name.eq.${moduleName}`,
      )
      .eq("status", "active");

    if (error) {
      console.error("Error fetching module integrations:", error);
      return { data: [], error };
    }

    const formattedData = data.map((item) => ({
      id: item.id,
      sourceModuleId: item.source_module_id,
      sourceModuleName: item.source_module_name,
      targetModuleId: item.target_module_id,
      targetModuleName: item.target_module_name,
      integrationType: item.integration_type,
      integrationDetails: item.integration_details,
      status: item.status,
    }));

    return { data: formattedData, error: null };
  } catch (error) {
    console.error("Error in getModuleIntegrations:", error);
    return { data: [], error };
  }
};

/**
 * Get all integrations in the system
 */
export const getAllIntegrations = async (): Promise<{
  data: ModuleIntegration[];
  error: any;
}> => {
  try {
    const { data, error } = await supabase
      .from("module_integrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all module integrations:", error);
      return { data: [], error };
    }

    const formattedData = data.map((item) => ({
      id: item.id,
      sourceModuleId: item.source_module_id,
      sourceModuleName: item.source_module_name,
      targetModuleId: item.target_module_id,
      targetModuleName: item.target_module_name,
      integrationType: item.integration_type,
      integrationDetails: item.integration_details,
      status: item.status,
    }));

    return { data: formattedData, error: null };
  } catch (error) {
    console.error("Error in getAllIntegrations:", error);
    return { data: [], error };
  }
};

/**
 * Update an existing module integration
 */
export const updateModuleIntegration = async (
  id: string,
  updates: Partial<ModuleIntegration>,
): Promise<{ success: boolean; error: any }> => {
  try {
    const updateData: any = {};

    if (updates.sourceModuleId)
      updateData.source_module_id = updates.sourceModuleId;
    if (updates.sourceModuleName)
      updateData.source_module_name = updates.sourceModuleName;
    if (updates.targetModuleId)
      updateData.target_module_id = updates.targetModuleId;
    if (updates.targetModuleName)
      updateData.target_module_name = updates.targetModuleName;
    if (updates.integrationType)
      updateData.integration_type = updates.integrationType;
    if (updates.integrationDetails)
      updateData.integration_details = updates.integrationDetails;
    if (updates.status) updateData.status = updates.status;

    const { error } = await supabase
      .from("module_integrations")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating module integration:", error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error in updateModuleIntegration:", error);
    return { success: false, error };
  }
};

/**
 * Delete a module integration
 */
export const deleteModuleIntegration = async (
  id: string,
): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase
      .from("module_integrations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting module integration:", error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error in deleteModuleIntegration:", error);
    return { success: false, error };
  }
};

/**
 * Get all modules that integrate with a specific module
 */
export const getRelatedModules = async (
  moduleName: string,
): Promise<{ data: string[]; error: any }> => {
  try {
    const { data: sourceData, error: sourceError } = await supabase
      .from("module_integrations")
      .select("target_module_name")
      .eq("source_module_name", moduleName)
      .eq("status", "active");

    if (sourceError) {
      console.error("Error fetching source module integrations:", sourceError);
      return { data: [], error: sourceError };
    }

    const { data: targetData, error: targetError } = await supabase
      .from("module_integrations")
      .select("source_module_name")
      .eq("target_module_name", moduleName)
      .eq("status", "active");

    if (targetError) {
      console.error("Error fetching target module integrations:", targetError);
      return { data: [], error: targetError };
    }

    // Combine and deduplicate module names
    const relatedModules = [
      ...sourceData.map((item) => item.target_module_name),
      ...targetData.map((item) => item.source_module_name),
    ];

    const uniqueModules = [...new Set(relatedModules)];

    return { data: uniqueModules, error: null };
  } catch (error) {
    console.error("Error in getRelatedModules:", error);
    return { data: [], error };
  }
};

/**
 * Get integration statistics
 */
export const getIntegrationStatistics = async (): Promise<{
  data: any;
  error: any;
}> => {
  try {
    // Try to get statistics from the view first
    const { data: viewStats, error: viewError } = await supabase
      .from("module_integration_stats")
      .select("*")
      .single();

    if (!viewError && viewStats) {
      return { data: viewStats, error: null };
    }

    // Fallback to calculating statistics manually
    const { data: integrations, error } = await getAllIntegrations();

    if (error) {
      return { data: null, error };
    }

    // Calculate statistics
    const stats = {
      totalIntegrations: integrations.length,
      activeIntegrations: integrations.filter((i) => i.status === "active")
        .length,
      inactiveIntegrations: integrations.filter((i) => i.status === "inactive")
        .length,
      pendingIntegrations: integrations.filter((i) => i.status === "pending")
        .length,
      integrationTypes: {} as Record<string, number>,
      moduleConnections: {} as Record<string, number>,
    };

    // Count integration types
    integrations.forEach((integration) => {
      const type = integration.integrationType;
      stats.integrationTypes[type] = (stats.integrationTypes[type] || 0) + 1;

      // Count module connections
      stats.moduleConnections[integration.sourceModuleName] =
        (stats.moduleConnections[integration.sourceModuleName] || 0) + 1;
      stats.moduleConnections[integration.targetModuleName] =
        (stats.moduleConnections[integration.targetModuleName] || 0) + 1;
    });

    return { data: stats, error: null };
  } catch (error) {
    console.error("Error in getIntegrationStatistics:", error);
    return { data: null, error };
  }
};

// Export the service object
export const moduleIntegrationService = {
  createModuleIntegration,
  getModuleIntegrations,
  getAllIntegrations,
  updateModuleIntegration,
  deleteModuleIntegration,
  getRelatedModules,
  getIntegrationStatistics,
};
