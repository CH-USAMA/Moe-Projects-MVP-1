# Moe Limo - Persistent AI Memory

This document serves as the "AI Memory" for the Moe Limo project. When starting a new session or prompting the AI, reference this document to quickly regain full context of the application architecture, stack, and current state.

## Project Overview
**Name:** Moe Limo Operations Hub
**Purpose:** A centralized operational support and ticket management platform for a limousine service.
**Goal:** MVP speed, simplicity, maintainability, and future scalability.

## Tech Stack
- **Backend:** Laravel 13 (PHP 8.3)
- **Frontend:** React + Inertia.js
- **Styling:** Tailwind CSS (v4 via Vite) - Includes full Light/Dark mode support.
- **Database:** SQLite (for MVP speed), easily switchable to MySQL.

## Architecture & Core Components
### 1. Database Schema
- **Users:** System users (Admins, Agents) with a `role` column. Supports full CRUD.
- **Customers:** End-users creating tickets. Fields: `name`, `email`, `phone`, `tags` (JSON), `external_ids` (JSON). Supports full CRUD and bulk deletion.
- **Tickets:** Core entity. Fields: `subject`, `status`, `priority`, `source`, `assigned_to`, `last_message_at`.
- **TicketMessages:** Threaded replies. Polymorphic sender (`sender_type`, `sender_id`). Supports `type` ('message' or 'note').
- **Settings:** Dynamic, encrypted key-value store for API keys and config.
- **SLA Policy:** Stored in Settings. Defines 3 levels of time-based alert thresholds and colors.

### 2. Backend Services
- **SettingsService:** Manages encrypted database-backed settings.
- **TicketService:** Handles lifecycle, threads, and automated routing.
- **AutomationEngine:** Evaluates rules (e.g., "IF source is GHL THEN alert via SMS").
- **GHLService:** Bi-directional sync. Handles Opportunity Create/Update webhooks and pushes tickets to GHL.
- **SMSService:** Sends alerts via Mobile Text Alerts. Handles inbound `message-reply` webhooks to create/update tickets.

### 3. Frontend Structure
- **Layout:** `AuthenticatedLayout.jsx` with Sidebar navigation and **Live Sync** (auto-refreshing every 30s).
- **Tickets:** `/tickets` with complex filtering, threaded views, bulk actions, and **SLA Highlighting** (pulsing alerts for overdue tickets).
- **Customers:** `/customers` with premium profile views, engagement insights, and GHL sync status.
- **Settings:** Modular views for Email, GHL, SMS, SLA Policy, and Automations.

## Current State & Next Steps
- **MVP Status:** COMPLETED & HARDENED.
- **Recent Additions:** 
  - Full Agent & Customer CRUD.
  - Multi-source Inbound (Email, GHL Opportunity, SMS).
  - SLA & Alerting system with custom thresholds/colors.
- **Next Potential Epics:**
  - Native Web Push Notifications (VAPID) - INTEGRATED.
  - Advanced reporting and analytics.
  - S3 Storage integration for attachments.
  - Real-time WebSockets (Pusher/Reverb).

  
## Rules for AI Interaction
- Do not over-engineer.
- Keep components focused and reusable.
- Ensure all new features support the `dark:` Tailwind variant natively.
- **Always update this `project_memory.md` file whenever a major architectural change or new feature is implemented.**
