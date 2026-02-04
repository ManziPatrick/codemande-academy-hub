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
  Eye,
  Briefcase,
} from "lucide-react";
import { 
  EnrollCourseDialog, 
  FilterCoursesDialog,
  ViewCourseDetailDialog,
  ApplyInternshipDialog,
} from "@/components/portal/dialogs";
import type { CourseFilters } from "@/components/portal/dialogs/FilterCoursesDialog";
import { toast } from "sonner";


import { useQuery } from "@apollo/client/react";
import { GET_ME, GET_COURSES } from "@/lib/graphql/queries";

export default function StudentCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Queries
  const { data: meData, loading: meLoading } = useQuery(GET_ME);
  const { data: coursesData, loading: coursesLoading } = useQuery(GET_COURSES);

  // Dialog states
  const [enrollCourse, setEnrollCourse] = useState<any | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewCourse, setViewCourse] = useState<any | null>(null);
  const [filters, setFilters] = useState<CourseFilters>({
    categories: [],
    level: "All Levels",
    duration: "Any Duration",
    rating: 0,
    priceRange: "Any Price",
  });
  const [applyInternshipOpen, setApplyInternshipOpen] = useState(false);

  if (meLoading || coursesLoading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </PortalLayout>
    );
  }

  const me = (meData as any)?.me;
  const enrolledCourses = me?.enrolledCourses || [];
  const completedLessons = me?.completedLessons || [];
  
  const allCourses = (coursesData as any)?.courses || [];
  const availableCourses = allCourses.filter((c: any) => 
    !enrolledCourses.some((ec: any) => ec.id === c.id)
  );

  const getCourseProgress = (courseId: string, totalLessons: number) => {
    if (totalLessons === 0) return 0;
    const completed = completedLessons.filter((l: any) => l.courseId === courseId).length;
    return Math.round((completed / totalLessons) * 100);
  };

  const handleBrowseCourses = () => {
    const tabTrigger = document.querySelector('[value="available"]') as HTMLElement;
    tabTrigger?.click();
  };

  const handleApplyFilters = (newFilters: CourseFilters) => {
    setFilters(newFilters);
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
          <Button 
            variant="gold" 
            className="shadow-lg shadow-gold/20"
            onClick={() => setApplyInternshipOpen(true)}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Apply for Internship
          </Button>
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
            <Button variant="outline" size="icon" onClick={() => setFilterOpen(true)}>
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
                {enrolledCourses.map((course: any, index: number) => {
                  const courseId = course.id || course._id;
                  const totalLessons = course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0;
                  const progress = getCourseProgress(courseId, totalLessons);
                  const completedCount = completedLessons.filter((l: any) => l.courseId === courseId).length;

                  return (
                    <motion.div
                      key={courseId || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-border/50 hover:shadow-card-hover transition-all overflow-hidden">
                        <div className={`flex ${viewMode === "list" ? "flex-row" : "flex-col"}`}>
                          {/* Image */}
                          <div className={`bg-gradient-to-br from-accent/20 to-primary/10 ${viewMode === "list" ? "w-48 h-auto" : "h-40"}`}>
                            <div className="w-full h-full flex items-center justify-center">
                              {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                              ) : (
                                <BookOpen className="w-12 h-12 text-accent/50" />
                              )}
                            </div>
                          </div>
                          
                          {/* Content */}
                          <CardContent className="p-4 flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-heading font-semibold text-card-foreground">
                                {course.title}
                              </h3>
                              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                                {progress}%
                              </span>
                            </div>
                            <p className="text-sm text-card-foreground/60 mb-3 line-clamp-2">
                              {course.description}
                            </p>
                            <Progress value={progress} className="h-2 mb-3" />
                            <div className="flex items-center justify-between text-xs text-card-foreground/60 mb-4">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5" />
                                {completedCount}/{totalLessons} lessons
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {course.level}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-card-foreground/70">by {course.instructor?.username || 'Trainer'}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setViewCourse(course)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Link to={`/portal/student/courses/${course.id || course._id}`}>
                                  <Button variant="gold" size="sm">
                                    <PlayCircle className="w-4 h-4 mr-1" />
                                    Continue
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Available Courses */}
          <TabsContent value="available" className="space-y-4">
            <div className={`grid gap-4 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {availableCourses.map((course: any, index: number) => {
                const totalLessons = course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0;
                const isFree = course.price === 0;

                return (
                  <motion.div
                    key={course.id || course._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-border/50 hover:shadow-card-hover transition-all overflow-hidden h-full flex flex-col">
                      {/* Image */}
                      <div className="h-36 bg-gradient-to-br from-accent/20 to-primary/10 relative">
                        <div className="w-full h-full flex items-center justify-center">
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen className="w-10 h-10 text-accent/50" />
                          )}
                        </div>
                        {isFree && (
                          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded">
                            Free
                          </span>
                        )}
                        {!isFree && (
                          <span className="absolute top-3 left-3 bg-card text-card-foreground text-xs font-medium px-2 py-1 rounded">
                            Premium
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
                            {totalLessons} lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                            4.8
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {course.studentsEnrolled?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-accent">
                            {isFree ? 'Free' : (course.price.toLocaleString() + ' RWF')}
                          </span>
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
                );
              })}
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
      <FilterCoursesDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
      <ViewCourseDetailDialog
        open={!!viewCourse}
        onOpenChange={(open) => !open && setViewCourse(null)}
        course={viewCourse}
      />
      <ApplyInternshipDialog
        open={applyInternshipOpen}
        onOpenChange={setApplyInternshipOpen}
      />
    </PortalLayout>
  );
}
