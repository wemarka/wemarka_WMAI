import React, { useState, useEffect } from "react";
import { useToast } from "@/frontend/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/frontend/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Database,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface MigrationLog {
  id: string;
  sql_preview: string;
  sql_hash: string;
  execution_method: string;
  status: string;
  execution_time_ms: number;
  error_message?: string;
  user_id?: string;
  created_at: string;
  metadata?: any;
}

const MigrationLogs: React.FC = () => {
  const [logs, setLogs] = useState<MigrationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("migration_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        throw error;
      }

      setLogs(data || []);
    } catch (error: any) {
      console.error("Error fetching migration logs:", error);
      toast({
        title: "Error",
        description: `Failed to fetch migration logs: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Migration Logs
            </CardTitle>
            <CardDescription>
              Recent SQL migration execution history
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {loading ? "Loading logs..." : "No migration logs found"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>SQL Preview</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {log.status === "success" ? (
                        <Badge variant="success" className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Success
                        </Badge>
                      ) : (
                        <Badge
                          variant="destructive"
                          className="flex items-center"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Error
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs max-w-md truncate">
                      {log.sql_preview}
                      {log.error_message && (
                        <div className="text-destructive text-xs mt-1">
                          {log.error_message}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.execution_method}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        {log.execution_time_ms
                          ? log.execution_time_ms > 1000
                            ? `${(log.execution_time_ms / 1000).toFixed(2)}s`
                            : `${log.execution_time_ms}ms`
                          : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MigrationLogs;
