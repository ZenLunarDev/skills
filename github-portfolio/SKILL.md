---
name: github-portfolio
description: Build a pixel-perfect GitHub profile and repository portfolio web app with dark mode, mock repositories, search/language filtering, and GitHub Pages deployment readiness. Use this skill whenever the user wants a portfolio website, personal homepage, developer profile page, or project showcase that mirrors GitHub's look and feel — even if they just say "make me a portfolio like GitHub", "a profile page for my repos", or "a page like my GitHub profile". Also use it for recreating specific GitHub UI pieces (profile sidebar, repository cards, language color dots, the repositories tab) or deploying a static portfolio to GitHub Pages.
---

# GitHub Portfolio Skill

## Overview

This skill guides building a fully responsive portfolio web application that mirrors the exact look, feel, and functionality of a GitHub Profile and its Repositories tab, deployable to GitHub Pages. The goal is fidelity: a visitor should be able to mistake it for the real GitHub at a glance.

Fidelity matters more than cleverness here. GitHub's UI is extremely consistent, so every detail — spacing, border colors, muted text, hover states, badge sizes — should match the real site rather than being "inspired by" it. When in doubt about any visual detail, default to what GitHub actually does.

## Design System & Theme

Use the **GitHub Dark Default** palette throughout:

- Background: `#0d1117`
- Canvas / Card Background: `#161b22`
- Border Color: `#30363d`
- Primary Text: `#c9d1d9`
- Secondary Text / Muted: `#8b949e`
- Accent / Links: `#58a6ff`
- Button Green (Primary): `#238636` (Hover: `#2ea043`)
- Danger/Red (e.g. "Unwatch" hover): `#f85149`

Typography stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif` — GitHub does not use a custom font.

Icons: use `lucide-react` for GitHub-style icons (GitFork, Star, BookMarked, Code, Package, LayoutDashboard, Search, Moon, Sun, Link, MapPin, Users, Bell).

## Layout & Components

### 1. Header / Navbar
- GitHub logo mark, centered search bar (mock — does not need real search), nav links (Pull requests, Issues, Marketplace, Explore), notification bell, and a profile dropdown with the user's avatar.
- On scroll, the header stays sticky with a subtle `background-color: rgba(13,17,23,0.8)` + blur.

### 2. Profile Sidebar (left column on desktop, ~296px wide)
- Circular avatar, display name, `@username`, bio, follower/following counts, and detail rows (Organization, Location, Website).
- "Follow" mock button (green, `#238636`).
- Achievements / Highlights badges row.
- On mobile, the sidebar stacks on top of the main content (matching real GitHub's mobile view), with avatar and name left-aligned in a row and a "Follow" button at top-right of the card.

### 3. Main Content Area
- **Navigation tabs**: Overview, **Repositories** (with a live count badge showing the number of repos), Projects, Packages, Stars.
- Only Overview and Repositories need functional content; the rest can be stubs.

### 4. Repositories View
- Search input ("Find a repository…") and a Language filter dropdown ("All languages" plus each language present in the data, with its official color dot).
- Repository cards (grid on wide screens, single column on narrow) containing:
  - Repository name (accent-blue link) with Public/Private badge on the right
  - Description
  - Language row: official language color dot + name, star count, fork count, and relative last-updated time ("Updated 3 days ago")
- Filtering is client-side and instant: search matches name and description; language dropdown filters to that language; the two combine.

## Repository Data

Create `src/data/repositories.json` with 6–8 realistic projects. Structure per repo:

```json
{
  "name": "vite-ssr-boilerplate",
  "description": "Opinionated Vite + React SSR starter with code splitting and route-based lazy loading.",
  "language": "TypeScript",
  "stars": 482,
  "forks": 39,
  "private": false,
  "url": "https://github.com/yourname/vite-ssr-boilerplate",
  "updated": "2026-06-14"
}
```

Use a variety of languages so the filter and the color dots are visibly useful (e.g. TypeScript, JavaScript, Python, HTML, CSS, Go, Rust). Pull the official language colors from `references/languages.json` in this skill — do not guess colors.

## Implementation Steps

1. **Project setup**: Initialize a Vite + React project with Tailwind CSS configured. (If the environment lacks network access for `npm create vite`, scaffold the files manually: `index.html`, `vite.config.js`, `src/main.jsx`, `src/App.jsx`, `src/index.css` with the Tailwind directives, plus `tailwind.config.js` with the GitHub palette as theme colors.)
2. **Data**: Create `src/data/repositories.json` per the schema above, and a small `src/data/profile.json` with avatar URL (use `https://github.com/<username>.png`), name, username, bio, counts, org, location, website.
3. **Components**: Break the UI into components — `Header`, `ProfileSidebar`, `RepoTabs`, `RepoCard`, `RepoFilters`. Keep styling in each component's JSX/Tailwind classes rather than one giant stylesheet.
4. **Interactivity**: Implement real-time search filtering and language filtering with React state (`useState` + `useMemo`). The repositories count badge should reflect the filtered count too (GitHub shows the count of the *filtered* list, not the total).
5. **Responsive design**: Desktop = sidebar left, content right. Below `lg` breakpoint, sidebar stacks above content. Verify at 375px (mobile), 768px (tablet), 1280px+ (desktop).

## GitHub Pages Deployment Readiness

- Set `base: '/<repo-name>/'` in `vite.config.js` (the repo name the portfolio will be served from).
- Add `.github/workflows/deploy.yml` that: triggers on push to `main`, sets up Node 20, installs with `npm ci`, builds with `npm run build`, and deploys `dist/` to GitHub Pages using `actions/upload-pages-artifact` + `actions/deploy-pages` with `permissions: contents: read, pages: write, id-token: write`.
- Make sure all asset URLs are relative-friendly (Vite `base` handles this).

## Quality Checklist

Before finishing, verify all of the following:

- [ ] Background is `#0d1117`, cards `#161b22`, borders `#30363d`, text `#c9d1d9`, muted `#8b949e`, links `#58a6ff`
- [ ] Header with logo, search bar, nav links, avatar dropdown
- [ ] Profile sidebar with avatar, name, `@username`, bio, counts, Follow button
- [ ] Repositories tab shows a count badge
- [ ] 6–8 repo cards with name, description, language dot, stars, forks, relative updated time
- [ ] Search and language filtering work and combine; count badge reflects filtered results
- [ ] Language dots use the official colors from `references/languages.json`
- [ ] Responsive: sidebar stacks above content on mobile
- [ ] `vite.config.js` has the GitHub Pages `base` set
- [ ] `.github/workflows/deploy.yml` exists and is complete
- [ ] `npm run build` (or equivalent) succeeds without errors

## Bundled Resources

- `references/languages.json` — official GitHub language color mapping. Read this whenever you render language dots or the filter dropdown, instead of inventing colors.
