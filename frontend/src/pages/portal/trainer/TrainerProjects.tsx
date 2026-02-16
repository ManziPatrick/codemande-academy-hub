import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
    GET_ASSIGNMENT_SUBMISSIONS,
    GET_MY_PROJECTS,
    GET_COURSES,
    GET_ALL_STUDENTS
} from "@/lib/graphql/queries";
import {
    GRADE_ASSIGNMENT,
    CREATE_PROJECT,
    GRADE_PROJECT
} from "@/lib/graphql/mutations";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { TextEditor } from "@/components/ui/text-editor";
import {
    Trash2,
    Link as LinkIcon,
    ListTodo,
    CheckCircle,
    User,
    Clock,
    Calendar,
    MessageSquare,
    ExternalLink,
    FolderOpen,
    Plus,
    Users,
    FileCode
} from "lucide-react";

interface AssignmentSubmission {
    id: string;
    userId: string;
    user: {
        id: string;
        username: string;
        fullName?: string;
        avatar?: string;
    };
    courseId: string;
    lessonId: string;
    content: string;
    status: string;
    grade?: number;
    feedback?: string;
    createdAt: string;
}

interface Project {
    id: string;
    title: string;
    course: string;
    type: string;
    status: string;
    progress: number;
    deadline?: string;
    team: {
        userId: string;
        name: string;
        role: string;
        user?: {
            avatar?: string;
            username: string;
        }
    }[];
    createdAt: string;
}

interface GetAssignmentSubmissionsData {
    getAssignmentSubmissions: AssignmentSubmission[];
}

interface GetMyProjectsData {
    myProjects: Project[];
}

