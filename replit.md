# ChatFlow - Form Builder Application

## Project Overview
ChatFlow is a form builder application migrated from Lovable to Replit's fullstack template. It allows users to create, manage, and share forms with an intuitive interface.

## Recent Changes - Lovable to Replit Migration (October 21, 2025)

### Migration Summary
Successfully migrated the application from Lovable's single-page architecture to Replit's fullstack client/server architecture.

### Key Changes Made:
1. **Project Structure**:
   - Reorganized from flat structure to client/server separation
   - Created `client/` directory for frontend code
   - Created `server/` directory for backend code
   - Created `shared/` directory for shared types and schemas

2. **Backend Setup**:
   - Created Express server (`server/index.ts`)
   - Implemented storage interface with in-memory storage (`server/storage.ts`)
   - Created API routes for auth, forms, and responses (`server/routes.ts`)
   - Configured Vite middleware integration (`server/vite.ts`)

3. **Frontend Routing**:
   - Migrated from `react-router-dom` to `wouter` (Replit standard)
   - Updated App.tsx to use wouter's `Route` and `Switch`
   - Partially migrated page components (Index, Login, Signup completed)

4. **Configuration Updates**:
   - Updated vite.config.ts with correct path aliases
   - Modified tsconfig files for new structure
   - Updated package.json scripts for `npm run dev` with tsx watch
   - Moved index.html to root directory

5. **Dependencies**:
   - Installed: express, drizzle-orm, drizzle-zod, postgres, tsx, wouter
   - Existing: React, Vite, shadcn/ui, TanStack Query, Tailwind CSS

## Current Status
✅ Server running successfully on port 5000
✅ Vite development server connected
✅ ALL routing migrated from react-router-dom to wouter
✅ Application loads and runs without errors
✅ Basic structure follows Replit fullstack template
⚠️ Frontend still uses mock data (useMockForms hook)
⚠️ Backend schema needs to be expanded to match frontend requirements

## Known Issues
1. **Frontend-Backend Integration Incomplete**: 
   - Frontend pages use `useMockForms` hook for all data operations instead of calling the Express API
   - Backend schema in `shared/schema.ts` is missing fields required by the frontend:
     - Form model missing: `status`, `responses[]`, `customization`, field `options[]`
     - Response model structure needs alignment with frontend expectations
   - TanStack Query not yet wired to backend routes
   
2. **Data Model Mismatch**:
   - Current schema is minimal (id, userId, title, description, fields, createdAt)
   - Frontend expects richer data (status, customization, nested responses, etc.)
   - Need to expand schema and implement real API calls

## Next Steps for Full Integration
1. **Expand Backend Schema** (`shared/schema.ts`):
   - Add `status` field to forms table (draft, published)
   - Add `customization` JSONB field for theme, chat settings, downloadable files
   - Add proper responses relationship with all required fields
   - Add `options` array to form fields for choice fields
   
2. **Implement Real API Calls**:
   - Replace `useMockForms` hook with TanStack Query hooks
   - Create API endpoints for all CRUD operations
   - Wire up frontend to call Express routes instead of mock data
   
3. **Test End-to-End**:
   - Verify form creation persists to backend
   - Test form editing and publishing
   - Validate response collection works
   - Ensure all navigation flows work with real data

## Development Workflow
- **Start dev server**: `npm run dev` (already configured in workflow)
- **Build for production**: `npm run build`
- **Start production**: `npm run start`

## Architecture
- **Frontend**: React with Vite, wouter for routing, shadcn/ui components
- **Backend**: Express server with in-memory storage
- **Shared**: Zod schemas for type safety between client/server
- **Deployment**: Configured for Replit autoscale deployment

## User Preferences
- Portuguese language interface
- Clean, modern gradient-based UI design
- Form builder with drag-and-drop (future enhancement)

## Project Structure
```
/
├── client/           # Frontend application
│   ├── public/       # Static assets
│   └── src/
│       ├── components/  # UI components
│       ├── hooks/       # React hooks
│       ├── lib/         # Utilities
│       └── pages/       # Page components
├── server/           # Backend application
│   ├── index.ts      # Express server entry
│   ├── routes.ts     # API routes
│   ├── storage.ts    # Data storage interface
│   └── vite.ts       # Vite middleware
├── shared/           # Shared types and schemas
│   └── schema.ts     # Drizzle/Zod schemas
└── index.html        # Entry HTML file
```
