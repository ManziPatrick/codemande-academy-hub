import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_INTERNSHIP_PROGRAMS, GET_MY_INTERNSHIP_TEAM, GET_MY_INTERNSHIP_APPLICATIONS } from "@/lib/graphql/queries";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  Rocket, 
  Search, 
  ClipboardList, 
  Users, 
  Target,
  Trophy,
  Briefcase
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgramCatalog } from "@/components/portal/student/internship/ProgramCatalog";
import { MyInternshipDashboard } from "@/components/portal/student/internship/MyInternshipDashboard";
import { MyApplications } from "@/components/portal/student/internship/MyApplications";

export default function StudentInternships() {
  const { data: teamData, loading: loadingTeam } = useQuery<any>(GET_MY_INTERNSHIP_TEAM);
  const [activeTab, setActiveTab] = useState("catalog");

  // If student is already in a team, default to dashboard
  const hasTeam = !!teamData?.myInternshipTeam;

  return (
    <PortalLayout>
      <div className="space-y-6 pb-10">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/20 via-background to-accent/5 p-8 border border-accent/10"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">Future-Proof Your Career</h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Gain real-world experience through CODEMANDE's exclusive internship programs. 
                Build production software, collaborate in high-performance teams, and get mentored by industry veterans.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-background/80 backdrop-blur-sm p-4 rounded-2xl border border-border/50 text-center min-w-[100px]">
                <p className="text-2xl font-bold text-accent">3+</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Active Tracks</p>
              </div>
              <div className="bg-background/80 backdrop-blur-sm p-4 rounded-2xl border border-border/50 text-center min-w-[100px]">
                <p className="text-2xl font-bold text-accent">50+</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Global Interns</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1 border border-border/50">
            <TabsTrigger value="catalog" className="gap-2">
              <Briefcase className="w-4 h-4" />
              Available Tracks
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <Target className="w-4 h-4" />
              My Internship
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog">
            <ProgramCatalog />
          </TabsContent>

          <TabsContent value="dashboard">
            <MyInternshipDashboard team={teamData?.myInternshipTeam} loading={loadingTeam} />
          </TabsContent>

          <TabsContent value="applications">
            <MyApplications />
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
}
