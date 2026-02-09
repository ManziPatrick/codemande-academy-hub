import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@apollo/client/react";
import { TRACK_ACTIVITY } from "@/lib/graphql/mutations";
import { GET_BRANDING } from "@/lib/graphql/queries";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  BookOpen,
  FolderOpen,
  Award,
  Briefcase,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Users,
  BarChart3,
  Palette,
  CreditCard,
  Shield,
  Cog,
  Bell,
  HelpCircle,
  Table,
  FileText,
  UserCog,
  GraduationCap,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePusher } from "@/hooks/use-pusher";
import { toast } from "sonner";
import { FloatingChat } from "@/components/chat/FloatingChat";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const studentNavItems: NavItem[] = [
  { label: "Dashboard", href: "/portal/student", icon: LayoutDashboard },
  { label: "My Courses", href: "/portal/student/courses", icon: BookOpen },
  { label: "Projects", href: "/portal/student/projects", icon: FolderOpen },
  { label: "Certificates", href: "/portal/student/certificates", icon: Award },
  { label: "Internship", href: "/portal/student/internship", icon: Briefcase },
  { label: "Schedule", href: "/portal/student/schedule", icon: Calendar },
  { label: "Billing", href: "/portal/student/billing", icon: CreditCard },
  { label: "Messages", href: "/chat", icon: MessageSquare },
  { label: "Profile", href: "/portal/student/profile", icon: UserCog },
  { label: "Support", href: "/portal/student/support", icon: HelpCircle },
];

const trainerNavItems: NavItem[] = [
  { label: "Dashboard", href: "/portal/trainer", icon: LayoutDashboard },
  { label: "My Courses", href: "/portal/trainer/courses", icon: BookOpen },
  { label: "Students", href: "/portal/trainer/students", icon: Users },
  { label: "Assignments", href: "/portal/trainer/assignments", icon: FolderOpen },
  { label: "Schedule", href: "/portal/trainer/schedule", icon: Calendar },
  { label: "Mentorship", href: "/portal/trainer/mentorship", icon: GraduationCap },
  { label: "Internships", href: "/portal/trainer/internships", icon: Briefcase },
  { label: "Projects", href: "/portal/trainer/projects", icon: FolderOpen },
  { label: "Messages", href: "/chat", icon: MessageSquare },
];

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/portal/admin", icon: LayoutDashboard },
  { label: "Users", href: "/portal/admin/users", icon: Users },
  { label: "Courses", href: "/portal/admin/courses", icon: BookOpen },
  { label: "Internships", href: "/portal/admin/internships", icon: Briefcase },
  { label: "Projects", href: "/portal/admin/projects", icon: FolderOpen },
  { label: "Team", href: "/portal/admin/team", icon: UserCog },
  { label: "Payments", href: "/portal/admin/payments", icon: CreditCard },
  { label: "Badges", href: "/portal/admin/badges", icon: Award },
  { label: "Blog", href: "/portal/admin/blogs", icon: FileText },
  { label: "Analytics", href: "/portal/admin/analytics", icon: BarChart3 },
  { label: "Toolbox", href: "/portal/admin/tools", icon: Table },
  { label: "Branding", href: "/portal/admin/branding", icon: Palette },
  { label: "Messages", href: "/chat", icon: MessageSquare },
];

const superAdminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/portal/super-admin", icon: LayoutDashboard },
  { label: "Admins", href: "/portal/super-admin/admins", icon: Shield },
  { label: "All Users", href: "/portal/super-admin/users", icon: Users },
  { label: "Configuration", href: "/portal/super-admin/config", icon: Cog },
  { label: "Blog", href: "/portal/admin/blogs", icon: FileText },
  { label: "Branding", href: "/portal/admin/branding", icon: Palette },
  { label: "Analytics", href: "/portal/super-admin/analytics", icon: BarChart3 },
  { label: "Messages", href: "/chat", icon: MessageSquare },
];

const navItemsByRole: Record<UserRole, NavItem[]> = {
  student: studentNavItems,
  trainer: trainerNavItems,
  mentor: trainerNavItems,
  admin: adminNavItems,
  super_admin: superAdminNavItems,
};

const roleLabels: Record<UserRole, string> = {
  student: "Student Portal",
  trainer: "Trainer Portal",
  mentor: "Trainer Portal",
  admin: "Admin Dashboard",
  super_admin: "Super Admin",
};

interface PortalLayoutProps {
  children: ReactNode;
}

import { useBranding } from "@/components/BrandingProvider";

