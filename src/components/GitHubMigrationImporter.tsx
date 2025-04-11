import React, { useState } from "react";
import { useToast } from "@/frontend/components/ui/use-toast";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
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
  Loader2,
  FileCode,
  Github,
  RefreshCw,
  Download,
  Play,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/frontend/components/ui/alert";
import { githubApi } from "@/api/github";
import { migrationsApi } from "@/api/migrations";

const GitHubMigrationImporter: React.FC = () => {
  const { toast } = useToast();
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const [path, setPath] = useState("supabase/migrations");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  // Fetch migration files from GitHub
  const fetchMigrationFiles = async () => {
    if (!owner || !repo) {
      setError("Repository owner and name are required");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFiles([]);
    setSelectedFile(null);
    setFileContent("");
    setResult(null);

    try {
      const { files, error } = await githubApi.fetchMigrationFiles(
        owner,
        repo,
        path,
        branch,
      );

      if (error) {
        setError(`Failed to fetch migration files: ${error.message || error}`);
        toast({
          title: "Error",
          description: `Failed to fetch migration files: ${error.message || error}`,
          variant: "destructive",
        });
      } else {
        setFiles(files);
        if (files.length === 0) {
          setError(`No SQL migration files found in ${path}`);
        } else {
          toast({
            title: "Success",
            description: `Found ${files.length} migration files`,
            variant: "success",
          });
        }
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Import a selected migration file
  const importMigrationFile = async (filePath: string) => {
    setIsImporting(true);
    setError(null);
    setFileContent("");
    setResult(null);

    try {
      const { success, sql, error } = await githubApi.importMigrationFile(
        owner,
        repo,
        filePath,
        branch,
      );

      if (!success || !sql) {
        setError(
          `Failed to import migration file: ${error?.message || error || "Unknown error"}`,
        );
        toast({
          title: "Error",
          description: `Failed to import migration file: ${error?.message || error || "Unknown error"}`,
          variant: "destructive",
        });
      } else {
        setFileContent(sql);
        setSelectedFile(filePath);
        toast({
          title: "Success",
          description: "Migration file imported successfully",
          variant: "success",
        });
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Apply the selected migration
  const applyMigration = async () => {
    if (!fileContent) {
      setError("No migration content to apply");
      return;
    }

    setIsApplying(true);
    setError(null);
    setResult(null);

    try {
      const result = await migrationsApi.runCustomSql(fileContent);
      setResult(result);

      if (result.success) {
        toast({
          title: "Success",
          description: "Migration applied successfully",
          variant: "success",
        });
      } else {
        setError(
          `Failed to apply migration: ${result.error?.message || JSON.stringify(result.error)}`,
        );
        toast({
          title: "Error",
          description: `Failed to apply migration: ${result.error?.message || JSON.stringify(result.error)}`,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Github className="mr-2 h-5 w-5" />
          GitHub Migration Importer
        </CardTitle>
        <CardDescription>
          Import and apply SQL migrations from GitHub repositories
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="owner">Repository Owner</Label>
            <Input
              id="owner"
              placeholder="e.g., username or organization"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repo">Repository Name</Label>
            <Input
              id="repo"
              placeholder="e.g., project-name"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Input
              id="branch"
              placeholder="e.g., main"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="path">Migrations Path</Label>
            <Input
              id="path"
              placeholder="e.g., supabase/migrations"
              value={path}
              onChange={(e) => setPath(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={fetchMigrationFiles}
          disabled={isLoading || !owner || !repo}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fetching Files...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Fetch Migration Files
            </>
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {files.length > 0 && (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.sha}>
                    <TableCell className="font-medium">{file.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {file.path}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => importMigrationFile(file.path)}
                        disabled={isImporting}
                      >
                        {isImporting && selectedFile === file.path ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {fileContent && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Migration Content</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={applyMigration}
                disabled={isApplying}
              >
                {isApplying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Apply Migration
                  </>
                )}
              </Button>
            </div>
            <div className="relative">
              <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto max-h-60 text-xs font-mono">
                {fileContent}
              </pre>
              <div className="absolute top-2 right-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                <FileCode className="h-3 w-3 inline mr-1" />
                {selectedFile?.split("/").pop()}
              </div>
            </div>
          </div>
        )}

        {result && (
          <Alert variant={result.success ? "success" : "destructive"}>
            {result.success ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>
              {result.success
                ? "Migration applied successfully"
                : `Failed to apply migration: ${result.error?.message || JSON.stringify(result.error)}`}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              // Navigate to migration logs
              window.location.href =
                "/tempobook/storyboards/migration-logs-storyboard";
            }}
          >
            View Logs
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setFiles([]);
              setSelectedFile(null);
              setFileContent("");
              setResult(null);
              setError(null);
            }}
            disabled={files.length === 0 && !fileContent && !error && !result}
          >
            Clear
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GitHubMigrationImporter;
