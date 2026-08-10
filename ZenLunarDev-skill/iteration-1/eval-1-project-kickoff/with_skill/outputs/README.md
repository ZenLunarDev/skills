# Lunara Analytics Dashboard

A modern React SaaS dashboard for B2B analytics with real-time WebSocket updates, designed for mid-level managers at tech companies.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Security scan
npm run security:scan
```

## Tech Stack

- **React 18** + TypeScript (Functional Components)
- **Vite** for fast dev/build
- **Zustand** for state management
- **Framer Motion** for purpose-driven animations
- **Recharts** for data visualization
- **React Router** for client-side routing
- **WebSocket** for real-time updates

## Project Structure

```
src/
├── app/                    # Routes & Layouts
│   └── routes.tsx
├── features/               # Feature modules
│   ├── dashboard/          # Main dashboard feature
│   │   ├── components/     # Dashboard-specific components
│   │   ├── hooks/          # Dashboard hooks
│   │   ├── services/       # Dashboard API calls
│   │   └── types/          # Dashboard types
│   └── analytics/          # Analytics feature
│       ├── components/     # Analytics components
│       ├── hooks/          # Analytics hooks
│       ├── services/       # WebSocket & API services
│       └── types/          # Analytics types
├── shared/                 # Shared utilities
│   ├── ui/                 # Atomic design components
│   ├── lib/                # Utilities, constants
│   └── hooks/              # Global hooks
└── config/                 # Environment & theme config
```

## Design Philosophy

- **Dynamic Grid Asymmetry**: Non-uniform grid layouts across sections
- **Depth Layering**: Glassmorphism + Neumorphism fusion using backdrop-filter and layered shadows
- **Color Philosophy**: Indigo (#6366f1) primary + Slate neutrals + Cyan (#06b6d4) accent
- **Motion with Purpose**: Framer Motion for state changes only
- **Typography**: Inter font family with varied weights for contrast

## Security

See [SECURITY.md](./SECURITY.md) for the security audit report.

## License

MIT
