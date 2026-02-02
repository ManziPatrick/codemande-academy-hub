import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Mail,
  GraduationCap,
  UserCog,
  Shield,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AddUserDialog, 
  EditUserDialog, 
  ViewUserDialog, 
  SendEmailDialog, 
  DeleteConfirmDialog 
} from "@/components/portal/dialogs";
import { toast } from "sonner";


const getRoleBadge = (role: string) => {
  const styles: Record<string, string> = {
    student: "bg-blue-500/20 text-blue-400 border-blue-400/30",
    trainer: "bg-accent/20 text-accent border-accent/30",
    admin: "bg-purple-500/20 text-purple-400 border-purple-400/30",
    super_admin: "bg-red-500/20 text-red-400 border-red-400/30",
  };
  const icons: Record<string, React.ReactNode> = {
    student: <GraduationCap className="w-3 h-3 mr-1" />,
    trainer: <UserCog className="w-3 h-3 mr-1" />,
    admin: <Shield className="w-3 h-3 mr-1" />,
    super_admin: <Shield className="w-3 h-3 mr-1" />,
  };
  return (
    <Badge variant="outline" className={styles[role]}>
      {(icons as any)[role]}
      {role?.charAt(0).toUpperCase() + role?.slice(1).replace("_", " ")}
    </Badge>
  );
};

import { useQuery, useMutation } from "@apollo/client/react";
import { GET_USERS } from "@/lib/graphql/queries";
import { CREATE_USER, UPDATE_USER, DELETE_USER } from "@/lib/graphql/mutations";

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  
  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [deleteUser, setDeleteUser] = useState<any | null>(null);
  const [emailUser, setEmailUser] = useState<any | null>(null);

  // Queries & Mutations
  const { data, loading, refetch } = useQuery(GET_USERS);
  const [createUserMutation] = useMutation(CREATE_USER);
  const [updateUserMutation] = useMutation(UPDATE_USER);
  const [deleteUserMutation] = useMutation(DELETE_USER);

  const users = (data as any)?.users || [];

  const filteredUsers = users.filter((u: any) => {
    const matchesSearch = (u.username?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                          (u.email?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = async (newUser: any) => {
    try {
        await createUserMutation({
            variables: {
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                role: newUser.role
            }
        });
        toast.success("User created successfully!");
        refetch();
        setIsAddOpen(false);
    } catch (err: any) {
        toast.error(err.message);
    }
  };

  const handleSaveUser = async (updatedUser: any) => {
    try {
        await updateUserMutation({
            variables: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
        toast.success("User updated successfully!");
        refetch();
        setEditUser(null);
    } catch (err: any) {
        toast.error(err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;
    try {
        await deleteUserMutation({ variables: { id: deleteUser.id } });
        toast.success("User deleted successfully!");
        refetch();
        setDeleteUser(null);
    } catch (err: any) {
        toast.error(err.message);
    }
  };


  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage students, trainers, and administrators
            </p>
          </div>
          <Button variant="gold" onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-card-foreground">{users.length}</p>
              <p className="text-xs text-card-foreground/60">Total Users</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <GraduationCap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-card-foreground">
                {users.filter((u: any) => u.role === "student").length}
              </p>
              <p className="text-xs text-card-foreground/60">Students</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <UserCog className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-card-foreground">
                {users.filter((u: any) => u.role === "trainer").length}
              </p>
              <p className="text-xs text-card-foreground/60">Trainers</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-card-foreground">
                {users.filter((u: any) => u.role === "admin" || u.role === "super_admin").length}
              </p>
              <p className="text-xs text-card-foreground/60">Admins</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm min-w-[150px]"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="trainer">Trainers</option>
            <option value="admin">Admins</option>
          </select>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background/50 border-b border-border/50">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        User
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Role
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Courses
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="text-right px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredUsers.map((user: any) => (
                      <tr key={user.id} className="hover:bg-background/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-accent/20 text-accent text-sm">
                                {user.username?.split(" ").map((n: string) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-card-foreground">{user.username}</p>
                              <p className="text-sm text-card-foreground/60">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400/30">
                            active
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-card-foreground">
                          0
                        </td>
                        <td className="px-6 py-4 text-card-foreground/60 text-sm">
                          Recently
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setViewUser(user)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditUser(user)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEmailUser(user)}>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => setDeleteUser(user)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredUsers.length} of {users.length} users
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dialogs */}
      <AddUserDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onAdd={handleAddUser}
      />
      <ViewUserDialog
        open={!!viewUser}
        onOpenChange={(open) => !open && setViewUser(null)}
        user={viewUser}
        onSendEmail={(user) => {
          setViewUser(null);
          setEmailUser(user);
        }}
      />
      <EditUserDialog
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        user={editUser}
        onSave={handleSaveUser}
      />
      <SendEmailDialog
        open={!!emailUser}
        onOpenChange={(open) => !open && setEmailUser(null)}
        recipientName={emailUser?.name || ""}
        recipientEmail={emailUser?.email || ""}
      />
      <DeleteConfirmDialog
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
        title="Delete User"
        description={`Are you sure you want to delete ${deleteUser?.name}? This will remove their account and all associated data.`}
        onConfirm={handleDeleteUser}
      />
    </PortalLayout>
  );
}
