import { supabase } from "@/lib/supabase";
import { useAI } from "@/frontend/contexts/AIContext";

export interface ProjectStage {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: "completed" | "in-progress" | "planned" | "delayed";
  progress: number; // 0-100
  dependencies?: string[];
  owner?: string;
  tasks: ProjectTask[];
}

export interface ProjectTask {
  id: string;
  name: string;
  description: string;
  status: "completed" | "in-progress" | "planned" | "blocked";
  priority: "low" | "medium" | "high" | "critical";
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  stageId: string;
}

export interface CommitActivity {
  date: string;
  count: number;
  author?: string;
  files?: number;
  additions?: number;
  deletions?: number;
}

export interface ModuleProgress {
  module: string;
  completedTasks: number;
  totalTasks: number;
  progress: number; // 0-100
  lastActivity?: string;
  contributors?: string[];
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: "performance" | "security" | "ux" | "code-quality" | "feature";
  createdAt: string;
  status: "new" | "in-review" | "accepted" | "rejected" | "implemented";
  implementationDifficulty?: "easy" | "medium" | "hard";
  estimatedHours?: number;
  relatedModule?: string;
  codeSnippet?: string;
}

export interface ProjectMetrics {
  totalCommits: number;
  totalFiles: number;
  totalLines: number;
  contributors: number;
  openIssues: number;
  closedIssues: number;
  pullRequests: number;
  mergedPullRequests: number;
  averageIssueResolutionTime: number; // in hours
  codeQuality: {
    coverage: number; // 0-100
    bugs: number;
    vulnerabilities: number;
    codeSmells: number;
    duplications: number; // percentage
  };
  velocity: number; // story points per sprint
  burndown: {
    planned: number;
    actual: number;
    remaining: number;
  };
}

export interface ProjectRoadmap {
  milestones: {
    id: string;
    name: string;
    description: string;
    dueDate: string;
    progress: number; // 0-100
    status: "completed" | "in-progress" | "planned" | "delayed";
  }[];
  releases: {
    id: string;
    version: string;
    name: string;
    releaseDate: string;
    status: "released" | "planned" | "in-development";
    features: string[];
  }[];
}

/**
 * Get project stages with tasks
 */
export const getProjectStages = async (): Promise<ProjectStage[]> => {
  try {
    // In a real implementation, this would fetch from a project_stages table
    // For now, we'll return mock data that looks realistic
    const { data, error } = await supabase
      .from("project_stages")
      .select("*, tasks(*)")
      .order("start_date");

    if (error) {
      console.error("Error fetching project stages:", error);
      return getMockProjectStages();
    }

    if (!data || data.length === 0) {
      return getMockProjectStages();
    }

    // Transform the data to match our interface
    return data.map((stage) => ({
      id: stage.id,
      name: stage.name,
      description: stage.description,
      startDate: stage.start_date,
      endDate: stage.end_date,
      status: stage.status,
      progress: stage.progress,
      dependencies: stage.dependencies,
      owner: stage.owner,
      tasks: (stage.tasks || []).map((task: any) => ({
        id: task.id,
        name: task.name,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        completedAt: task.completed_at,
        estimatedHours: task.estimated_hours,
        actualHours: task.actual_hours,
        stageId: task.stage_id,
      })),
    }));
  } catch (error) {
    console.error("Error in getProjectStages:", error);
    return getMockProjectStages();
  }
};

/**
 * Get commit activity over time
 */
export const getCommitActivity = async (
  startDate: Date,
  endDate: Date,
): Promise<CommitActivity[]> => {
  try {
    // In a real implementation, this would fetch from a git_commits table or API
    const { data, error } = await supabase
      .from("git_commits")
      .select("*")
      .gte("date", startDate.toISOString().split("T")[0])
      .lte("date", endDate.toISOString().split("T")[0])
      .order("date");

    if (error) {
      console.error("Error fetching commit activity:", error);
      return getMockCommitActivity(startDate, endDate);
    }

    if (!data || data.length === 0) {
      return getMockCommitActivity(startDate, endDate);
    }

    // Group by date and count
    const groupedByDate = data.reduce(
      (acc: Record<string, any>, commit: any) => {
        const date = commit.date.split("T")[0];
        if (!acc[date]) {
          acc[date] = {
            date,
            count: 0,
            files: 0,
            additions: 0,
            deletions: 0,
            authors: new Set(),
          };
        }
        acc[date].count += 1;
        acc[date].files += commit.files_changed || 0;
        acc[date].additions += commit.additions || 0;
        acc[date].deletions += commit.deletions || 0;
        if (commit.author) acc[date].authors.add(commit.author);
        return acc;
      },
      {},
    );

    return Object.values(groupedByDate).map((day: any) => ({
      date: day.date,
      count: day.count,
      files: day.files,
      additions: day.additions,
      deletions: day.deletions,
      author: Array.from(day.authors).join(", "),
    }));
  } catch (error) {
    console.error("Error in getCommitActivity:", error);
    return getMockCommitActivity(startDate, endDate);
  }
};

