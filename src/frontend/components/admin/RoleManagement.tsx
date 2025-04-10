import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/frontend/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Badge } from "@/frontend/components/ui/badge";
import { useToast } from "@/frontend/components/ui/use-toast";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { UserRole } from "@/frontend/contexts/RoleContext";
import { supabase } from "@/lib/supabase";
import {
  assignUserRole,
  removeUserRole,
} from "@/frontend/services/roleService";
import { Loader2, Search, ShieldCheck, UserPlus, X } from "lucide-react";

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  roles: UserRole[];
}

const RoleManagement: React.FC = () => {
  const { toast } = useToast();
  const { assignRole } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const roleOptions: { value: UserRole; label: string }[] = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "editor", label: "Editor" },
    { value: "viewer", label: "Viewer" },
    { value: "user", label: "User" },
  ];

  // Fetch users and their roles
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch users from Supabase Auth
      const { data: authUsers, error: authError } =
        await supabase.auth.admin.listUsers();

      if (authError) throw authError;

      // Fetch roles for each user
      const usersWithRoles = await Promise.all(
        authUsers.users.map(async (user) => {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id);

          const roles = roleData
            ? roleData.map((r) => r.role as UserRole)
            : ["user"];

          return {
            ...user,
            roles,
          };
        }),
      );

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user_metadata?.full_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Assign role to user
  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRole) return;

    try {
      const success = await assignUserRole(selectedUserId, selectedRole);

      if (success) {
        toast({
          title: "Role Assigned",
          description: `Successfully assigned ${selectedRole} role to user.`,
        });

        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUserId
              ? {
                  ...user,
                  roles: user.roles.includes(selectedRole)
                    ? user.roles
                    : [...user.roles, selectedRole],
                }
              : user,
          ),
        );
      } else {
        throw new Error("Failed to assign role");
      }
    } catch (error) {
      console.error("Error assigning role:", error);
      toast({
        title: "Error",
        description: "Failed to assign role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSelectedUserId(null);
    }
  };

  // Remove role from user
  const handleRemoveRole = async (userId: string, role: UserRole) => {
    try {
      const success = await removeUserRole(userId, role);

      if (success) {
        toast({
          title: "Role Removed",
          description: `Successfully removed ${role} role from user.`,
        });

        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  roles: user.roles.filter((r) => r !== role),
                }
              : user,
          ),
        );
      } else {
        throw new Error("Failed to remove role");
      }
    } catch (error) {
      console.error("Error removing role:", error);
      toast({
        title: "Error",
        description: "Failed to remove role. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
          Role Management
        </CardTitle>
        <CardDescription>
          Manage user roles and permissions across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAssignRole}
              disabled={!selectedUserId}
              className="flex items-center"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Assign Role
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading users...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className={selectedUserId === user.id ? "bg-muted/50" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {user.user_metadata?.avatar_url ? (
                            <img
                              src={user.user_metadata.avatar_url}
                              alt={user.user_metadata?.full_name || user.email}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-primary font-bold">
                              {user.email.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {user.user_metadata?.full_name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined{" "}
                            {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <Badge
                              key={`${user.id}-${role}`}
                              variant="outline"
                              className="flex items-center space-x-1"
                            >
                              <span>{role}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 rounded-full"
                                onClick={() => handleRemoveRole(user.id, role)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline">No roles</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedUserId(
                            selectedUserId === user.id ? null : user.id,
                          )
                        }
                      >
                        {selectedUserId === user.id ? "Cancel" : "Select"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Total users: {filteredUsers.length}
        </div>
        <Button variant="outline" onClick={fetchUsers}>
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoleManagement;
