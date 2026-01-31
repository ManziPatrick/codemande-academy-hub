import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlayCircle,
  CheckCircle,
  Lock,
  Clock,
  BookOpen,
  FileText,
  Download,
  MessageSquare,
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
  Code,
  FolderOpen,
  HelpCircle,
  Video,
} from "lucide-react";

// Mock course data
const courseData = {
  id: "software-dev",
  title: "Software Development",
  description: "Master web and mobile development with modern technologies used by leading tech companies.",
  progress: 68,
  totalLessons: 24,
  completedLessons: 16,
  instructor: {
    name: "Marie Claire",
    avatar: "/placeholder.svg",
    bio: "Senior Software Engineer with 10+ years of experience",
  },
  modules: [
    {
      id: "m1",
      title: "Getting Started",
      lessons: [
        { id: "l1", title: "Welcome & Course Overview", duration: "5 min", completed: true, type: "video" },
        { id: "l2", title: "Setting Up Your Environment", duration: "15 min", completed: true, type: "video" },
        { id: "l3", title: "First Code Challenge", duration: "10 min", completed: true, type: "challenge" },
      ],
    },
    {
      id: "m2",
      title: "HTML & CSS Fundamentals",
      lessons: [
        { id: "l4", title: "HTML Structure & Semantics", duration: "20 min", completed: true, type: "video" },
        { id: "l5", title: "CSS Basics & Selectors", duration: "25 min", completed: true, type: "video" },
        { id: "l6", title: "Responsive Design Principles", duration: "30 min", completed: true, type: "video" },
        { id: "l7", title: "Build a Landing Page", duration: "45 min", completed: true, type: "project" },
      ],
    },
    {
      id: "m3",
      title: "JavaScript Essentials",
      lessons: [
        { id: "l8", title: "Variables & Data Types", duration: "20 min", completed: true, type: "video" },
        { id: "l9", title: "Functions & Scope", duration: "25 min", completed: true, type: "video" },
        { id: "l10", title: "Arrays & Objects", duration: "30 min", completed: true, type: "video" },
        { id: "l11", title: "DOM Manipulation", duration: "35 min", completed: true, type: "video" },
        { id: "l12", title: "JavaScript Challenge", duration: "20 min", completed: true, type: "challenge" },
      ],
    },
    {
      id: "m4",
      title: "React.js Fundamentals",
      lessons: [
        { id: "l13", title: "Introduction to React", duration: "20 min", completed: true, type: "video" },
        { id: "l14", title: "Components & Props", duration: "25 min", completed: true, type: "video" },
        { id: "l15", title: "State & Lifecycle", duration: "30 min", completed: true, type: "video" },
        { id: "l16", title: "React Hooks & State Management", duration: "40 min", completed: false, type: "video", current: true },
        { id: "l17", title: "React Router", duration: "25 min", completed: false, type: "video" },
        { id: "l18", title: "Build a React App", duration: "60 min", completed: false, type: "project" },
      ],
    },
    {
      id: "m5",
      title: "Backend Development",
      lessons: [
        { id: "l19", title: "Node.js Basics", duration: "30 min", completed: false, type: "video", locked: true },
        { id: "l20", title: "Express.js Framework", duration: "35 min", completed: false, type: "video", locked: true },
        { id: "l21", title: "REST API Design", duration: "40 min", completed: false, type: "video", locked: true },
        { id: "l22", title: "Database Integration", duration: "45 min", completed: false, type: "video", locked: true },
      ],
    },
    {
      id: "m6",
      title: "Final Project",
      lessons: [
        { id: "l23", title: "Project Planning", duration: "15 min", completed: false, type: "video", locked: true },
        { id: "l24", title: "Full-Stack Application", duration: "3 hrs", completed: false, type: "project", locked: true },
      ],
    },
  ],
  resources: [
    { title: "JavaScript Cheat Sheet", type: "pdf", size: "2.3 MB" },
    { title: "React Best Practices Guide", type: "pdf", size: "1.8 MB" },
    { title: "Project Starter Template", type: "zip", size: "5.2 MB" },
  ],
};

