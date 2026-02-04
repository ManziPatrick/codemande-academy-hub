import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

// Define query locally if not exported yet, or import from queries.ts
const GET_ACTIVITY_LOGS = gql`
  query GetInternshipActivityLogs {
    internshipActivityLogs {
      id
      action
      targetType
      targetId
      details
      createdAt
      user {
        username
        fullName
      }
    }
  }
`;

export default function InternshipActivityLogs() {
  const { data, loading, error } = useQuery(GET_ACTIVITY_LOGS);

  if (loading) return <div>Loading logs...</div>;
  if (error) return <div>Error loading logs</div>;

  const logs = (data as any)?.internshipActivityLogs || [];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Activity Audit Trail</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full pr-4">
          <div className="space-y-4">
            {logs.map((log: any) => (
              <div key={log.id} className="flex gap-4 border-b pb-4 last:border-0">
                <div className="min-w-[100px] text-xs text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{log.user?.username || 'System'}</span>
                    <Badge variant="outline" className="text-xs">{log.action}</Badge>
                    <span className="text-xs text-muted-foreground">on {log.targetType}</span>
                  </div>
                  <p className="text-sm">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
