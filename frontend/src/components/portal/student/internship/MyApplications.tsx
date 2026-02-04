import { useQuery } from "@apollo/client/react";
import { GET_MY_INTERNSHIP_APPLICATIONS } from "@/lib/graphql/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Calendar,
  CreditCard,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { StripePaymentDialog } from "./StripePaymentDialog";

export function MyApplications() {
  const { data, loading, refetch } = useQuery(GET_MY_INTERNSHIP_APPLICATIONS);
  const [payingFor, setPayingFor] = useState<any>(null);

  const applications = (data as any)?.myInternshipApplications || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Under Review</Badge>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-heading flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            My Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You haven't applied to any internship programs. Browse the "Available Tracks" tab to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app: any) => (
                <div 
                  key={app.id} 
                  className="p-6 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                        {getStatusIcon(app.status)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">
                          {app.internshipProgram.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          Applied on {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  {app.status === 'approved' && (
                    <div className="mt-4 p-4 bg-green-500/5 border border-green-500/20 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2 font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Congratulations! Your application has been approved.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {app.payment?.status === 'paid' 
                            ? "Payment confirmed. You'll be assigned to a team soon." 
                            : `Secure your spot by paying the enrollment fee of ${(app.internshipProgram.price || 0).toLocaleString()} ${app.internshipProgram.currency || 'RWF'}`}
                        </p>
                      </div>
                      
                      {app.payment?.status !== 'paid' && (
                        <Button 
                          variant="gold" 
                          size="sm" 
                          className="gap-2 shadow-lg shadow-gold/20"
                          onClick={() => setPayingFor(app)}
                        >
                          <CreditCard className="w-4 h-4" />
                          Secure My Spot
                        </Button>
                      )}
                      
                      {app.payment?.status === 'paid' && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Paid
                        </Badge>
                      )}
                    </div>
                  )}

                  {app.status === 'rejected' && app.rejectionReason && (
                    <div className="mt-4 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <p className="text-xs uppercase font-bold text-destructive mb-2">Feedback</p>
                      <p className="text-sm text-muted-foreground">{app.rejectionReason}</p>
                    </div>
                  )}

                  {app.status === 'pending' && (
                    <div className="mt-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Your application is being reviewed. You'll receive a response within 5 business days.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stripe Payment Dialog */}
      {payingFor && (
        <StripePaymentDialog
          open={!!payingFor}
          onOpenChange={(open) => {
            if (!open) {
              setPayingFor(null);
              refetch();
            }
          }}
          programId={payingFor.internshipProgram.id}
          programTitle={payingFor.internshipProgram.title}
          amount={payingFor.internshipProgram.price}
          currency={payingFor.internshipProgram.currency}
        />
      )}
    </div>
  );
}
