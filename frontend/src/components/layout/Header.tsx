import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useQuery } from "@apollo/client/react";
import { GET_UNREAD_NOTIFICATIONS } from "@/lib/graphql/queries";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Training", href: "/training" },
  { name: "Internships", href: "/internships" },
  { name: "Projects", href: "/projects" },
  { name: "Team", href: "/team" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

import { useBranding } from "@/components/BrandingProvider";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { branding } = useBranding();

  const { data: notificationData } = useQuery<{ unreadNotificationCount: number }>(GET_UNREAD_NOTIFICATIONS, {
    skip: !isAuthenticated,
    pollInterval: 30000, // Poll every 30 seconds
  });
  const unreadCount = notificationData?.unreadNotificationCount || 0;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-card/95 backdrop-blur-sm shadow-card"
        : "bg-card"
        }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center">
              {branding.logoUrl ? (
                <img src={branding.logoUrl} alt={branding.siteName} className="h-7 sm:h-8 lg:h-10 w-auto transition-all" />
              ) : (
                <>
                  <span className="text-accent text-2xl font-bold">≪</span>
                  <span className="font-heading text-xl lg:text-2xl font-semibold text-card-foreground tracking-wide ml-1">
                    {branding.siteName}
                  </span>
                </>
              )}
            </div>
          </Link>

          {/* Desktop Navigation - Hidden under 1280px (xl) */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-colors duration-300 gold-underline ${location.pathname === link.href
                  ? "text-accent"
                  : "text-foreground/80 hover:text-accent"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions: Theme Toggle, Auth Buttons, Mobile Menu */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Notification Bell - Desktop */}
            {isAuthenticated && (
              <Button variant="ghost" size="icon" className="relative text-card-foreground hover:text-accent hidden md:flex">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </Button>
            )}

            {/* Auth Buttons - Desktop Only (Hidden under 1280px) */}
            <div className="hidden xl:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to={user?.role === 'trainer' ? "/portal/trainer" : user?.role === 'admin' || user?.role === 'super_admin' ? "/portal/admin" : "/portal/student"}>
                    <Button variant="gold" size="default" className="gap-2">
                      <User size={16} />
                      {user?.role === 'trainer' ? "Trainer Portal" : user?.role === 'admin' || user?.role === 'super_admin' ? "Admin Portal" : "Student Portal"}
                    </Button>
                  </Link>
                  <Button
                    variant="heroOutline"
                    size="default"
                    onClick={handleLogout}
                    className="gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="heroOutline" size="default">
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="gold" size="default">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden text-card-foreground p-2 ml-1"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="xl:hidden bg-card border-t border-card-foreground/10"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`py-2 text-base font-medium transition-colors duration-300 ${location.pathname === link.href
                  ? "text-accent"
                  : "text-card-foreground/80 hover:text-accent"
                  }`}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to={user?.role === 'trainer' ? "/portal/trainer" : user?.role === 'admin' || user?.role === 'super_admin' ? "/portal/admin" : "/portal/student"}>
                  <Button variant="gold" size="lg" className="mt-2 w-full gap-2">
                    <User size={18} />
                    {user?.role === 'trainer' ? "Trainer Portal" : user?.role === 'admin' || user?.role === 'super_admin' ? "Admin Portal" : "Student Portal"}
                  </Button>
                </Link>
                <Button
                  variant="heroOutline"
                  size="lg"
                  className="mt-2 w-full gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="heroOutline" size="lg" className="mt-2 w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="gold" size="lg" className="mt-2 w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
