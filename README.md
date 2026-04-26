# Moe Limo Operations Hub

Moe Limo is a premium, omnichannel operations and ticket management platform designed for the modern limousine and transport industry. It centralizes communications from Email, GoHighLevel, and SMS into a single, high-performance dashboard.

## 🚀 Key Features

- **Omnichannel Inbox:** Unified view for Email (IMAP/SMTP), GoHighLevel Opportunities, and SMS (Mobile Text Alerts).
- **Gmail-Style Categorization:** Organize your inbox with **Important**, **Primary**, and **Casual** tabs based on customer profiles.
- **Visual Analytics:** Premium dashboard with custom SVG charts for Service Distribution and Status Breakdowns.
- **SLA & Alerting System:** Dynamic visual indicators (Green/Orange/Red) with custom time thresholds to ensure zero missed inquiries.
- **Smart Automations:** IF/THEN rules engine for auto-assignment, prioritization, and automated SMS/Email alerts.
- **Audit Logging:** Comprehensive tracking of all user activity (Ticket creation, replies, deletions, and customer updates).
- **PWA & Mobile Ready:** Install as a native app on iOS/Android with push notifications and a fully responsive interface.

## 📱 Mobile & PWA Installation

The platform is 100% mobile responsive and designed as a **Progressive Web App (PWA)**.

1. **iOS:** Open in Safari, tap the 'Share' icon, and select **'Add to Home Screen'**.
2. **Android:** Open in Chrome, tap the three dots, and select **'Install App'**.
3. **Desktop:** Click the install icon in the address bar to run as a standalone desktop app.

## 🏁 Getting Started

### Prerequisites
- PHP 8.3+
- Composer
- Node.js & NPM
- SQLite (or MySQL)

### Installation

1. **Clone and Install:**
   ```bash
   git clone <repo-url>
   composer install && npm install
   ```

2. **Environment & Database:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   php artisan migrate --seed
   ```

3. **Build & Run:**
   ```bash
   npm run build
   php artisan serve
   ```

### 🔐 Default Credentials

- **Superadmin:** `superadmin@moelimo.com` / `moelimo2026`
- **Standard Admin:** `admin@moelimo.com` / `password`

## 📡 Webhook Configuration

- **GoHighLevel:** `POST /webhooks/ghl`
- **SMS:** `POST /webhooks/sms` (Use the "Register Webhook" button in SMS settings to auto-configure).
- **Email:** `POST /webhooks/inbound-email`

## ⚙️ Background Tasks

Ensure the Laravel Scheduler is running to handle Live Sync and SLA monitoring:

```bash
php artisan schedule:work
```

## 📄 License
The Moe Limo Hub is proprietary software. Licensed under the MIT license.

