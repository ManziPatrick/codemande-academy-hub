import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const users = [
  { id: "1", name: "Jean Baptiste", email: "jean@example.com", role: "student", status: "active", courses: 2, joinedAt: "Jan 2026" },
  { id: "2", name: "Marie Claire", email: "marie@example.com", role: "trainer", status: "active", courses: 3, joinedAt: "Nov 2025" },
  { id: "3", name: "Emmanuel Kwizera", email: "emmanuel@example.com", role: "trainer", status: "active", courses: 2, joinedAt: "Oct 2025" },
  { id: "4", name: "Grace M.", email: "grace@example.com", role: "student", status: "active", courses: 1, joinedAt: "Jan 2026" },
  { id: "5", name: "Patrick N.", email: "patrick@example.com", role: "student", status: "inactive", courses: 1, joinedAt: "Dec 2025" },
  { id: "6", name: "Sarah Uwimana", email: "sarah@example.com", role: "admin", status: "active", courses: 0, joinedAt: "Sep 2025" },
];

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
      {icons[role]}
      {role.charAt(0).toUpperCase() + role.slice(1).replace("_", " ")}
    </Badge>
  );
};

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

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
          <Button variant="gold">
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
                {users.filter((u) => u.role === "student").length}
              </p>
              <p className="text-xs text-card-foreground/60">Students</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <UserCog className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-card-foreground">
                {users.filter((u) => u.role === "trainer").length}
              </p>
              <p className="text-xs text-card-foreground/60">Trainers</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-card-foreground">
                {users.filter((u) => u.role === "admin").length}
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
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-background/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-accent/20 text-accent text-sm">
                                {user.name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-card-foreground">{user.name}</p>
                              <p className="text-sm text-card-foreground/60">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={
                            user.status === "active"
                              ? "bg-green-500/20 text-green-400 border-green-400/30"
                              : "bg-muted text-muted-foreground"
                          }>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-card-foreground">
                          {user.courses}
                        </td>
                        <td className="px-6 py-4 text-card-foreground/60 text-sm">
                          {user.joinedAt}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
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
    </PortalLayout>
  );
}
