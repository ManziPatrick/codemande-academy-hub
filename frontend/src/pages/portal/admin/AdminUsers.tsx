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
  Award,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeAwardDialog } from "@/components/portal/BadgeAwardDialog";
import {
  AddUserDialog,
  EditUserDialog,
  ViewUserDialog,
  SendEmailDialog,
  DeleteConfirmDialog
} from "@/components/portal/dialogs";
import { toast } from "sonner";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_USERS } from "@/lib/graphql/queries";
import { CREATE_USER, UPDATE_USER, DELETE_USER } from "@/lib/graphql/mutations";

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

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [deleteUser, setDeleteUser] = useState<any | null>(null);
  const [emailUser, setEmailUser] = useState<any | null>(null);
  const [awardUser, setAwardUser] = useState<any | null>(null);

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
              Manage platform users, roles, and permissions
            </p>
          </div>
          <Button variant="gold" onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {["all", "student", "trainer", "admin", "super_admin"].map((role) => (
              <Button
                key={role}
                variant={filterRole === role ? "gold" : "outline"}
                size="sm"
                onClick={() => setFilterRole(role)}
                className="capitalize whitespace-nowrap"
              >
                {role.replace("_", " ")}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 text-sm font-medium text-card-foreground/70">User</th>
                      <th className="text-left p-4 text-sm font-medium text-card-foreground/70">Role</th>
                      <th className="text-center p-4 text-sm font-medium text-card-foreground/70">Courses</th>
                      <th className="text-left p-4 text-sm font-medium text-card-foreground/70">Joined</th>
                      <th className="text-right p-4 text-sm font-medium text-card-foreground/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user: any) => (
                      <tr key={user.id} className="border-b border-border/30 hover:bg-background/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-border/50">
                              <AvatarFallback className="bg-accent/10 text-accent">
                                {user.username?.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-card-foreground">{user.username}</p>
                              <p className="text-xs text-card-foreground/60">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-sm font-medium text-card-foreground">
                            {user.enrolledCourses?.length || 0}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-card-foreground/70">
                          {new Date(parseInt(user.createdAt || Date.now().toString())).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setAwardUser(user)}>
                                <Award className="w-4 h-4 mr-2" /> Award Badge
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setViewUser(user)}>
                                <Eye className="w-4 h-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditUser(user)}>
                                <Edit className="w-4 h-4 mr-2" /> Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEmailUser(user)}>
                                <Mail className="w-4 h-4 mr-2" /> Send Email
                              </DropdownMenuItem>
                              <div className="h-px bg-border/50 my-1" />
                              <DropdownMenuItem
                                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                onClick={() => setDeleteUser(user)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing <b>{filteredUsers.length}</b> users
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <BadgeAwardDialog
        isOpen={!!awardUser}
        onClose={() => setAwardUser(null)}
        user={awardUser}
      />

      <AddUserDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSave={handleAddUser}
      />

      <EditUserDialog
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        user={editUser}
        onSave={handleSaveUser}
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

      <SendEmailDialog
        open={!!emailUser}
        onOpenChange={(open) => !open && setEmailUser(null)}
        recipientName={emailUser?.username || ""}
        recipientEmail={emailUser?.email || ""}
      />

      <DeleteConfirmDialog
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete ${deleteUser?.username}? This action cannot be undone.`}
      />

    </PortalLayout>
  );
}
