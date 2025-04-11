import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/frontend/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/frontend/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import {
  Archive,
  Calendar,
  Clock,
  Download,
  FileText,
  GitCompare,
  Loader2,
  MoreHorizontal,
  Trash2,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/frontend/components/ui/use-toast";
import {
  roadmapHistoryService,
  RoadmapHistoryItem,
} from "@/frontend/services/roadmapHistoryService";
import { projectAnalysisService } from "@/frontend/services/projectAnalysisService";

export default function RoadmapHistory() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [roadmaps, setRoadmaps] = useState<RoadmapHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoadmap, setSelectedRoadmap] =
    useState<RoadmapHistoryItem | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const isRTL = i18n.dir() === "rtl";

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const data = await roadmapHistoryService.getSavedRoadmaps();
      setRoadmaps(data);
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

  const handleViewRoadmap = (roadmap: RoadmapHistoryItem) => {
    // In a real implementation, this would navigate to a roadmap viewer
    // or set state to display the roadmap in a modal/panel
    setSelectedRoadmap(roadmap);
    toast({
      title: t("Roadmap Selected"),
      description: t("Viewing roadmap: {{name}}", { name: roadmap.name }),
    });
  };

  const handleCompareRoadmaps = (roadmap: RoadmapHistoryItem) => {
    // Navigate to the comparison tab with this roadmap pre-selected
    // In a real implementation, this would use a router or state management
    // to navigate to the comparison tab with the selected roadmap
    const event = new CustomEvent("navigate-to-comparison", {
      detail: { roadmapId: roadmap.id },
    });
    window.dispatchEvent(event);

    toast({
      title: t("Compare Roadmaps"),
      description: t("Select another roadmap to compare with {{name}}", {
        name: roadmap.name,
      }),
    });
  };

  const handleArchiveRoadmap = async (roadmap: RoadmapHistoryItem) => {
    setIsArchiving(true);
    try {
      const success = await roadmapHistoryService.archiveRoadmap(roadmap.id);
      if (success) {
        toast({
          title: t("Roadmap Archived"),
          description: t("The roadmap has been archived successfully"),
        });
        fetchRoadmaps();
      } else {
        toast({
          title: t("Archive Failed"),
          description: t("Failed to archive the roadmap"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error archiving roadmap:", error);
      toast({
        title: t("Error"),
        description: t("An error occurred while archiving the roadmap"),
        variant: "destructive",
      });
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDeleteRoadmap = async () => {
    if (!selectedRoadmap) return;

    setIsDeleting(true);
    try {
      const success = await roadmapHistoryService.deleteRoadmap(
        selectedRoadmap.id,
      );
      if (success) {
        toast({
          title: t("Roadmap Deleted"),
          description: t("The roadmap has been deleted successfully"),
        });
        setShowDeleteDialog(false);
        fetchRoadmaps();
      } else {
        toast({
          title: t("Deletion Failed"),
          description: t("Failed to delete the roadmap"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting roadmap:", error);
      toast({
        title: t("Error"),
        description: t("An error occurred while deleting the roadmap"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportRoadmap = async (roadmap: RoadmapHistoryItem) => {
    setIsExporting(true);
    try {
      // In a real implementation, this would generate and download a file
      // For now, we'll just simulate the export
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a JSON string of the roadmap data
      const roadmapJson = JSON.stringify(roadmap.roadmapData, null, 2);

      // Create a blob and download link
      const blob = new Blob([roadmapJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${roadmap.name.replace(/\s+/g, "-").toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: t("Export Successful"),
        description: t("The roadmap has been exported successfully"),
      });
    } catch (error) {
      console.error("Error exporting roadmap:", error);
      toast({
        title: t("Export Failed"),
        description: t("Failed to export the roadmap"),
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const confirmDelete = (roadmap: RoadmapHistoryItem) => {
    setSelectedRoadmap(roadmap);
    setShowDeleteDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            {t("Active")}
          </Badge>
        );
      case "archived":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            {t("Archived")}
          </Badge>
        );
      case "deleted":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            {t("Deleted")}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t("Roadmap History")}</h2>
          <p className="text-muted-foreground">
            {t("View and manage saved development roadmaps")}
          </p>
        </div>
        <Button onClick={fetchRoadmaps} variant="outline" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Clock className="h-4 w-4 mr-2" />
          )}
          {t("Refresh")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("Saved Roadmaps")}</CardTitle>
          <CardDescription>
            {t("All roadmaps generated and saved for the project")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : roadmaps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("No roadmaps found")}</p>
              <p className="text-sm">
                {t("Generate and save a roadmap to see it here")}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Name")}</TableHead>
                    <TableHead>{t("Created")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead>{t("Phases")}</TableHead>
                    <TableHead className="text-right">{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roadmaps.map((roadmap) => (
                    <TableRow key={roadmap.id}>
                      <TableCell className="font-medium">
                        <div className="max-w-md truncate">{roadmap.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {roadmap.description?.split("\n")[0]}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>
                            {new Date(roadmap.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <User className="h-3 w-3 mr-1" />
                          <span>{roadmap.createdBy || t("System")}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(roadmap.status)}</TableCell>
                      <TableCell>
                        {roadmap.roadmapData?.phases?.length || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{t("Actions")}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewRoadmap(roadmap)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              {t("View")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCompareRoadmaps(roadmap)}
                            >
                              <GitCompare className="h-4 w-4 mr-2" />
                              {t("Compare")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleExportRoadmap(roadmap)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {t("Export")}
                            </DropdownMenuItem>
                            {roadmap.status === "active" && (
                              <DropdownMenuItem
                                onClick={() => handleArchiveRoadmap(roadmap)}
                              >
                                <Archive className="h-4 w-4 mr-2" />
                                {t("Archive")}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => confirmDelete(roadmap)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t("Delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Confirm Deletion")}</DialogTitle>
            <DialogDescription>
              {t(
                "Are you sure you want to delete this roadmap? This action cannot be undone.",
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedRoadmap && (
              <div className="border rounded-md p-3 bg-muted/50">
                <p className="font-medium">{selectedRoadmap.name}</p>
                <p className="text-sm text-muted-foreground">
                  {t("Created")}:{" "}
                  {new Date(selectedRoadmap.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              {t("Cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRoadmap}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t("Deleting...")}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("Delete")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
