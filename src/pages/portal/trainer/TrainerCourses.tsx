import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Users,
  Clock,
  Search,
  Plus,
  Edit,
  Eye,
  Video,
  FileText,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";
import { AddLessonDialog, AddModuleDialog } from "@/components/portal/dialogs";
import { toast } from "sonner";

const myCourses = [
  {
    id: "software-dev",
    title: "Software Development",
    description: "Master web and mobile development with modern technologies.",
    students: 45,
    lessons: 24,
    completedStudents: 12,
    pendingAssignments: 8,
    progress: 68,
    status: "active",
    lastUpdated: "2 days ago",
  },
  {
    id: "iot",
    title: "Internet of Things",
    description: "Design and build smart connected systems with sensors.",
    students: 28,
    lessons: 20,
    completedStudents: 5,
    pendingAssignments: 4,
    progress: 55,
    status: "active",
    lastUpdated: "1 week ago",
  },
];

const courseModules = [
  { id: 1, title: "Introduction to React", lessons: 4, duration: "2h 30m", status: "published" },
  { id: 2, title: "React Hooks & State", lessons: 6, duration: "4h 15m", status: "published" },
  { id: 3, title: "Advanced Patterns", lessons: 5, duration: "3h 45m", status: "draft" },
  { id: 4, title: "Testing & Deployment", lessons: 4, duration: "3h 00m", status: "draft" },
];

export default function TrainerCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isLessonOpen, setIsLessonOpen] = useState(false);
  const [isModuleOpen, setIsModuleOpen] = useState(false);

  const handleAddLesson = () => {
    toast.success("Lesson added to course!");
  };

  const handleAddModule = () => {
    toast.success("Module added to course!");
  };

  const handlePreview = (courseTitle: string) => {
    toast.info(`Opening preview for ${courseTitle}...`);
  };

  const handleEdit = (courseTitle: string) => {
    toast.info(`Editing ${courseTitle}...`);
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
              My Courses
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your course content, lessons, and materials
            </p>
          </div>
          <Button variant="gold" onClick={() => setIsLessonOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Lesson
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-4"
        >
          {myCourses.map((course) => (
            <Card 
              key={course.id} 
              className={`border-border/50 cursor-pointer transition-all hover:shadow-card-hover ${
                selectedCourse === course.id ? "ring-2 ring-accent" : ""
              }`}
              onClick={() => setSelectedCourse(course.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading font-semibold text-card-foreground text-lg">
                      {course.title}
                    </h3>
                    <p className="text-sm text-card-foreground/60 mt-1">
                      {course.description}
                    </p>
                  </div>
                  <Badge variant={course.status === "active" ? "default" : "secondary"}>
                    {course.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 my-4 text-sm">
                  <div className="text-center p-2 bg-background/50 rounded-lg">
                    <Users className="w-4 h-4 mx-auto text-accent mb-1" />
                    <p className="font-medium text-card-foreground">{course.students}</p>
                    <p className="text-xs text-card-foreground/60">Students</p>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded-lg">
                    <BookOpen className="w-4 h-4 mx-auto text-accent mb-1" />
                    <p className="font-medium text-card-foreground">{course.lessons}</p>
                    <p className="text-xs text-card-foreground/60">Lessons</p>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded-lg">
                    <AlertCircle className="w-4 h-4 mx-auto text-accent mb-1" />
                    <p className="font-medium text-card-foreground">{course.pendingAssignments}</p>
                    <p className="text-xs text-card-foreground/60">Pending</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-card-foreground/60">Course Progress</span>
                    <span className="text-accent font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-card-foreground/60">
                    Updated {course.lastUpdated}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePreview(course.title)}>
                      <Eye className="w-4 h-4 mr-1" /> Preview
                    </Button>
                    <Button variant="gold" size="sm" onClick={() => handleEdit(course.title)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Course Content Management */}
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-heading">Course Modules</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setIsModuleOpen(true)}>
                  <Plus className="w-4 h-4 mr-1" /> Add Module
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="modules">
                  <TabsList className="mb-4">
                    <TabsTrigger value="modules">Modules</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="modules" className="space-y-3">
                    {courseModules.map((module, index) => (
                      <div
                        key={module.id}
                        className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <span className="font-medium text-accent">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-card-foreground">{module.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-card-foreground/60 mt-1">
                              <span className="flex items-center gap-1">
                                <Video className="w-3 h-3" /> {module.lessons} lessons
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {module.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={module.status === "published" ? "default" : "secondary"}>
                            {module.status === "published" ? (
                              <><CheckCircle className="w-3 h-3 mr-1" /> Published</>
                            ) : (
                              "Draft"
                            )}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                      <h4 className="font-medium text-card-foreground mb-1">Upload Resources</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop files or click to browse
                      </p>
                      <Button variant="outline">Choose Files</Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-accent" />
                          <span className="text-sm text-card-foreground">React_Cheatsheet.pdf</span>
                        </div>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-accent" />
                          <span className="text-sm text-card-foreground">Project_Template.zip</span>
                        </div>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid gap-4">
                      <div className="p-4 bg-background/50 rounded-lg">
                        <h4 className="font-medium text-card-foreground mb-2">Course Visibility</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Control who can access this course
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Public</Button>
                          <Button variant="gold" size="sm">Enrolled Only</Button>
                        </div>
                      </div>
                      <div className="p-4 bg-background/50 rounded-lg">
                        <h4 className="font-medium text-card-foreground mb-2">Enrollment Settings</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Manage how students enroll
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Open Enrollment</Button>
                          <Button variant="outline" size="sm">Invite Only</Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Dialogs */}
      <AddLessonDialog
        open={isLessonOpen}
        onOpenChange={setIsLessonOpen}
        onAdd={handleAddLesson}
      />
      <AddModuleDialog
        open={isModuleOpen}
        onOpenChange={setIsModuleOpen}
        onAdd={handleAddModule}
      />
    </PortalLayout>
  );
}
