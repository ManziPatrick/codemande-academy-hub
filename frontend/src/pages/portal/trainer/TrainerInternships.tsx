import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Briefcase,
    Users,
    FileText,
    Activity,
    Search,
    LayoutGrid
} from "lucide-react";
import ProgramList from "@/components/portal/admin/internship/ProgramList";
import ApplicationReview from "@/components/portal/admin/internship/ApplicationReview";
import TeamManagement from "@/components/portal/admin/internship/TeamManagement";
import { useAuth } from "@/contexts/AuthContext";

export default function TrainerInternships() {
    const [activeTab, setActiveTab] = useState("applications");
    const { user } = useAuth();

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
                            Internship Management
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Review applications, manage your teams, and track intern progress.
                        </p>
                    </div>
                </motion.div>

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-muted/50 p-1 border border-border/50">
                        <TabsTrigger value="applications" className="gap-2">
                            <FileText className="w-4 h-4" />
                            Applications
                        </TabsTrigger>
                        <TabsTrigger value="teams" className="gap-2">
                            <LayoutGrid className="w-4 h-4" />
                            My Teams & Projects
                        </TabsTrigger>
                        <TabsTrigger value="programs" className="gap-2">
                            <Briefcase className="w-4 h-4" />
                            Programs
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="applications">
                        <ApplicationReview />
                    </TabsContent>

                    <TabsContent value="teams">
                        <TeamManagement />
                    </TabsContent>

                    <TabsContent value="programs">
                        <ProgramList />
                    </TabsContent>
                </Tabs>
            </div>
        </PortalLayout>
    );
}