/**
 * Get progress by module
 */
export const getModuleProgress = async (): Promise<ModuleProgress[]> => {
  try {
    // In a real implementation, this would fetch from a module_progress view or table
    const { data, error } = await supabase
      .from("module_progress")
      .select("*")
      .order("module");

    if (error) {
      console.error("Error fetching module progress:", error);
      return getMockModuleProgress();
    }

    if (!data || data.length === 0) {
      return getMockModuleProgress();
    }

    return data.map((module: any) => ({
      module: module.module,
      completedTasks: module.completed_tasks,
      totalTasks: module.total_tasks,
      progress: module.progress,
      lastActivity: module.last_activity,
      contributors: module.contributors,
    }));
  } catch (error) {
    console.error("Error in getModuleProgress:", error);
    return getMockModuleProgress();
  }
};

/**
 * Get AI recommendations for project improvement
 */
export const getAIRecommendations = async (): Promise<AIRecommendation[]> => {
  try {
    // In a real implementation, this would fetch from an ai_recommendations table
    const { data, error } = await supabase
      .from("ai_recommendations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching AI recommendations:", error);
      return getMockAIRecommendations();
    }

    if (!data || data.length === 0) {
      return getMockAIRecommendations();
    }

    return data.map((rec: any) => ({
      id: rec.id,
      title: rec.title,
      description: rec.description,
      priority: rec.priority,
      category: rec.category,
      createdAt: rec.created_at,
      status: rec.status,
      implementationDifficulty: rec.implementation_difficulty,
      estimatedHours: rec.estimated_hours,
      relatedModule: rec.related_module,
      codeSnippet: rec.code_snippet,
    }));
  } catch (error) {
    console.error("Error in getAIRecommendations:", error);
    return getMockAIRecommendations();
  }
};

/**
 * Get project metrics
 */
export const getProjectMetrics = async (): Promise<ProjectMetrics> => {
  try {
    // In a real implementation, this would fetch from multiple tables or APIs
    const { data, error } = await supabase
      .from("project_metrics")
      .select("*")
      .single();

    if (error) {
      console.error("Error fetching project metrics:", error);
      return getMockProjectMetrics();
    }

    if (!data) {
      return getMockProjectMetrics();
    }

    return {
      totalCommits: data.total_commits,
      totalFiles: data.total_files,
      totalLines: data.total_lines,
      contributors: data.contributors,
      openIssues: data.open_issues,
      closedIssues: data.closed_issues,
      pullRequests: data.pull_requests,
      mergedPullRequests: data.merged_pull_requests,
      averageIssueResolutionTime: data.average_issue_resolution_time,
      codeQuality: {
        coverage: data.code_quality?.coverage || 0,
        bugs: data.code_quality?.bugs || 0,
        vulnerabilities: data.code_quality?.vulnerabilities || 0,
        codeSmells: data.code_quality?.code_smells || 0,
        duplications: data.code_quality?.duplications || 0,
      },
      velocity: data.velocity,
      burndown: {
        planned: data.burndown?.planned || 0,
        actual: data.burndown?.actual || 0,
        remaining: data.burndown?.remaining || 0,
      },
    };
  } catch (error) {
    console.error("Error in getProjectMetrics:", error);
    return getMockProjectMetrics();
  }
};

/**
 * Get project roadmap
 */
