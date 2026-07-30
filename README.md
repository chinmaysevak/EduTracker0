# 🎓 EduTrack — Smart Student Dashboard

A modern, full-stack student management PWA built with **React 19**, **TypeScript**, **Tailwind CSS**, and an **Express + MongoDB** backend. EduTrack helps students organize their academic life with AI-powered assistance, attendance tracking, study materials, task planning, and progress monitoring — all wrapped in a sleek glassmorphic UI.

---

## ✨ Features

### 📊 Dashboard
- Weekly schedule overview with visual timetable calendar
- Real-time clock and date display
- Quick-access cards to all modules
- Daily motivational quotes

### 📚 Attendance Management
- Track attendance across multiple subjects
- Visual attendance statistics and analytics
- Subject-wise attendance reports with monthly trends
- Smart notifications for low attendance warnings

### 📁 Study Materials
- Organize study materials by subject
- Support for various file types
- Quick search and filtering
- Material categorization and tagging

### 🎓 Learning Hub
- YouTube playlist integration for educational content
- Subject-specific learning resource management
- Progress tracking across learning resources

### 📅 Planner & Tasks
- Drag-and-drop task management (powered by `@dnd-kit`)
- Priority-based organization (High / Medium / Low)
- Deadline tracking with status management (Pending → In Progress → Completed)
- Task completion analytics

### 📈 Progress Tracking
- Interactive charts via **Recharts** (line, bar, and area charts)
- Subject-wise performance metrics
- Goal setting and achievement tracking
- Achievement badges and milestones

### 🤖 AI-Powered Assistance
- Integrated **Google Gemini AI** for intelligent study help
- AI-powered content generation and summarization
- Markdown-rendered AI responses via `react-markdown`

### 🔐 Authentication
- **Google Sign-In** via Google Identity Services
- JWT-based session management
- Email OTP verification via **Nodemailer**
- Secure password hashing with **bcryptjs**

### ⚙️ Settings & Data
- Full data import/export (JSON backup & restore)
- Theme customization (Light / Dark mode with system preference detection)
- Profile management
- Data clear with confirmation safeguards

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **TypeScript 5.9** | Type safety |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS 3** | Utility-first styling |
| **shadcn/ui + Radix UI** | Accessible component primitives |
| **Framer Motion** | Smooth animations & transitions |
| **Recharts** | Data visualization & charts |
| **Lucide React** | Icon library |
| **React Router DOM 7** | Client-side routing |
| **React Hook Form + Zod** | Form handling & validation |
| **@dnd-kit** | Drag-and-drop interactions |
| **date-fns** | Date utility library |
| **Sonner** | Toast notifications |
| **next-themes** | Theme switching (Light/Dark) |
| **cmdk** | Command palette |
| **IndexedDB (idb)** | Client-side structured storage |
| **fflate** | Compression for data export |

### Backend
| Technology | Purpose |
|---|---|
| **Express 5** | REST API server |
| **MongoDB + Mongoose 9** | Database & ODM |
| **JWT (jsonwebtoken)** | Session authentication |
| **bcryptjs** | Password hashing |
| **Nodemailer** | Email OTP delivery |
| **Google Auth Library** | Google OAuth verification |
| **dotenv** | Environment variable management |
| **CORS** | Cross-origin request handling |

### PWA & Deployment
| Technology | Purpose |
|---|---|
| **vite-plugin-pwa** | Progressive Web App support |
| **Service Worker** | Offline caching & background sync |
| **Vercel** | Frontend deployment (with rewrites & caching headers) |
| **Netlify** | Alternative deployment target |

---

## 📱 Responsive Design

EduTrack is fully responsive and optimized across devices:

- **Desktop**: 1920px and above
- **Tablet**: 768px – 1024px
- **Mobile**: 320px – 768px (with safe-area inset support)
- **Custom breakpoint**: `xs` at 475px for small mobile devices
- Fluid typography and spacing using CSS `clamp()` functions

---

## 🎨 UI / UX Design

