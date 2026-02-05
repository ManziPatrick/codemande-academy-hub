import { useState } from 'react';
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_INTERNSHIP_APPLICATIONS } from '@/lib/graphql/queries';
import { REVIEW_INTERNSHIP_APPLICATION } from '@/lib/graphql/mutations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function ApplicationReview() {
  const [filter, setFilter] = useState('pending');
  
  const { data, loading, error, refetch } = useQuery(GET_INTERNSHIP_APPLICATIONS, {
    variables: { status: filter }
  });
  
  const [reviewApplication] = useMutation(REVIEW_INTERNSHIP_APPLICATION);
  
  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await reviewApplication({
        variables: { id, status }
      });
      toast.success(`Application updated to ${status}`);
      refetch();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      case 'waitlisted': return <Badge className="bg-amber-500 hover:bg-amber-600">Waitlisted</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (loading) return <div>Loading applications...</div>;
  if (error) return <div>Error loading applications</div>;

  const applications = (data as any)?.internshipApplications || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Application Management</h2>
        <div className="flex gap-2 bg-muted p-1 rounded-md">
          {['pending', 'approved', 'waitlisted', 'rejected'].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={filter === s ? 'default' : 'ghost'}
              onClick={() => setFilter(s)}
              className="capitalize"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {applications.length === 0 && (
          <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">No {filter} applications found.</p>
          </div>
        )}
        
        {applications.map((app: any) => (
          <Card key={app.id}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={app.user?.avatar} />
                  <AvatarFallback>{app.user?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{app.user?.fullName || app.user?.username}</h3>
                    {getStatusBadge(app.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">Applying for: {app.internshipProgram?.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{app.user?.studentProfile?.school || 'Unknown School'}</Badge>
                    <span className="text-xs text-muted-foreground">Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {app.status !== 'approved' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleStatusUpdate(app.id, 'approved')}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                )}
                {app.status !== 'waitlisted' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    onClick={() => handleStatusUpdate(app.id, 'waitlisted')}
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Waitlist
                  </Button>
                )}
                {app.status !== 'rejected' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleStatusUpdate(app.id, 'rejected')}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
