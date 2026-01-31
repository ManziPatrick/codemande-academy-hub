import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  HelpCircle,
  Calendar,
  Clock,
  Send,
  Search,
  ChevronRight,
  BookOpen,
  Video,
  FileText,
} from "lucide-react";

const faqs = [
  { q: "How do I reset my password?", a: "Go to Settings > Security and click 'Change Password'." },
  { q: "Can I download course videos?", a: "Videos are streaming-only, but you can download resources and materials." },
  { q: "How do I contact my instructor?", a: "Use the 'Request Help' button on any course page or visit the Support section." },
  { q: "When will I receive my certificate?", a: "Certificates are issued within 24 hours of course completion." },
];

const supportTickets = [
  { id: "T-2024-001", subject: "Video playback issue", status: "resolved", date: "Jan 20, 2026" },
  { id: "T-2024-002", subject: "Project submission error", status: "in_progress", date: "Jan 28, 2026" },
];

export default function StudentSupport() {
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground">
            Help & Support
          </h1>
          <p className="text-muted-foreground mt-1">
            Get help with courses, technical issues, or connect with mentors
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-3 gap-4"
        >
          <Card className="border-border/50 hover:border-accent/30 transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-card-foreground mb-1">Live Chat</h3>
              <p className="text-xs text-card-foreground/60">Chat with support team</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 hover:border-accent/30 transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-card-foreground mb-1">Book Office Hours</h3>
              <p className="text-xs text-card-foreground/60">Schedule time with instructor</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 hover:border-accent/30 transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-card-foreground mb-1">Video Call</h3>
              <p className="text-xs text-card-foreground/60">Request a Google Meet</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h2 className="font-heading text-lg font-semibold text-card-foreground mb-4">
                    Send a Message
                  </h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-card-foreground mb-2 block">
                          Subject
                        </label>
                        <Input placeholder="What's your question about?" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-card-foreground mb-2 block">
                          Category
                        </label>
                        <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                          <option>Technical Issue</option>
                          <option>Course Content</option>
                          <option>Payment</option>
                          <option>Internship</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground mb-2 block">
                        Message
                      </label>
                      <Textarea
                        placeholder="Describe your issue or question in detail..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                      />
                    </div>
                    <Button variant="gold" className="w-full sm:w-auto">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Support Tickets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h2 className="font-heading text-lg font-semibold text-card-foreground mb-4">
                    Your Tickets
                  </h2>
                  <div className="space-y-3">
                    {supportTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex items-center justify-between p-4 bg-background/50 rounded-lg"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-card-foreground/50">{ticket.id}</span>
                            <Badge
                              variant="outline"
                              className={
                                ticket.status === "resolved"
                                  ? "bg-green-500/20 text-green-400 border-green-400/30"
                                  : "bg-accent/20 text-accent border-accent/30"
                              }
                            >
                              {ticket.status === "resolved" ? "Resolved" : "In Progress"}
                            </Badge>
                          </div>
                          <p className="font-medium text-card-foreground">{ticket.subject}</p>
                          <p className="text-xs text-card-foreground/60 mt-1">{ticket.date}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - FAQs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h2 className="font-heading text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-accent" />
                  Quick Answers
                </h2>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="flex items-center justify-between cursor-pointer p-3 bg-background/50 rounded-lg text-sm font-medium text-card-foreground hover:bg-background transition-colors">
                        {faq.q}
                        <ChevronRight className="w-4 h-4 text-card-foreground/50 transition-transform group-open:rotate-90" />
                      </summary>
                      <p className="text-sm text-card-foreground/70 p-3 pl-6">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border/50">
                  <h3 className="text-sm font-medium text-card-foreground mb-3">Resources</h3>
                  <div className="space-y-2">
                    <a href="#" className="flex items-center gap-2 text-sm text-card-foreground/70 hover:text-accent transition-colors">
                      <BookOpen className="w-4 h-4" />
                      Getting Started Guide
                    </a>
                    <a href="#" className="flex items-center gap-2 text-sm text-card-foreground/70 hover:text-accent transition-colors">
                      <FileText className="w-4 h-4" />
                      Student Handbook
                    </a>
                    <a href="#" className="flex items-center gap-2 text-sm text-card-foreground/70 hover:text-accent transition-colors">
                      <Video className="w-4 h-4" />
                      Platform Tutorial
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PortalLayout>
  );
}
