import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/frontend/components/ui/dialog";
import { Button } from "@/frontend/components/ui/button";
import { Label } from "@/frontend/components/ui/label";
import { Input } from "@/frontend/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import { Loader2, Download, FileText, Image, Share2 } from "lucide-react";
import { Roadmap } from "@/frontend/services/projectAnalysisService";

interface RoadmapExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roadmap: Roadmap | null;
  onExport: (format: string, options: any) => Promise<void>;
  isExporting: boolean;
}

export default function RoadmapExportModal({
  open,
  onOpenChange,
  roadmap,
  onExport,
  isExporting,
}: RoadmapExportModalProps) {
  const { t } = useTranslation();
  const [exportFormat, setExportFormat] = useState<string>("pdf");
  const [fileName, setFileName] = useState<string>(
    `roadmap-${new Date().toISOString().split("T")[0]}`,
  );
  const [includeMetadata, setIncludeMetadata] = useState<boolean>(true);
  const [includeTasks, setIncludeTasks] = useState<boolean>(true);
  const [includeTimeline, setIncludeTimeline] = useState<boolean>(true);

  const handleExport = async () => {
    const options = {
      fileName,
      includeMetadata,
      includeTasks,
      includeTimeline,
    };
    await onExport(exportFormat, options);
  };

  if (!roadmap) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("Export Roadmap")}</DialogTitle>
          <DialogDescription>
            {t("Choose export format and options for your roadmap")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>{t("Export Format")}</Label>
            <Tabs
              defaultValue={exportFormat}
              onValueChange={setExportFormat}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="pdf">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </TabsTrigger>
                <TabsTrigger value="image">
                  <Image className="h-4 w-4 mr-2" />
                  {t("Image")}
                </TabsTrigger>
                <TabsTrigger value="json">
                  <FileText className="h-4 w-4 mr-2" />
                  JSON
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileName">{t("File Name")}</Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="roadmap-export"
            />
          </div>

          <div className="space-y-3">
            <Label>{t("Export Options")}</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeMetadata"
                checked={includeMetadata}
                onCheckedChange={(checked) =>
                  setIncludeMetadata(checked as boolean)
                }
              />
              <Label
                htmlFor="includeMetadata"
                className="text-sm font-normal cursor-pointer"
              >
                {t("Include metadata (generation date, summary)")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeTasks"
                checked={includeTasks}
                onCheckedChange={(checked) =>
                  setIncludeTasks(checked as boolean)
                }
              />
              <Label
                htmlFor="includeTasks"
                className="text-sm font-normal cursor-pointer"
              >
                {t("Include detailed tasks for each phase")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeTimeline"
                checked={includeTimeline}
                onCheckedChange={(checked) =>
                  setIncludeTimeline(checked as boolean)
                }
              />
              <Label
                htmlFor="includeTimeline"
                className="text-sm font-normal cursor-pointer"
              >
                {t("Include timeline visualization")}
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("Cancel")}
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("Exporting...")}
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                {t("Export")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
