import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Button } from "@/frontend/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/frontend/components/ui/dialog";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Role, RoleType, ModuleAction, Permission } from "../types";
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  fetchPermissions,
  savePermissions,
} from "../services/roleService";

// Mock data for initial development
const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    type: "superadmin",
    description: "Full access to all modules and actions",
    isDefault: true,
  },
  {
    id: "2",
    name: "Admin",
    type: "admin",
    description: "Administrative access with some restrictions",
    isDefault: true,
  },
  {
    id: "3",
    name: "Agent",
    type: "agent",
    description: "Access to customer-facing modules",
    isDefault: true,
  },
  {
    id: "4",
    name: "Viewer",
    type: "viewer",
    description: "Read-only access to most modules",
    isDefault: true,
  },
];

const mockModuleActions: ModuleAction[] = [
  { module: "dashboard", action: "view", description: "View dashboard" },
  {
    module: "dashboard",
    action: "edit",
    description: "Edit dashboard widgets",
  },
  { module: "store", action: "view", description: "View store data" },
  { module: "store", action: "edit", description: "Edit store data" },
  { module: "store", action: "delete", description: "Delete store items" },
  { module: "accounting", action: "view", description: "View accounting data" },
  { module: "accounting", action: "edit", description: "Edit accounting data" },
  {
    module: "marketing",
    action: "view",
    description: "View marketing campaigns",
  },
  {
    module: "marketing",
    action: "edit",
    description: "Edit marketing campaigns",
  },
  { module: "settings", action: "view", description: "View settings" },
  { module: "settings", action: "edit", description: "Edit settings" },
];

interface RoleManagementPanelProps {
  isRTL?: boolean;
}

