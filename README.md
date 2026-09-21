# 🏡 PropKart Connect

> **Instant Public Property Registration Application**  
> Public-facing, responsive property registration form app powered by the PropKart Dynamic Forms Architecture.

---

## 🌟 Overview

**PropKart Connect** allows property owners, brokers, and landlords to register their properties in a few simple, beautifully guided steps.
The entire form structure (sections, fields, placeholders, validations, photo limits, video limits, options) is **100% dynamic** and controlled directly from **PropKart Panel → Form Builder**.

```
PropKart Connect (Public App)
          │
          ▼  GET /api/v1/forms/active
Shared Backend API (Hostinger VPS)
          │
          ▼  Realtime PostgreSQL
PropKart Panel (Internal / Telecaller Portal)
```

---

## ✨ Features

- **100% Dynamic Form Engine:** Renders any field configured in PropKart Panel (Short text, Textarea, Name, Indian Mobile Number, Email, Currency, Area, Dropdown, Radio, Checkbox, Multi-select, Photos up to 50, Videos up to 30, Google Maps GPS Location, Directions, Remarks, Declaration Consent).
- **Stepped Form Wizard:** Smooth step-by-step navigation with progress indicators, completion checks, and responsive mobile-first UX.
- **Client & Server Parity Validation:** Strict validation rules enforced both client-side and server-side.
- **Automatic Draft Recovery:** In-progress forms are automatically saved to browser storage. If a user refreshes or navigates away accidentally, their draft is seamlessly restored.
- **Media Management:**
  - Up to 50 high-res property photos.
  - Up to 30 video walkthroughs.
  - Drag-and-drop, client-side thumbnail previews, and per-file upload indicators.
- **Location & Navigation:**
  - One-tap "Use My Location" via browser GPS.
  - Interactive Google Maps URL validation and test link button.
  - Landmark direction instructions.
- **Celebratory Success Experience:**
  - Registration ID badge (`PK-REG-2026-XXXXX`) with one-click copy.
  - Instant "Connect on WhatsApp" link with pre-filled message for verification.
  - Option to register another property.

---

## 🛠️ Local Development

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup
```bash
# 1. Clone repository
git clone https://github.com/propkartnbpropertytech-blip/Propkart_Connect.git
cd Propkart_Connect

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Start local development server
npm run dev
```

### Testing
```bash
# Run unit tests
npm test
```

### Production Build
```bash
# Build production bundle
npm run build

# Preview build locally
npm run preview
```

---

## 🚀 CI/CD Pipeline & Automated Deployment (v1.0.0)

Every push to `main` triggers automated build and deployment to the Hostinger VPS via GitHub Actions:

- **Workflow:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
- **Production URL:** `https://propconnect.nbpropertytech.com`
- **Zero-Touch Isolation Policy:** The deployment workflow strictly targets `/root/propconnect-stack/connect-dist` and restarts only the `propconnect-web` container (`docker restart propconnect-web`). It has zero interaction with any other container on the VPS (`traefik`, `propkart-backend`, `supabase-db`, etc.).

### Required GitHub Repository Secrets

Configure the following secrets in **Repository Settings → Secrets and variables → Actions**:

| Secret Name | Description | Example / Recommended Value |
|---|---|---|
| `VPS_HOST` | Hostinger VPS Public IP Address | `200.234.36.120` |
| `VPS_USERNAME` | SSH User | `root` |
| `VPS_SSH_KEY` | Dedicated OpenSSH ed25519 Deployment Private Key | Key generated on VPS (`/root/.ssh/github_actions_deploy_key`) |
| `VPS_SSH_PASSWORD` | Fallback SSH password (if key is not provided) | VPS password |
| `VPS_PORT` | SSH Port (default: `22`) | `22` |

---

## 🔐 Z+ Security & Privacy Hardening

- **Zero Secret Credentials in Git:** All API URLs use relative paths (`/api/v1`), `.env` files are ignored, and zero tokens or passwords exist in the codebase.
- **Ephemeral Session Storage:** In-progress form drafts are stored in `sessionStorage` (purged on tab close) to prevent privacy leaks on shared devices.
- **Reverse Proxy Architecture:** Nginx acts as reverse proxy on port 80, terminating SSL via Traefik and proxying `/api/v1/` to the backend.
- **Strict Headers:** Enforces `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`.

