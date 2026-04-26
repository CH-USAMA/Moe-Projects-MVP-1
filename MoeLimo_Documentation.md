# Moe Limo Operations Hub - Product Documentation

## 1. System Overview
Moe Limo is a centralized operational support and ticket management platform designed for rapid deployment, speed, and maintainability. It aggregates customer communications from manual entry, Email, GoHighLevel, and SMS into a unified dashboard.

## 2. Technical Architecture
- **Framework:** Laravel 13
- **Frontend:** React with Inertia.js
- **Styling:** Tailwind CSS (with native Light/Dark mode support)
- **Database:** SQLite (default for MVP), MySQL compatible
- **Authentication:** Laravel Breeze (Session-based)

## 3. Core Features

### Dashboard (`/dashboard`)
Provides an at-a-glance view of system health.
- **Stat Cards:** Real-time metrics for Total, Open, Pending, Waiting, and Resolved tickets.
- **Recent Activity:** A quick-access feed featuring **SLA Highlighting** (pulsing alerts for overdue tickets).
- **Agent Performance:** Visual progress bars displaying resolution rates for each agent.

### Ticket Management (`/tickets`)
- **Inbox:** Searchable list with **Omnichannel Support** (Email, SMS, GHL, Manual).
- **SLA & Alerting:** Tickets automatically change color (Green, Orange, Red) and show "Time Open" based on custom policies.
- **Bulk Actions:** Select multiple tickets to mark as read/unread or delete in bulk.
- **Detail View:** Threaded conversation view supporting Public Replies and Internal Notes.

### Customer Management (`/customers`)
- **Profiles:** Premium profile views with engagement insights, ticket history, and tag management.
- **Management:** Full CRUD capabilities including single and **Bulk Delete** for list cleanup.
- **Sync:** Manually push customer data to GoHighLevel opportunities.

### Agent Management (`/agents`)
- **Team Management:** Full CRUD for system users. Admins can create, edit, and delete agents, update roles, and reset passwords.

## 4. Integrations & Settings

### Email Integration (`/settings/email`)
- **Purpose:** Ingest inbound emails as tickets via IMAP and send replies via SMTP.
- **Sync:** Runs automatically every minute via the Laravel Scheduler (`php artisan schedule:work`).

### GoHighLevel (GHL) Integration (`/settings/ghl`)
- **Inbound:** Configure a GHL workflow to send webhooks to `/webhooks/ghl`. Supports automatic ticket creation on `OpportunityCreate` and internal notes on `OpportunityStageUpdate`.
- **Outbound:** Sync tickets back to GHL opportunities directly from the UI.

### SMS Alerts & Inbound (`/settings/sms`)
- **Alerting:** Send urgent SMS notifications via Mobile Text Alerts API.
- **Inbound SMS:** Configure the `/webhooks/sms` endpoint in your Mobile Text Alerts dashboard. Replies from customers will automatically thread into their active tickets or create new ones.

### SLA Policy (`/settings/sla`)
- **Customization:** Define time thresholds (in hours) and choose highlight colors for three alert levels to ensure no customer response is missed.

### Automation Engine (`/settings/automations`)
- **Workflow:** An IF/THEN rules engine to automate assignment, prioritization, and alerting based on source, subject, or customer data.

## 5. Developer Guide

### Webhook Endpoints (CSRF Exempt)
- **Email:** `POST /webhooks/inbound-email`
- **GHL:** `POST /webhooks/ghl`
- **SMS:** `POST /webhooks/sms`

### Installation & Deployment
1. `composer install && npm install`
2. `php artisan migrate --seed` (Seed default admin: `admin@moelimo.com` / `password`)
3. `npm run build`
4. Set up a cron job for `php artisan schedule:run` to enable automated email fetching.