- **Glassmorphic Design** — Backdrop blur, glass shadows, and translucent surfaces
- **Fluid Type Scale** — Responsive typography from 320px to 2560px viewports
- **Dark-First Theme** — Deep `#0a0a0f` background with emerald/blue/amber/violet glow accents
- **Smooth Animations** — Powered by Framer Motion with accordion, pulse-glow, and caret-blink keyframes
- **Collapsible Sidebar** — Space-efficient navigation layout
- **Custom Fonts** — Inter (display) + Geist Mono (data/monospace)
- **Custom Scrollbars** — Hidden scrollbars with hover effects

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** (or yarn/pnpm)
- **MongoDB** instance (local or Atlas)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chinmaysevak/EduTracker0.git
   cd EduTracker0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root (and/or `server/.env`) with:
   ```env
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # JWT
   JWT_SECRET=your_jwt_secret

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id

   # Nodemailer (Email OTP)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Google Gemini AI
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start development servers**

   Run both frontend and backend concurrently:
   ```bash
   npm run dev:full
   ```

   Or run them separately:
   ```bash
   # Frontend only (http://localhost:5173)
   npm run dev

   # Backend only (http://localhost:5000)
   npm run server
   ```

5. **Open in browser**

   Navigate to `http://localhost:5173`

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server (frontend) |
| `npm run server` | Start Express server (backend) |
| `npm run dev:full` | Run frontend + backend concurrently |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📁 Project Structure

```
EduTracker0/
├── public/                  # Static assets (favicon, logo, manifest)
├── server/                  # Express backend
│   └── index.js             # Server entry point
├── src/
│   ├── components/          # Reusable UI components (shadcn/ui based)
│   ├── sections/            # Main app sections
│   │   ├── Dashboard.tsx
│   │   ├── Attendance.tsx
│   │   ├── Materials.tsx
│   │   ├── LearningHub.tsx
│   │   ├── Planner.tsx
│   │   ├── Progress.tsx
│   │   └── Settings.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useData.ts
│   │   ├── useImportExport.ts
│   │   └── useLocalStorage.ts
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles & CSS variables
├── index.html               # HTML entry point with PWA meta
├── vite.config.ts           # Vite + PWA plugin configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript config
├── vercel.json              # Vercel deployment config
├── netlify.toml             # Netlify deployment config
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

---

## 💾 Data Storage

EduTrack uses a hybrid storage approach:

**Client-side (localStorage + IndexedDB):**

| Key | Data |
|---|---|
| `edu-tracker-subjects` | Subject information |
| `edu-tracker-attendance-v2` | Attendance records |
| `edu-tracker-materials` | Study materials |
| `edu-tracker-playlists` | YouTube playlists |
| `edu-tracker-tasks` | Study tasks |
| `edu-tracker-progress` | Progress data |
| `edu-tracker-notifications` | Notification settings |
| `edu-tracker-timetable-data` | Timetable information |
| `edu-tracker-timetable-times` | Custom time slots |
| `edu-tracker-user-name` | User profile name |
| `edu-tracker-authenticated` | Authentication state |

**Server-side**: MongoDB via Mongoose for persistent user data, authentication, and sync.

---

## 🔄 Import / Export

1. **Export**: Settings → Export Data → Downloads a compressed JSON backup
2. **Import**: Settings → Import Data → Select a JSON backup file
3. **Clear Data**: Settings → Clear All Data (with confirmation dialog)

---

## 🐛 Troubleshooting

| Issue | Solution |
|---|---|
| Data not saving | Check browser localStorage/IndexedDB permissions |
| Mobile zoom issues | Viewport meta tag is set; clear cache if needed |
| Theme not switching | Check system color preference or toggle manually |
| Import/Export failing | Validate JSON file format and version compatibility |
| API calls failing | Ensure the backend server is running on port 5000 |
| Google Sign-In not working | Verify `GOOGLE_CLIENT_ID` in environment variables |

### Recommended Browsers

Chrome 90+ · Firefox 88+ · Safari 14+ · Edge 90+

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://react.dev/) — UI framework
- [Vite](https://vitejs.dev/) — Build tool
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) — Accessible component primitives
- [shadcn/ui](https://ui.shadcn.com/) — Component library
- [Framer Motion](https://www.framer.com/motion/) — Animation library
- [Recharts](https://recharts.org/) — Chart library
- [Lucide](https://lucide.dev/) — Icon library
- [Google Gemini AI](https://ai.google.dev/) — AI assistance
- [@dnd-kit](https://dndkit.com/) — Drag-and-drop toolkit

---

**EduTrack** — Empowering students to achieve academic excellence 🎓