export default function TrainerProjects() {
    const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
    const [gradeValue, setGradeValue] = useState("");
    const [feedbackValue, setFeedbackValue] = useState("");

    // Projects State
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        type: "Individual",
        course: "",
        deadline: "",
        links: [{ title: "", url: "" }] as { title: string; url: string }[],
        tasks: [{ title: "", completed: false }] as { title: string; completed: boolean }[]
    });
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

    const { data: assignmentsData, loading: assignmentsLoading, refetch: refetchAssignments } = useQuery<GetAssignmentSubmissionsData>(GET_ASSIGNMENT_SUBMISSIONS);
    const { data: projectsData, loading: projectsLoading } = useQuery<GetMyProjectsData>(GET_MY_PROJECTS);
    const { data: coursesData } = useQuery(GET_COURSES);
    const { data: studentsData } = useQuery(GET_ALL_STUDENTS);

    const [gradeAssignmentMutation, { loading: grading }] = useMutation(GRADE_ASSIGNMENT);
    const [createProject, { loading: creatingProject }] = useMutation(CREATE_PROJECT);

    const submissions = assignmentsData?.getAssignmentSubmissions || [];
    const pendingSubmissions = submissions.filter((s: AssignmentSubmission) => s.status === "pending");
    const gradedSubmissions = submissions.filter((s: AssignmentSubmission) => s.status === "reviewed" || s.status === "graded" || s.status === "revision_requested");

    const projects = projectsData?.myProjects || [];

    const handleGrade = async () => {
        if (!selectedSubmission || !gradeValue) {
            toast.error("Please enter a grade");
            return;
        }

        const grade = parseInt(gradeValue);
        if (isNaN(grade) || grade < 0 || grade > 100) {
            toast.error("Grade must be between 0 and 100");
            return;
        }

        try {
            await gradeAssignmentMutation({
                variables: {
                    submissionId: selectedSubmission.id,
                    grade,
                    feedback: feedbackValue
                },
                refetchQueries: [{ query: GET_ASSIGNMENT_SUBMISSIONS }],
                awaitRefetchQueries: true
            });

            toast.success("Assignment graded successfully!");
            await refetchAssignments();
            setSelectedSubmission(null);
            setGradeValue("");
            setFeedbackValue("");
        } catch (err: any) {
            console.error("Grading error:", err);
            toast.error(err.message || "Failed to grade assignment");
        }
    };

    const handleCreateProject = async () => {
        if (!newProject.title || !newProject.course || !newProject.description) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const variables: any = {
                title: newProject.title,
                description: newProject.description,
                type: newProject.type === 'team' ? 'Team Project' : 'Individual',
                course: newProject.course,
                deadline: newProject.deadline || null,
                tasks: newProject.tasks.filter(t => t.title.trim() !== ""),
                documentation: {
                    links: newProject.links.filter(l => l.title.trim() !== "" && l.url.trim() !== "")
                }
            };

            if (newProject.type === 'individual' && selectedStudentIds.length > 0) {
                variables.userId = selectedStudentIds[0];
            } else if (newProject.type === 'team' && selectedStudentIds.length > 0) {
                // For team projects, we map selected IDs to TeamMemberInput
                // We'll need usernames too. Let's find them from data.
                const selectedStudents = (studentsData as any)?.getAllStudents?.filter((s: any) => selectedStudentIds.includes(s.id));
                variables.team = selectedStudents?.map((s: any) => ({
                    userId: s.id,
                    name: s.fullName || s.username,
                    role: 'Member'
                }));
            }

            await createProject({
                variables,
                refetchQueries: [{ query: GET_MY_PROJECTS }]
            });
            toast.success("Project created successfully");
            setIsCreateProjectOpen(false);
            setNewProject({
                title: "",
                description: "",
                type: "individual",
                course: "",
                deadline: "",
                links: [{ title: "", url: "" }],
                tasks: [{ title: "", completed: false }]
            });
            setSelectedStudentIds([]);
        } catch (e: any) {
            toast.error(e.message || "Failed to create project");
        }
    };

    // Project Grading
    const [managingProject, setManagingProject] = useState<Project | null>(null);
    const [projectGrade, setProjectGrade] = useState("");
    const [projectFeedback, setProjectFeedback] = useState("");
    const [gradeProjectMutation, { loading: gradingProject }] = useMutation(GRADE_PROJECT);

    const handleGradeProject = async () => {
        if (!managingProject || !projectGrade) {
            toast.error("Please enter a grade");
            return;
        }

        const grade = parseInt(projectGrade);
        if (isNaN(grade) || grade < 0 || grade > 100) {
            toast.error("Grade must be between 0 and 100");
            return;
        }

        try {
            await gradeProjectMutation({
                variables: {
                    id: managingProject.id,
                    grade: projectGrade, // Backend expects String based on mutation def, but let's check
                    feedback: projectFeedback
                },
                refetchQueries: [{ query: GET_MY_PROJECTS }]
            });
            toast.success("Project graded successfully");
            setManagingProject(null);
            setProjectGrade("");
            setProjectFeedback("");
        } catch (e: any) {
            toast.error(e.message || "Failed to grade project");
        }
    };

    if (assignmentsLoading || projectsLoading) {
        return (
            <PortalLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
                </div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout>
            <div className="space-y-6">
                <Tabs defaultValue="assignments" className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <TabsList className="bg-muted/20 p-1 rounded-xl h-12 border border-border/30">
                            <TabsTrigger value="assignments" className="rounded-lg px-6">Assignment Reviews</TabsTrigger>
                            <TabsTrigger value="projects" className="rounded-lg px-6">Project Management</TabsTrigger>
                        </TabsList>

                        <div className="flex gap-2">
                            {/* Global actions if any */}
                        </div>
                    </div>

                    {/* ASSIGNMENTS TAB */}
                    <TabsContent value="assignments">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="font-heading text-3xl font-bold">Assignment Review</h1>
                                <p className="text-muted-foreground mt-1">Review and grade specific lesson assignments</p>
                            </div>
                            <Badge variant="outline" className="text-lg px-4 py-2">
                                {pendingSubmissions.length} Pending
                            </Badge>
                        </div>

                        <Tabs defaultValue="pending" className="space-y-6">
                            <TabsList className="bg-muted/20 p-1 rounded-xl h-10 border border-border/30 w-fit">
                                <TabsTrigger value="pending" className="rounded-lg text-sm">Pending ({pendingSubmissions.length})</TabsTrigger>
                                <TabsTrigger value="graded" className="rounded-lg text-sm">Graded ({gradedSubmissions.length})</TabsTrigger>
                            </TabsList>

                            <TabsContent value="pending" className="space-y-4">
                                {pendingSubmissions.length === 0 ? (
                                    <Card className="border-border/50">
                                        <CardContent className="p-12 text-center">
                                            <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                                            <p className="text-muted-foreground">All caught up! No pending submissions.</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid lg:grid-cols-2 gap-6">
                                        <ScrollArea className="h-[calc(100vh-350px)]">
                                            <div className="space-y-4 pr-4">
                                                {pendingSubmissions.map((submission: AssignmentSubmission) => (
                                                    <Card
                                                        key={submission.id}
                                                        className={`cursor-pointer transition-all hover:border-accent/50 ${selectedSubmission?.id === submission.id ? "border-accent bg-accent/5" : "border-border/50"}`}
                                                        onClick={() => setSelectedSubmission(submission)}
                                                    >
                                                        <CardHeader className="pb-3">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                                                        <User className="w-5 h-5 text-accent" />
                                                                    </div>
                                                                    <div>
                                                                        <CardTitle className="text-base">{submission.user?.fullName || submission.user?.username}</CardTitle>
                                                                        <p className="text-xs text-muted-foreground">Lesson ID: {submission.lessonId}</p>
                                                                    </div>
                                                                </div>
                                                                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                                                    <Clock className="w-3 h-3 mr-1" />
                                                                    Pending
                                                                </Badge>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="space-y-2">
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(parseInt(submission.createdAt)).toLocaleDateString()}
                                                            </div>
                                                            <p className="text-sm line-clamp-2 text-muted-foreground">{submission.content}</p>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </ScrollArea>

                                        <Card className="border-border/50 sticky top-6 h-fit">
                                            <CardHeader className="border-b border-border/30">
                                                <CardTitle className="flex items-center gap-2">
                                                    <MessageSquare className="w-5 h-5 text-accent" />
                                                    Grade Submission
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                {selectedSubmission ? (
                                                    <div className="space-y-6">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-bold">Student</label>
                                                            <p className="text-lg">{selectedSubmission.user?.fullName || selectedSubmission.user?.username}</p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-bold">Submission Content</label>
                                                            <div className="p-4 bg-muted/20 rounded-lg border border-border/30">
                                                                <p className="text-sm font-mono whitespace-pre-wrap break-all">{selectedSubmission.content}</p>
                                                                {selectedSubmission.content.startsWith("http") && (
                                                                    <Button variant="ghost" size="sm" className="mt-2" asChild>
                                                                        <a href={selectedSubmission.content} target="_blank" rel="noopener noreferrer">
                                                                            <ExternalLink className="w-4 h-4 mr-2" />
                                                                            Open Link
                                                                        </a>
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-bold">Grade (0-100)</label>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                placeholder="Enter grade..."
                                                                value={gradeValue}
                                                                onChange={(e) => setGradeValue(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-bold">Feedback (Optional)</label>
                                                            <Textarea
                                                                placeholder="Provide constructive feedback..."
                                                                value={feedbackValue}
                                                                onChange={(e) => setFeedbackValue(e.target.value)}
                                                                rows={4}
                                                            />
                                                        </div>
                                                        <Button
                                                            variant="gold"
                                                            className="w-full shadow-lg shadow-gold/20"
                                                            onClick={handleGrade}
                                                            disabled={grading || !gradeValue}
                                                        >
                                                            {grading ? "Submitting..." : "Submit Grade"}
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-muted-foreground">
                                                        <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                                        <p>Select a submission to grade</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="graded" className="space-y-4">
                                {gradedSubmissions.length === 0 ? (
                                    <Card className="border-border/50">
                                        <CardContent className="p-12 text-center">
                                            <p className="text-muted-foreground">No graded submissions yet.</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {gradedSubmissions.map((submission: AssignmentSubmission) => (
                                            <Card key={submission.id} className="border-border/50">
                                                <CardHeader>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                                                <User className="w-5 h-5 text-accent" />
                                                            </div>
                                                            <div>
                                                                <CardTitle className="text-base">{submission.user?.fullName || submission.user?.username}</CardTitle>
                                                                <p className="text-xs text-muted-foreground">Lesson: {submission.lessonId}</p>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                                                            {submission.grade}/100
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                    {submission.feedback && (
                                                        <div className="p-3 bg-muted/20 rounded-lg border border-border/30">
                                                            <p className="text-xs font-bold text-accent mb-1">Feedback</p>
                                                            <p className="text-sm italic text-muted-foreground">"{submission.feedback}"</p>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(parseInt(submission.createdAt)).toLocaleDateString()}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </TabsContent>

                    {/* PROJECTS TAB */}
                    <TabsContent value="projects">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="font-heading text-3xl font-bold">Project Management</h1>
                                <p className="text-muted-foreground mt-1">Manage student projects, teams, and progress</p>
                            </div>
                            <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="gold" className="shadow-lg shadow-gold/20">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Project
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Create New Project</DialogTitle>
                                        <DialogDescription>
                                            Define a new project for your students.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="title">Project Title</Label>
                                            <Input
                                                id="title"
                                                value={newProject.title}
                                                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                                placeholder="e.g. E-commerce Platform"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="course">Course</Label>
                                            <Select
                                                value={newProject.course}
                                                onValueChange={(value) => setNewProject({ ...newProject, course: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a course" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(coursesData as any)?.courses?.map((course: any) => (
                                                        <SelectItem key={course.id} value={course.title}>
                                                            {course.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="type">Type</Label>
                                            <Select
                                                value={newProject.type}
                                                onValueChange={(value) => setNewProject({ ...newProject, type: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="individual">Individual</SelectItem>
                                                    <SelectItem value="team">Team</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Assign To ({newProject.type === 'individual' ? 'Student' : 'Team Members'})</Label>
                                            {newProject.type === 'individual' ? (
                                                <Select
                                                    value={selectedStudentIds[0] || ""}
                                                    onValueChange={(value) => setSelectedStudentIds([value])}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a student" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {(studentsData as any)?.getAllStudents?.map((student: any) => (
                                                            <SelectItem key={student.id} value={student.id}>
                                                                {student.fullName || student.username}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <ScrollArea className="h-[150px] w-full border rounded-md p-2">
                                                    <div className="space-y-2">
                                                        {(studentsData as any)?.getAllStudents?.map((student: any) => (
                                                            <div key={student.id} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`student-${student.id}`}
                                                                    checked={selectedStudentIds.includes(student.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        if (checked) {
                                                                            setSelectedStudentIds([...selectedStudentIds, student.id]);
                                                                        } else {
                                                                            setSelectedStudentIds(selectedStudentIds.filter(id => id !== student.id));
                                                                        }
                                                                    }}
                                                                />
                                                                <label
                                                                    htmlFor={`student-${student.id}`}
                                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                >
                                                                    {student.fullName || student.username}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                            )}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="deadline">Deadline (Optional)</Label>
                                            <Input
                                                id="deadline"
                                                type="date"
                                                value={newProject.deadline}
                                                onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Project Deliverables / Tasks</Label>
                                            <div className="space-y-2">
                                                {newProject.tasks.map((task, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <Input
                                                            placeholder="e.g. Design Database Schema"
                                                            value={task.title}
                                                            onChange={(e) => {
                                                                const updated = [...newProject.tasks];
                                                                updated[index].title = e.target.value;
                                                                setNewProject({ ...newProject, tasks: updated });
                                                            }}
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                const updated = newProject.tasks.filter((_, i) => i !== index);
                                                                setNewProject({ ...newProject, tasks: updated.length ? updated : [{ title: "", completed: false }] });
                                                            }}
                                                            disabled={newProject.tasks.length === 1 && !task.title}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full border-dashed"
                                                    onClick={() => setNewProject({ ...newProject, tasks: [...newProject.tasks, { title: "", completed: false }] })}
                                                >
                                                    <Plus className="w-3 h-3 mr-2" />
                                                    Add Task
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Resource Links (Toolbox)</Label>
                                            <div className="space-y-2">
                                                {newProject.links.map((link, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <Input
                                                            placeholder="Title"
                                                            className="flex-1"
                                                            value={link.title}
                                                            onChange={(e) => {
                                                                const updated = [...newProject.links];
                                                                updated[index].title = e.target.value;
                                                                setNewProject({ ...newProject, links: updated });
                                                            }}
                                                        />
                                                        <Input
                                                            placeholder="URL"
                                                            className="flex-[2]"
                                                            value={link.url}
                                                            onChange={(e) => {
                                                                const updated = [...newProject.links];
                                                                updated[index].url = e.target.value;
                                                                setNewProject({ ...newProject, links: updated });
                                                            }}
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                const updated = newProject.links.filter((_, i) => i !== index);
                                                                setNewProject({ ...newProject, links: updated.length ? updated : [{ title: "", url: "" }] });
                                                            }}
                                                            disabled={newProject.links.length === 1 && !link.title && !link.url}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full border-dashed"
                                                    onClick={() => setNewProject({ ...newProject, links: [...newProject.links, { title: "", url: "" }] })}
                                                >
                                                    <Plus className="w-3 h-3 mr-2" />
                                                    Add Link
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="description">Detailed Instructions (README style)</Label>
                                            <TextEditor
                                                value={newProject.description}
                                                onChange={(content) => setNewProject({ ...newProject, description: content })}
                                                placeholder="Write detailed project instructions, expectations, and guidelines..."
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleCreateProject} disabled={creatingProject}>
                                            {creatingProject ? "Creating..." : "Create Project"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {projects.length === 0 ? (
                            <Card className="border-border/50">
                                <CardContent className="p-12 text-center">
                                    <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                                    <h3 className="text-lg font-bold mb-2">No Projects Found</h3>
                                    <p className="text-muted-foreground mb-4">Create your first project to get started.</p>
                                    <Button variant="outline" onClick={() => setIsCreateProjectOpen(true)}>Create Project</Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project: Project) => (
                                    <Card key={project.id} className="border-border/50 hover:border-accent/50 transition-all group">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <Badge>{project.type}</Badge>
                                                {project.status === 'completed' && <Badge variant="secondary" className="bg-green-500/10 text-green-500">Completed</Badge>}
                                                {project.status === 'in_progress' && <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">In Progress</Badge>}
                                            </div>
                                            <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                                            <CardDescription className="line-clamp-1">{project.course}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Progress</span>
                                                    <span>{project.progress}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-accent transition-all duration-500"
                                                        style={{ width: `${project.progress}%` }}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        <span>{project.team.length} Members</span>
                                                    </div>
                                                    {project.deadline && (
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{new Date(parseInt(project.deadline)).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="pt-0">
                                            <Button
                                                variant="outline"
                                                className="w-full group-hover:bg-accent group-hover:text-accent-foreground"
                                                onClick={() => setManagingProject(project)}
                                            >
                                                Manage Project
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Manage Project Dialog */}
            <Dialog open={!!managingProject} onOpenChange={(open) => !open && setManagingProject(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Manage Project: {managingProject?.title}</DialogTitle>
                        <DialogDescription>
                            Review details and grade the project.
                        </DialogDescription>
                    </DialogHeader>

                    {managingProject && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-semibold block">Status</span>
                                    <Badge variant="outline">{managingProject.status}</Badge>
                                </div>
                                <div>
                                    <span className="font-semibold block">Type</span>
                                    <span className="capitalize">{managingProject.type}</span>
                                </div>
                                <div>
                                    <span className="font-semibold block">Course</span>
                                    <span className="line-clamp-1">{managingProject.course}</span>
                                </div>
                                <div>
                                    <span className="font-semibold block">Team Size</span>
                                    <span>{managingProject.team.length} Members</span>
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <FileCode className="w-4 h-4 text-gold" />
                                    Grading
                                </h4>
                                <div className="space-y-3">
                                    <div className="grid gap-2">
                                        <Label>Grade (0-100)</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="Enter grade..."
                                            value={projectGrade}
                                            onChange={(e) => setProjectGrade(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Feedback</Label>
                                        <Textarea
                                            placeholder="Provide detailed feedback..."
                                            value={projectFeedback}
                                            onChange={(e) => setProjectFeedback(e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setManagingProject(null)}>Cancel</Button>
                        <Button variant="gold" onClick={handleGradeProject} disabled={gradingProject}>
                            {gradingProject ? "Grading..." : "Submit Grade"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </PortalLayout >
    );
}
