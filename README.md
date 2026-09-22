# 🏡 PropKart Connect

> **Dynamic Public Property Registration & Showcase Application**  
> Responsive web application enabling property owners, brokers, and landlords to list properties with real-time validation, rich media uploads, and dynamic schema rendering powered by PropKart Panel.

---

## 🌟 Overview

**PropKart Connect** is the public gateway of the PropKart ecosystem. Unlike rigid real estate forms, PropKart Connect's forms are **100% dynamic**—all form sections, fields, input constraints, and media limits are centrally configured and published from **PropKart Panel**.

The application also serves as the public **Property Showcase**, providing prospective buyers and tenants with verified property listings, interactive photo galleries, and location details via shareable links.

```
┌─────────────────────────────────────────────────────────┐
│              PropKart Connect (Public Web)              │
│  • Stepped Dynamic Wizard    • Media Drag-and-Drop      │
│  • Public Property Showcase  • Auto Draft Recovery      │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼ HTTPS
┌─────────────────────────────────────────────────────────┐
│                 Shared Backend API                      │
│        Node.js / Express • PostgreSQL Database          │
└──────────────────────────▲──────────────────────────────┘
                           │
                           ▼ WSS / HTTPS
┌─────────────────────────────────────────────────────────┐
│              PropKart Panel (Admin / Ops)               │
│  • Dynamic Form Builder      • Submission Operations    │
│  • Telecaller Desk           • 3-Way Sharing Hub        │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 📝 Dynamic Form Wizard
- **Centrally Governed Schema:** Sections, fields, labels, placeholders, and validation rules update instantly whenever published in PropKart Panel.
- **Stepped Guided Experience:** Multi-step wizard layout with interactive progress tracking, section validation, and mobile ergonomics.
- **Smart Validation Engine:**
  - Standardized 10-digit Indian phone verification (`+91`).
  - Expected rent/price threshold sanity checks.
  - Required field indicators and real-time error messaging.
- **Seamless Draft Recovery:** In-flight entries are saved to browser session storage, allowing users to safely recover their input upon accidental refresh or navigation.

### 📸 High-Resolution Media Upload
- **Photo Gallery:** Supports high-resolution property imagery (up to 50 photos) with drag-and-drop support, thumbnail previews, and individual removal.
- **Video Walkthroughs:** Allows video uploads (up to 30 clips) with file size validation and preview indicators.

### 📍 Location & Landmark Assistance
- **Geolocation:** One-tap GPS coordinate capture via browser Location API.
- **Navigation Links:** Support for direct Google Maps links and landmark navigation instructions for prospective visitors.

### 🔍 Public Property Showcase (`/?view=<id>`)
- **Direct Link Sharing:** Displays verified property submissions in an elegant, customer-ready presentation.
- **Dynamic Field Rendering:** Only presents active and populated fields, automatically omitting unused or removed schema fields.
- **Image Carousel & Lightbox:** Interactive, high-resolution image viewer with thumbnail selection.
- **Call-to-Action:** Built-in contact and inquiry options for prospective buyers or tenants.

---

## 🔐 Security & Privacy

- **Zero Hardcoded Credentials:** No tokens, API keys, or raw IP addresses are committed to source control.
- **Session Protection:** Draft form data resides in temporary `sessionStorage` and is purged upon session completion or window closure.
- **Reverse Proxy Architecture:** Production traffic is served via Nginx behind Traefik SSL termination.
- **Security Headers:** Hardened against clickjacking and MIME-type sniffing via `X-Frame-Options`, `X-Content-Type-Options`, and strict referrer policies.

---

## 💻 Tech Stack

- **Framework:** React 18 with TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS, PostCSS
- **Icons:** Lucide React
- **HTTP Client:** Axios

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** `>= 18.0.0`
- **npm:** `>= 9.0.0`

### Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/propkartnbpropertytech-blip/Propkart_Connect.git
cd Propkart_Connect

# 2. Install dependencies
npm install

# 3. Create local environment configuration
cp .env.example .env

# 4. Start the development server
npm run dev
```

The application will run locally at `http://localhost:5173` (or the port shown in your terminal).

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local development server with Hot Module Replacement |
| `npm run build` | Compiles optimized production bundle in `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm test` | Executes unit tests |

---

## 🌐 CI/CD & Production Deployment

Continuous deployment is managed via GitHub Actions. Pushes to `main` trigger automated linting, test suites, production bundling, and deployment to the production server.

- **Workflow File:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
- **Production URL:** `https://propconnect.nbpropertytech.com`

### Configuring GitHub Secrets

Configure the following secrets in your repository settings under **Settings → Secrets and variables → Actions**:

| Secret Name | Description | Example / Format |
|---|---|---|
| `VPS_HOST` | Production server IP or hostname | `<your-server-ip>` |
| `VPS_USERNAME` | SSH deployment user | `root` or `deploy-user` |
| `VPS_SSH_KEY` | Dedicated OpenSSH Private Key (recommended) | `-----BEGIN OPENSSH PRIVATE KEY----- ...` |
| `VPS_SSH_PASSWORD` | Fallback SSH password (if key is omitted) | `<your-ssh-password>` |
| `VPS_PORT` | SSH daemon port (default: `22`) | `22` |

> 🔒 **Security Notice:** Never commit server credentials, IP addresses, or secrets to the Git repository. Always supply them through GitHub Actions Secrets or host environment files.

---

## 📄 License

Proprietary software. All rights reserved by **NB Property Technology**.
