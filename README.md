# Moe Limo Operations Hub

Moe Limo is a premium, omnichannel operations and ticket management platform designed for the modern limousine and transport industry. It centralizes communications from Email, GoHighLevel, and SMS into a single, high-performance dashboard.

![Moe Limo Dashboard](https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg) *Placeholder for actual UI screenshot*

## 🚀 Key Features

- **Omnichannel Inbox:** Unified view for Email (IMAP/SMTP), GoHighLevel Opportunities, and SMS (Mobile Text Alerts).
- **SLA & Alerting System:** Dynamic visual indicators (Green/Orange/Red) with custom time thresholds to ensure zero missed inquiries.
- **Smart Automations:** IF/THEN rules engine for auto-assignment, prioritization, and automated SMS/Email alerts.
- **Team Management:** Full RBAC (Role-Based Access Control) for Admins and Agents.
- **Customer CRM:** Deep customer profiles with engagement history, tag management, and manual GHL synchronization.
- **Premium UI:** Fully responsive React interface with native Light/Dark mode support.

## 🛠 Tech Stack

- **Backend:** Laravel 13 (PHP 8.3+)
- **Frontend:** React + Inertia.js
- **Styling:** Tailwind CSS v4
- **Database:** SQLite (default) / MySQL compatible
- **Integrations:** 
    - **Email:** Webklex IMAP / Laravel SMTP
    - **GHL:** Webhook-based Opportunity Sync
    - **SMS:** Mobile Text Alerts V3 API

## 🏁 Getting Started

### Prerequisites
- PHP 8.3+
- Composer
- Node.js & NPM
- SQLite (or MySQL)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/moe-limo-hub.git
   cd moe-limo-hub
   ```

2. **Install dependencies:**
   ```bash
   composer install
   npm install
   ```

3. **Configure Environment:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Setup:**
   ```bash
   php artisan migrate --seed
   ```
   *Default Admin: `admin@moelimo.com` / `password`*

5. **Build Assets:**
   ```bash
   npm run build
   ```

6. **Start the Application:**
   ```bash
   php artisan serve
   ```

## 📡 Webhook Configuration

To enable real-time inbound synchronization, configure the following endpoints in your external platforms:

- **GoHighLevel:** `POST /webhooks/ghl`
- **SMS (Mobile Text Alerts):** `POST /webhooks/sms`
- **Inbound Email:** `POST /webhooks/inbound-email`

## ⚙️ Background Tasks

To handle automated email fetching and SLA calculations, ensure the Laravel Scheduler is running:

```bash
# Local development
php artisan schedule:work

# Production (Cron)
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

## 📄 License
The Moe Limo Hub is proprietary software. Licensed under the MIT license.
