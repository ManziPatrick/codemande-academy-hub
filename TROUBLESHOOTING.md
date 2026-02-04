# 🔧 Troubleshooting Guide - CODEMANDE Internship Module

## Common Issues & Solutions

### ❌ Issue 1: Apollo Client Import Error

**Error Message:**
```
The requested module '/node_modules/.vite/deps/@apollo_client.js?v=575585a5' 
does not provide an export named 'useMutation'
```

**Cause:** Vite's dependency cache is outdated or corrupted.

**Solution:**
```bash
# Navigate to frontend directory
cd frontend

# Remove Vite cache
Remove-Item -Recurse -Force node_modules\.vite

# Restart dev server (it will auto-restart if running)
# Or manually restart:
npm run dev
```

**Prevention:**
- Clear cache after major dependency updates
- Use `npm run dev -- --force` to force rebuild

---

### ❌ Issue 2: GraphQL Query/Mutation Not Found

**Error Message:**
```
Cannot find name 'GET_INTERNSHIP_PROGRAMS'
```

**Solution:**
1. Check import path:
   ```typescript
   import { GET_INTERNSHIP_PROGRAMS } from "@/lib/graphql/queries";
   ```

2. Verify query exists in `frontend/src/lib/graphql/queries.ts`

3. Check for typos in query name

---

### ❌ Issue 3: Component Not Rendering

**Symptoms:**
- Blank page
- Console errors about undefined components

**Solution:**
1. Check routing in `AnimatedRoutes.tsx`:
   ```typescript
   import StudentInternships from "@/pages/portal/student/StudentInternships";
   ```

2. Verify component export:
   ```typescript
   export default function StudentInternships() { ... }
   ```

3. Check for missing dependencies in component

---

### ❌ Issue 4: Backend Connection Failed

**Error Message:**
```
Network error: Failed to fetch
```

**Solution:**
1. Verify backend is running:
   ```bash
   cd backend
   npm run dev
   ```

2. Check Apollo Client URI in `frontend/src/lib/apolloClient.ts`:
   ```typescript
   uri: 'http://localhost:4000/graphql'
   ```

3. Verify MongoDB is running:
   ```bash
   mongosh
   ```

---

### ❌ Issue 5: Authentication Errors

**Error Message:**
```
Not authenticated
Unauthorized
```

**Solution:**
1. Check if user is logged in
2. Verify token in localStorage:
   ```javascript
   localStorage.getItem('codemande_token')
   ```

3. Check token expiration
4. Re-login if needed

---

### ❌ Issue 6: Data Not Loading

**Symptoms:**
- Empty lists
- "Loading..." stuck
- No data in GraphQL response

**Solution:**
1. **Run seed script:**
   ```bash
   cd backend
   npm run seed:internship
   ```

2. **Check database:**
   ```bash
   mongosh
   use your_database_name
   db.internshipprograms.find().pretty()
   ```

3. **Verify GraphQL query:**
   - Open `http://localhost:4000/graphql`
   - Test query manually

---

### ❌ Issue 7: TypeScript Errors

**Error Message:**
```
Property 'internshipPrograms' does not exist on type
```

**Solution:**
1. Add type definitions:
   ```typescript
   const programs = data?.internshipPrograms || [];
   ```

2. Use `any` type temporarily:
   ```typescript
   const programs = (data as any)?.internshipPrograms || [];
   ```

3. Create proper TypeScript interfaces (recommended)

---

### ❌ Issue 8: Styling Not Applied

**Symptoms:**
- Components look unstyled
- Tailwind classes not working

**Solution:**
1. Verify Tailwind is installed:
   ```bash
   npm list tailwindcss
   ```

2. Check `tailwind.config.js` includes component paths

3. Restart dev server

4. Clear browser cache

---

### ❌ Issue 9: Socket.IO Not Connecting

**Error Message:**
```
WebSocket connection failed
```

**Solution:**
1. Verify Socket.IO is initialized in `backend/src/index.ts`:
   ```typescript
   import { initNotificationService } from './services/notification.service';
   initNotificationService(io);
   ```

2. Check CORS settings allow WebSocket

3. Verify port is not blocked by firewall

---

### ❌ Issue 10: Build Errors

