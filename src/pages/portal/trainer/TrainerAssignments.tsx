import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  MessageSquare,
  Download,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
} from "lucide-react";

const pendingSubmissions = [
  {
    id: 1,
    student: "Jean Baptiste",
    assignment: "Project 3: E-Commerce App",
    course: "Software Development",
    submittedAt: "2 hours ago",
    type: "project",
  },
  {
    id: 2,
    student: "Marie Uwase",
    assignment: "Challenge 5: React Hooks",
    course: "Software Development",
    submittedAt: "4 hours ago",
    type: "challenge",
  },
  {
    id: 3,
    student: "Emmanuel K.",
    assignment: "Quiz: JavaScript Basics",
    course: "Software Development",
    submittedAt: "Yesterday",
    type: "quiz",
  },
  {
    id: 4,
    student: "Grace M.",
    assignment: "Project 2: IoT Sensor Dashboard",
    course: "Internet of Things",
    submittedAt: "Yesterday",
    type: "project",
  },
];

const reviewedSubmissions = [
  {
    id: 5,
    student: "Patrick N.",
    assignment: "Challenge 4: State Management",
    course: "Software Development",
    reviewedAt: "1 day ago",
    grade: 85,
    feedback: "Great work on the implementation!",
  },
  {
    id: 6,
    student: "Alice K.",
    assignment: "Project 1: Portfolio Website",
    course: "Software Development",
    reviewedAt: "2 days ago",
    grade: 92,
    feedback: "Excellent design and code quality.",
  },
];

export default function TrainerAssignments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState("");

  const handleGradeSubmit = () => {
    console.log("Grading submission:", { grade, feedback });
    setSelectedSubmission(null);
    setFeedback("");
    setGrade("");
  };

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
              Assignments & Grading
            </h1>
            <p className="text-muted-foreground mt-1">
              Review student submissions and provide feedback
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-accent/20 text-accent border-0">
              <AlertCircle className="w-3 h-3 mr-1" />
              {pendingSubmissions.length} pending reviews
            </Badge>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Submissions List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">
                  Pending ({pendingSubmissions.length})
                </TabsTrigger>
                <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-3">
                {pendingSubmissions.map((submission) => (
                  <Card
                    key={submission.id}
                    className={`border-border/50 cursor-pointer transition-all hover:shadow-card-hover ${
                      selectedSubmission === submission.id ? "ring-2 ring-accent" : ""
                    }`}
                    onClick={() => setSelectedSubmission(submission.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <span className="text-accent font-medium">
                              {submission.student.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-card-foreground">
                              {submission.student}
                            </h4>
                            <p className="text-sm text-card-foreground/70 mt-0.5">
                              {submission.assignment}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {submission.type}
                              </Badge>
                              <span className="text-xs text-card-foreground/60">
                                {submission.course}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-card-foreground/60 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {submission.submittedAt}
                          </span>
                          <ChevronRight className="w-4 h-4 text-card-foreground/40" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="reviewed" className="space-y-3">
                {reviewedSubmissions.map((submission) => (
                  <Card key={submission.id} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-card-foreground">
                              {submission.student}
                            </h4>
                            <p className="text-sm text-card-foreground/70 mt-0.5">
                              {submission.assignment}
                            </p>
                            <p className="text-xs text-card-foreground/60 mt-2">
                              "{submission.feedback}"
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-accent text-accent-foreground">
                            {submission.grade}/100
                          </Badge>
                          <p className="text-xs text-card-foreground/60 mt-1">
                            {submission.reviewedAt}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Grading Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border/50 sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Grade Submission</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSubmission ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-background/50 rounded-lg">
                      <p className="font-medium text-card-foreground text-sm">
                        {pendingSubmissions.find(s => s.id === selectedSubmission)?.assignment}
                      </p>
                      <p className="text-xs text-card-foreground/60 mt-1">
                        by {pendingSubmissions.find(s => s.id === selectedSubmission)?.student}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-1" /> Download
                      </Button>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-card-foreground mb-2 block">
                        Grade (0-100)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder="Enter grade..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-card-foreground mb-2 block">
                        Feedback
                      </label>
                      <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Provide constructive feedback..."
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setGrade("");
                          setFeedback("Needs revision. Please address the following issues...");
                        }}
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" /> Request Revision
                      </Button>
                      <Button
                        variant="gold"
                        size="sm"
                        className="flex-1"
                        onClick={handleGradeSubmit}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" /> Submit Grade
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground text-sm">
                      Select a submission to review and grade
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PortalLayout>
  );
}
