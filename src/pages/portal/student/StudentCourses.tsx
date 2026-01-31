import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  PlayCircle,
  Clock,
  Search,
  Filter,
  Grid,
  List,
  Award,
  Users,
  Star,
  ArrowRight,
} from "lucide-react";
import { EnrollCourseDialog } from "@/components/portal/dialogs";
import { toast } from "sonner";

interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  instructor: string;
  rating: number;
  students: number;
  image: string;
  status: string;
}

interface AvailableCourse {
  id: string;
  title: string;
  description: string;
  totalLessons: number;
  duration: string;
  instructor: string;
  rating: number;
  students: number;
  price: string;
  image: string;
  isFree: boolean;
  freeTrialLessons: number;
}

const enrolledCourses: EnrolledCourse[] = [
  {
    id: "software-dev",
    title: "Software Development",
    description: "Master web and mobile development with modern technologies.",
    progress: 68,
    totalLessons: 24,
    completedLessons: 16,
    duration: "3-6 months",
    instructor: "Marie Claire",
    rating: 4.8,
    students: 245,
    image: "/placeholder.svg",
    status: "in_progress",
  },
  {
    id: "data-science",
    title: "Data Science & AI",
    description: "Learn to extract insights from data using machine learning.",
    progress: 35,
    totalLessons: 32,
    completedLessons: 11,
    duration: "4-6 months",
    instructor: "Emmanuel Kwizera",
    rating: 4.9,
    students: 189,
    image: "/placeholder.svg",
    status: "in_progress",
  },
];

const availableCourses: AvailableCourse[] = [
  {
    id: "iot",
    title: "Internet of Things (IoT)",
    description: "Design and build smart connected systems with sensors.",
    totalLessons: 20,
    duration: "3-4 months",
    instructor: "Jean Pierre",
    rating: 4.7,
    students: 156,
    price: "Contact for pricing",
    image: "/placeholder.svg",
    isFree: false,
    freeTrialLessons: 2,
  },
  {
    id: "ai-fundamentals",
    title: "AI Fundamentals",
    description: "Introduction to AI for professionals across all sectors.",
    totalLessons: 16,
    duration: "2-4 weeks",
    instructor: "Sarah Uwimana",
    rating: 4.9,
    students: 312,
    price: "Free",
    image: "/placeholder.svg",
    isFree: true,
    freeTrialLessons: 16,
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Fundamentals",
    description: "Master AI-powered security tools and threat prevention.",
    totalLessons: 28,
    duration: "4-5 weeks",
    instructor: "Emmanuel Kwizera",
    rating: 4.8,
    students: 98,
    price: "Contact for pricing",
    image: "/placeholder.svg",
    isFree: false,
    freeTrialLessons: 2,
  },
];

export default function StudentCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Dialog state
  const [enrollCourse, setEnrollCourse] = useState<AvailableCourse | null>(null);

  const handleBrowseCourses = () => {
    const tabTrigger = document.querySelector('[value="available"]') as HTMLElement;
    tabTrigger?.click();
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
              Track your progress and explore new learning opportunities
            </p>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="enrolled" className="space-y-6">
          <TabsList>
            <TabsTrigger value="enrolled">Enrolled ({enrolledCourses.length})</TabsTrigger>
            <TabsTrigger value="available">Available Courses</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {/* Enrolled Courses */}
          <TabsContent value="enrolled" className="space-y-4">
            {enrolledCourses.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading text-lg font-medium text-foreground mb-2">
                    No courses enrolled yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start your learning journey by exploring our course catalog
                  </p>
                  <Button variant="gold" onClick={handleBrowseCourses}>
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid gap-4 ${viewMode === "grid" ? "md:grid-cols-2" : "grid-cols-1"}`}>
                {enrolledCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-border/50 hover:shadow-card-hover transition-all overflow-hidden">
                      <div className={`flex ${viewMode === "list" ? "flex-row" : "flex-col"}`}>
                        {/* Image */}
                        <div className={`bg-gradient-to-br from-accent/20 to-primary/10 ${viewMode === "list" ? "w-48 h-auto" : "h-40"}`}>
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-accent/50" />
                          </div>
                        </div>
                        
                        {/* Content */}
                        <CardContent className="p-4 flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-heading font-semibold text-card-foreground">
                              {course.title}
                            </h3>
                            <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                              {course.progress}%
                            </span>
                          </div>
                          <p className="text-sm text-card-foreground/60 mb-3 line-clamp-2">
                            {course.description}
                          </p>
                          <Progress value={course.progress} className="h-2 mb-3" />
                          <div className="flex items-center justify-between text-xs text-card-foreground/60 mb-4">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              {course.completedLessons}/{course.totalLessons} lessons
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {course.duration}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-card-foreground/70">by {course.instructor}</span>
                            </div>
                            <Link to={`/portal/student/courses/${course.id}`}>
                              <Button variant="gold" size="sm">
                                <PlayCircle className="w-4 h-4 mr-1" />
                                Continue
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Available Courses */}
          <TabsContent value="available" className="space-y-4">
            <div className={`grid gap-4 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {availableCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-border/50 hover:shadow-card-hover transition-all overflow-hidden h-full flex flex-col">
                    {/* Image */}
                    <div className="h-36 bg-gradient-to-br from-accent/20 to-primary/10 relative">
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-accent/50" />
                      </div>
                      {course.isFree && (
                        <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded">
                          Free
                        </span>
                      )}
                      {!course.isFree && (
                        <span className="absolute top-3 left-3 bg-card text-card-foreground text-xs font-medium px-2 py-1 rounded">
                          {course.freeTrialLessons} Free Lessons
                        </span>
                      )}
                    </div>
                    
                    {/* Content */}
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <h3 className="font-heading font-semibold text-card-foreground mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-card-foreground/60 mb-3 line-clamp-2 flex-1">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-card-foreground/60 mb-3">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {course.totalLessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                          {course.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {course.students}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-accent">{course.price}</span>
                        <Button 
                          variant="gold" 
                          size="sm"
                          onClick={() => setEnrollCourse(course)}
                        >
                          Enroll <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Completed Courses */}
          <TabsContent value="completed">
            <Card className="border-border/50">
              <CardContent className="py-12 text-center">
                <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading text-lg font-medium text-foreground mb-2">
                  No completed courses yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Keep learning! Your completed courses will appear here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <EnrollCourseDialog
        open={!!enrollCourse}
        onOpenChange={(open) => !open && setEnrollCourse(null)}
        course={enrollCourse}
      />
    </PortalLayout>
  );
}
