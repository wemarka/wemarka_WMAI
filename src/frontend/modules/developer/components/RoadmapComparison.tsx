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
} from "lucide-react";
import { FallbackMessage } from "@/frontend/components/ui/fallback-message";

interface RoadmapComparisonProps {
  initialRoadmapIds?: { before: string; after: string };
}

export default function RoadmapComparison({
  initialRoadmapIds,
}: RoadmapComparisonProps) {
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

  const handleExportComparison = () => {
    if (!comparison || !beforeRoadmap || !afterRoadmap) return;

    try {
      // Create a JSON string of the comparison data
      const comparisonData = {
        comparison,
        before: {
          id: beforeRoadmap.id,
          name: beforeRoadmap.name,
          createdAt: beforeRoadmap.createdAt,
        },
        after: {
          id: afterRoadmap.id,
          name: afterRoadmap.name,
          createdAt: afterRoadmap.createdAt,
        },
        exportedAt: new Date().toISOString(),
      };

      const comparisonJson = JSON.stringify(comparisonData, null, 2);

      // Create a blob and download link
      const blob = new Blob([comparisonJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `roadmap-comparison-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

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
    }
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

  const renderSummary = () => {
    if (!comparison || !beforeRoadmap || !afterRoadmap) return null;

    return (
      <div className="space-y-6">
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
                <div className="font-medium">{t("Phases")}:</div>
                <div>{beforeRoadmap.roadmapData.phases.length}</div>
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
                <div className="font-medium">{t("Phases")}:</div>
                <div>{afterRoadmap.roadmapData.phases.length}</div>
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
                  {comparison.modifiedPhases.map(
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
        {comparison && (
          <Button
            variant="outline"
            onClick={handleExportComparison}
            disabled={!comparison}
          >
            <Download className="h-4 w-4 mr-2" />
            {t("Export Comparison")}
          </Button>
        )}
      </div>

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
              <TabsTrigger value="detailed">{t("Detailed View")}</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-6">
              {renderSummary()}
            </TabsContent>

            <TabsContent value="changes" className="mt-6">
              {renderPhaseChanges()}
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