**Error Message:**
```
Build failed with X errors
```

**Solution:**
1. **Clear all caches:**
   ```bash
   # Frontend
   cd frontend
   Remove-Item -Recurse -Force node_modules\.vite
   Remove-Item -Recurse -Force dist

   # Backend
   cd ../backend
   Remove-Item -Recurse -Force dist
   ```

2. **Reinstall dependencies:**
   ```bash
   npm install
   ```

3. **Check for missing imports**

4. **Verify all files are saved**

---

## 🔍 Debugging Checklist

### Before Asking for Help:

- [ ] Backend server is running (`npm run dev` in backend)
- [ ] Frontend server is running (`npm run dev` in frontend)
- [ ] MongoDB is running and connected
- [ ] Database is seeded with test data
- [ ] Vite cache is cleared
- [ ] Browser cache is cleared
- [ ] User is logged in with correct role
- [ ] No console errors in browser
- [ ] No errors in backend terminal
- [ ] GraphQL Playground works (`http://localhost:4000/graphql`)
- [ ] Correct Node.js version (v16+)
- [ ] All dependencies installed (`npm install`)

---

## 🛠️ Development Tools

### Useful Commands

**Frontend:**
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear cache and restart
Remove-Item -Recurse -Force node_modules\.vite; npm run dev
```

**Backend:**
```bash
# Start dev server
npm run dev

# Seed database
npm run seed

# Seed internship data
npm run seed:internship

# Build TypeScript
npm run build

# Run production
npm start
```

**Database:**
```bash
# Connect to MongoDB
mongosh

# Show databases
show dbs

# Use database
use codemande_academy

# Show collections
show collections

# Query data
db.internshipprograms.find().pretty()
db.internshipapplications.find().pretty()
db.internshipteams.find().pretty()

# Clear collection
db.internshipprograms.deleteMany({})
```

---

## 📊 Monitoring & Logging

### Check Backend Logs
```bash
# In backend terminal, look for:
✓ MongoDB Connected: localhost
✓ Server running on port 4000
✓ GraphQL endpoint: http://localhost:4000/graphql
```

### Check Frontend Logs
```bash
# In frontend terminal, look for:
✓ VITE v5.x.x ready in XXX ms
✓ Local: http://localhost:5173/
✓ Network: use --host to expose
```

### Browser Console
```javascript
// Check Apollo Client state
window.__APOLLO_CLIENT__

// Check authentication
localStorage.getItem('codemande_token')

// Check user data
localStorage.getItem('codemande_user')
```

---

## 🚨 Emergency Reset

If everything is broken and you need to start fresh:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clear all caches and builds
cd frontend
Remove-Item -Recurse -Force node_modules\.vite
Remove-Item -Recurse -Force dist

cd ../backend
Remove-Item -Recurse -Force dist

# 3. Reinstall dependencies
cd frontend
npm install

cd ../backend
npm install

# 4. Reset database
mongosh
use codemande_academy
db.dropDatabase()
exit

# 5. Reseed database
cd backend
npm run seed
npm run seed:internship

# 6. Restart servers
# Terminal 1:
cd backend
npm run dev

# Terminal 2:
cd frontend
npm run dev

# 7. Clear browser cache and reload
```

---

## 📞 Getting Help

### Information to Provide:

1. **Error message** (full text)
2. **Console logs** (browser & terminal)
3. **Steps to reproduce**
4. **What you've tried**
5. **Environment info:**
   - Node.js version: `node --version`
   - npm version: `npm --version`
   - OS: Windows/Mac/Linux

### Useful Screenshots:

- Browser console (F12)
- Network tab (F12 → Network)
- Backend terminal output
- Frontend terminal output
- GraphQL Playground error

---

## ✅ Health Check Script

Run this to verify everything is working:

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check MongoDB
mongosh --eval "db.version()"

# Check backend dependencies
cd backend
npm list @apollo/server mongoose

# Check frontend dependencies
cd ../frontend
npm list @apollo/client react react-dom

# Test GraphQL endpoint
curl http://localhost:4000/graphql

# Test frontend
curl http://localhost:5173
```

---

**Last Updated:** 2026-02-04
**Version:** 1.0.0
