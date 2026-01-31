import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthAwareLinkProps {
  children: React.ReactNode;
  variant?: "gold" | "heroOutline" | "outline" | "default" | "ghost";
  size?: "sm" | "lg" | "default" | "icon";
  className?: string;
  /** If true, this is an enrollment/apply action that should go to portal */
  isEnrollAction?: boolean;
}

export function AuthAwareLink({ 
  children, 
  variant = "gold", 
  size = "default",
  className,
  isEnrollAction = true 
}: AuthAwareLinkProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (isLoading) return;
    
    if (user) {
      // User is logged in, go to student portal
      navigate("/portal/student");
    } else {
      // Not logged in, go to auth page
      navigate("/auth");
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={cn(className)}
      onClick={handleClick}
      disabled={isLoading}
    >
      {children}
    </Button>
  );
}
