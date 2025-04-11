import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Separator } from "@/frontend/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { Roadmap } from "@/frontend/services/projectAnalysisService";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  Calendar,
  Check,
  Clock,
  Download,
  FileText,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Loader2,
  BarChart,
  AlertTriangle,
  Zap,
  Users,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  GanttChart,
  List,
  GripVertical,
  Move,
} from "lucide-react";
import { FallbackMessage } from "@/frontend/components/ui/fallback-message";

interface RoadmapVisualizationProps {
  roadmap: Roadmap | null;
  loading: boolean;
  filterPriority: string | null;
  onAIAssist: (phaseIndex: number) => void;
  isRTL: boolean;
}

export default function RoadmapVisualization({
  roadmap,
  loading,
  filterPriority,
  onAIAssist,
  isRTL,
}: RoadmapVisualizationProps) {
  const { t } = useTranslation();
  const [viewType, setViewType] = useState<"timeline" | "gantt" | "list">(
    "timeline",
  );

  // Update activeView when viewType changes
  useEffect(() => {
    setActiveView(viewType);
  }, [viewType]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [phases, setPhases] = useState<Roadmap["phases"]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [activeView, setActiveView] = useState<string>("timeline");

  useEffect(() => {
    if (roadmap) {
      setPhases(roadmap.phases);
    }
  }, [roadmap]);

  const getFilteredPhases = () => {
    if (!phases.length) return [];
    if (!filterPriority) return phases;

    return phases.filter(
      (phase) => phase.priority.toLowerCase() === filterPriority.toLowerCase(),
    );
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);

    // Dropped outside the list
    if (!result.destination) return;

    // No movement
    if (result.destination.index === result.source.index) return;

    // Get filtered phases to ensure we're working with the correct subset
    const filteredItems = getFilteredPhases();
    const allItems = Array.from(phases);

    // Find the actual indices in the full phases array
    const sourceItem = filteredItems[result.source.index];
    const sourceIndex = allItems.findIndex(
      (item) => item.name === sourceItem.name,
    );

    // If we're reordering within the same priority group
    const [reorderedItem] = allItems.splice(sourceIndex, 1);

    // Find the destination index in the full array
    const destItem = filteredItems[result.destination.index];
    const destIndex = allItems.findIndex((item) => item.name === destItem.name);

    // Insert at the correct position
    if (destIndex >= 0) {
      // If moving forward, we need to adjust the index since we removed an item
      const adjustedDestIndex = sourceIndex < destIndex ? destIndex : destIndex;
      allItems.splice(adjustedDestIndex, 0, reorderedItem);
    } else {
      // Fallback to just using the destination index
      allItems.splice(result.destination.index, 0, reorderedItem);
    }

    setPhases(allItems);

    // Provide visual feedback for successful drag
    const toastMessage = isRTL
      ? "تم تحديث ترتيب المراحل بنجاح"
      : "Phase order updated successfully";
    // In a real implementation, this would use the toast system
    console.log(toastMessage);

    // Provide haptic feedback if available
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([50, 50, 50]);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    // Provide haptic feedback if available
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
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

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.25, 0.5));
  };

  const exportAsImage = () => {
    // In a real implementation, this would use html2canvas or a similar library
    // to capture the roadmap visualization as an image
    alert(t("Export as image functionality would be implemented here"));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg" dir="auto">
          {t("Loading roadmap visualization...")}
        </p>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <FallbackMessage
        title={t("No Roadmap Available")}
        message={t("There is no roadmap data available to visualize.")}
        icon={
          <GitPullRequest className="h-12 w-12 text-muted-foreground opacity-50" />
        }
        dir="auto"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs
          value={viewType}
          onValueChange={(v) => {
            setViewType(v as any);
            setActiveView(v);
          }}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="timeline">
              <CalendarDays className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
              {t("Timeline")}
            </TabsTrigger>
            <TabsTrigger value="gantt">
              <GanttChart className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
              {t("Gantt Chart")}
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
              {t("List View")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div
          className={`flex items-center ${isRTL ? "space-x-reverse" : ""} space-x-2`}
        >
          <div className="flex border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
              className="px-2 h-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center px-2 text-sm">
              {Math.round(zoomLevel * 100)}%
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2}
              className="px-2 h-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={exportAsImage}>
            <Download className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
            {t("Export as Image")}
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-card">
        {/* Wrap all content in a Tabs component */}
        <Tabs value={viewType} onValueChange={(v) => setViewType(v as any)}>
          <TabsContent value="timeline" className="mt-0">
            <DragDropContext
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
            >
              <Droppable droppableId="timeline-phases">
                {(provided) => (
                  <div
                    ref={(el) => {
                      timelineRef.current = el;
                      provided.innerRef(el);
                    }}
                    className="space-y-8"
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: "top left",
                      direction: isRTL ? "rtl" : "ltr",
                    }}
                    {...provided.droppableProps}
                  >
                    {getFilteredPhases().map((phase, index) => (
                      <Draggable
                        key={`phase-${index}`}
                        draggableId={`phase-${index}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            id={`timeline-phase-${index}`}
                            className={`relative transition-all duration-200 ${snapshot.isDragging ? "opacity-70 bg-accent/20 rounded-lg shadow-lg scale-[1.02] border-2 border-primary/50" : "hover:bg-accent/10 rounded-lg"}`}
                          >
                            {index > 0 && (
                              <div className="absolute left-6 top-0 h-full w-px bg-border -translate-x-1/2 -translate-y-1/2" />
                            )}
                            <div className="relative">
                              <div className="flex items-center">
                                <div
                                  {...provided.dragHandleProps}
                                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-110 hover:shadow-md"
                                >
                                  <div className="relative">
                                    <span>{index + 1}</span>
                                    <GripVertical className="h-4 w-4 absolute -bottom-4 left-1/2 transform -translate-x-1/2 opacity-50" />
                                  </div>
                                </div>
                                <div
                                  className={`${isRTL ? "mr-4" : "ml-4"} space-y-1`}
                                >
                                  <div className="flex items-center">
                                    <h3 className="text-xl font-semibold">
                                      {phase.name}
                                    </h3>
                                    <Badge
                                      className={`${isRTL ? "mr-2" : "ml-2"} ${getPriorityColor(phase.priority)}`}
                                    >
                                      {t(phase.priority)}
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={`${isRTL ? "mr-2" : "ml-2"}`}
                                      onClick={() => onAIAssist(index)}
                                    >
                                      <Zap className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <p className="text-muted-foreground">
                                    {t("Duration")}: {phase.duration}
                                  </p>
                                </div>
                              </div>

                              <div
                                className={`mt-2 ${isRTL ? "mr-16" : "ml-16"}`}
                              >
                                <p className="mb-2" dir="auto">
                                  {phase.description}
                                </p>

                                {phase.dependencies &&
                                  phase.dependencies.length > 0 && (
                                    <div className="mb-2">
                                      <span className="text-sm font-medium">
                                        {t("Dependencies")}:
                                      </span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {phase.dependencies.map((dep, i) => (
                                          <Badge key={i} variant="outline">
                                            {dep}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                <div className="mt-4">
                                  <h4 className="text-sm font-medium mb-2">
                                    {t("Tasks")}:
                                  </h4>
                                  <ul className="space-y-1">
                                    {phase.tasks.map((task, i) => (
                                      <li key={i} className="flex items-start">
                                        <Check
                                          className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"} text-green-500 flex-shrink-0`}
                                        />
                                        <span dir="auto">{task}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {index < getFilteredPhases().length - 1 && (
                              <Separator className="my-8" />
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </TabsContent>

          <TabsContent value="gantt" className="mt-0">
            <DragDropContext
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
            >
              <Droppable droppableId="gantt-phases" direction="vertical">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="relative overflow-x-auto"
                  >
                    <div
                      className="min-w-[800px]"
                      style={{
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: "top left",
                        direction: isRTL ? "rtl" : "ltr",
                      }}
                    >
                      {/* Gantt Chart Header */}
                      <div className="flex items-center mb-4">
                        <div className="w-1/4 font-medium">{t("Phase")}</div>
                        <div className="w-3/4 flex">
                          {Array.from({ length: 12 }, (_, i) => (
                            <div
                              key={i}
                              className="flex-1 text-center text-sm font-medium border-l px-1"
                            >
                              {t("Month")} {i + 1}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Today's Date Indicator */}
                      <div className="relative w-full h-0">
                        <div
                          className="absolute top-0 h-full border-l-2 border-blue-500 z-10 flex items-start"
                          style={{
                            left: `${25 + (new Date().getDate() / 30) * (75 / 12)}%`,
                            height: `${getFilteredPhases().length * 48 + 16}px`,
                          }}
                        >
                          <div
                            className={`bg-blue-500 text-white text-xs px-1 py-0.5 rounded ${isRTL ? "-mr-[20px]" : "-ml-[20px]"} mt-1`}
                          >
                            {t("Today")}
                          </div>
                        </div>
                      </div>

                      {/* Phases */}
                      {getFilteredPhases().map((phase, index) => {
                        // Calculate duration in months (for demo purposes)
                        const durationText = phase.duration;
                        let durationMonths = 1; // Default

                        // Try to extract number of months from duration text
                        const monthsMatch =
                          durationText.match(/(\d+)\s*months?/i);
                        const weeksMatch =
                          durationText.match(/(\d+)\s*weeks?/i);

                        if (monthsMatch) {
                          durationMonths = parseInt(monthsMatch[1]);
                        } else if (weeksMatch) {
                          durationMonths = Math.ceil(
                            parseInt(weeksMatch[1]) / 4,
                          ); // Approximate weeks to months
                        }

                        // Calculate start month (for demo purposes)
                        // Each phase starts after the previous one
                        let startMonth = 0;
                        for (let i = 0; i < index; i++) {
                          const prevDuration = getFilteredPhases()[i].duration;
                          const prevMonthsMatch =
                            prevDuration.match(/(\d+)\s*months?/i);
                          const prevWeeksMatch =
                            prevDuration.match(/(\d+)\s*weeks?/i);

                          if (prevMonthsMatch) {
                            startMonth += parseInt(prevMonthsMatch[1]);
                          } else if (prevWeeksMatch) {
                            startMonth += Math.ceil(
                              parseInt(prevWeeksMatch[1]) / 4,
                            );
                          } else {
                            startMonth += 1; // Default
                          }
                        }

                        // Ensure we don't exceed 12 months for display
                        const displayDuration = Math.min(
                          durationMonths,
                          12 - startMonth,
                        );

                        // Calculate dependencies for visualization
                        const hasDependencies =
                          phase.dependencies && phase.dependencies.length > 0;

                        return (
                          <Draggable
                            key={`gantt-phase-${index}`}
                            draggableId={`gantt-phase-${index}`}
                            index={index}
                            isDragDisabled={activeView !== "gantt"}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                id={`gantt-phase-${index}`}
                                className={`flex items-center mb-3 h-12 group transition-all duration-200 rounded-md ${snapshot.isDragging ? "opacity-80 bg-accent/40 z-10 shadow-lg scale-[1.02] border-2 border-primary/50" : "hover:bg-accent/20"}`}
                              >
                                <div className="w-1/4 flex items-center">
                                  <div
                                    className="font-medium truncate"
                                    dir="auto"
                                  >
                                    {phase.name}
                                  </div>
                                  <Badge
                                    className={`${isRTL ? "mr-1" : "ml-1"} ${getPriorityColor(phase.priority)}`}
                                  >
                                    {t(phase.priority)}
                                  </Badge>
                                </div>
                                <div className="w-3/4 flex relative">
                                  {/* Dependency Lines */}
                                  {hasDependencies &&
                                    phase.dependencies?.map((dep, i) => {
                                      // Find the index of the dependency phase
                                      const depIndex =
                                        getFilteredPhases().findIndex(
                                          (p) => p.name === dep,
                                        );
                                      if (depIndex >= 0) {
                                        // Calculate the end position of the dependency phase
                                        let depEndMonth = 0;
                                        for (let j = 0; j <= depIndex; j++) {
                                          const phaseDuration =
                                            getFilteredPhases()[j].duration;
                                          const monthsMatch =
                                            phaseDuration.match(
                                              /(\d+)\s*months?/i,
                                            );
                                          const weeksMatch =
                                            phaseDuration.match(
                                              /(\d+)\s*weeks?/i,
                                            );

                                          if (monthsMatch) {
                                            depEndMonth += parseInt(
                                              monthsMatch[1],
                                            );
                                          } else if (weeksMatch) {
                                            depEndMonth += Math.ceil(
                                              parseInt(weeksMatch[1]) / 4,
                                            );
                                          } else {
                                            depEndMonth += 1;
                                          }
                                        }

                                        return (
                                          <div
                                            key={i}
                                            className="absolute border-t-2 border-dashed border-gray-400 z-0"
                                            style={{
                                              left: `0%`,
                                              top: `-${(index - depIndex) * 15}px`,
                                              width: `${(startMonth / 12) * 100}%`,
                                              height: `${(index - depIndex) * 15}px`,
                                              borderRight:
                                                "2px dashed rgb(156, 163, 175)",
                                            }}
                                          />
                                        );
                                      }
                                      return null;
                                    })}

                                  {/* Phase Bar */}
                                  <div
                                    className="absolute h-8 rounded-md flex items-center justify-center text-sm font-medium cursor-pointer transition-all group-hover:ring-2 ring-primary/30"
                                    style={{
                                      left: `${(startMonth / 12) * 100}%`,
                                      width: `${(displayDuration / 12) * 100}%`,
                                      backgroundColor:
                                        phase.priority.toLowerCase() === "high"
                                          ? "rgba(239, 68, 68, 0.2)"
                                          : phase.priority.toLowerCase() ===
                                              "medium"
                                            ? "rgba(234, 179, 8, 0.2)"
                                            : "rgba(34, 197, 94, 0.2)",
                                      borderLeft: `3px solid ${
                                        phase.priority.toLowerCase() === "high"
                                          ? "rgb(239, 68, 68)"
                                          : phase.priority.toLowerCase() ===
                                              "medium"
                                            ? "rgb(234, 179, 8)"
                                            : "rgb(34, 197, 94)"
                                      }`,
                                    }}
                                    onClick={() => onAIAssist(index)}
                                    title={phase.description}
                                  >
                                    <span className="truncate px-2" dir="auto">
                                      {phase.name} ({phase.duration})
                                    </span>
                                    <div
                                      className={`absolute ${isRTL ? "left-1" : "right-1"} top-1 opacity-0 group-hover:opacity-100 transition-opacity`}
                                    >
                                      <Zap className="h-3 w-3 text-primary" />
                                    </div>
                                  </div>

                                  {/* Task Indicators */}
                                  <div className="absolute bottom-0 left-0 w-full flex justify-between px-1">
                                    {phase.tasks.length > 0 && (
                                      <div
                                        className={`flex ${isRTL ? "space-x-reverse" : ""} space-x-1`}
                                      >
                                        {Array.from(
                                          {
                                            length: Math.min(
                                              5,
                                              phase.tasks.length,
                                            ),
                                          },
                                          (_, i) => (
                                            <div
                                              key={i}
                                              className="h-1 w-1 rounded-full bg-primary/70"
                                              title={phase.tasks[i]}
                                            />
                                          ),
                                        )}
                                        {phase.tasks.length > 5 && (
                                          <div className="text-xs text-muted-foreground">
                                            +{phase.tasks.length - 5}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}

                      {/* Month Grid Lines */}
                      <div className="absolute top-0 left-1/4 w-3/4 h-full pointer-events-none">
                        {Array.from({ length: 12 }, (_, i) => (
                          <div
                            key={i}
                            className="absolute h-full border-l border-gray-200 dark:border-gray-700"
                            style={{ left: `${(i / 12) * 100}%` }}
                          />
                        ))}
                      </div>
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <DragDropContext
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
            >
              <Droppable droppableId="list-phases" direction="vertical">
                {(provided) => (
                  <ScrollArea className="h-[500px]">
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-4"
                      style={{
                        direction: isRTL ? "rtl" : "ltr",
                      }}
                    >
                      {getFilteredPhases().map((phase, index) => (
                        <Draggable
                          key={`list-phase-${index}`}
                          draggableId={`list-phase-${index}`}
                          index={index}
                          isDragDisabled={activeView !== "list"}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              id={`list-phase-${index}`}
                              className={`border rounded-md p-4 transition-all duration-200 ${snapshot.isDragging ? "opacity-80 bg-accent/40 shadow-lg scale-[1.02] border-2 border-primary/50" : "hover:bg-accent/20"}`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="w-full cursor-grab active:cursor-grabbing relative"
                              >
                                <div
                                  className={`absolute top-0 ${isRTL ? "left-0" : "right-0"} opacity-30 group-hover:opacity-100 transition-opacity`}
                                >
                                  <Move className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center">
                                      <span
                                        className={`flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm ${isRTL ? "ml-2" : "mr-2"}`}
                                      >
                                        {index + 1}
                                      </span>
                                      <h3
                                        className="text-lg font-semibold"
                                        dir="auto"
                                      >
                                        {phase.name}
                                      </h3>
                                      <Badge
                                        className={`${isRTL ? "mr-2" : "ml-2"} ${getPriorityColor(phase.priority)}`}
                                      >
                                        {t(phase.priority)}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {t("Duration")}: {phase.duration}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onAIAssist(index)}
                                  >
                                    <Zap
                                      className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`}
                                    />
                                    {t("Analyze")}
                                  </Button>
                                </div>

                                <p className="mt-2" dir="auto">
                                  {phase.description}
                                </p>

                                {phase.dependencies &&
                                  phase.dependencies.length > 0 && (
                                    <div className="mt-3">
                                      <span className="text-sm font-medium">
                                        {t("Dependencies")}:
                                      </span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {phase.dependencies.map((dep, i) => (
                                          <Badge key={i} variant="outline">
                                            {dep}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                <div className="mt-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium">
                                      {t("Tasks")} ({phase.tasks.length})
                                    </h4>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-2"
                                    >
                                      {t("Show All")}
                                    </Button>
                                  </div>
                                  <ul className="mt-1 space-y-1">
                                    {phase.tasks.slice(0, 3).map((task, i) => (
                                      <li
                                        key={i}
                                        className="flex items-start text-sm"
                                      >
                                        <Check
                                          className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"} text-green-500 flex-shrink-0 mt-0.5`}
                                        />
                                        <span dir="auto">{task}</span>
                                      </li>
                                    ))}
                                    {phase.tasks.length > 3 && (
                                      <li className="text-sm text-muted-foreground">
                                        +{phase.tasks.length - 3}{" "}
                                        {t("more tasks")}
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </ScrollArea>
                )}
              </Droppable>
            </DragDropContext>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex items-center text-sm text-muted-foreground">
        <AlertTriangle
          className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4 text-yellow-500`}
        />
        <span dir="auto">
          {t(
            "This visualization is based on AI-generated data and should be reviewed by the team",
          )}
        </span>
      </div>
    </div>
  );
}
