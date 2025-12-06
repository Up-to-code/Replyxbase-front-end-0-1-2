# CRM Module Documentation

This directory contains the main application logic for the CRM Dashboard.

## Architecture

- **`page.tsx`**: Server Component. Fetches initial data (Bookings, Customers) based on URL `searchParams`.
- **`CRM.tsx`**: Main Client Component. Handles the UI state (Table, Kanban, Calendar) and synchronizes filters with the URL.
- **`bookings/[id]/page.tsx`**: Dedicated page for viewing Booking Details.

## State Management ("SSR Findele")
The CRM uses a "URL-first" state management approach.
1.  **Filters**: Changed by the user -> Updates URL `searchParams`.
2.  **Server**: Reads URL -> Fetches filtered data.
3.  **Client**: Receives fresh data as props.

## Components
- **`components/bookings`**: Booking Table and Details view.
- **`components/kanban`**: Drag-and-drop Kanban board having "Status" columns.
- **`components/calendar`**: Month/Week/Day calendar views.
- **`components/shared`**: Reusable UI like `StatsOverview`, `Filters`, and `ViewToggle`.

## Design System
- **Colors**: Uses `blue-500` (Primary) and `slate-200` (Borders). No generic Yellow.
- **Style**: "Blue Enterprise" theme. Flat, clean, `border-2`, no drop shadows.