const RoleManagementPanel: React.FC<RoleManagementPanelProps> = ({
  isRTL = false,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<Partial<Role>>({
    name: "",
    type: "agent" as RoleType,
    description: "",
  });
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  // Group module actions by module
  const moduleActionsByModule = mockModuleActions.reduce(
    (acc, item) => {
      if (!acc[item.module]) {
        acc[item.module] = [];
      }
      acc[item.module].push(item);
      return acc;
    },
    {} as Record<string, ModuleAction[]>,
  );

  const modules = Object.keys(moduleActionsByModule);

  // State for error messages
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    if (selectedRoleId) {
      loadPermissions(selectedRoleId);
    }
  }, [selectedRoleId]);

  const loadRoles = async () => {
    setIsLoadingRoles(true);
    setError(null);
    try {
      const fetchedRoles = await fetchRoles();
      setRoles(fetchedRoles);
      if (fetchedRoles.length > 0 && !selectedRoleId) {
        setSelectedRoleId(fetchedRoles[0].id);
      }
    } catch (error) {
      console.error("Error loading roles:", error);
      setError("Failed to load roles. Please try again.");
      // If we can't load roles, use mock data for development
      setRoles(mockRoles);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const loadPermissions = async (roleId: string) => {
    setIsLoadingPermissions(true);
    setError(null);
    try {
      const fetchedPermissions = await fetchPermissions(roleId);
      setPermissions(fetchedPermissions);
    } catch (error) {
      console.error("Error loading permissions:", error);
      setError("Failed to load permissions. Please try again.");
      // Initialize with empty permissions if we can't load them
      setPermissions([]);
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const handleAddRole = async () => {
    if (newRole.name && newRole.type && newRole.description) {
      setIsCreatingRole(true);
      setError(null);
      try {
        const role = await createRole({
          name: newRole.name,
          type: newRole.type as RoleType,
          description: newRole.description,
          isDefault: false,
        });
        setRoles([...roles, role]);
        setNewRole({ name: "", type: "agent" as RoleType, description: "" });
        setIsAddRoleDialogOpen(false);
        // Show success message
        alert(isRTL ? "تم إضافة الدور بنجاح" : "Role added successfully");
      } catch (error: any) {
        console.error("Error adding role:", error);
        setError(`Failed to add role: ${error.message || "Unknown error"}`);
      } finally {
        setIsCreatingRole(false);
      }
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (
      confirm(
        isRTL
          ? "هل أنت متأكد أنك تريد حذف هذا الدور؟"
          : "Are you sure you want to delete this role?",
      )
    ) {
      setIsDeletingRole(true);
      setError(null);
      try {
        await deleteRole(id);
        setRoles(roles.filter((role) => role.id !== id));
        if (selectedRoleId === id) {
          setSelectedRoleId(roles[0]?.id || "");
        }
        // Show success message
        alert(isRTL ? "تم حذف الدور بنجاح" : "Role deleted successfully");
      } catch (error: any) {
        console.error("Error deleting role:", error);
        setError(`Failed to delete role: ${error.message || "Unknown error"}`);
      } finally {
        setIsDeletingRole(false);
      }
    }
  };

  const handleRoleSelect = (role: Role) => {
    setEditingRole({
      id: role.id,
      name: role.name,
      type: role.type,
      description: role.description,
      isDefault: role.isDefault,
    });
    setIsEditRoleDialogOpen(true);
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId(roleId);
  };

  const handlePermissionChange = (
    module: string,
    action: string,
    allowed: boolean,
  ) => {
    const existingPermission = permissions.find(
      (p) => p.module === module && p.action === action,
    );

    if (existingPermission) {
      setPermissions(
        permissions.map((p) =>
          p.module === module && p.action === action ? { ...p, allowed } : p,
        ),
      );
    } else {
      setPermissions([
        ...permissions,
        {
          id: `temp-${Date.now()}`,
          roleId: selectedRoleId,
          module,
          action,
          allowed,
        },
      ]);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;

    // Validate input fields
    if (!editingRole.name || !editingRole.description) {
      setError(
        isRTL
          ? "الاسم والوصف حقول مطلوبة"
          : "Name and description are required fields",
      );
      return;
    }

    setIsUpdatingRole(true);
    setError(null);
    try {
      const updatedRole = await updateRole(editingRole);

      // Update the roles list with the updated role
      setRoles(
        roles.map((role) => (role.id === updatedRole.id ? updatedRole : role)),
      );

      // Show success message
      alert(isRTL ? "تم تحديث الدور بنجاح" : "Role updated successfully");

      setIsEditRoleDialogOpen(false);
      setEditingRole(null);
    } catch (error: any) {
      console.error("Error updating role:", error);
      setError(`Failed to update role: ${error.message || "Unknown error"}`);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRoleId) return;

    setIsSavingPermissions(true);
    setError(null);
    try {
      // If permissions array is empty, create a default array with all permissions set to false
      let permissionsToSave = permissions;

      if (permissionsToSave.length === 0) {
        // Create default permissions for all module actions
        permissionsToSave = mockModuleActions.map((action) => ({
          id: `temp-${Date.now()}-${action.module}-${action.action}`,
          roleId: selectedRoleId,
          module: action.module,
          action: action.action,
          allowed: false,
        }));
      }

      await savePermissions(
        permissionsToSave.map((p) => ({
          roleId: p.roleId,
          module: p.module,
          action: p.action,
          allowed: p.allowed,
        })),
      );

      // Update the local permissions state
      setPermissions(permissionsToSave);

      // Show success message in the appropriate language
      alert(
        isRTL ? "تم حفظ الصلاحيات بنجاح" : "Permissions saved successfully!",
      );
    } catch (error: any) {
      console.error("Error saving permissions:", error);
      setError(
        `Failed to save permissions: ${error.message || "Unknown error"}`,
      );
    } finally {
      setIsSavingPermissions(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>
            {isRTL ? "إدارة الأدوار والصلاحيات" : "Role Management"}
          </CardTitle>
          <CardDescription>
            {isRTL
              ? "تعريف الأدوار وتعيين الصلاحيات للوحدات والإجراءات"
              : "Define roles and assign permissions to modules and actions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="roles" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="roles">
                {isRTL ? "الأدوار" : "Roles"}
              </TabsTrigger>
              <TabsTrigger value="permissions">
                {isRTL ? "الصلاحيات" : "Permissions"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="roles" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {isRTL ? "قائمة الأدوار" : "Role List"}
                </h3>
                <Dialog
                  open={isAddRoleDialogOpen}
                  onOpenChange={setIsAddRoleDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {isRTL ? "إضافة دور" : "Add Role"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {isRTL ? "إضافة دور جديد" : "Add New Role"}
                      </DialogTitle>
                      <DialogDescription>
                        {isRTL
                          ? "أدخل تفاصيل الدور الجديد"
                          : "Enter details for the new role"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          {isRTL ? "الاسم" : "Name"}
                        </Label>
                        <Input
                          id="name"
                          value={newRole.name}
                          onChange={(e) =>
                            setNewRole({ ...newRole, name: e.target.value })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          {isRTL ? "النوع" : "Type"}
                        </Label>
                        <Select
                          value={newRole.type}
                          onValueChange={(value) =>
                            setNewRole({ ...newRole, type: value as RoleType })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select role type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="superadmin">
                              Super Admin
                            </SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          {isRTL ? "الوصف" : "Description"}
                        </Label>
                        <Input
                          id="description"
                          value={newRole.description}
                          onChange={(e) =>
                            setNewRole({
                              ...newRole,
                              description: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={handleAddRole}
                        disabled={isCreatingRole}
                      >
                        {isCreatingRole ? (
                          <span className="flex items-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-0 border-r-0 rounded-full"></div>
                            {isRTL ? "جاري الحفظ..." : "Saving..."}
                          </span>
                        ) : isRTL ? (
                          "حفظ"
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Edit Role Dialog */}
                <Dialog
                  open={isEditRoleDialogOpen}
                  onOpenChange={setIsEditRoleDialogOpen}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {isRTL ? "تعديل الدور" : "Edit Role"}
                      </DialogTitle>
                      <DialogDescription>
                        {isRTL ? "تعديل تفاصيل الدور" : "Edit role details"}
                      </DialogDescription>
                    </DialogHeader>
                    {editingRole && (
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">
                            {isRTL ? "الاسم" : "Name"}
                          </Label>
                          <Input
                            id="edit-name"
                            value={editingRole.name}
                            onChange={(e) =>
                              setEditingRole({
                                ...editingRole,
                                name: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-type" className="text-right">
                            {isRTL ? "النوع" : "Type"}
                          </Label>
                          <Select
                            value={editingRole.type}
                            onValueChange={(value) =>
                              setEditingRole({
                                ...editingRole,
                                type: value as RoleType,
                              })
                            }
                            disabled={editingRole.isDefault}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select role type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="superadmin">
                                Super Admin
                              </SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="agent">Agent</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="edit-description"
                            className="text-right"
                          >
                            {isRTL ? "الوصف" : "Description"}
                          </Label>
                          <Input
                            id="edit-description"
                            value={editingRole.description}
                            onChange={(e) =>
                              setEditingRole({
                                ...editingRole,
                                description: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={handleUpdateRole}
                        disabled={isUpdatingRole}
                      >
                        {isUpdatingRole ? (
                          <span className="flex items-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-0 border-r-0 rounded-full"></div>
                            {isRTL ? "جاري الحفظ..." : "Saving..."}
                          </span>
                        ) : isRTL ? (
                          "حفظ"
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoadingRoles ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{isRTL ? "الاسم" : "Name"}</TableHead>
                      <TableHead>{isRTL ? "النوع" : "Type"}</TableHead>
                      <TableHead>{isRTL ? "الوصف" : "Description"}</TableHead>
                      <TableHead>{isRTL ? "الإجراءات" : "Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          {isRTL ? "لا توجد أدوار" : "No roles found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      roles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell className="font-medium">
                            {role.name}
                          </TableCell>
                          <TableCell>{role.type}</TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRoleSelect(role)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {!role.isDefault && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteRole(role.id)}
                                  disabled={isDeletingRole}
                                >
                                  {isDeletingRole ? (
                                    <div className="animate-spin h-4 w-4 border-2 border-b-0 border-r-0 rounded-full"></div>
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {isRTL ? "مصفوفة الصلاحيات" : "Permission Matrix"}
                </h3>
                <Select value={selectedRoleId} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isLoadingPermissions ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">
                          {isRTL ? "الوحدة / الإجراء" : "Module / Action"}
                        </TableHead>
                        <TableHead>{isRTL ? "الوصف" : "Description"}</TableHead>
                        <TableHead className="text-center">
                          {isRTL ? "مسموح" : "Allowed"}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!selectedRoleId ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4">
                            {isRTL
                              ? "الرجاء اختيار دور"
                              : "Please select a role"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        modules.map((module) => (
                          <React.Fragment key={module}>
                            <TableRow className="bg-muted/50">
                              <TableCell
                                colSpan={3}
                                className="font-bold capitalize"
                              >
                                {module}
                              </TableCell>
                            </TableRow>
                            {moduleActionsByModule[module].map((action) => (
                              <TableRow
                                key={`${action.module}-${action.action}`}
                              >
                                <TableCell className="capitalize">
                                  {action.action}
                                </TableCell>
                                <TableCell>{action.description}</TableCell>
                                <TableCell className="text-center">
                                  <Checkbox
                                    checked={permissions.some(
                                      (p) =>
                                        p.module === action.module &&
                                        p.action === action.action &&
                                        p.allowed,
                                    )}
                                    onCheckedChange={(checked) =>
                                      handlePermissionChange(
                                        action.module,
                                        action.action,
                                        !!checked,
                                      )
                                    }
                                    disabled={isSavingPermissions}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </React.Fragment>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
              <div className="flex justify-end">
                <Button
                  onClick={handleSavePermissions}
                  disabled={isSavingPermissions || !selectedRoleId}
                >
                  {isSavingPermissions ? (
                    <span className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-0 border-r-0 rounded-full"></div>
                      {isRTL ? "جاري الحفظ..." : "Saving..."}
                    </span>
                  ) : (
                    <span>{isRTL ? "حفظ الصلاحيات" : "Save Permissions"}</span>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagementPanel;
