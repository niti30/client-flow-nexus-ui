
# Client Flow Nexus UI

A comprehensive client management system with role-based access control, workflow management, and reporting functionalities.

## Project Overview

This application provides a robust platform for managing client relationships, workflows, and support services. It features:

- Role-based access for administrators, support engineers, and clients
- Comprehensive workflow management and tracking
- Reporting and analytics dashboards
- Client credential management
- Messaging and support ticket system
- Billing and subscription management

## Live Demo

You can access the deployed application at: [https://client-flow-nexus-ui.lovable.app/auth]

## Local Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd client-flow-nexus-ui
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

This project uses Supabase for backend functionality. You'll need to set up a local Supabase instance or connect to a remote one.

#### Option A: Using Supabase CLI (Recommended for Local Development)

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Start a local Supabase instance:
   ```bash
   supabase start
   ```

3. Run the database migration script:
   ```bash
   psql -h localhost -p 5432 -U postgres -d postgres -a -f setup/database.sql
   ```

#### Option B: Using Remote Supabase Instance

1. Create a new project at [Supabase](https://app.supabase.io/)
2. Run the SQL commands from the `Database Schema` section below in the Supabase SQL editor
3. Update the Supabase URL and anon key in `src/integrations/supabase/client.ts`

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Database Schema

Run the following SQL script to set up your database:

```sql
-- Create the clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  industry TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  client_id UUID REFERENCES public.clients(id),
  cost_rate NUMERIC,
  bill_rate NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the user_client_assignments table
CREATE TABLE public.user_client_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  client_id UUID REFERENCES public.clients(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the workflows table
CREATE TABLE public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id),
  description TEXT,
  department TEXT,
  status TEXT DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  nodes INTEGER DEFAULT 0,
  executions INTEGER DEFAULT 0,
  exceptions INTEGER DEFAULT 0,
  time_saved NUMERIC DEFAULT 0,
  cost_saved NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create the exceptions table
CREATE TABLE public.exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id),
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create the plans table
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  features JSONB,
  billing_cycle TEXT DEFAULT 'monthly',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id),
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id),
  amount NUMERIC NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paid_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin_insert_client function
CREATE OR REPLACE FUNCTION public.admin_insert_client(client_name text, client_status text DEFAULT 'active'::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  client_id uuid;
BEGIN
  -- This function runs with SECURITY DEFINER privileges (as the owner)
  -- which bypasses RLS policies
  INSERT INTO public.clients (name, status)
  VALUES (client_name, client_status)
  RETURNING id INTO client_id;
  
  RETURN client_id;
END;
$$;

-- Create get_dashboard_metrics function
CREATE OR REPLACE FUNCTION public.get_dashboard_metrics(time_period text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  start_date timestamp with time zone;
  result jsonb;
BEGIN
  -- Set the start date based on the time period
  CASE time_period
    WHEN '7d' THEN start_date := now() - interval '7 days';
    WHEN '30d' THEN start_date := now() - interval '30 days';
    WHEN 'mtd' THEN start_date := date_trunc('month', now());
    WHEN 'qtd' THEN start_date := date_trunc('quarter', now());
    WHEN 'ytd' THEN start_date := date_trunc('year', now());
    WHEN 'itd' THEN start_date := '1970-01-01'::timestamp; -- inception to date
    ELSE start_date := now() - interval '7 days'; -- default to 7 days
  END CASE;
  
  -- Gather metrics
  SELECT 
    jsonb_build_object(
      'totalWorkflows', (SELECT COUNT(*) FROM workflows WHERE created_at >= start_date),
      'totalExceptions', (SELECT COUNT(*) FROM exceptions WHERE created_at >= start_date),
      'timeSaved', 1284, -- placeholder for time saved in hours
      'revenue', 847000, -- placeholder for revenue in dollars
      'activeClients', (SELECT COUNT(*) FROM clients WHERE status = 'active' AND created_at >= start_date)
    ) INTO result;
  
  RETURN result;
END;
$$;

-- Seed data for testing (Optional)
-- Insert sample clients
INSERT INTO public.clients (id, name, status, industry, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Acme Corporation', 'active', 'Technology', now()),
  ('22222222-2222-2222-2222-222222222222', 'Wayne Enterprises', 'active', 'Manufacturing', now()),
  ('33333333-3333-3333-3333-333333333333', 'Stark Industries', 'active', 'Energy', now());

-- Insert sample users (passwords are 'password123' in a real app, but we're using Supabase Auth)
INSERT INTO public.users (id, email, first_name, last_name, role, client_id, created_at) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@example.com', 'Admin', 'User', 'admin', NULL, now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'se@example.com', 'Support', 'Engineer', 'se', NULL, now()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'client@example.com', 'Client', 'User', 'client', '11111111-1111-1111-1111-111111111111', now());

-- Insert sample workflows
INSERT INTO public.workflows (id, name, client_id, department, status, progress, nodes, executions, exceptions, time_saved, cost_saved, created_at) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Invoice Processing', '11111111-1111-1111-1111-111111111111', 'Accounting', 'active', 75, 12, 150, 3, 120, 12000, now()),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Customer Onboarding', '22222222-2222-2222-2222-222222222222', 'Sales', 'pending', 25, 8, 30, 1, 45, 5000, now()),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Vendor Management', '33333333-3333-3333-3333-333333333333', 'Procurement', 'active', 50, 15, 75, 2, 90, 9000, now());
```

### 5. Creating Test Users in Supabase

After setting up the database, you'll need to create test users in Supabase Auth:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Create users with the following credentials:

```
Admin User:
Email: admin@example.com
Password: password123
User Metadata: { "role": "admin" }

Support Engineer:
Email: se@example.com
Password: password123
User Metadata: { "role": "se" }

Client User:
Email: client@example.com
Password: password123
User Metadata: { "role": "client" }
```

## Test Credentials

Use these credentials to test different user roles:

| Role            | Email               | Password    |
|-----------------|---------------------|-------------|
| Administrator   | admin@example.com   | password123 |
| Support Engineer| se@example.com      | password123 |
| Client          | client@example.com  | password123 |

## Key Features by Role

### Administrator
- Manage all clients and users
- View and analyze all workflows
- Access billing and subscription information
- Handle exceptions across all clients

### Support Engineer
- Manage assigned clients
- Create and monitor workflows
- Provide support to clients
- Handle exceptions for assigned clients

### Client
- View own workflows and metrics
- Submit support requests
- Access billing information
- Manage credentials and users

## Deployment

The application is deployed using Lovable's built-in deployment feature. To deploy your own version:

1. Push your changes to GitHub
2. Connect your repository to Lovable
3. Click on "Share" → "Publish" in the Lovable interface

## Technologies Used

- React with TypeScript
- Vite for building
- Tailwind CSS for styling
- shadcn/ui for UI components
- Supabase for backend functionality
- TanStack Query for data fetching
- React Router for navigation
- Recharts for data visualization

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.