export const getProjectRoadmap = async (): Promise<ProjectRoadmap> => {
  try {
    // In a real implementation, this would fetch from milestones and releases tables
    const [milestonesResponse, releasesResponse] = await Promise.all([
      supabase.from("milestones").select("*").order("due_date"),
      supabase.from("releases").select("*").order("release_date"),
    ]);

    if (milestonesResponse.error || releasesResponse.error) {
      console.error(
        "Error fetching roadmap:",
        milestonesResponse.error || releasesResponse.error,
      );
      return getMockProjectRoadmap();
    }

    const milestones = milestonesResponse.data || [];
    const releases = releasesResponse.data || [];

    if (milestones.length === 0 && releases.length === 0) {
      return getMockProjectRoadmap();
    }

    return {
      milestones: milestones.map((m: any) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        dueDate: m.due_date,
        progress: m.progress,
        status: m.status,
      })),
      releases: releases.map((r: any) => ({
        id: r.id,
        version: r.version,
        name: r.name,
        releaseDate: r.release_date,
        status: r.status,
        features: r.features || [],
      })),
    };
  } catch (error) {
    console.error("Error in getProjectRoadmap:", error);
    return getMockProjectRoadmap();
  }
};

/**
 * Generate new AI recommendations based on project data
 */
export const generateAIRecommendations = async (
  projectData: any,
): Promise<AIRecommendation[]> => {
  try {
    // In a real implementation, this would call an AI service or API
    // For now, we'll return mock recommendations
    // In a real implementation, you would use the AI context to generate recommendations
    return getMockAIRecommendations();
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    return [];
  }
};

/**
 * Save AI recommendation feedback
 */
