import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AICourse from './models/AICourse';
import { User } from './models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codemande';

const createLessons = (title: string, count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        title: `${title} Lesson ${i + 1}`,
        duration: 15 + Math.floor(Math.random() * 30),
        type: 'video',
        content: `Detailed content for ${title} lesson ${i + 1}. This lesson covers technical implementation, theory, and hands-on exercises to ensure mastery of the subject matter.`
    }));
};

const courses = (trainerId: any) => [
    // --- GENERAL ---
    {
        title: "AI Fundamentals & Practical Applications",
        department: "GENERAL",
        duration: "4 Weeks",
        level: "Beginner",
        price: 0,
        instructor: trainerId,
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop",
        description: "A comprehensive introduction to AI for professionals. Learn how to leverage ChatGPT, Claude, and Gemini to automate 40% of your daily tasks.",
        modules: [
            { title: "Generative AI Foundations", lessons: createLessons("AI Intro", 5) },
            { title: "Prompt Engineering Mastery", lessons: createLessons("Prompting", 6) }
        ],
        keyModules: ["Generative AI Foundations", "Prompt Engineering Mastery", "AI Productivity Toolkit", "Responsible AI Ethics"],
        additionalModulesCount: 6,
        slug: "ai-fundamentals",
        featured: true
    },
    {
        title: "AI Governance & Public Policy",
        department: "GENERAL",
        duration: "5 Weeks",
        level: "Intermediate",
        price: 125000,
        instructor: trainerId,
        thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000&auto=format&fit=crop",
        description: "Explore the legal and ethical landscape of AI. This course prepares leaders to draft internal policies and navigate global AI regulations.",
        modules: [
            { title: "Global AI Regulations", lessons: createLessons("Law & AI", 4) },
            { title: "Corporate AI Ethics", lessons: createLessons("Policy Making", 4) }
        ],
        keyModules: ["EU AI Act Compliance", "NIST Framework", "Bias Mitigation Strategies", "Algorithmic Accountability"],
        additionalModulesCount: 4,
        slug: "ai-governance",
        featured: false
    },

    // --- HEALTHCARE ---
    {
        title: "AI in Healthcare: Clinical Decision Support",
        department: "HEALTHCARE",
        duration: "6 Weeks",
        level: "Intermediate",
        price: 150000,
        instructor: trainerId,
        thumbnail: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?q=80&w=2000&auto=format&fit=crop",
        description: "Enhance patient care with AI. Learn to use predictive models for diagnostics and patient outcome analysis while maintaining strict privacy standards.",
        modules: [
            { title: "AI in Diagnostics", lessons: createLessons("Clinical AI", 4) },
            { title: "Healthcare Data Ethics", lessons: createLessons("Data Privacy", 3) }
        ],
        keyModules: ["AI-Powered Diagnostics", "Patient Risk Stratification", "NLP for Clinical Records", "HIPAA & AI Compliance"],
        additionalModulesCount: 8,
        slug: "ai-healthcare",
        featured: false
    },
    {
        title: "AI for Genomic Data Analysis",
        department: "HEALTHCARE",
        duration: "8 Weeks",
        level: "Advanced",
        price: 280000,
        instructor: trainerId,
        thumbnail: "https://images.unsplash.com/photo-1530026115535-712d4152cc91?q=80&w=2000&auto=format&fit=crop",
        description: "Master the intersection of bioinformatics and deep learning. Learn to predict disease markers and accelerate drug discovery using AI.",
        modules: [
            { title: "Deep Learning for DNA", lessons: createLessons("Genomics AI", 6) },
            { title: "Drug Discovery Pipelines", lessons: createLessons("Bio-AI", 5) }
        ],
        keyModules: ["Sequence Analysis with RNNs", "Protein Folding Models", "Variant Discovery AI", "Personalized Medicine Theory"],
        additionalModulesCount: 10,
        slug: "ai-genomics",
        featured: true
    },

    // --- FINANCE ---
    {
        title: "AI in Finance: Fraud Detection & FinTech",
        department: "FINANCE",
        duration: "5 Weeks",
        level: "Intermediate",
        price: 185000,
        instructor: trainerId,
        thumbnail: "https://images.unsplash.com/photo-1551288049-nebda4ff7141?q=80&w=2000&auto=format&fit=crop",
        description: "Master AI applications in financial services. Cover real-time fraud detection, credit scoring automation, and algorithmic trading insights.",
        modules: [
            { title: "Financial Risk Models", lessons: createLessons("Finance AI", 5) },
            { title: "Fraud Detection Systems", lessons: createLessons("Fraud Models", 4) }
        ],
        keyModules: ["Anomaly Detection in Transactions", "Credit Risk Modeling", "Algorithmic Advisor AI", "Financial Regulation Compliance"],
        additionalModulesCount: 5,
        slug: "ai-finance",
        featured: false
    },
    {
        title: "RegTech: AI for Regulatory Compliance",
        department: "FINANCE",
        duration: "4 Weeks",
        level: "Intermediate",
        price: 160000,
        instructor: trainerId,
        thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop",
        description: "Automate compliance and reporting. Learn to use AI for KYC/AML automation, legislative change tracking, and real-time audit trails.",
        modules: [
            { title: "AI for AML/KYC", lessons: createLessons("RegTech", 4) },
            { title: "Automated Reporting", lessons: createLessons("Compliance AI", 3) }
        ],
        keyModules: ["Smart KYC Systems", "Legislative NLP Tracking", "Audit Trail Automation", "Global Financial Law Interface"],
        additionalModulesCount: 6,
        slug: "ai-regtech",
        featured: false
    },

    // --- EDUCATION ---
    {
        title: "AI in Education: Personalized Learning",
        department: "EDUCATION",
        duration: "3 Weeks",
        level: "Beginner",
        price: 0,
        instructor: trainerId,
        thumbnail: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2000&auto=format&fit=crop",
        description: "Empower educators with AI tools that personalize learning paths for every student. Automate grading and generate creative curriculum content.",
        modules: [
            { title: "Intelligent Tutoring Systems", lessons: createLessons("EdTech AI", 4) },
            { title: "Automating Administration", lessons: createLessons("Edu Productivity", 3) }
        ],
        keyModules: ["Personalized Learning Paths", "AI for Lesson Planning", "Automated Assessment Tools", "Cheating Detection & Ethics"],
        additionalModulesCount: 4,
        slug: "ai-education",
        featured: false
    },
    {
        title: "AI-Enhanced Special Education",
        department: "EDUCATION",
        duration: "4 Weeks",
        level: "Intermediate",
        price: 85000,
        instructor: trainerId,
        thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2000&auto=format&fit=crop",
        description: "Using AI to break down barriers. Learn to use assistive technologies and custom learning models for students with diverse needs.",
        modules: [
            { title: "Assistive AI Tools", lessons: createLessons("Inclusive Ed", 5) },
            { title: "Custom Learning Models", lessons: createLessons("Special Needs AI", 4) }
        ],
        keyModules: ["Speech-to-Text & Real-time Translation", "Behavior Tracking AI", "Custom IEP Generation", "Emotional AI for Classrooms"],
        additionalModulesCount: 5,
        slug: "ai-special-ed",
        featured: true
    },

    // --- MARKETING ---
    {
        title: "AI for Marketing: Hyper-Personalization",
        department: "MARKETING",
        duration: "4 Weeks",
        level: "Beginner to Intermediate",
        price: 120000,
        instructor: trainerId,
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop",
        description: "Transform your marketing strategy with AI-driven content generation, predictive audience analysis, and hyper-personalized customer journeys.",
        modules: [
            { title: "AI Content Strategy", lessons: createLessons("Marketing AI", 6) },
            { title: "Audience Prediction", lessons: createLessons("Predictive Ads", 4) }
        ],
        keyModules: ["Generative Copywriting", "Predictive Analytics for Ads", "Customer Sentiment AI", "Dynamic Pricing Models"],
        additionalModulesCount: 7,
        slug: "ai-marketing",
        featured: true
    },
    {
        title: "Predictive Branding & Consumer Neuroscience",
        department: "MARKETING",
        duration: "6 Weeks",
        level: "Advanced",
        price: 210000,
        instructor: trainerId,
        thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2000&auto=format&fit=crop",
        description: "Predict the future of your brand. Use deep learning to analyze consumer brain patterns and behavioral data to craft unbeatable brand identities.",
        modules: [
            { title: "Neuro-Marketing AI", lessons: createLessons("Brand Science", 5) },
            { title: "Behavioral Simulation", lessons: createLessons("Consumer AI", 5) }
        ],
        keyModules: ["Eye-Tracking Heatmap AI", "Deep Learning for Brand Equity", "Emotional Response Analytics", "Trend Prediction Engine"],
        additionalModulesCount: 8,
        slug: "ai-branding",
        featured: false
    },

    // --- MANUFACTURING ---
    {
        title: "AI in Smart Manufacturing: Industry 4.0",
        department: "MANUFACTURING",
        duration: "6 Weeks",
        level: "Advanced",
        price: 250000,
        instructor: trainerId,
        thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop",
        description: "Optimize production lines with predictive maintenance, computer vision for quality control, and AI-managed supply chains.",
        modules: [
            { title: "Predictive Maintenance", lessons: createLessons("Smart Factory", 5) },
            { title: "Quality Control Vision", lessons: createLessons("CV in Industry", 4) }
        ],
        keyModules: ["IoT & AI Integration", "Visual Defect Detection", "Supply Chain Optimization", "Robotic Process Automation"],
        additionalModulesCount: 10,
        slug: "ai-manufacturing",
        featured: false
    },
    {
        title: "AI Digital Twins & Process Simulation",
        department: "MANUFACTURING",
        duration: "8 Weeks",
        level: "Advanced",
        price: 350000,
        instructor: trainerId,
        thumbnail: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=2000&auto=format&fit=crop",
        description: "Create living digital models of your entire factory. Learn to simulate millions of scenarios using AI to find the perfect efficiency settings.",
        modules: [
            { title: "Digital Twin Architecture", lessons: createLessons("Simulation AI", 6) },
            { title: "Reinforcement Learning for Efficiency", lessons: createLessons("RL in Industry", 6) }
        ],
        keyModules: ["NVIDIA Omniverse Integration", "Real-time Sensor Fusion", "Predictive Failure Simulations", "AI Factory Orchestration"],
        additionalModulesCount: 12,
        slug: "ai-digital-twins",
        featured: true
    },

    // --- HR ---
    {
        title: "AI in HR: Smart Talent Management",
        department: "HR",
        duration: "3 Weeks",
        level: "Beginner",
        price: 95000,
        instructor: trainerId,
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop",
        description: "Streamline recruitment and employee engagement with AI. Use resume matching algorithms and sentiment analysis for organizational health.",
        modules: [
            { title: "AI Recruitment", lessons: createLessons("HR Tech", 4) },
            { title: "Employee Analytics", lessons: createLessons("People Data", 3) }
        ],
        keyModules: ["Smart Resume Screening", "Retention Predictive Models", "AI-Powered Employee Support", "Unbiased AI Hiring"],
        additionalModulesCount: 5,
        slug: "ai-hr",
        featured: false
    },
    {
        title: "People Analytics & Organizational Psychology",
        department: "HR",
        duration: "5 Weeks",
        level: "Intermediate",
        price: 145000,
        instructor: trainerId,
        thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop",
        description: "Deep dive into the human element. Learn to use AI to predict team dynamics, leadership success, and organizational culture fit.",
        modules: [
            { title: "Predicting Team Success", lessons: createLessons("Team Analytics", 4) },
            { title: "Leadership Evaluation AI", lessons: createLessons("Psych-AI", 4) }
        ],
        keyModules: ["Social Network Analysis (SNA)", "Culture Mapping Models", "Burnout Prediction AI", "Diversity & Inclusion Metrics"],
        additionalModulesCount: 6,
        slug: "ai-people-analytics",
        featured: false
    },

    // --- CYBERSECURITY ---
    {
        title: "AI in Cybersecurity: Threat Defense",
        department: "CYBERSECURITY",
        duration: "8 Weeks",
        level: "Advanced",
        price: 300000,
        instructor: trainerId,
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop",
        description: "Master AI-driven security. Learn to detect anomalies in real-time, automate threat response, and defend against AI-generated cyber attacks.",
        modules: [
            { title: "AI Anomaly Detection", lessons: createLessons("Cyber AI", 7) },
            { title: "Autonomous Defense Systems", lessons: createLessons("Defensive AI", 6) }
        ],
        keyModules: ["Real-time Threat Neutralization", "AI-Powered Malware Analysis", "Adversarial AI Defense", "SOAR Automation"],
        additionalModulesCount: 12,
        slug: "ai-cybersecurity",
        featured: true
    },
    {
        title: "Zero Trust AI & Identity Management",
        department: "CYBERSECURITY",
        duration: "6 Weeks",
        level: "Advanced",
        price: 275000,
        instructor: trainerId,
        thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2000&auto=format&fit=crop",
        description: "Secure the perimeter of the future. Learn to implement AI-powered continuous verification systems and dynamic identity protection.",
        modules: [
            { title: "Continuous Verification AI", lessons: createLessons("ID-AI", 5) },
            { title: "Behavioral Biometrics", lessons: createLessons("Security-AI", 5) }
        ],
        keyModules: ["Dynamic Risk Scoring", "Deepfake Detection in Identity", "Adaptive MFA Orchestration", "Blockchain-AI Security Fusion"],
        additionalModulesCount: 8,
        slug: "ai-zero-trust",
        featured: false
    }
];

const seedAICourses = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB Connected for seeding AICourses');

        const trainer = await User.findOne({ role: 'trainer' });
        if (!trainer) {
            console.error('No trainer found. Please seed users first.');
            process.exit(1);
        }

        // Clear existing AI courses
        await AICourse.deleteMany({});
        console.log('Cleared existing AICourses');

        // Insert new AI courses
        const coursesToSeed = courses(trainer._id);
        await AICourse.insertMany(coursesToSeed);
        console.log(`Successfully seeded ${coursesToSeed.length} ultra-rich AICourses with curricula and images`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding AICourses:', error);
        process.exit(1);
    }
};

seedAICourses();
