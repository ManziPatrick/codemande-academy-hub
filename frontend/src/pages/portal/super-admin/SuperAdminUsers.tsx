import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Download,
  GraduationCap,
  BookOpen,
  Shield,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_USERS } from "@/lib/graphql/queries";
import { DELETE_USER, UPDATE_USER } from "@/lib/graphql/mutations";
import { toast } from "sonner";

export default function SuperAdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const { data, loading, refetch } = useQuery(GET_USERS);
  const [deleteUserMutation] = useMutation(DELETE_USER);
  const [updateUserMutation] = useMutation(UPDATE_USER);

  const allUsers = (data as any)?.users || [];

  const getInitials = (name: string) => (name || "U").split(" ").map(n => n[0]).join("").toUpperCase();

  const filteredUsers = allUsers.filter((user: any) => {
    const matchesSearch = (user.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (user.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUserMutation({ variables: { id } });
      toast.success("User deleted successfully");
      refetch();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleToggleStatus = async (user: any) => {
    // This is a mock since we don't have status in model, but we could use it for deactivating
    toast.info("Status toggle feature coming soon");
  };

  const userStats = [
    { label: "Total Users", value: allUsers.length.toString(), role: "all", icon: Users },
    { label: "Students", value: allUsers.filter((u: any) => u.role === "student").length.toString(), role: "all", icon: GraduationCap },
    { label: "Trainers", value: allUsers.filter((u: any) => u.role === "trainer").length.toString(), role: "all", icon: BookOpen },
    { label: "Admins", value: allUsers.filter((u: any) => u.role === "admin" || u.role === "super_admin").length.toString(), role: "all", icon: Shield },
  ];

  const roleColors: Record<string, string> = {
    student: "bg-blue-500/20 text-blue-400",
    trainer: "bg-purple-500/20 text-purple-400",
    admin: "bg-accent/20 text-accent",
    super_admin: "bg-red-500/20 text-red-400",
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
              All Users
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage all platform users
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {userStats.map((stat) => (
            <Card 
              key={stat.label} 
              className="border-border/50 transition-all hover:shadow-card-hover"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                    <p className="text-xs text-card-foreground/60">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="trainer">Trainers</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="super_admin">Super Admins</SelectItem>
            </SelectContent>
          </Select>
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
                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
                ) : (
                    <table className="w-full">
                    <thead>
                        <tr className="border-b border-border/50">
                        <th className="text-left p-4 text-sm font-medium text-card-foreground/70">User</th>
                        <th className="text-center p-4 text-sm font-medium text-card-foreground/70">Role</th>
                        <th className="text-center p-4 text-sm font-medium text-card-foreground/70">Status</th>
                        <th className="text-center p-4 text-sm font-medium text-card-foreground/70">Joined</th>
                        <th className="text-right p-4 text-sm font-medium text-card-foreground/70">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user: any) => (
                        <tr key={user.id} className="border-b border-border/30 hover:bg-background/50">
                            <td className="p-4">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                <AvatarFallback className="bg-accent/20 text-accent">
                                    {getInitials(user.username)}
                                </AvatarFallback>
                                </Avatar>
                                <div>
                                <p className="font-medium text-card-foreground">{user.username}</p>
                                <p className="text-xs text-card-foreground/60">{user.email}</p>
                                </div>
                            </div>
                            </td>
                            <td className="p-4 text-center">
                            <Badge className={roleColors[user.role]}>{user.role}</Badge>
                            </td>
                            <td className="p-4 text-center">
                            <Badge className="bg-green-500/20 text-green-400">
                                active
                            </Badge>
                            </td>
                            <td className="p-4 text-center text-sm text-card-foreground/70">
                            Recently
                            </td>
                            <td className="p-4 text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" /> View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PortalLayout>
  );
}
