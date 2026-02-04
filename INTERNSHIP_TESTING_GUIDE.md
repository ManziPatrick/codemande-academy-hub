# 🧪 Internship Module Testing Guide

## Quick Start Testing

### 1️⃣ Seed the Database

```bash
cd backend
npm run seed:internship
```

**Expected Output:**
```
MongoDB Connected: localhost
Clearing existing internship data...
Seeding Internship Program...
Found 4 students. Seeding Applications...
Seeding Projects...
Seeding Milestones...
Seeding Team...
Seeding Team Members...
🚀 Internship seeding complete!
```

---

## 2️⃣ Test GraphQL API

### Open GraphQL Playground
Navigate to: `http://localhost:4000/graphql`

### Test Query 1: Get All Programs
```graphql
query {
  internshipPrograms {
    id
    title
    description
    status
    applicationDeadline
    startDate
    endDate
  }
}
```

### Test Query 2: Get Applications (Admin Only)
```graphql
query {
  internshipApplications {
    id
    status
    skills
    user {
      username
      email
    }
    internshipProgram {
      title
    }
  }
}
```

### Test Mutation 1: Student Applies
```graphql
mutation {
  applyToInternshipProgram(
    internshipProgramId: "YOUR_PROGRAM_ID_HERE"
    skills: ["JavaScript", "React", "Node.js"]
    availability: "Full-time"
    portfolioUrl: "https://github.com/student"
  ) {
    id
    status
  }
}
```

### Test Mutation 2: Admin Approves
```graphql
mutation {
  reviewInternshipApplication(
    id: "YOUR_APPLICATION_ID_HERE"
    status: "approved"
  ) {
    id
    status
  }
}
```

---

## 3️⃣ Test Frontend

### Admin Testing

1. **Login as Admin**
   - Email: `admin@codemande.com`
   - Password: `password123`

2. **Navigate to Internships**
   - URL: `http://localhost:5173/portal/admin/internships`

3. **Test Each Tab:**

   **Programs Tab:**
   - ✅ View existing programs
   - ✅ Click "Create Program"
   - ✅ Fill form and submit
   - ✅ Edit existing program
   - ✅ View program details

   **Applications Tab:**
   - ✅ View all applications
   - ✅ See applicant details
   - ✅ Approve an application (green checkmark)
   - ✅ Reject an application (red X, must provide reason)
   - ✅ View portfolio links

   **Teams Tab:**
   - ✅ View existing teams
   - ✅ Click "Assemble Team"
   - ✅ Create new team with mentor
   - ✅ View team members
   - ✅ See project assignments

   **Audit Logs Tab:**
   - ✅ View activity timeline
   - ✅ See user actions
   - ✅ Check timestamps
   - ✅ Verify action types (CREATE, UPDATE, APPROVE, etc.)

---

### Student Testing

1. **Login as Student**
   - Email: `alice@example.com`
   - Password: `password123`

2. **Navigate to Internships**
   - URL: `http://localhost:5173/portal/student/internship`

3. **Test Each Tab:**

   **Available Tracks Tab:**
   - ✅ View active programs
   - ✅ See program details
   - ✅ Check eligibility requirements
   - ✅ Click "Apply Now"
   - ✅ Fill application form
   - ✅ Submit application

   **My Internship Tab:**
   - ✅ View team information (if assigned)
   - ✅ See mentor details
   - ✅ Check team members
   - ✅ View project milestones
   - ✅ See progress percentage
   - ✅ Check deadline status

   **Applications Tab:**
   - ✅ View submitted applications
   - ✅ Check application status
   - ✅ See approval/rejection feedback
   - ✅ View application dates

---

## 4️⃣ Test Real-time Notifications

### Setup
1. Open two browser windows side-by-side
2. Window 1: Admin logged in
3. Window 2: Student logged in

### Test Scenario 1: Application Approval
1. **Student**: Submit an application
2. **Admin**: Approve the application
3. **Student**: Should receive real-time notification (check browser console for Socket.IO events)

### Test Scenario 2: Team Assignment
1. **Admin**: Add student to a team
2. **Student**: Should receive team assignment notification

---

## 5️⃣ Verify Data Integrity

### Check Database
```bash
# Connect to MongoDB
mongosh

# Use your database
use your_database_name

# Check collections
db.internshipprograms.find().pretty()
db.internshipapplications.find().pretty()
db.internshipteams.find().pretty()
db.internshipactivitylogs.find().pretty()
```

### Verify Soft Deletes
1. Delete a program from admin panel
2. Check database: `isDeleted` should be `true`
3. Program should not appear in lists

---

## 6️⃣ Test Edge Cases

### Application Flow
- ✅ Apply to closed program (should fail)
- ✅ Apply twice to same program (should fail)
- ✅ Apply without required fields (should fail)

### Team Management
- ✅ Create team without mentor (should work)
- ✅ Add same user twice (should fail)
- ✅ Remove team member (should work)

### Access Control
- ✅ Student tries to access admin panel (should redirect)
- ✅ Student tries to view other team's data (should fail)
- ✅ Trainer can view assigned teams only

---

## 7️⃣ Performance Testing

### Load Test
1. Create 10+ programs
2. Submit 50+ applications
3. Create 20+ teams
4. Check page load times
5. Verify query performance

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot read properties of undefined"
**Solution:** Ensure seed script ran successfully and data exists

### Issue: GraphQL errors
**Solution:** Check authentication token in headers

### Issue: Components not loading
**Solution:** Clear browser cache and restart dev server

### Issue: Socket.IO not connecting
**Solution:** Check backend server is running and CORS is configured

---

## ✅ Success Criteria

- [ ] All GraphQL queries return data
- [ ] All mutations execute successfully
- [ ] Admin can manage programs, applications, and teams
- [ ] Students can browse, apply, and track progress
- [ ] Real-time notifications work
- [ ] Audit logs capture all actions
- [ ] Access control prevents unauthorized access
- [ ] UI is responsive and visually appealing
- [ ] No console errors in browser
- [ ] No errors in backend logs

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Backend:
- [ ] Seed script successful
- [ ] GraphQL queries working
- [ ] Mutations working
- [ ] Socket.IO connected
- [ ] Audit logs recording

Frontend - Admin:
- [ ] Programs tab functional
- [ ] Applications tab functional
- [ ] Teams tab functional
- [ ] Logs tab functional

Frontend - Student:
- [ ] Catalog tab functional
- [ ] Dashboard tab functional
- [ ] Applications tab functional

Issues Found:
1. ___________
2. ___________
3. ___________

Notes:
___________
```

---

## 🚀 Next Steps After Testing

1. **Production Deployment**
   - Set up environment variables
   - Configure production database
   - Enable SSL/TLS
   - Set up monitoring

2. **User Training**
   - Create admin guide
   - Create student guide
   - Record demo videos

3. **Monitoring**
   - Set up error tracking
   - Monitor performance
   - Track user engagement

---

**Happy Testing! 🎉**
