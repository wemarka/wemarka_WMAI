import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Separator } from "@/frontend/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/frontend/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { useToast } from "@/frontend/components/ui/use-toast";
import {
  roadmapHistoryService,
  RoadmapHistoryItem,
} from "@/frontend/services/roadmapHistoryService";
import { Roadmap } from "@/frontend/services/projectAnalysisService";
import {
  AlertTriangle,
  Calendar,
  Check,
  Clock,
  Download,
  FileText,
  GitCompare,
  Loader2,
  MinusCircle,
  PlusCircle,
  RefreshCw,
  User,
  Filter,
  BarChart,
  Save,
  Share2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  History,
  ArrowLeftRight,
  Diff,
} from "lucide-react";
import { FallbackMessage } from "@/frontend/components/ui/fallback-message";
import { Progress } from "@/frontend/components/ui/progress";

interface RoadmapComparisonEnhancedProps {
  initialRoadmapIds?: { before: string; after: string };
}

export default function RoadmapComparisonEnhanced({
  initialRoadmapIds,
}: RoadmapComparisonEnhancedProps) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [roadmaps, setRoadmaps] = useState<RoadmapHistoryItem[]>([]);
  const [selectedBeforeId, setSelectedBeforeId] = useState<string>(
    initialRoadmapIds?.before || "",
  );
  const [selectedAfterId, setSelectedAfterId] = useState<string>(
    initialRoadmapIds?.after || "",
  );
  const [beforeRoadmap, setBeforeRoadmap] = useState<RoadmapHistoryItem | null>(
    null,
  );
  const [afterRoadmap, setAfterRoadmap] = useState<RoadmapHistoryItem | null>(
    null,
  );
  const [comparison, setComparison] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "json">("pdf");
  const [isExporting, setIsExporting] = useState(false);
  const [comparisonMetrics, setComparisonMetrics] = useState<any>(null);
  const isRTL = i18n.dir() === "rtl";

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  useEffect(() => {
    if (initialRoadmapIds?.before && initialRoadmapIds?.after) {
      loadRoadmaps(initialRoadmapIds.before, initialRoadmapIds.after);
    }
  }, [initialRoadmapIds]);

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const data = await roadmapHistoryService.getSavedRoadmaps();
      // Filter to only include active roadmaps
      const activeRoadmaps = data.filter((r) => r.status === "active");
      setRoadmaps(activeRoadmaps);

      // If we have at least 2 roadmaps and no selection yet, select the two most recent
      if (activeRoadmaps.length >= 2 && !selectedBeforeId && !selectedAfterId) {
        setSelectedBeforeId(activeRoadmaps[1].id); // Second most recent
        setSelectedAfterId(activeRoadmaps[0].id); // Most recent
        await loadRoadmaps(activeRoadmaps[1].id, activeRoadmaps[0].id);
      }
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
      toast({
        title: t("Error"),
        description: t("Failed to load roadmap history"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRoadmaps = async (beforeId: string, afterId: string) => {
    setComparing(true);
    try {
      const [before, after] = await Promise.all([
        roadmapHistoryService.getRoadmapById(beforeId),
        roadmapHistoryService.getRoadmapById(afterId),
      ]);

      if (!before || !after) {
        throw new Error("Failed to load one or both roadmaps");
      }

      setBeforeRoadmap(before);
      setAfterRoadmap(after);

      // Compare the roadmaps
      const comparisonResult = roadmapHistoryService.compareRoadmaps(
        before.roadmapData,
        after.roadmapData,
      );
      setComparison(comparisonResult);

      // Calculate comparison metrics
      calculateComparisonMetrics(
        before.roadmapData,
        after.roadmapData,
        comparisonResult,
      );
    } catch (error) {
      console.error("Error loading roadmaps for comparison:", error);
      toast({
        title: t("Error"),
        description: t("Failed to load roadmaps for comparison"),
        variant: "destructive",
      });
    } finally {
      setComparing(false);
    }
  };

  const calculateComparisonMetrics = (
    beforeRoadmap: Roadmap,
    afterRoadmap: Roadmap,
    comparisonResult: any,
  ) => {
    // Calculate total phases in both roadmaps
    const totalPhasesBefore = beforeRoadmap.phases.length;
    const totalPhasesAfter = afterRoadmap.phases.length;

    // Calculate total tasks in both roadmaps
    const totalTasksBefore = beforeRoadmap.phases.reduce(
      (sum, phase) => sum + phase.tasks.length,
      0,
    );
    const totalTasksAfter = afterRoadmap.phases.reduce(
      (sum, phase) => sum + phase.tasks.length,
      0,
    );

    // Calculate changes percentages
    const addedPhasesPercent =
      (comparisonResult.addedPhases.length / totalPhasesAfter) * 100;
    const removedPhasesPercent =
      (comparisonResult.removedPhases.length / totalPhasesBefore) * 100;
    const modifiedPhasesPercent =
      (comparisonResult.modifiedPhases.length / totalPhasesBefore) * 100;

    // Calculate task changes
    let addedTasks = 0;
    let removedTasks = 0;

    // Count tasks in added phases
    addedTasks += comparisonResult.addedPhases.reduce(
      (sum: number, phase: any) => sum + phase.tasks.length,
      0,
    );

    // Count tasks in removed phases
    removedTasks += comparisonResult.removedPhases.reduce(
      (sum: number, phase: any) => sum + phase.tasks.length,
      0,
    );

    // Count tasks added/removed in modified phases
    comparisonResult.modifiedPhases.forEach((phase: any) => {
      addedTasks += phase.taskChanges.added.length;
      removedTasks += phase.taskChanges.removed.length;
    });

    // Calculate priority changes
    const priorityChanges = comparisonResult.modifiedPhases.filter(
      (phase: any) => phase.priorityChanged,
    ).length;

    // Calculate duration changes
    const durationChanges = comparisonResult.modifiedPhases.filter(
      (phase: any) => phase.durationChanged,
    ).length;

    // Calculate overall change percentage
    const totalChanges =
      comparisonResult.addedPhases.length +
      comparisonResult.removedPhases.length +
      comparisonResult.modifiedPhases.length;
    const overallChangePercent =
      (totalChanges / ((totalPhasesBefore + totalPhasesAfter) / 2)) * 100;

    setComparisonMetrics({
      totalPhasesBefore,
      totalPhasesAfter,
      totalTasksBefore,
      totalTasksAfter,
      addedPhasesPercent,
      removedPhasesPercent,
      modifiedPhasesPercent,
      addedTasks,
      removedTasks,
      priorityChanges,
      durationChanges,
      overallChangePercent: Math.min(overallChangePercent, 100), // Cap at 100%
    });
  };

  const handleCompare = async () => {
    if (!selectedBeforeId || !selectedAfterId) {
      toast({
        title: t("Selection Required"),
        description: t("Please select two roadmaps to compare"),
        variant: "destructive",
      });
      return;
    }

    if (selectedBeforeId === selectedAfterId) {
      toast({
        title: t("Invalid Selection"),
        description: t("Please select two different roadmaps to compare"),
        variant: "destructive",
      });
      return;
    }

    await loadRoadmaps(selectedBeforeId, selectedAfterId);
  };

  const handleExportComparison = async () => {
    if (!comparison || !beforeRoadmap || !afterRoadmap) return;

    setIsExporting(true);
    try {
      // Create a JSON string of the comparison data
      const comparisonData = {
        comparison,
        metrics: comparisonMetrics,
        before: {
          id: beforeRoadmap.id,
          name: beforeRoadmap.name,
          createdAt: beforeRoadmap.createdAt,
          roadmapData: beforeRoadmap.roadmapData,
        },
        after: {
          id: afterRoadmap.id,
          name: afterRoadmap.name,
          createdAt: afterRoadmap.createdAt,
          roadmapData: afterRoadmap.roadmapData,
        },
        exportedAt: new Date().toISOString(),
      };

      if (exportFormat === "json") {
        // Export as JSON
        const comparisonJson = JSON.stringify(comparisonData, null, 2);
        const blob = new Blob([comparisonJson], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `roadmap-comparison-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Export as PDF
        // Create a hidden div to render the PDF content
        const printContent = document.createElement("div");
        printContent.style.display = "none";
        printContent.innerHTML = `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h1 style="text-align: center;">Roadmap Comparison Report</h1>
            <p style="text-align: center;">Generated on ${new Date().toLocaleString()}</p>
            
            <div style="margin-top: 30px;">
              <h2>Comparison Summary</h2>
              <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <div style="flex: 1;">
                  <h3>Before: ${beforeRoadmap.name}</h3>
                  <p>Created: ${new Date(beforeRoadmap.createdAt).toLocaleDateString()}</p>
                  <p>Phases: ${beforeRoadmap.roadmapData.phases.length}</p>
                  <p>Tasks: ${beforeRoadmap.roadmapData.phases.reduce((sum, phase) => sum + phase.tasks.length, 0)}</p>
                </div>
                <div style="flex: 1;">
                  <h3>After: ${afterRoadmap.name}</h3>
                  <p>Created: ${new Date(afterRoadmap.createdAt).toLocaleDateString()}</p>
                  <p>Phases: ${afterRoadmap.roadmapData.phases.length}</p>
                  <p>Tasks: ${afterRoadmap.roadmapData.phases.reduce((sum, phase) => sum + phase.tasks.length, 0)}</p>
                </div>
              </div>
              
              <h3>Changes Overview</h3>
              <ul>
                <li>Added Phases: ${comparison.addedPhases.length}</li>
                <li>Removed Phases: ${comparison.removedPhases.length}</li>
                <li>Modified Phases: ${comparison.modifiedPhases.length}</li>
                <li>Added Tasks: ${comparisonMetrics.addedTasks}</li>
                <li>Removed Tasks: ${comparisonMetrics.removedTasks}</li>
                <li>Priority Changes: ${comparisonMetrics.priorityChanges}</li>
                <li>Duration Changes: ${comparisonMetrics.durationChanges}</li>
              </ul>
              
              <h2>Detailed Changes</h2>
              ${
                comparison.addedPhases.length > 0
                  ? `
                <h3>Added Phases</h3>
                <ul>
                  ${comparison.addedPhases
                    .map(
                      (phase) => `
                    <li>
                      <strong>${phase.name}</strong> (${phase.priority}, ${phase.duration})<br>
                      ${phase.description}<br>
                      Tasks: ${phase.tasks.length}
                    </li>
                  `,
                    )
                    .join("")}
                </ul>
              `
                  : ""
              }
              
              ${
                comparison.removedPhases.length > 0
                  ? `
                <h3>Removed Phases</h3>
                <ul>
                  ${comparison.removedPhases
                    .map(
                      (phase) => `
                    <li>
                      <strong>${phase.name}</strong> (${phase.priority}, ${phase.duration})<br>
                      ${phase.description}<br>
                      Tasks: ${phase.tasks.length}
                    </li>
                  `,
                    )
                    .join("")}
                </ul>
              `
                  : ""
              }
              
              ${
                comparison.modifiedPhases.length > 0
                  ? `
                <h3>Modified Phases</h3>
                <ul>
                  ${comparison.modifiedPhases
                    .map(
                      (phase) => `
                    <li>
                      <strong>${phase.name}</strong><br>
                      ${phase.priorityChanged ? `Priority: ${phase.priorityChanged.from} → ${phase.priorityChanged.to}<br>` : ""}
                      ${phase.durationChanged ? `Duration: ${phase.durationChanged.from} → ${phase.durationChanged.to}<br>` : ""}
                      ${phase.descriptionChanged ? "Description was changed<br>" : ""}
                      ${phase.taskChanges.added.length > 0 ? `Added ${phase.taskChanges.added.length} tasks<br>` : ""}
                      ${phase.taskChanges.removed.length > 0 ? `Removed ${phase.taskChanges.removed.length} tasks<br>` : ""}
                    </li>
                  `,
                    )
                    .join("")}
                </ul>
              `
                  : ""
              }
            </div>
            
            <div style="margin-top: 30px; font-size: 12px; text-align: center; color: #666;">
              <p>Generated by Wemarka WMAI - Development Roadmap Tool</p>
            </div>
          </div>
        `;
        document.body.appendChild(printContent);

        // Use browser's print functionality to generate PDF
        const originalTitle = document.title;
        document.title = `Roadmap Comparison - ${new Date().toLocaleDateString()}`;

        window.print();

        // Restore original title and remove the print content
        document.title = originalTitle;
        document.body.removeChild(printContent);
      }

      toast({
        title: t("Export Successful"),
        description: t("The comparison has been exported successfully"),
      });
    } catch (error) {
      console.error("Error exporting comparison:", error);
      toast({
        title: t("Export Failed"),
        description: t("Failed to export the comparison"),
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveComparison = () => {
    // In a real implementation, this would save the comparison to the database
    toast({
      title: t("Comparison Saved"),
      description: t("The comparison has been saved for future reference"),
    });
  };

  const handleShareComparison = () => {
    // In a real implementation, this would generate a shareable link
    navigator.clipboard
      .writeText(
        `https://wemarka.ai/compare/${beforeRoadmap?.id}/${afterRoadmap?.id}`,
      )
      .then(() => {
        toast({
          title: t("Link Copied"),
          description: t("Comparison link has been copied to clipboard"),
        });
      })
      .catch(() => {
        toast({
          title: t("Copy Failed"),
          description: t("Failed to copy link to clipboard"),
          variant: "destructive",
        });
      });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "";
    }
  };

  const getFilteredChanges = (changes: any[]) => {
    if (!filterType) return changes;
    return changes.filter((change) => {
      if (filterType === "priority" && change.priorityChanged) return true;
      if (filterType === "duration" && change.durationChanged) return true;
      if (
        filterType === "tasks" &&
        (change.taskChanges?.added.length > 0 ||
          change.taskChanges?.removed.length > 0)
      )
        return true;
      if (filterType === "description" && change.descriptionChanged)
        return true;
      if (filterType === "dependencies" && change.dependenciesChanged)
        return true;
      return false;
    });
  };

  const renderComparisonMetrics = () => {
    if (!comparisonMetrics) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("Comparison Analytics")}</CardTitle>
          <CardDescription>
            {t("Detailed metrics about the changes between roadmap versions")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Overall Change Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {t("Overall Change")}
                </span>
                <span className="text-sm font-medium">
                  {Math.round(comparisonMetrics.overallChangePercent)}%
                </span>
              </div>
              <Progress
                value={comparisonMetrics.overallChangePercent}
                className="h-2"
              />
            </div>

            {/* Phase Changes */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {t("Added Phases")}
                  </span>
                  <span className="text-sm font-medium">
                    {Math.round(comparisonMetrics.addedPhasesPercent)}%
                  </span>
                </div>
                <Progress
                  value={comparisonMetrics.addedPhasesPercent}
                  className="h-2 bg-green-100 dark:bg-green-900"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {t("Removed Phases")}
                  </span>
                  <span className="text-sm font-medium">
                    {Math.round(comparisonMetrics.removedPhasesPercent)}%
                  </span>
                </div>
                <Progress
                  value={comparisonMetrics.removedPhasesPercent}
                  className="h-2 bg-red-100 dark:bg-red-900"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {t("Modified Phases")}
                  </span>
                  <span className="text-sm font-medium">
                    {Math.round(comparisonMetrics.modifiedPhasesPercent)}%
                  </span>
                </div>
                <Progress
                  value={comparisonMetrics.modifiedPhasesPercent}
                  className="h-2 bg-blue-100 dark:bg-blue-900"
                />
              </div>
            </div>

            {/* Task Changes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-4 bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center">
                  <PlusCircle className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="text-lg font-medium">{t("Added Tasks")}</h3>
                </div>
                <div className="text-3xl font-bold mt-2">
                  {comparisonMetrics.addedTasks}
                </div>
                {comparisonMetrics.totalTasksAfter > 0 && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {Math.round(
                      (comparisonMetrics.addedTasks /
                        comparisonMetrics.totalTasksAfter) *
                        100,
                    )}
                    % {t("of current tasks")}
                  </div>
                )}
              </div>

              <div className="border rounded-md p-4 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center">
                  <MinusCircle className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="text-lg font-medium">{t("Removed Tasks")}</h3>
                </div>
                <div className="text-3xl font-bold mt-2">
                  {comparisonMetrics.removedTasks}
                </div>
                {comparisonMetrics.totalTasksBefore > 0 && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {Math.round(
                      (comparisonMetrics.removedTasks /
                        comparisonMetrics.totalTasksBefore) *
                        100,
                    )}
                    % {t("of previous tasks")}
                  </div>
                )}
              </div>
            </div>

            {/* Other Changes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-4 bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center">
                  <ArrowLeftRight className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-medium">
                    {t("Priority Changes")}
                  </h3>
                </div>
                <div className="text-3xl font-bold mt-2">
                  {comparisonMetrics.priorityChanges}
                </div>
                {comparisonMetrics.totalPhasesBefore > 0 && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {Math.round(
                      (comparisonMetrics.priorityChanges /
                        comparisonMetrics.totalPhasesBefore) *
                        100,
                    )}
                    % {t("of phases changed priority")}
                  </div>
                )}
              </div>

              <div className="border rounded-md p-4 bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-medium">
                    {t("Duration Changes")}
                  </h3>
                </div>
                <div className="text-3xl font-bold mt-2">
                  {comparisonMetrics.durationChanges}
                </div>
                {comparisonMetrics.totalPhasesBefore > 0 && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {Math.round(
                      (comparisonMetrics.durationChanges /
                        comparisonMetrics.totalPhasesBefore) *
                        100,
                    )}
                    % {t("of phases changed duration")}
                  </div>
                )}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">{t("Before")}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border rounded-md p-2">
                    <div className="text-xs text-muted-foreground">
                      {t("Phases")}
                    </div>
                    <div className="text-lg font-bold">
                      {comparisonMetrics.totalPhasesBefore}
                    </div>
                  </div>
                  <div className="border rounded-md p-2">
                    <div className="text-xs text-muted-foreground">
                      {t("Tasks")}
                    </div>
                    <div className="text-lg font-bold">
                      {comparisonMetrics.totalTasksBefore}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">{t("After")}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border rounded-md p-2">
                    <div className="text-xs text-muted-foreground">
                      {t("Phases")}
                    </div>
                    <div className="text-lg font-bold">
                      {comparisonMetrics.totalPhasesAfter}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {comparisonMetrics.totalPhasesBefore > 0 ? (
                        <span
                          className={
                            comparisonMetrics.totalPhasesAfter >
                            comparisonMetrics.totalPhasesBefore
                              ? "text-green-600"
                              : comparisonMetrics.totalPhasesAfter <
                                  comparisonMetrics.totalPhasesBefore
                                ? "text-red-600"
                                : ""
                          }
                        >
                          {comparisonMetrics.totalPhasesAfter >
                          comparisonMetrics.totalPhasesBefore
                            ? "+"
                            : ""}
                          {(
                            ((comparisonMetrics.totalPhasesAfter -
                              comparisonMetrics.totalPhasesBefore) /
                              comparisonMetrics.totalPhasesBefore) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="border rounded-md p-2">
                    <div className="text-xs text-muted-foreground">
                      {t("Tasks")}
                    </div>
                    <div className="text-lg font-bold">
                      {comparisonMetrics.totalTasksAfter}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {comparisonMetrics.totalTasksBefore > 0 ? (
                        <span
                          className={
                            comparisonMetrics.totalTasksAfter >
                            comparisonMetrics.totalTasksBefore
                              ? "text-green-600"
                              : comparisonMetrics.totalTasksAfter <
                                  comparisonMetrics.totalTasksBefore
                                ? "text-red-600"
                                : ""
                          }
                        >
                          {comparisonMetrics.totalTasksAfter >
                          comparisonMetrics.totalTasksBefore
                            ? "+"
                            : ""}
                          {(
                            ((comparisonMetrics.totalTasksAfter -
                              comparisonMetrics.totalTasksBefore) /
                              comparisonMetrics.totalTasksBefore) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSummary = () => {
    if (!comparison || !beforeRoadmap || !afterRoadmap) return null;

    return (
      <div className="space-y-6">
        {renderComparisonMetrics()}

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {t("Before")}: {beforeRoadmap.name}
              </CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(beforeRoadmap.createdAt).toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div className="font-medium">{t("Summary")}:</div>
                <div className="mt-1 text-muted-foreground">
                  {beforeRoadmap.roadmapData.summary}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {t("After")}: {afterRoadmap.name}
              </CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(afterRoadmap.createdAt).toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div className="font-medium">{t("Summary")}:</div>
                <div className="mt-1 text-muted-foreground">
                  {afterRoadmap.roadmapData.summary}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("Comparison Summary")}</CardTitle>
            <CardDescription>
              {t("Overview of changes between the selected roadmaps")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="border rounded-md p-4 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center">
                    <PlusCircle className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="text-lg font-medium">{t("Added Phases")}</h3>
                  </div>
                  <div className="text-3xl font-bold mt-2">
                    {comparison.addedPhases.length}
                  </div>
                </div>

                <div className="border rounded-md p-4 bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center">
                    <MinusCircle className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="text-lg font-medium">
                      {t("Removed Phases")}
                    </h3>
                  </div>
                  <div className="text-3xl font-bold mt-2">
                    {comparison.removedPhases.length}
                  </div>
                </div>

                <div className="border rounded-md p-4 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center">
                    <RefreshCw className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-medium">
                      {t("Modified Phases")}
                    </h3>
                  </div>
                  <div className="text-3xl font-bold mt-2">
                    {comparison.modifiedPhases.length}
                  </div>
                </div>
              </div>

              {comparison.summaryChanged && (
                <div className="border rounded-md p-4 bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    <h3 className="text-lg font-medium">
                      {t("Summary Changed")}
                    </h3>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm font-medium mb-1">
                      {t("Before")}:
                    </div>
                    <div className="text-sm bg-muted p-2 rounded">
                      {beforeRoadmap.roadmapData.summary}
                    </div>
                    <div className="text-sm font-medium mb-1 mt-2">
                      {t("After")}:
                    </div>
                    <div className="text-sm bg-muted p-2 rounded">
                      {afterRoadmap.roadmapData.summary}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPhaseChanges = () => {
    if (!comparison || !beforeRoadmap || !afterRoadmap) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {t("Filter by change type")}:
            </span>
            <Select
              value={filterType || ""}
              onValueChange={(value) => setFilterType(value || null)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("All changes")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("All changes")}</SelectItem>
                <SelectItem value="priority">
                  {t("Priority changes")}
                </SelectItem>
                <SelectItem value="duration">
                  {t("Duration changes")}
                </SelectItem>
                <SelectItem value="tasks">{t("Task changes")}</SelectItem>
                <SelectItem value="description">
                  {t("Description changes")}
                </SelectItem>
                <SelectItem value="dependencies">
                  {t("Dependency changes")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterType(null)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {t("Clear filters")}
          </Button>
        </div>

        {/* Added Phases */}
        {comparison.addedPhases.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PlusCircle className="h-5 w-5 text-green-500 mr-2" />
                {t("Added Phases")}
              </CardTitle>
              <CardDescription>
                {t("New phases added in the updated roadmap")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {comparison.addedPhases.map((phase: any, index: number) => (
                    <div
                      key={`added-${index}`}
                      className="border rounded-md p-4 bg-green-50 dark:bg-green-900/20"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">{phase.name}</h3>
                          <div className="flex items-center mt-1">
                            <Badge
                              className={`${getPriorityColor(phase.priority)}`}
                            >
                              {t(phase.priority)}
                            </Badge>
                            <span className="text-sm text-muted-foreground ml-2">
                              {t("Duration")}: {phase.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm">{phase.description}</p>

                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">
                          {t("Tasks")}:
                        </h4>
                        <ul className="space-y-1">
                          {phase.tasks.map((task: string, i: number) => (
                            <li key={i} className="flex items-start text-sm">
                              <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {phase.dependencies && phase.dependencies.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-1">
                            {t("Dependencies")}:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {phase.dependencies.map(
                              (dep: string, i: number) => (
                                <Badge key={i} variant="outline">
                                  {dep}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Removed Phases */}
        {comparison.removedPhases.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MinusCircle className="h-5 w-5 text-red-500 mr-2" />
                {t("Removed Phases")}
              </CardTitle>
              <CardDescription>
                {t("Phases that were removed in the updated roadmap")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {comparison.removedPhases.map((phase: any, index: number) => (
                    <div
                      key={`removed-${index}`}
                      className="border rounded-md p-4 bg-red-50 dark:bg-red-900/20"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">{phase.name}</h3>
                          <div className="flex items-center mt-1">
                            <Badge
                              className={`${getPriorityColor(phase.priority)}`}
                            >
                              {t(phase.priority)}
                            </Badge>
                            <span className="text-sm text-muted-foreground ml-2">
                              {t("Duration")}: {phase.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm">{phase.description}</p>

                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">
                          {t("Tasks")}:
                        </h4>
                        <ul className="space-y-1">
                          {phase.tasks.map((task: string, i: number) => (
                            <li key={i} className="flex items-start text-sm">
                              <Check className="h-4 w-4 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {phase.dependencies && phase.dependencies.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-1">
                            {t("Dependencies")}:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {phase.dependencies.map(
                              (dep: string, i: number) => (
                                <Badge key={i} variant="outline">
                                  {dep}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Modified Phases */}
        {comparison.modifiedPhases.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 text-blue-500 mr-2" />
                {t("Modified Phases")}
              </CardTitle>
              <CardDescription>
                {t("Phases that were changed in the updated roadmap")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-6">
                  {getFilteredChanges(comparison.modifiedPhases).map(
                    (modifiedPhase: any, index: number) => {
                      const beforePhase = beforeRoadmap.roadmapData.phases.find(
                        (p: any) => p.name === modifiedPhase.name,
                      );
                      const afterPhase = afterRoadmap.roadmapData.phases.find(
                        (p: any) => p.name === modifiedPhase.name,
                      );

                      if (!beforePhase || !afterPhase) return null;

                      return (
                        <div
                          key={`modified-${index}`}
                          className="border rounded-md p-4 bg-blue-50 dark:bg-blue-900/20"
                        >
                          <h3 className="text-lg font-medium">
                            {modifiedPhase.name}
                          </h3>

                          {/* Priority Change */}
                          {modifiedPhase.priorityChanged && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium mb-1">
                                {t("Priority Changed")}:
                              </h4>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  className={`${getPriorityColor(
                                    modifiedPhase.priorityChanged.from,
                                  )}`}
                                >
                                  {t(modifiedPhase.priorityChanged.from)}
                                </Badge>
                                <span>→</span>
                                <Badge
                                  className={`${getPriorityColor(
                                    modifiedPhase.priorityChanged.to,
                                  )}`}
                                >
                                  {t(modifiedPhase.priorityChanged.to)}
                                </Badge>
                              </div>
                            </div>
                          )}

                          {/* Duration Change */}
                          {modifiedPhase.durationChanged && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium mb-1">
                                {t("Duration Changed")}:
                              </h4>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm">
                                  {modifiedPhase.durationChanged.from}
                                </span>
                                <span>→</span>
                                <span className="text-sm">
                                  {modifiedPhase.durationChanged.to}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Description Change */}
                          {modifiedPhase.descriptionChanged && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium mb-1">
                                {t("Description Changed")}:
                              </h4>
                              <div className="space-y-2">
                                <div>
                                  <div className="text-xs text-muted-foreground">
                                    {t("Before")}:
                                  </div>
                                  <div className="text-sm bg-muted p-2 rounded">
                                    {beforePhase.description}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">
                                    {t("After")}:
                                  </div>
                                  <div className="text-sm bg-muted p-2 rounded">
                                    {afterPhase.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Task Changes */}
                          {(modifiedPhase.taskChanges.added.length > 0 ||
                            modifiedPhase.taskChanges.removed.length > 0) && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium mb-1">
                                {t("Task Changes")}:
                              </h4>

                              {/* Added Tasks */}
                              {modifiedPhase.taskChanges.added.length > 0 && (
                                <div className="mt-2">
                                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                    {t("Added Tasks")}:
                                  </div>
                                  <ul className="space-y-1 mt-1">
                                    {modifiedPhase.taskChanges.added.map(
                                      (task: string, i: number) => (
                                        <li
                                          key={`added-task-${i}`}
                                          className="flex items-start text-sm"
                                        >
                                          <PlusCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                                          <span>{task}</span>
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}

                              {/* Removed Tasks */}
                              {modifiedPhase.taskChanges.removed.length > 0 && (
                                <div className="mt-2">
                                  <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                                    {t("Removed Tasks")}:
                                  </div>
                                  <ul className="space-y-1 mt-1">
                                    {modifiedPhase.taskChanges.removed.map(
                                      (task: string, i: number) => (
                                        <li
                                          key={`removed-task-${i}`}
                                          className="flex items-start text-sm"
                                        >
                                          <MinusCircle className="h-4 w-4 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                                          <span>{task}</span>
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderSideBySideView = () => {
    if (!comparison || !beforeRoadmap || !afterRoadmap) return null;

    // Create a combined list of all phases from both roadmaps
    const allPhaseNames = new Set<string>();
    beforeRoadmap.roadmapData.phases.forEach((p: any) =>
      allPhaseNames.add(p.name),
    );
    afterRoadmap.roadmapData.phases.forEach((p: any) =>
      allPhaseNames.add(p.name),
    );

    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("Side-by-Side Comparison")}</CardTitle>
          <CardDescription>
            {t("Detailed comparison of phases between roadmap versions")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              {Array.from(allPhaseNames).map((phaseName) => {
                const beforePhase = beforeRoadmap.roadmapData.phases.find(
                  (p: any) => p.name === phaseName,
                );
                const afterPhase = afterRoadmap.roadmapData.phases.find(
                  (p: any) => p.name === phaseName,
                );

                let status = "unchanged";
                if (!beforePhase) status = "added";
                else if (!afterPhase) status = "removed";
                else if (
                  comparison.modifiedPhases.some(
                    (mp: any) => mp.name === phaseName,
                  )
                )
                  status = "modified";

                // Skip if filtered
                if (filterType) {
                  const modifiedPhase = comparison.modifiedPhases.find(
                    (mp: any) => mp.name === phaseName,
                  );
                  if (status === "modified") {
                    if (
                      filterType === "priority" &&
                      !modifiedPhase?.priorityChanged
                    )
                      return null;
                    if (
                      filterType === "duration" &&
                      !modifiedPhase?.durationChanged
                    )
                      return null;
                    if (
                      filterType === "tasks" &&
                      !(
                        modifiedPhase?.taskChanges?.added.length > 0 ||
                        modifiedPhase?.taskChanges?.removed.length > 0
                      )
                    )
                      return null;
                    if (
                      filterType === "description" &&
                      !modifiedPhase?.descriptionChanged
                    )
                      return null;
                  } else if (status !== "added" && status !== "removed") {
                    return null;
                  }
                }

                // Get the modified phase details if available
                const modifiedPhaseDetails =
                  status === "modified"
                    ? comparison.modifiedPhases.find(
                        (mp: any) => mp.name === phaseName,
                      )
                    : null;

                return (
                  <div
                    key={phaseName}
                    className="border rounded-md p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">{phaseName}</h3>
                      {status === "added" && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          {t("Added")}
                        </Badge>
                      )}
                      {status === "removed" && (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                          {t("Removed")}
                        </Badge>
                      )}
                      {status === "modified" && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {t("Modified")}
                        </Badge>
                      )}
                      {status === "unchanged" && (
                        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                          {t("Unchanged")}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Before Column */}
                      <div className={`${!beforePhase ? "opacity-50" : ""}`}>
                        <h4 className="text-sm font-medium mb-2">
                          {t("Before")}:
                        </h4>
                        {beforePhase ? (
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Badge
                                className={`${getPriorityColor(
                                  beforePhase.priority,
                                )} ${isRTL ? "ml-2" : "mr-2"}`}
                              >
                                {t(beforePhase.priority)}
                              </Badge>
                              <span className="text-sm">
                                {t("Duration")}: {beforePhase.duration}
                              </span>
                            </div>

                            <div>
                              <div className="text-xs font-medium mb-1">
                                {t("Description")}:
                              </div>
                              <div className="text-sm bg-muted p-2 rounded">
                                {beforePhase.description}
                              </div>
                            </div>

                            <div>
                              <div className="text-xs font-medium mb-1">
                                {t("Tasks")} ({beforePhase.tasks.length}):
                              </div>
                              <ul className="space-y-1">
                                {beforePhase.tasks.map(
                                  (task: string, i: number) => (
                                    <li
                                      key={i}
                                      className="flex items-start text-sm"
                                    >
                                      <Check
                                        className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"} text-muted-foreground flex-shrink-0 mt-0.5`}
                                      />
                                      <span>{task}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>

                            {beforePhase.dependencies &&
                              beforePhase.dependencies.length > 0 && (
                                <div>
                                  <div className="text-xs font-medium mb-1">
                                    {t("Dependencies")}:
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {beforePhase.dependencies.map(
                                      (dep: string, i: number) => (
                                        <Badge key={i} variant="outline">
                                          {dep}
                                        </Badge>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-32 border rounded-md bg-muted/20">
                            <span className="text-muted-foreground">
                              {t("Not present in this version")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* After Column */}
                      <div className={`${!afterPhase ? "opacity-50" : ""}`}>
                        <h4 className="text-sm font-medium mb-2">
                          {t("After")}:
                        </h4>
                        {afterPhase ? (
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Badge
                                className={`${getPriorityColor(
                                  afterPhase.priority,
                                )} ${isRTL ? "ml-2" : "mr-2"}`}
                              >
                                {t(afterPhase.priority)}
                              </Badge>
                              <span className="text-sm">
                                {t("Duration")}: {afterPhase.duration}
                              </span>
                              {modifiedPhaseDetails?.priorityChanged && (
                                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded ml-2">
                                  {t("Priority Changed")}
                                </span>
                              )}
                              {modifiedPhaseDetails?.durationChanged && (
                                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded ml-2">
                                  {t("Duration Changed")}
                                </span>
                              )}
                            </div>

                            <div>
                              <div className="text-xs font-medium mb-1 flex justify-between">
                                <span>{t("Description")}:</span>
                                {modifiedPhaseDetails?.descriptionChanged && (
                                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded">
                                    {t("Changed")}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm bg-muted p-2 rounded">
                                {afterPhase.description}
                              </div>
                            </div>

                            <div>
                              <div className="text-xs font-medium mb-1 flex justify-between">
                                <span>
                                  {t("Tasks")} ({afterPhase.tasks.length}):
                                </span>
                                {modifiedPhaseDetails?.taskChanges &&
                                  (modifiedPhaseDetails.taskChanges.added
                                    .length > 0 ||
                                    modifiedPhaseDetails.taskChanges.removed
                                      .length > 0) && (
                                    <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded">
                                      {modifiedPhaseDetails.taskChanges.added
                                        .length > 0 &&
                                      modifiedPhaseDetails.taskChanges.removed
                                        .length > 0
                                        ? t("Tasks Added & Removed")
                                        : modifiedPhaseDetails.taskChanges.added
                                              .length > 0
                                          ? t("Tasks Added")
                                          : t("Tasks Removed")}
                                    </span>
                                  )}
                              </div>
                              <ul className="space-y-1">
                                {afterPhase.tasks.map(
                                  (task: string, i: number) => {
                                    const isNewTask =
                                      modifiedPhaseDetails?.taskChanges?.added.includes(
                                        task,
                                      );
                                    return (
                                      <li
                                        key={i}
                                        className="flex items-start text-sm"
                                      >
                                        <Check
                                          className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"} ${isNewTask ? "text-green-500" : "text-muted-foreground"} flex-shrink-0 mt-0.5`}
                                        />
                                        <span
                                          className={
                                            isNewTask
                                              ? "text-green-700 dark:text-green-400 font-medium"
                                              : ""
                                          }
                                        >
                                          {task}
                                          {isNewTask && (
                                            <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-1 py-0.5 rounded ml-2">
                                              {t("New")}
                                            </span>
                                          )}
                                        </span>
                                      </li>
                                    );
                                  },
                                )}
                              </ul>

                              {modifiedPhaseDetails?.taskChanges?.removed
                                .length > 0 && (
                                <div className="mt-2 border-t pt-2">
                                  <div className="text-xs font-medium mb-1 text-red-600 dark:text-red-400">
                                    {t("Removed Tasks")}:
                                  </div>
                                  <ul className="space-y-1">
                                    {modifiedPhaseDetails.taskChanges.removed.map(
                                      (task: string, i: number) => (
                                        <li
                                          key={i}
                                          className="flex items-start text-sm text-red-600 dark:text-red-400"
                                        >
                                          <MinusCircle
                                            className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"} text-red-500 flex-shrink-0 mt-0.5`}
                                          />
                                          <span>{task}</span>
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {afterPhase.dependencies &&
                              afterPhase.dependencies.length > 0 && (
                                <div>
                                  <div className="text-xs font-medium mb-1 flex justify-between">
                                    <span>{t("Dependencies")}:</span>
                                    {modifiedPhaseDetails?.dependenciesChanged && (
                                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded">
                                        {t("Changed")}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {afterPhase.dependencies.map(
                                      (dep: string, i: number) => {
                                        const isNewDep =
                                          modifiedPhaseDetails?.dependenciesChanged?.added.includes(
                                            dep,
                                          );
                                        return (
                                          <Badge
                                            key={i}
                                            variant={
                                              isNewDep ? "default" : "outline"
                                            }
                                            className={
                                              isNewDep
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                : ""
                                            }
                                          >
                                            {dep}
                                          </Badge>
                                        );
                                      },
                                    )}
                                  </div>

                                  {modifiedPhaseDetails?.dependenciesChanged
                                    ?.removed.length > 0 && (
                                    <div className="mt-2">
                                      <div className="text-xs font-medium mb-1 text-red-600 dark:text-red-400">
                                        {t("Removed Dependencies")}:
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {modifiedPhaseDetails.dependenciesChanged.removed.map(
                                          (dep: string, i: number) => (
                                            <Badge
                                              key={i}
                                              variant="outline"
                                              className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700"
                                            >
                                              {dep}
                                            </Badge>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-32 border rounded-md bg-muted/20">
                            <span className="text-muted-foreground">
                              {t("Not present in this version")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  };

  const renderDetailedView = () => {
    if (!comparison || !beforeRoadmap || !afterRoadmap) return null;

    // Create a combined list of all phases from both roadmaps
    const allPhaseNames = new Set<string>();
    beforeRoadmap.roadmapData.phases.forEach((p: any) =>
      allPhaseNames.add(p.name),
    );
    afterRoadmap.roadmapData.phases.forEach((p: any) =>
      allPhaseNames.add(p.name),
    );

    // Sort phases by name for consistent ordering
    const sortedPhaseNames = Array.from(allPhaseNames).sort();

    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("Detailed Comparison")}</CardTitle>
          <CardDescription>
            {t("Side-by-side comparison of all phases")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Phase Name")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead>{t("Before")}</TableHead>
                  <TableHead>{t("After")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPhaseNames.map((phaseName) => {
                  const beforePhase = beforeRoadmap.roadmapData.phases.find(
                    (p: any) => p.name === phaseName,
                  );
                  const afterPhase = afterRoadmap.roadmapData.phases.find(
                    (p: any) => p.name === phaseName,
                  );

                  let status = "unchanged";
                  if (!beforePhase) status = "added";
                  else if (!afterPhase) status = "removed";
                  else if (
                    comparison.modifiedPhases.some(
                      (mp: any) => mp.name === phaseName,
                    )
                  )
                    status = "modified";

                  // Skip if filtered
                  if (filterType) {
                    const modifiedPhase = comparison.modifiedPhases.find(
                      (mp: any) => mp.name === phaseName,
                    );
                    if (status === "modified") {
                      if (
                        filterType === "priority" &&
                        !modifiedPhase?.priorityChanged
                      )
                        return null;
                      if (
                        filterType === "duration" &&
                        !modifiedPhase?.durationChanged
                      )
                        return null;
                      if (
                        filterType === "tasks" &&
                        !(
                          modifiedPhase?.taskChanges?.added.length > 0 ||
                          modifiedPhase?.taskChanges?.removed.length > 0
                        )
                      )
                        return null;
                      if (
                        filterType === "description" &&
                        !modifiedPhase?.descriptionChanged
                      )
                        return null;
                    } else if (status !== "added" && status !== "removed") {
                      return null;
                    }
                  }

                  return (
                    <TableRow key={phaseName}>
                      <TableCell className="font-medium">{phaseName}</TableCell>
                      <TableCell>
                        {status === "added" && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            {t("Added")}
                          </Badge>
                        )}
                        {status === "removed" && (
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                            {t("Removed")}
                          </Badge>
                        )}
                        {status === "modified" && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {t("Modified")}
                          </Badge>
                        )}
                        {status === "unchanged" && (
                          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                            {t("Unchanged")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {beforePhase ? (
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Badge
                                className={`${getPriorityColor(
                                  beforePhase.priority,
                                )} mr-2`}
                              >
                                {t(beforePhase.priority)}
                              </Badge>
                              <span className="text-sm">
                                {beforePhase.duration}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("Tasks")}: {beforePhase.tasks.length}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            {t("N/A")}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {afterPhase ? (
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Badge
                                className={`${getPriorityColor(
                                  afterPhase.priority,
                                )} mr-2`}
                              >
                                {t(afterPhase.priority)}
                              </Badge>
                              <span className="text-sm">
                                {afterPhase.duration}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("Tasks")}: {afterPhase.tasks.length}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            {t("N/A")}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (roadmaps.length < 2) {
    return (
      <FallbackMessage
        title={t("Not Enough Roadmaps")}
        message={t(
          "You need at least two roadmaps to perform a comparison. Please create more roadmaps.",
        )}
        icon={
          <GitCompare className="h-12 w-12 text-muted-foreground opacity-50" />
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t("Roadmap Comparison")}</h2>
          <p className="text-muted-foreground">
            {t("Compare different versions of your development roadmap")}
          </p>
        </div>
        <div className="flex gap-2">
          {comparison && (
            <>
              <Button
                variant="outline"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              >
                <Sliders className="h-4 w-4 mr-2" />
                {t("Options")}
                {showAdvancedOptions ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
              <Button variant="outline" onClick={handleSaveComparison}>
                <Save className="h-4 w-4 mr-2" />
                {t("Save")}
              </Button>
              <Button variant="outline" onClick={handleShareComparison}>
                <Share2 className="h-4 w-4 mr-2" />
                {t("Share")}
              </Button>
              <Button
                variant="outline"
                onClick={handleExportComparison}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {t("Export")}
              </Button>
            </>
          )}
        </div>
      </div>

      {showAdvancedOptions && comparison && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle>{t("Export Options")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">{t("Export Format")}</h3>
                <div className="flex space-x-2">
                  <Button
                    variant={exportFormat === "pdf" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExportFormat("pdf")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    variant={exportFormat === "json" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExportFormat("json")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    JSON
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">{t("View Options")}</h3>
                <div className="flex space-x-2">
                  <Button
                    variant={filterType === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType(null)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t("Show All")}
                  </Button>
                  <Button
                    variant={filterType !== null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("priority")}
                  >
                    <EyeOff className="h-4 w-4 mr-2" />
                    {t("Filter Changes")}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("Select Roadmaps to Compare")}</CardTitle>
          <CardDescription>
            {t("Choose two roadmaps to see what changed between them")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("Before (Older Version)")}:
              </label>
              <Select
                value={selectedBeforeId}
                onValueChange={setSelectedBeforeId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("Select an older roadmap version")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {roadmaps.map((roadmap) => (
                    <SelectItem key={roadmap.id} value={roadmap.id}>
                      {roadmap.name} (
                      {new Date(roadmap.createdAt).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("After (Newer Version)")}:
              </label>
              <Select
                value={selectedAfterId}
                onValueChange={setSelectedAfterId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("Select a newer roadmap version")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {roadmaps.map((roadmap) => (
                    <SelectItem key={roadmap.id} value={roadmap.id}>
                      {roadmap.name} (
                      {new Date(roadmap.createdAt).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="mt-4 w-full"
            onClick={handleCompare}
            disabled={comparing || !selectedBeforeId || !selectedAfterId}
          >
            {comparing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t("Comparing...")}
              </>
            ) : (
              <>
                <GitCompare className="h-4 w-4 mr-2" />
                {t("Compare Roadmaps")}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {comparison && beforeRoadmap && afterRoadmap && (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="summary">{t("Summary")}</TabsTrigger>
              <TabsTrigger value="changes">{t("Phase Changes")}</TabsTrigger>
              <TabsTrigger value="side-by-side">
                {t("Side-by-Side")}
              </TabsTrigger>
              <TabsTrigger value="detailed">{t("Detailed View")}</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-6">
              {renderSummary()}
            </TabsContent>

            <TabsContent value="changes" className="mt-6">
              {renderPhaseChanges()}
            </TabsContent>

            <TabsContent value="side-by-side" className="mt-6">
              {renderSideBySideView()}
            </TabsContent>

            <TabsContent value="detailed" className="mt-6">
              {renderDetailedView()}
            </TabsContent>
          </Tabs>

          <div className="flex items-center text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
            {t(
              "This comparison is based on the roadmap data at the time of generation and may not reflect current changes.",
            )}
          </div>
        </>
      )}
    </div>
  );
}
