import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { moduleAccessApi } from './api';

interface ModuleGuardProps {
  courseId: string;
  moduleIndex: number;
  fallbackPath: string;
  children: ReactNode;
}

/**
 * Route-level guard that blocks URL hacking to locked modules.
 */
export function ModuleGuard({ courseId, moduleIndex, fallbackPath, children }: ModuleGuardProps) {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    moduleAccessApi
      .canAccess(courseId, moduleIndex)
      .then(() => mounted && setAllowed(true))
      .catch((err) => {
        if (!mounted) return;
        setAllowed(false);
        setMessage(err?.message || 'Complete your assignment to unlock this module.');
        navigate(fallbackPath, { replace: true, state: { moduleGuardMessage: err?.message } });
      });

    return () => {
      mounted = false;
    };
  }, [courseId, moduleIndex, fallbackPath, navigate]);

  if (allowed === null) {
    return <div className="p-6 text-sm text-muted-foreground">Checking access...</div>;
  }

  if (!allowed) {
    return <div className="p-6 text-sm text-destructive">{message}</div>;
  }

  return <>{children}</>;
}
