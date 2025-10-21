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
✅ Basic routing functional (home, login, signup)
⚠️ Some pages still need react-router-dom → wouter migration (Dashboard, Editor, Responses, FormView, NotFound)

## Known Issues
1. **Routing Library Conflict**: Some pages (Dashboard, Editor, Responses, FormView, NotFound) still use `react-router-dom` hooks (`useNavigate`, `useParams`) instead of wouter equivalents. This causes React errors when navigating to these pages.
2. **react-router-dom dependency**: Should be uninstalled once all pages are fully migrated to wouter.

## Next Steps for Completion
1. Update remaining pages to use wouter hooks:
   - Replace `useNavigate()` with `const [, setLocation] = useLocation()`
   - Replace `navigate(path)` calls with `setLocation(path)`
   - Replace `useParams()` from react-router-dom with `useParams()` from wouter
   - Update `Link` imports from react-router-dom to wouter
2. Remove react-router-dom dependency
3. Test all navigation flows
4. Verify form creation and response collection

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
