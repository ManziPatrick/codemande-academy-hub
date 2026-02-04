import axios from 'axios';
import { Course } from '../models/Course';
import { Booking } from '../models/Booking';
import { User } from '../models/User';

const HF_TOKEN = process.env.HF_TOKEN || "";

export const chatWithAIService = async (userMessage: string, contextUser: any) => {
    // 1. Gather Basic Context
    const courses = await Course.find({ status: 'published' }).limit(10).select('title description price');
    const mentors = await User.find({ role: 'trainer' }).limit(10).select('username role _id');
    const now = new Date();
    const dateTimeStr = now.toLocaleString();

    let userContext = `You are the "CODEMANDE Brain", a highly intelligent and helpful AI assistant for the CODEMANDE Academy Hub. 
  Your goal is to assist students, interns, and guests with everything related to the platform.
  
  Current Date & Time: ${dateTimeStr}

  What we do (CODEMANDE Academy):
  - Training: Intensive bootcamps and courses in fields like:
    - Full Stack Web Development
    - Data Science with Python
    - UI/UX Design
    - Cybersecurity Fundamentals
    - Cloud Computing (AWS)
    - Mobile App Development (Flutter)
    - DevOps & CI/CD
    - AI & Machine Learning Engineering
    - Digital Marketing & Content Strategy
    - Blockchain & Web3 Development
  - Internships: Hands-on industry experience for students and job seekers through placement and projects.
  - Mentorship: Direct access to experienced professionals for career and technical guidance.
  - Projects: Real-world project simulations to build portfolios.
  
  Available Courses:
  ${courses.map(c => `- ${c.title}: ${c.description} ($${c.price})`).join('\n')}
  
  Available Mentors (Important for booking):
  ${mentors.map(m => `- ${m.username} (ID: ${m._id})`).join('\n')}
  
  User State:
  - Is Authenticated: ${!!contextUser}
  - Username: ${contextUser?.username || 'Guest'}
  - Role: ${contextUser?.role || 'Guest'}
  
  Instructions:
  - You are CODEMANDE's brain. Use "we" when referring to the platform.
  - Be proactive, friendly, and professional.
  - Handling Bookings: If a user wants to book a session, check if they are logged in. If not, tell them to log in at /auth. If they are, ask for: 
    1. Mentor name (from the list)
    2. Topic of discussion
    3. Preferred Date (use YYYY-MM-DD format)
    4. Preferred Time (use HH:mm format)
  - PERFORMING BOOKING: Once you have all info (Mentor ID, Topic, Date, Time), you MUST include this tag at the end of your response: 
    [ACTION:CREATE_BOOKING]{"mentorId": "MENTOR_ID", "date": "YYYY-MM-DD", "time": "HH:mm", "topic": "TOPIC_NAME"}
  - Handling Technical Blockers: Provide code snippets, debugging tips, or conceptual explanations.
  - Explain Platform Pages: If they ask where something is:
    - Dashboard: /portal/student
    - Courses: /portal/student/courses
    - Internship: /portal/student/internship
    - Schedule: /portal/student/schedule
  - IMPORTANT: Always answer as "CODEMANDE".
  `;

    try {
        // Use Hugging Face Router API (OpenAI compatible)
        const response = await axios.post(
            'https://router.huggingface.co/v1/chat/completions',
            {
                model: "Qwen/Qwen3-Coder-Next:novita",
                messages: [
                    { role: 'system', content: userContext },
                    { role: 'user', content: userMessage }
                ],
                stream: false // Using non-streaming for simplicity with axios here
            },
            {
                headers: {
                    'Authorization': `Bearer ${HF_TOKEN}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        let aiContent = response.data.choices[0].message.content;
        let action = null;
        let actionData = null;

        // Simple Action Parsing
        const actionMatch = aiContent.match(/\[ACTION:([^\]]+)\]({.*})/);
        if (actionMatch) {
            action = actionMatch[1];
            actionData = actionMatch[2];
            // Remove the action tag from the display content
            aiContent = aiContent.replace(actionMatch[0], '').trim();

            // Execute the action if it's CREATE_BOOKING
            if (action === 'CREATE_BOOKING' && contextUser) {
                try {
                    const data = JSON.parse(actionData);
                    const newBooking = new Booking({
                        userId: contextUser.id,
                        mentorId: data.mentorId,
                        type: 'Mentorship Session',
                        date: data.date,
                        time: data.time,
                        topic: data.topic,
                        status: 'pending'
                    });
                    await newBooking.save();
                    aiContent += "\n\n(System Message: I have successfully created your booking request for " + data.date + " at " + data.time + ". You can view it in your schedule.)";
                } catch (err) {
                    console.error("Action Execution Error:", err);
                }
            }
        }

        return {
            content: aiContent,
            role: 'assistant',
            action,
            actionData
        };
    } catch (error: any) {
        console.error('AI Service Error:', error?.response?.data || error.message);
        return {
            content: "I'm having a bit of a brain fog right now. I couldn't reach the Qwen core at Hugging Face. Please try again!",
            role: 'assistant',
            action: null,
            actionData: null
        };
    }
};
