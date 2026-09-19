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

## 🚀 CI/CD Pipeline

- **GitHub Actions CI (`.github/workflows/ci.yml`):**
  - Triggered on every Pull Request and push to `main`.
  - Runs dependency install, unit tests (`vitest`), and TypeScript build check.
- **GitHub Actions Deploy (`.github/workflows/deploy.yml`):**
  - Builds production bundle and runs smoke verification.

---

## 🔐 Security & Privacy

- No database credentials or internal administrative secrets are exposed to the client.
- All submissions are authenticated against the backend schema and sanitized.
- Server-side rate limiting and CORS protection.
