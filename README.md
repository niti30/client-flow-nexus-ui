
# Braintrust Nexus - Client Workflow Management Platform

## Project Overview

Braintrust Nexus is a comprehensive workflow management platform designed for managed service providers to track client automation workflows, exceptions, and ROI metrics. The platform supports role-based access with different views for administrators, support engineers, and clients.

## Features

- **Role-based access control**: Admin, Support Engineer, and Client portals
- **Client management**: Add, view, and manage client accounts
- **Workflow tracking**: Monitor automation workflow status, exceptions, and progress
- **ROI metrics**: Track time saved and cost savings from automation
- **Responsive design**: Works on desktop and mobile devices

## Live Demo

The application is deployed at: https://lovable.dev/projects/a2e768c5-2ddd-419b-aa90-63360d43e0dc

## Technology Stack

- **Frontend**: React with TypeScript, Vite
- **UI Components**: Tailwind CSS, shadcn/ui
- **State Management**: React Query
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Database Schema

The application uses the following tables in Supabase:

- **clients**: Stores client organization details
- **users**: Stores user information with role-based access
- **workflows**: Tracks automation workflows and their metrics
- **exceptions**: Records issues that occur during workflow executions
- **user_client_assignments**: Maps support engineers to clients they manage
- **plans & subscriptions**: Manages subscription plans and client subscriptions
- **invoices**: Tracks billing information

## Local Development Setup

### Prerequisites

- Node.js (v16 or later)
- npm (v7 or later)
- Supabase account

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd braintrust-nexus
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL commands from the `supabase/config.toml` file to set up the database schema
   - Update the Supabase URL and key in `src/integrations/supabase/client.ts`

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Authentication

### Test Credentials

For demo purposes, you can use the following credentials:

- **Client User**:
  - Email: client1@example-domain.com
  - Password: password123

### Signup Process

1. Navigate to the auth page (`/auth`)
2. Use the "Login as Client" option
3. Enter the test credentials above

## Features Implementation

### Client Workflows

- Workflows are stored in the database and associated with a specific client
- The workflow status toggle (active/inactive) is fully functional
- Data for nodes, executions, exceptions, time saved, and money saved is stored and displayed
- New workflows can be added through the "Add Workflow" button

## Deployment

The application is configured for easy deployment on platforms that support Node.js applications:

1. Build the production version:
   ```
   npm run build
   ```

2. The built files will be in the `dist` directory and can be deployed to any static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
