import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  HelpCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewCourseDialog, EditCourseDialog, DeleteConfirmDialog } from "@/components/portal/dialogs";
import { QuestionManagerDialog } from "@/components/portal/QuestionManagerDialog";
import { FileUpload } from "@/components/FileUpload";
import { toast } from "sonner";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_COURSES, GET_STATS, GET_USERS } from "@/lib/graphql/queries";
import { CREATE_COURSE, UPDATE_COURSE, DELETE_COURSE } from "@/lib/graphql/mutations";

export default function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Dialog states
  const [viewCourse, setViewCourse] = useState<any | null>(null);
  const [editCourse, setEditCourse] = useState<any | null>(null);
  const [deleteCourse, setDeleteCourse] = useState<any | null>(null);
  const [editPricingCourse, setEditPricingCourse] = useState<any | null>(null);
  const [manageQuestionsCourse, setManageQuestionsCourse] = useState<any | null>(null);

  // Queries & Mutations
  const { data, loading, refetch } = useQuery(GET_COURSES);
  const [createCourseMutation] = useMutation(CREATE_COURSE);
  const [updateCourseMutation] = useMutation(UPDATE_COURSE);
  const [deleteCourseMutation] = useMutation(DELETE_COURSE);

  const courses = (data as any)?.courses || [];

  const { data: usersData } = useQuery(GET_USERS);
  const trainers = (usersData as any)?.users?.filter((u: any) => u.role === 'trainer' || u.role === 'admin' || u.role === 'super_admin') || [];

  // Create course form state
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: 0,
    discountPrice: 0,
    level: "Beginner",
    category: "Development",
    instructorId: "",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    isFree: false,
    status: "draft",
  });


  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createCourseMutation({
        variables: {
          title: newCourse.title,
          description: newCourse.description,
          price: newCourse.isFree ? 0 : Number(newCourse.price),
          discountPrice: Number(newCourse.discountPrice) || 0,
          level: newCourse.level,
          category: newCourse.category,
          instructorId: newCourse.instructorId,
          thumbnail: newCourse.thumbnail,
          status: newCourse.status,
          modules: []
        }
      });
      toast.success("Course created successfully!");
      refetch();
      setIsCreateOpen(false);
      setNewCourse({ title: "", description: "", price: 0, discountPrice: 0, level: "Beginner", category: "Development", instructorId: "", thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085", isFree: false, status: "draft" });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteCourse = async () => {
    if (!deleteCourse) return;
    try {
      await deleteCourseMutation({ variables: { id: deleteCourse.id } });
      toast.success("Course deleted successfully!");
      refetch();
      setDeleteCourse(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const { data: statsData } = useQuery(GET_STATS);
  const liveStats = (statsData as any)?.stats || { totalRevenue: 0 };

  const handleSaveCourse = async (updatedCourse: any) => {
    try {
      await updateCourseMutation({
        variables: {
          id: updatedCourse.id,
          title: updatedCourse.title,
          description: updatedCourse.description,
          price: Number(updatedCourse.price),
          discountPrice: Number(updatedCourse.discountPrice),
          level: updatedCourse.level,
          category: updatedCourse.category,
          instructorId: updatedCourse.instructorId,
          thumbnail: updatedCourse.thumbnail,
          status: updatedCourse.status,
          modules: updatedCourse.modules
        }
      });
      toast.success("Course updated successfully!");
      refetch();
      setEditCourse(null);
      setEditPricingCourse(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdateStatus = async (courseId: string, newStatus: string) => {
    try {
      await updateCourseMutation({
        variables: {
          id: courseId,
          status: newStatus
        }
      });
      toast.success(`Course status updated to ${newStatus}`);
      refetch();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filteredCourses = courses.filter((course: any) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor?.username.toLowerCase().includes(searchQuery.toLowerCase())
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
            <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 overflow-hidden">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <div className="flex-1 p-6 pt-0 overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Price ($) {!newCourse.isFree && <span className="text-[10px] text-accent font-normal">(Editable)</span>}</label>
                      <Input
                        type="number"
                        placeholder="99.99"
                        value={newCourse.price}
                        onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) || 0 })}
                        disabled={newCourse.isFree}
                        className={newCourse.isFree ? "opacity-50" : ""}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Discount Price ($)</label>
                      <Input
                        type="number"
                        placeholder="e.g. 79.99"
                        value={newCourse.discountPrice}
                        onChange={(e) => setNewCourse({ ...newCourse, discountPrice: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/5 border border-accent/20 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Make Course Free</p>
                      <p className="text-xs text-muted-foreground">Sets price to 0 and disables editing</p>
                    </div>
                    <Switch
                      checked={newCourse.isFree}
                      onCheckedChange={(checked) => setNewCourse({ ...newCourse, isFree: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 border border-border/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Course Visibility</p>
                      <p className="text-xs text-muted-foreground">Toggle between Draft and Live</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">{newCourse.status === 'published' ? 'Live' : 'Draft'}</span>
                      <Switch
                        checked={newCourse.status === 'published'}
                        onCheckedChange={(checked) => setNewCourse({ ...newCourse, status: checked ? 'published' : 'draft' })}
                      />
                    </div>
                  </div>
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
                  <div>
                    <label className="text-sm font-medium mb-2 block">Thumbnail</label>
                    {newCourse.thumbnail && newCourse.thumbnail.includes('unsplash') === false ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border">
                        <img src={newCourse.thumbnail} alt="" className="w-full h-full object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8"
                          onClick={() => setNewCourse({ ...newCourse, thumbnail: "" })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <FileUpload
                        folder="courses"
                        label="Upload Course Thumbnail"
                        onUploadComplete={(url) => setNewCourse({ ...newCourse, thumbnail: url })}
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Level</label>
                      <Input
                        placeholder="Beginner"
                        value={newCourse.level}
                        onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Input
                        placeholder="Development"
                        value={newCourse.category}
                        onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Assign Instructor</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={newCourse.instructorId}
                      onChange={(e) => setNewCourse({ ...newCourse, instructorId: e.target.value })}
                    >
                      <option value="">Select Instructor</option>
                      {trainers.map((t: any) => (
                        <option key={t.id} value={t.id}>{t.username} ({t.role})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 p-6 border-t">
                <Button variant="outline" className="flex-1" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button variant="gold" className="flex-1" onClick={handleCreateCourse}>
                  Create Course
                </Button>
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
                    {courses.reduce((sum: number, c: any) => sum + (c.studentsEnrolled?.length || 0), 0)}
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
                  <p className="text-2xl font-bold text-card-foreground">{(liveStats.totalRevenue || 0).toLocaleString()}</p>
                  <p className="text-xs text-card-foreground/60">Total Revenue (RWF)</p>
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
                    {filteredCourses.map((course: any) => (
                      <tr key={course.id} className="border-b border-border/30 hover:bg-background/50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-card-foreground">{course.title}</p>
                            <p className="text-xs text-card-foreground/60 mt-0.5">
                              {course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0} lessons
                            </p>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-card-foreground/70">{course.instructor?.username}</td>
                        <td className="p-4 text-center">
                          <span className="text-sm font-medium text-card-foreground">{course.studentsEnrolled?.length || 0}</span>
                        </td>
                        <td className="p-4 text-center">
                          {course.price === 0 ? (
                            <Badge className="bg-green-500/20 text-green-400">Free</Badge>
                          ) : (
                            <div className="flex flex-col items-center">
                              {course.discountPrice > 0 ? (
                                <>
                                  <span className="text-xs text-card-foreground/40 line-through">${course.price}</span>
                                  <span className="text-sm text-accent font-medium">${course.discountPrice}</span>
                                </>
                              ) : (
                                <span className="text-sm text-accent font-medium">${course.price}</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-center text-sm text-card-foreground/70">$0</td>
                        <td className="p-4 text-center">
                          <Badge
                            variant={course.status === 'published' ? 'default' : 'secondary'}
                            className={
                              course.status === 'draft' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                course.status === 'archived' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                  "bg-green-500/10 text-green-500 border-green-500/20"
                            }
                          >
                            {course.status === 'published' ? 'Live' : course.status === 'draft' ? 'Draft' : 'Archived'}
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
                                <Edit className="w-4 h-4 mr-2" /> Edit Content
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditPricingCourse(course)}>
                                <DollarSign className="w-4 h-4 mr-2" /> Edit Pricing
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => setManageQuestionsCourse(course)}>
                                <HelpCircle className="w-4 h-4 mr-2" /> Manage Questions
                              </DropdownMenuItem>

                              <div className="h-px bg-border/50 my-1" />
                              <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase">Set Status</div>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(course.id, 'published')} disabled={course.status === 'published'}>
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2" /> Go Live
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(course.id, 'draft')} disabled={course.status === 'draft'}>
                                <div className="w-2 h-2 rounded-full bg-amber-500 mr-2" /> Back to Draft
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(course.id, 'archived')} disabled={course.status === 'archived'}>
                                <div className="w-2 h-2 rounded-full bg-red-500 mr-2" /> Archive
                              </DropdownMenuItem>

                              <div className="h-px bg-border/50 my-1" />
                              <DropdownMenuItem
                                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
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
        trainers={trainers}
        onSave={handleSaveCourse}
      />
      <DeleteConfirmDialog
        open={!!deleteCourse}
        onOpenChange={(open) => !open && setDeleteCourse(null)}
        title="Delete Course"
        description={`Are you sure you want to delete "${deleteCourse?.title}"? This action cannot be undone and will remove all associated data.`}
        onConfirm={handleDeleteCourse}
      />
      <QuestionManagerDialog
        isOpen={!!manageQuestionsCourse}
        onClose={() => setManageQuestionsCourse(null)}
        course={manageQuestionsCourse}
      />
    </PortalLayout>
  );
}
