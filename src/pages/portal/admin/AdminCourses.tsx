import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Users,
  DollarSign,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewCourseDialog, EditCourseDialog, DeleteConfirmDialog } from "@/components/portal/dialogs";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  students: number;
  lessons: number;
  price: string;
  isFree: boolean;
  freeTrialLessons: number;
  status: string;
  revenue: string;
  completion: number;
}

const initialCourses: Course[] = [
  {
    id: "software-dev",
    title: "Software Development",
    description: "Master web and mobile development with modern technologies.",
    instructor: "Marie Claire",
    students: 245,
    lessons: 24,
    price: "150,000 RWF",
    isFree: false,
    freeTrialLessons: 2,
    status: "active",
    revenue: "1.2M RWF",
    completion: 72,
  },
  {
    id: "data-science",
    title: "Data Science & AI",
    description: "Learn to extract insights from data using machine learning.",
    instructor: "Emmanuel Kwizera",
    students: 189,
    lessons: 32,
    price: "180,000 RWF",
    isFree: false,
    freeTrialLessons: 2,
    status: "active",
    revenue: "850K RWF",
    completion: 65,
  },
  {
    id: "iot",
    title: "Internet of Things",
    description: "Design and build smart connected systems.",
    instructor: "Jean Pierre",
    students: 156,
    lessons: 20,
    price: "120,000 RWF",
    isFree: false,
    freeTrialLessons: 2,
    status: "active",
    revenue: "420K RWF",
    completion: 68,
  },
  {
    id: "ai-fundamentals",
    title: "AI Fundamentals",
    description: "Introduction to AI for professionals across all sectors.",
    instructor: "Sarah Uwimana",
    students: 312,
    lessons: 16,
    price: "Free",
    isFree: true,
    freeTrialLessons: 16,
    status: "active",
    revenue: "0 RWF",
    completion: 45,
  },
];

export default function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  
  // Dialog states
  const [viewCourse, setViewCourse] = useState<Course | null>(null);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);
  const [editPricingCourse, setEditPricingCourse] = useState<Course | null>(null);

  // Create course form state
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    freeTrialLessons: 2,
    isFree: false,
  });

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const course: Course = {
      id: `course-${Date.now()}`,
      title: newCourse.title,
      description: newCourse.description,
      instructor: "To be assigned",
      students: 0,
      lessons: 0,
      price: newCourse.isFree ? "Free" : `${newCourse.price} RWF`,
      isFree: newCourse.isFree,
      freeTrialLessons: newCourse.isFree ? 0 : newCourse.freeTrialLessons,
      status: "active",
      revenue: "0 RWF",
      completion: 0,
    };

    setCourses([...courses, course]);
    toast.success("Course created successfully!");
    setNewCourse({ title: "", description: "", price: "", freeTrialLessons: 2, isFree: false });
    setIsCreateOpen(false);
  };

  const handleDeleteCourse = () => {
    if (!deleteCourse) return;
    setCourses(courses.filter(c => c.id !== deleteCourse.id));
    toast.success("Course deleted successfully!");
    setDeleteCourse(null);
  };

  const handleSaveCourse = (updatedCourse: Course) => {
    setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Course Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Create, manage, and configure courses and pricing
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="gold">
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Course Title *</label>
                  <Input 
                    placeholder="e.g., Advanced JavaScript"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description *</label>
                  <Textarea 
                    placeholder="Course description..." 
                    rows={3}
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price (RWF)</label>
                    <Input 
                      type="number" 
                      placeholder="150000"
                      value={newCourse.price}
                      onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                      disabled={newCourse.isFree}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Free Trial Lessons</label>
                    <Input 
                      type="number" 
                      value={newCourse.freeTrialLessons}
                      onChange={(e) => setNewCourse({ ...newCourse, freeTrialLessons: parseInt(e.target.value) })}
                      disabled={newCourse.isFree}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Make Course Free</p>
                    <p className="text-xs text-muted-foreground">All lessons will be accessible</p>
                  </div>
                  <Switch 
                    checked={newCourse.isFree}
                    onCheckedChange={(checked) => setNewCourse({ ...newCourse, isFree: checked })}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="gold" className="flex-1" onClick={handleCreateCourse}>
                    Create Course
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{courses.length}</p>
                  <p className="text-xs text-card-foreground/60">Total Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {courses.reduce((sum, c) => sum + c.students, 0)}
                  </p>
                  <p className="text-xs text-card-foreground/60">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">2.47M</p>
                  <p className="text-xs text-card-foreground/60">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">62%</p>
                  <p className="text-xs text-card-foreground/60">Avg. Completion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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

        {/* Courses List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 text-sm font-medium text-card-foreground/70">Course</th>
                      <th className="text-left p-4 text-sm font-medium text-card-foreground/70">Instructor</th>
                      <th className="text-center p-4 text-sm font-medium text-card-foreground/70">Students</th>
                      <th className="text-center p-4 text-sm font-medium text-card-foreground/70">Price</th>
                      <th className="text-center p-4 text-sm font-medium text-card-foreground/70">Revenue</th>
                      <th className="text-center p-4 text-sm font-medium text-card-foreground/70">Status</th>
                      <th className="text-right p-4 text-sm font-medium text-card-foreground/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="border-b border-border/30 hover:bg-background/50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-card-foreground">{course.title}</p>
                            <p className="text-xs text-card-foreground/60 mt-0.5">
                              {course.lessons} lessons
                            </p>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-card-foreground/70">{course.instructor}</td>
                        <td className="p-4 text-center">
                          <span className="text-sm font-medium text-card-foreground">{course.students}</span>
                        </td>
                        <td className="p-4 text-center">
                          {course.isFree ? (
                            <Badge className="bg-green-500/20 text-green-400">Free</Badge>
                          ) : (
                            <span className="text-sm text-accent font-medium">{course.price}</span>
                          )}
                        </td>
                        <td className="p-4 text-center text-sm text-card-foreground/70">{course.revenue}</td>
                        <td className="p-4 text-center">
                          <Badge variant={course.status === "active" ? "default" : "secondary"}>
                            {course.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setViewCourse(course)}>
                                <Eye className="w-4 h-4 mr-2" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditCourse(course)}>
                                <Edit className="w-4 h-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditPricingCourse(course)}>
                                <DollarSign className="w-4 h-4 mr-2" /> Edit Pricing
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => setDeleteCourse(course)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dialogs */}
      <ViewCourseDialog
        open={!!viewCourse}
        onOpenChange={(open) => !open && setViewCourse(null)}
        course={viewCourse}
      />
      <EditCourseDialog
        open={!!editCourse || !!editPricingCourse}
        onOpenChange={(open) => {
          if (!open) {
            setEditCourse(null);
            setEditPricingCourse(null);
          }
        }}
        course={editCourse || editPricingCourse}
        onSave={handleSaveCourse}
      />
      <DeleteConfirmDialog
        open={!!deleteCourse}
        onOpenChange={(open) => !open && setDeleteCourse(null)}
        title="Delete Course"
        description={`Are you sure you want to delete "${deleteCourse?.title}"? This action cannot be undone and will remove all associated data.`}
        onConfirm={handleDeleteCourse}
      />
    </PortalLayout>
  );
}
