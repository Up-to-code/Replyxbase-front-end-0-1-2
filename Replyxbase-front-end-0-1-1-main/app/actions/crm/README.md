# CRM Server Actions

This directory contains Server Actions for the CRM module, split by domain entity.

## Structure

- **`bookings.ts`**: Handles CRUD operations for Bookings (get, create, update, delete).
- **`customers.ts`**: Handles Customer creation and retrieval (Leads & Clients).
- **`activities.ts`**: Handles logging activities (notes, calls, emails) for bookings and customers.
- **`utils.ts`**: Shared utilities, primarily for fetching the current Organization ID securely.

## Usage

All actions are marked with `'use server'` and can be imported directly into Client Components or Server Components.

```typescript
import { createBooking } from '@/app/actions/crm/bookings';

// ... inside a component or form action
await createBooking(formData);
```

## Security
- All actions verify authentication via `getSession` or `getOrganizationId`.
- Data access is scoped strictly to the user's Organization.