const getLessonIcon = (type: string) => {
  switch (type) {
    case "video":
      return Video;
    case "challenge":
      return Code;
    case "project":
      return FolderOpen;
    default:
      return BookOpen;
  }
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const [activeLesson, setActiveLesson] = useState("l16");

  const currentModule = courseData.modules.find((m) =>
    m.lessons.some((l) => l.id === activeLesson)
  );
  const currentLesson = currentModule?.lessons.find((l) => l.id === activeLesson);

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link to="/portal/student/courses" className="hover:text-accent">
            My Courses
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{courseData.title}</span>
        </motion.div>

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground">
              {courseData.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {courseData.completedLessons} of {courseData.totalLessons} lessons completed
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-accent">{courseData.progress}%</p>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
            <div className="w-32">
              <Progress value={courseData.progress} className="h-3" />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video/Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Video Player Placeholder */}
            <Card className="border-border/50 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-card to-accent/10 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-accent/30 transition-colors">
                    <PlayCircle className="w-10 h-10 text-accent" />
                  </div>
                  <p className="text-card-foreground font-medium">{currentLesson?.title}</p>
                  <p className="text-card-foreground/60 text-sm">{currentLesson?.duration}</p>
                </div>
              </div>
            </Card>

            {/* Lesson Info */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg font-semibold text-card-foreground mb-3">
                      {currentLesson?.title}
                    </h3>
                    <p className="text-card-foreground/70 mb-4">
                      In this lesson, you'll learn about React Hooks and how to manage state effectively 
                      in functional components. We'll cover useState, useEffect, and custom hooks.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-card-foreground/60">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {currentLesson?.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        Video Lesson
                      </span>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/50">
                      <Button variant="outline" size="sm">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      <Button variant="gold" size="sm">
                        Mark Complete & Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg font-semibold text-card-foreground mb-4">
                      Course Resources
                    </h3>
                    <div className="space-y-3">
                      {courseData.resources.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-accent" />
                            <div>
                              <p className="text-sm font-medium text-card-foreground">{resource.title}</p>
                              <p className="text-xs text-card-foreground/60">{resource.type.toUpperCase()} • {resource.size}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion">
                <Card className="border-border/50">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-heading text-lg font-medium text-foreground mb-2">
                      Join the Discussion
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Ask questions and interact with other students
                    </p>
                    <Button variant="gold">Start Discussion</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg font-semibold text-card-foreground mb-4">
                      Your Notes
                    </h3>
                    <textarea
                      placeholder="Take notes while watching the lesson..."
                      className="w-full h-40 p-3 bg-background border border-border rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <div className="flex justify-end mt-3">
                      <Button variant="gold" size="sm">Save Notes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Curriculum Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border/50 sticky top-20">
              <CardContent className="p-4">
                <h3 className="font-heading font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  Course Curriculum
                </h3>
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {courseData.modules.map((module) => (
                    <div key={module.id}>
                      <h4 className="text-sm font-medium text-card-foreground mb-2">
                        {module.title}
                      </h4>
                      <ul className="space-y-1">
                        {module.lessons.map((lesson) => {
                          const Icon = getLessonIcon(lesson.type);
                          const isActive = lesson.id === activeLesson;
                          const isLocked = (lesson as any).locked;

                          return (
                            <li key={lesson.id}>
                              <button
                                onClick={() => !isLocked && setActiveLesson(lesson.id)}
                                disabled={isLocked}
                                className={`w-full flex items-center gap-3 p-2 rounded-lg text-left text-sm transition-all ${
                                  isActive
                                    ? "bg-accent text-accent-foreground"
                                    : isLocked
                                    ? "text-card-foreground/40 cursor-not-allowed"
                                    : "text-card-foreground/70 hover:bg-background/50"
                                }`}
                              >
                                {lesson.completed ? (
                                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                                ) : isLocked ? (
                                  <Lock className="w-4 h-4 flex-shrink-0" />
                                ) : (
                                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "" : "text-card-foreground/50"}`} />
                                )}
                                <span className="flex-1 truncate">{lesson.title}</span>
                                <span className="text-xs opacity-70">{lesson.duration}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Request Help */}
                <div className="mt-4 pt-4 border-t border-border/50">
                  <Button variant="outline" size="sm" className="w-full">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Request Help
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PortalLayout>
  );
}