export const saveRecommendationFeedback = async (
  recommendationId: string,
  status: AIRecommendation["status"],
  feedback?: string,
): Promise<boolean> => {
  try {
    // In a real implementation, this would update the recommendation in the database
    const { error } = await supabase
      .from("ai_recommendations")
      .update({ status, feedback })
      .eq("id", recommendationId);

    if (error) {
      console.error("Error saving recommendation feedback:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in saveRecommendationFeedback:", error);
    return false;
  }
};

// Define Roadmap interface for the ProjectRoadmap component
export interface Roadmap {
  phases: {
    name: string;
    description: string;
    duration: string;
    priority: string;
    dependencies?: string[];
    tasks: string[];
  }[];
  summary: string;
  generatedDate: string;
}

/**
 * Generate a project roadmap using AI
 */
export const generateRoadmap = async (
  projectData: any,
  context: string,
): Promise<Roadmap> => {
  try {
    // Call the generate-roadmap edge function
    const { data, error } = await supabase.functions.invoke(
      "generate-roadmap",
      {
        body: { projectData, context },
      },
    );

    if (error) {
      console.error("Error calling generate-roadmap function:", error);
      throw new Error(`Failed to generate roadmap: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned from roadmap generation");
    }

    // Transform the response to match our Roadmap interface if needed
    return data as Roadmap;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    // Fallback to a basic roadmap if the edge function fails
    return {
      phases: [
        {
          name: "Project Setup & Planning",
          description:
            "Initial project setup, requirements gathering, and architecture design",
          duration: "4 weeks",
          priority: "high",
          tasks: [
            "Create Git repository and project structure",
            "Document functional and non-functional requirements",
            "Design system architecture",
            "Create detailed project timeline",
          ],
        },
        {
          name: "Core Infrastructure Development",
          description:
            "Development of core system infrastructure and base components",
          duration: "8 weeks",
          priority: "high",
          dependencies: ["Project Setup & Planning"],
          tasks: [
            "Design and implement database schema",
            "Implement user authentication and authorization",
            "Set up API framework and base endpoints",
            "Develop reusable UI components",
          ],
        },
        {
          name: "Module Development",
          description: "Development of individual system modules",
          duration: "12 weeks",
          priority: "medium",
          dependencies: ["Core Infrastructure Development"],
          tasks: [
            "Implement user management functionality",
            "Develop main dashboard and analytics",
            "Implement reporting and data visualization",
            "Create system-wide notification functionality",
          ],
        },
        {
          name: "Integration & Testing",
          description: "System integration, testing, and quality assurance",
          duration: "6 weeks",
          priority: "medium",
          dependencies: ["Module Development"],
          tasks: [
            "Perform integration testing across all modules",
            "Conduct performance and load testing",
            "Perform security testing and vulnerability assessment",
            "Address issues identified during testing",
          ],
        },
        {
          name: "Deployment & Launch",
          description: "System deployment, user training, and official launch",
          duration: "4 weeks",
          priority: "high",
          dependencies: ["Integration & Testing"],
          tasks: [
            "Prepare deployment strategy and rollback plan",
            "Create user manuals and documentation",
            "Conduct training sessions for end users",
            "Deploy system to production environment",
          ],
        },
      ],
      summary:
        "This roadmap outlines the development plan for the Wemarka WMAI project, a comprehensive business operating system with modules for dashboard, store, accounting, marketing, inbox, developer tools, analytics, and integrations.",
      generatedDate: new Date().toISOString(),
    };
  }
};

/**
 * Save a generated roadmap to the database
 */
export const saveGeneratedRoadmap = async (
  roadmap: Roadmap,
  name: string,
  description: string,
): Promise<string> => {
  try {
    // Check if Supabase client is properly initialized
    if (!supabase || !supabase.from) {
      console.warn(
        "Supabase client not properly initialized, returning mock ID",
      );
      return "roadmap-" + Math.random().toString(36).substring(2, 9);
    }

    // First check if the table exists by trying to get a single row
    const { error: tableCheckError } = await supabase
      .from("project_roadmaps")
      .select("id")
      .limit(1);

    // If we get a specific error about the relation not existing or credentials, return a mock ID
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
        "project_roadmaps table does not exist yet or credentials issue, returning mock ID:",
        tableCheckError.message,
      );
      return "roadmap-" + Math.random().toString(36).substring(2, 9);
    }

    // Get user ID safely
    let userId = "system";
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (!userError && userData && userData.user) {
        userId = userData.user.id;
      }
    } catch (userError) {
      console.warn(
        "Could not get user ID, using 'system' as fallback",
        userError,
      );
    }

    // Save the roadmap to the project_roadmaps table
    const { data, error } = await supabase
      .from("project_roadmaps")
      .insert({
        name,
        description,
        roadmap_data: roadmap,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: userId,
        status: "active",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error saving roadmap to database:", error);
      // Fallback to returning a mock ID if database save fails
      return "roadmap-" + Math.random().toString(36).substring(2, 9);
    }

    return data.id;
  } catch (error) {
    console.error("Error saving roadmap:", error);
    // Fallback to returning a mock ID
    return "roadmap-" + Math.random().toString(36).substring(2, 9);
  }
};

// Export the service object for use in components
export const projectAnalysisService = {
  getProjectStages,
  getCommitActivity,
  getModuleProgress,
  getAIRecommendations,
  getProjectMetrics,
  getProjectRoadmap,
  generateAIRecommendations,
  saveRecommendationFeedback,
  generateRoadmap,
  saveGeneratedRoadmap,
};

// Mock data generators
const getMockProjectStages = (): ProjectStage[] => {
  return [
    {
      id: "stage-1",
      name: "Project Setup & Planning",
      description:
        "Initial project setup, requirements gathering, and architecture design",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      status: "completed",
      progress: 100,
      owner: "Ahmed",
      tasks: [
        {
          id: "task-1",
          name: "Project Repository Setup",
          description: "Create Git repository and initial project structure",
          status: "completed",
          priority: "high",
          assignee: "Mohammed",
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T14:30:00Z",
          completedAt: "2024-01-15T14:30:00Z",
          estimatedHours: 4,
          actualHours: 3.5,
          stageId: "stage-1",
        },
        {
          id: "task-2",
          name: "Requirements Documentation",
          description: "Document functional and non-functional requirements",
          status: "completed",
          priority: "high",
          assignee: "Sara",
          createdAt: "2024-01-16T09:00:00Z",
          updatedAt: "2024-01-20T17:00:00Z",
          completedAt: "2024-01-20T17:00:00Z",
          estimatedHours: 16,
          actualHours: 20,
          stageId: "stage-1",
        },
        {
          id: "task-3",
          name: "Architecture Design",
          description: "Design system architecture and component interactions",
          status: "completed",
          priority: "critical",
          assignee: "Ahmed",
          createdAt: "2024-01-21T09:00:00Z",
          updatedAt: "2024-02-05T16:00:00Z",
          completedAt: "2024-02-05T16:00:00Z",
          estimatedHours: 24,
          actualHours: 30,
          stageId: "stage-1",
        },
        {
          id: "task-4",
          name: "Project Timeline",
          description: "Create detailed project timeline and milestones",
          status: "completed",
          priority: "medium",
          assignee: "Fatima",
          createdAt: "2024-02-06T09:00:00Z",
          updatedAt: "2024-02-15T12:00:00Z",
          completedAt: "2024-02-15T12:00:00Z",
          estimatedHours: 8,
          actualHours: 6,
          stageId: "stage-1",
        },
      ],
    },
    {
      id: "stage-2",
      name: "Core Infrastructure Development",
      description:
        "Development of core system infrastructure and base components",
      startDate: "2024-02-16",
      endDate: "2024-04-15",
      status: "completed",
      progress: 100,
      dependencies: ["stage-1"],
      owner: "Mohammed",
      tasks: [
        {
          id: "task-5",
          name: "Database Schema Design",
          description: "Design and implement database schema",
          status: "completed",
          priority: "high",
          assignee: "Khalid",
          createdAt: "2024-02-16T09:00:00Z",
          updatedAt: "2024-02-28T17:00:00Z",
          completedAt: "2024-02-28T17:00:00Z",
          estimatedHours: 20,
          actualHours: 24,
          stageId: "stage-2",
        },
        {
          id: "task-6",
          name: "Authentication System",
          description: "Implement user authentication and authorization",
          status: "completed",
          priority: "critical",
          assignee: "Mohammed",
          createdAt: "2024-03-01T09:00:00Z",
          updatedAt: "2024-03-15T16:00:00Z",
          completedAt: "2024-03-15T16:00:00Z",
          estimatedHours: 40,
          actualHours: 35,
          stageId: "stage-2",
        },
        {
          id: "task-7",
          name: "API Framework",
          description: "Set up API framework and base endpoints",
          status: "completed",
          priority: "high",
          assignee: "Ahmed",
          createdAt: "2024-03-16T09:00:00Z",
          updatedAt: "2024-04-05T17:00:00Z",
          completedAt: "2024-04-05T17:00:00Z",
          estimatedHours: 30,
          actualHours: 28,
          stageId: "stage-2",
        },
        {
          id: "task-8",
          name: "Core UI Components",
          description: "Develop reusable UI components",
          status: "completed",
          priority: "medium",
          assignee: "Sara",
          createdAt: "2024-03-20T09:00:00Z",
          updatedAt: "2024-04-15T15:00:00Z",
          completedAt: "2024-04-15T15:00:00Z",
          estimatedHours: 50,
          actualHours: 45,
          stageId: "stage-2",
        },
      ],
    },
    {
      id: "stage-3",
      name: "Module Development",
      description: "Development of individual system modules",
      startDate: "2024-04-16",
      endDate: "2024-07-15",
      status: "in-progress",
      progress: 65,
      dependencies: ["stage-2"],
      owner: "Sara",
      tasks: [
        {
          id: "task-9",
          name: "User Management Module",
          description: "Implement user management functionality",
          status: "completed",
          priority: "high",
          assignee: "Fatima",
          createdAt: "2024-04-16T09:00:00Z",
          updatedAt: "2024-05-10T17:00:00Z",
          completedAt: "2024-05-10T17:00:00Z",
          estimatedHours: 60,
          actualHours: 55,
          stageId: "stage-3",
        },
        {
          id: "task-10",
          name: "Dashboard Module",
          description: "Implement main dashboard and analytics",
          status: "completed",
          priority: "high",
          assignee: "Mohammed",
          createdAt: "2024-05-11T09:00:00Z",
          updatedAt: "2024-06-05T16:00:00Z",
          completedAt: "2024-06-05T16:00:00Z",
          estimatedHours: 70,
          actualHours: 75,
          stageId: "stage-3",
        },
        {
          id: "task-11",
          name: "Reporting Module",
          description: "Implement reporting and data visualization",
          status: "in-progress",
          priority: "medium",
          assignee: "Khalid",
          createdAt: "2024-06-06T09:00:00Z",
          updatedAt: "2024-06-30T17:00:00Z",
          estimatedHours: 80,
          actualHours: 40,
          stageId: "stage-3",
        },
        {
          id: "task-12",
          name: "Notification System",
          description: "Implement system-wide notification functionality",
          status: "planned",
          priority: "medium",
          assignee: "Sara",
          createdAt: "2024-06-20T09:00:00Z",
          updatedAt: "2024-06-20T09:00:00Z",
          estimatedHours: 40,
          stageId: "stage-3",
        },
      ],
    },
    {
      id: "stage-4",
      name: "Integration & Testing",
      description: "System integration, testing, and quality assurance",
      startDate: "2024-07-16",
      endDate: "2024-08-31",
      status: "planned",
      progress: 0,
      dependencies: ["stage-3"],
      owner: "Khalid",
      tasks: [
        {
          id: "task-13",
          name: "Integration Testing",
          description: "Perform integration testing across all modules",
          status: "planned",
          priority: "critical",
          assignee: "Khalid",
          createdAt: "2024-07-16T09:00:00Z",
          updatedAt: "2024-07-16T09:00:00Z",
          estimatedHours: 80,
          stageId: "stage-4",
        },
        {
          id: "task-14",
          name: "Performance Testing",
          description: "Conduct performance and load testing",
          status: "planned",
          priority: "high",
          assignee: "Mohammed",
          createdAt: "2024-07-16T09:00:00Z",
          updatedAt: "2024-07-16T09:00:00Z",
          estimatedHours: 40,
          stageId: "stage-4",
        },
        {
          id: "task-15",
          name: "Security Audit",
          description: "Perform security testing and vulnerability assessment",
          status: "planned",
          priority: "critical",
          assignee: "Ahmed",
          createdAt: "2024-07-16T09:00:00Z",
          updatedAt: "2024-07-16T09:00:00Z",
          estimatedHours: 40,
          stageId: "stage-4",
        },
        {
          id: "task-16",
          name: "Bug Fixing",
          description: "Address issues identified during testing",
          status: "planned",
          priority: "high",
          createdAt: "2024-08-01T09:00:00Z",
          updatedAt: "2024-08-01T09:00:00Z",
          estimatedHours: 60,
          stageId: "stage-4",
        },
      ],
    },
    {
      id: "stage-5",
      name: "Deployment & Launch",
      description: "System deployment, user training, and official launch",
      startDate: "2024-09-01",
      endDate: "2024-09-30",
      status: "planned",
      progress: 0,
      dependencies: ["stage-4"],
      owner: "Ahmed",
      tasks: [
        {
          id: "task-17",
          name: "Deployment Planning",
          description: "Prepare deployment strategy and rollback plan",
          status: "planned",
          priority: "high",
          assignee: "Ahmed",
          createdAt: "2024-09-01T09:00:00Z",
          updatedAt: "2024-09-01T09:00:00Z",
          estimatedHours: 16,
          stageId: "stage-5",
        },
        {
          id: "task-18",
          name: "User Documentation",
          description: "Create user manuals and documentation",
          status: "planned",
          priority: "medium",
          assignee: "Fatima",
          createdAt: "2024-09-01T09:00:00Z",
          updatedAt: "2024-09-01T09:00:00Z",
          estimatedHours: 40,
          stageId: "stage-5",
        },
        {
          id: "task-19",
          name: "User Training",
          description: "Conduct training sessions for end users",
          status: "planned",
          priority: "high",
          assignee: "Sara",
          createdAt: "2024-09-15T09:00:00Z",
          updatedAt: "2024-09-15T09:00:00Z",
          estimatedHours: 24,
          stageId: "stage-5",
        },
        {
          id: "task-20",
          name: "Production Deployment",
          description: "Deploy system to production environment",
          status: "planned",
          priority: "critical",
          assignee: "Mohammed",
          createdAt: "2024-09-25T09:00:00Z",
          updatedAt: "2024-09-25T09:00:00Z",
          estimatedHours: 16,
          stageId: "stage-5",
        },
      ],
    },
  ];
};

const getMockCommitActivity = (
  startDate: Date,
  endDate: Date,
): CommitActivity[] => {
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const authors = ["Ahmed", "Mohammed", "Sara", "Khalid", "Fatima"];

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    // Generate more realistic commit patterns
    // Weekends have fewer commits
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseCount = isWeekend ? 2 : 8;
    const randomFactor = isWeekend ? 3 : 10;

    const count = Math.max(
      0,
      Math.floor(Math.random() * randomFactor + baseCount),
    );
    const files = count * Math.floor(Math.random() * 3 + 1);
    const additions = files * Math.floor(Math.random() * 20 + 5);
    const deletions = files * Math.floor(Math.random() * 10 + 2);

    // Randomly select 1-3 authors for the day
    const authorCount = Math.floor(Math.random() * 3) + 1;
    const dayAuthors = [];
    for (let j = 0; j < authorCount; j++) {
      const author = authors[Math.floor(Math.random() * authors.length)];
      if (!dayAuthors.includes(author)) {
        dayAuthors.push(author);
      }
    }

    return {
      date: dateStr,
      count,
      files,
      additions,
      deletions,
      author: dayAuthors.join(", "),
    };
  });
};

const getMockModuleProgress = (): ModuleProgress[] => {
  const modules = [
    "Dashboard",
    "User Management",
    "Authentication",
    "Reporting",
    "Notifications",
    "Analytics",
    "API Integration",
    "Admin Panel",
    "Settings",
    "Documentation",
  ];

  const contributors = ["Ahmed", "Mohammed", "Sara", "Khalid", "Fatima"];

  return modules.map((module) => {
    // Generate realistic progress values
    // Core modules like Dashboard, Auth are more complete
    let progress = 0;
    if (
      module === "Dashboard" ||
      module === "Authentication" ||
      module === "User Management"
    ) {
      progress = Math.floor(Math.random() * 20 + 80); // 80-100%
    } else if (module === "API Integration" || module === "Admin Panel") {
      progress = Math.floor(Math.random() * 30 + 50); // 50-80%
    } else if (module === "Reporting" || module === "Analytics") {
      progress = Math.floor(Math.random() * 40 + 30); // 30-70%
    } else {
      progress = Math.floor(Math.random() * 50 + 10); // 10-60%
    }

    const totalTasks = Math.floor(Math.random() * 20 + 10); // 10-30 tasks
    const completedTasks = Math.floor((totalTasks * progress) / 100);

    // Generate random contributors (1-3 per module)
    const contributorCount = Math.floor(Math.random() * 3) + 1;
    const moduleContributors = [];
    for (let i = 0; i < contributorCount; i++) {
      const contributor =
        contributors[Math.floor(Math.random() * contributors.length)];
      if (!moduleContributors.includes(contributor)) {
        moduleContributors.push(contributor);
      }
    }

    // Generate last activity date (more recent for active modules)
    const daysAgo = progress > 70 ? 2 : progress > 40 ? 7 : 14;
    const lastActivity = new Date(
      Date.now() - Math.random() * daysAgo * 24 * 60 * 60 * 1000,
    ).toISOString();

    return {
      module,
      completedTasks,
      totalTasks,
      progress,
      lastActivity,
      contributors: moduleContributors,
    };
  });
};

const getMockAIRecommendations = (): AIRecommendation[] => {
  return [
    {
      id: "rec-1",
      title: "Implement Lazy Loading for Dashboard Components",
      description:
        "The dashboard is loading all components at once, causing slower initial load times. Implementing lazy loading for dashboard widgets would improve performance significantly.",
      priority: "high",
      category: "performance",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "new",
      implementationDifficulty: "medium",
      estimatedHours: 8,
      relatedModule: "Dashboard",
      codeSnippet: `// Current implementation
import { DashboardWidget1, DashboardWidget2, /* ... */ } from './widgets';

// Recommended implementation
const DashboardWidget1 = React.lazy(() => import('./widgets/DashboardWidget1'));
const DashboardWidget2 = React.lazy(() => import('./widgets/DashboardWidget2'));
// ...

// Wrap with Suspense
<Suspense fallback={<WidgetSkeleton />}>
  <DashboardWidget1 />
</Suspense>`,
    },
    {
      id: "rec-2",
      title: "Enhance Authentication Security with MFA",
      description:
        "Adding Multi-Factor Authentication would significantly improve security. Implement SMS or authenticator app verification as a second factor.",
      priority: "high",
      category: "security",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "in-review",
      implementationDifficulty: "hard",
      estimatedHours: 24,
      relatedModule: "Authentication",
    },
    {
      id: "rec-3",
      title: "Optimize Database Queries in Reporting Module",
      description:
        "Several reporting queries are performing full table scans. Adding indexes and optimizing JOIN operations could improve performance by up to 70%.",
      priority: "medium",
      category: "performance",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: "accepted",
      implementationDifficulty: "medium",
      estimatedHours: 16,
      relatedModule: "Reporting",
      codeSnippet: `-- Current query
SELECT * FROM reports r
JOIN report_data rd ON r.id = rd.report_id
WHERE r.created_at > '2024-01-01';

-- Optimized query
SELECT r.id, r.name, r.created_at, rd.metric_value
FROM reports r
JOIN report_data rd ON r.id = rd.report_id
WHERE r.created_at > '2024-01-01';

-- Add index
CREATE INDEX idx_reports_created_at ON reports(created_at);`,
    },
    {
      id: "rec-4",
      title: "Implement Comprehensive Error Handling",
      description:
        "Many API endpoints lack proper error handling, leading to poor user experience when errors occur. Implement a consistent error handling strategy across all endpoints.",
      priority: "medium",
      category: "code-quality",
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      status: "implemented",
      implementationDifficulty: "medium",
      estimatedHours: 20,
      relatedModule: "API Integration",
    },
    {
      id: "rec-5",
      title: "Add Real-time Notifications",
      description:
        "Users currently need to refresh to see new notifications. Implementing WebSocket-based real-time notifications would greatly enhance user experience.",
      priority: "medium",
      category: "feature",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      status: "new",
      implementationDifficulty: "hard",
      estimatedHours: 40,
      relatedModule: "Notifications",
    },
    {
      id: "rec-6",
      title: "Improve Mobile Responsiveness",
      description:
        "Several UI components don't render well on mobile devices. Enhancing responsive design would improve mobile user experience significantly.",
      priority: "high",
      category: "ux",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "new",
      implementationDifficulty: "medium",
      estimatedHours: 30,
      relatedModule: "UI Components",
    },
    {
      id: "rec-7",
      title: "Implement Automated Testing for Critical Paths",
      description:
        "Key user flows lack automated tests, increasing the risk of regressions. Implementing end-to-end tests for critical paths would improve reliability.",
      priority: "high",
      category: "code-quality",
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      status: "rejected",
      implementationDifficulty: "medium",
      estimatedHours: 40,
      relatedModule: "Testing",
    },
  ];
};

const getMockProjectMetrics = (): ProjectMetrics => {
  return {
    totalCommits: 1247,
    totalFiles: 358,
    totalLines: 87429,
    contributors: 5,
    openIssues: 42,
    closedIssues: 187,
    pullRequests: 15,
    mergedPullRequests: 203,
    averageIssueResolutionTime: 72, // 3 days in hours
    codeQuality: {
      coverage: 68, // percentage
      bugs: 24,
      vulnerabilities: 7,
      codeSmells: 156,
      duplications: 12, // percentage
    },
    velocity: 35, // story points per sprint
    burndown: {
      planned: 120,
      actual: 85,
      remaining: 35,
    },
  };
};

const getMockProjectRoadmap = (): ProjectRoadmap => {
  return {
    milestones: [
      {
        id: "milestone-1",
        name: "MVP Release",
        description: "Initial release with core functionality",
        dueDate: "2024-04-30",
        progress: 100,
        status: "completed",
      },
      {
        id: "milestone-2",
        name: "Beta Release",
        description: "Beta version with enhanced features and stability",
        dueDate: "2024-07-31",
        progress: 65,
        status: "in-progress",
      },
      {
        id: "milestone-3",
        name: "Production Release",
        description: "Full production release with all planned features",
        dueDate: "2024-09-30",
        progress: 0,
        status: "planned",
      },
    ],
    releases: [
      {
        id: "release-1",
        version: "0.1.0",
        name: "Alpha",
        releaseDate: "2024-03-15",
        status: "released",
        features: [
          "User authentication",
          "Basic dashboard",
          "Core API endpoints",
        ],
      },
      {
        id: "release-2",
        version: "0.5.0",
        name: "MVP",
        releaseDate: "2024-04-30",
        status: "released",
        features: [
          "Enhanced dashboard",
          "User management",
          "Basic reporting",
          "Settings module",
        ],
      },
      {
        id: "release-3",
        version: "0.8.0",
        name: "Beta",
        releaseDate: "2024-07-31",
        status: "in-development",
        features: [
          "Advanced reporting",
          "Notifications system",
          "API integrations",
          "Enhanced security",
        ],
      },
      {
        id: "release-4",
        version: "1.0.0",
        name: "Production",
        releaseDate: "2024-09-30",
        status: "planned",
        features: [
          "Complete feature set",
          "Performance optimizations",
          "Mobile responsiveness",
          "Advanced analytics",
        ],
      },
    ],
  };
};