export function PortalLayout({ children }: PortalLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pusher = usePusher();

  const [trackActivity] = useMutation(TRACK_ACTIVITY);
  const { branding } = useBranding();

  // Persist portal mode
  useEffect(() => {
    if (user?.role) {
      const savedMode = localStorage.getItem(`portal_mode_${user.id}`);
      if (!savedMode) {
        localStorage.setItem(`portal_mode_${user.id}`, user.role);
      }
    }
  }, [user]);

  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Audio play failed:", e));
    } catch (error) {
      console.error("Failed to play notification sound:", error);
    }
  };

  useEffect(() => {
    if (!pusher || !user) return;

    const channel = pusher.subscribe(`user-${user.id}`);

    const handleReceiveMessage = (msg: any) => {
      console.log("New message received:", msg);
      playNotificationSound();
    };

    const handleNewBooking = (booking: any) => {
      toast.info("New session request received!");
      playNotificationSound();
    };

    const handleBookingUpdate = (booking: any) => {
      toast.info(`Session status updated: ${booking.status}`);
      playNotificationSound();
    };

    const handleNotification = (data: any) => {
      if (user.role === 'trainer' || user.role === 'mentor' || user.role === 'admin') {
        playNotificationSound();
        if (data.message) toast.info(data.message);
      }
    };

    const handleStudentActivity = () => {
      if (user.role === 'trainer' || user.role === 'mentor') {
        playNotificationSound();
      }
    };

    channel.bind('receive_message', handleReceiveMessage);
    channel.bind('new_booking', handleNewBooking);
    channel.bind('booking_updated', handleBookingUpdate);
    channel.bind('notification', handleNotification);
    channel.bind('student_activity', handleStudentActivity);

    return () => {
      channel.unbind('receive_message', handleReceiveMessage);
      channel.unbind('new_booking', handleNewBooking);
      channel.unbind('booking_updated', handleBookingUpdate);
      channel.unbind('notification', handleNotification);
      channel.unbind('student_activity', handleStudentActivity);
    };
  }, [pusher, user]);

  useEffect(() => {
    if (user) {
      trackActivity({
        variables: {
          action: "view_page",
          details: location.pathname
        }
      }).catch(err => console.error("Tracking error:", err));
    }
  }, [location.pathname, user?.id, trackActivity]);

  if (!user) return null;

  const navItems = navItemsByRole[user.role] || studentNavItems;
  const roleLabel = roleLabels[user.role];

  const handleLogout = () => {
    localStorage.removeItem(`portal_mode_${user?.id}`);
    logout();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return (name || "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-card border-r border-border/50 fixed h-full">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <Link to="/" className="flex items-center gap-2">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt={branding.siteName} className="h-8 w-auto" />
            ) : (
              <span className="text-2xl font-bold" style={{ color: branding.primaryColor }}>≪</span>
            )}
            <span className="font-heading text-lg font-semibold text-card-foreground tracking-wide">
              {branding.siteName}
            </span>
          </Link>
        </div>

        {/* Role Badge */}
        <div className="px-4 py-3 border-b border-border/50">
          <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
            {roleLabel}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-card-foreground/70 hover:bg-background/50 hover:text-card-foreground"
                      }`}
                  >
                    <item.icon className="w-5 h-5" strokeWidth={1.5} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Help Link */}
        <div className="p-4 border-t border-border/50">
          <Link
            to="/portal/help"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-card-foreground/70 hover:bg-background/50 hover:text-card-foreground transition-all"
          >
            <HelpCircle className="w-5 h-5" strokeWidth={1.5} />
            Help & Support
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-card z-50 lg:hidden flex flex-col"
            >
              {/* Close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-card-foreground/70 hover:text-card-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Logo */}
              <div className="h-16 flex items-center px-6 border-b border-border/50">
                <Link to="/" className="flex items-center gap-2">
                  {branding.logoUrl ? (
                    <img src={branding.logoUrl} alt={branding.siteName} className="h-8 w-auto" />
                  ) : (
                    <span className="text-2xl font-bold" style={{ color: branding.primaryColor }}>≪</span>
                  )}
                  <span className="font-heading text-lg font-semibold text-card-foreground tracking-wide">
                    {branding.siteName}
                  </span>
                </Link>
              </div>

              {/* Role Badge */}
              <div className="px-4 py-3 border-b border-border/50">
                <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
                  {roleLabel}
                </span>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-card-foreground/70 hover:bg-background/50 hover:text-card-foreground"
                            }`}
                        >
                          <item.icon className="w-5 h-5" strokeWidth={1.5} />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border/50 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-card-foreground/70 hover:text-card-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Page Title - Mobile */}
          <div className="lg:hidden">
            <span className="font-heading font-semibold text-card-foreground">
              {roleLabel}
            </span>
          </div>

          {/* Search - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md">
            <div className="relative">
              <input
                type="search"
                placeholder="Search courses, projects..."
                className="w-full h-10 pl-4 pr-10 rounded-lg bg-background border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <button className="relative p-2 text-card-foreground/70 hover:text-card-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-background/50 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium text-card-foreground">
                    {user.fullName}
                  </span>
                  <ChevronDown className="w-4 h-4 text-card-foreground/50 hidden md:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/portal/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/" className="flex items-center gap-2 cursor-pointer">
                    <Home className="w-4 h-4" />
                    Back to Website
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
      {location.pathname !== '/chat' && <FloatingChat />}
    </div>
  );
}
