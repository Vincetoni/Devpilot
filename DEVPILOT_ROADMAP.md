# DevPilot — Build Plan & Roadmap

## Product Vision

DevPilot is an AI-powered project management platform built specifically for software developers. It understands your codebase, generates development roadmaps, tracks progress automatically, and helps you ship faster — from any device.

Unlike traditional task managers, DevPilot acts as an AI tech lead that reads your code, suggests next steps, and lets you commit changes from your phone.

---

## Architecture: One API, All Platforms

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Web App   │     │ Mobile App  │     │  Desktop    │
│  (Next.js)  │     │(React Native│     │   (Tauri)   │
│             │     │  or Flutter)│     │             │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌──────┴──────┐
                    │  DevPilot   │
                    │    API      │
                    │  (Node.js)  │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
           ┌──┴──┐    ┌───┴───┐   ┌───┴────┐
           │PostgreSQL│ Claude │   │GitHub  │
           │Supabase  │  API   │   │  API   │
           └─────────┘ └───────┘   └────────┘
```

**Principle:** Same database, same API, different UIs. No sync problem — everything lives in one place.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js 14 (App Router) + Tailwind + shadcn/ui | Fast, modern, one codebase |
| Mobile (future) | React Native or Flutter | Cross-platform, reuse API |
| Desktop (future) | Tauri (Rust wrapper) or Electron | Lightweight, same web code |
| API | Node.js + Express or Fastify | Familiar, fast to build |
| Database | PostgreSQL via Supabase | Auth included, realtime ready |
| AI | Claude API (Anthropic) | Best structured JSON output |
| File Analysis | tree-sitter + regex | Parse code without building ASTs |
| GitHub | OAuth App, read-only v1 | Standard, secure |
| Hosting | Vercel (frontend) + Railway/Render (API) | Free tier, easy deploy |

---

## Phase 1: Foundation (Weeks 1–2)

**Goal:** API + database that can generate roadmaps and store tasks.

### Week 1: API Scaffold

- [ ] Set up Node.js + Express project
- [ ] Connect Supabase (PostgreSQL + Auth)
- [ ] Design database schema:
  - `users` (auth via Supabase)
  - `projects` (name, description, repo_url)
  - `roadmaps` (generated JSON, project_id)
  - `milestones` (title, description, status, progress, signals)
  - `tasks` (milestone_id, title, status, notes, ai_notes)
- [ ] Write Claude API integration:
  - System prompt for structured JSON roadmaps
  - User prompt with project idea, stack, weeks
  - Parse and validate response
- [ ] Test endpoint: `POST /api/roadmaps/generate`

### Week 2: Core API Endpoints

- [ ] `GET /api/projects` — list user's projects
- [ ] `POST /api/projects` — create new project
- [ ] `GET /api/roadmaps/:id` — get roadmap with milestones
- [ ] `PATCH /api/milestones/:id` — update status/progress
- [ ] `POST /api/milestones/:id/notes` — add manual note
- [ ] `POST /api/milestones/:id/ai-notes` — generate AI suggestions
- [ ] Authentication middleware (Supabase JWT)
- [ ] Error handling, rate limiting, basic logging

**Deliverable:** API that can generate a roadmap from a project idea and store it.

---

## Phase 2: Web App (Weeks 3–4)

**Goal:** Beautiful task feed that consumes the API.

### Week 3: UI Scaffold & Roadmap Display

- [ ] Next.js project with shadcn/ui
- [ ] Auth pages (login/signup via Supabase)
- [ ] Dashboard: list of projects
- [ ] "New Project" flow:
  - Input: project idea, tech stack, target weeks
  - Call API → show loading → display roadmap
- [ ] Roadmap view:
  - Milestone cards with progress bars
  - Expandable details (description, signals, notes)
  - Status badges: not_started, in_progress, completed, blocked

### Week 4: Task Interaction

- [ ] Manual notes: add/edit/delete per milestone
- [ ] AI notes: "Get suggestions" button → Claude generates 3 bullet points
- [ ] Markdown import: paste `# Todo` list → convert to tasks
- [ ] Progress visualization:
  - Overall project %
  - Track-based progress (auth, ui, backend, etc.)
  - Milestone dependency graph (simple)
- [ ] Responsive design (mobile-first for future app)

**Deliverable:** Web app where you can create a project, generate a roadmap, and interact with tasks.

---

## Phase 3: File Scanning & Progress (Weeks 5–6)

**Goal:** The unique feature — DevPilot understands your codebase.

### Week 5: File Upload & Analysis

- [ ] `POST /api/projects/:id/upload` — accept zip or tar.gz
- [ ] Extract file tree (ignore node_modules, .git)
- [ ] Match files against milestone `signals`:
  - `file_exists`: glob pattern matching
  - `dependency`: parse package.json, requirements.txt, etc.
  - `manual`: user marks complete
- [ ] Update milestone completion % based on matched signals
- [ ] Dependency resolution: M2 blocked until M1 complete

### Week 6: GitHub Read-Only Integration

- [ ] Register GitHub OAuth App
- [ ] `GET /api/auth/github` — OAuth flow
- [ ] `POST /api/projects/:id/connect-github` — link repo
- [ ] Scan connected repo via GitHub API:
  - File tree (no content download)
  - package.json, requirements.txt detection
- [ ] Auto-update progress when repo changes (webhook or polling)
- [ ] Show "last scanned" timestamp

**Deliverable:** Upload code or connect GitHub → DevPilot shows real progress.

---

## Phase 4: Polish & Launch Prep (Weeks 7–8)

**Goal:** Landing page, beta users, first feedback.

### Week 7: Landing Page & Marketing

- [ ] Landing page:
  - Hero: "AI project manager that reads your code"
  - Demo video (2 min, screen recording)
  - Features list with screenshots
  - Pricing section (free + pro)
  - Waitlist email form
- [ ] Waitlist collection (ConvertKit or Mailchimp)
- [ ] Twitter/X account, first thread about building DevPilot
- [ ] Dev.to blog post: "How I built an AI project manager in 8 weeks"

### Week 8: Beta & Iterate

- [ ] Invite 20 friends/colleagues to beta
- [ ] Collect feedback via simple form
- [ ] Fix top 10 bugs/requests
- [ ] Set up analytics (Plausible or PostHog)
- [ ] Prepare Product Hunt launch materials

**Deliverable:** Live web app with waitlist, beta users, and a story to tell.

---

## Phase 5: Monetization (Weeks 9–10)

**Goal:** First paying users.

### Free Tier
- 3 roadmaps/month
- 1 connected repo
- Manual notes only
- File upload (zip)

### Pro Tier ($12/month)
- Unlimited roadmaps
- Unlimited repos
- AI notes & suggestions
- GitHub webhook auto-sync
- Priority support

### Tasks
- [ ] Stripe integration
- [ ] Subscription middleware (check plan limits)
- [ ] Upgrade prompts in UI
- [ ] First 10 paid users (target: friends, Twitter followers, HN)

---

## Phase 6: Mobile App (Q3 — Months 3–4)

**Goal:** iOS + Android apps using same API.

### v1 Mobile Features
- [ ] View roadmaps & tasks
- [ ] Swipe right: mark complete
- [ ] Swipe left: archive
- [ ] Long press: quick actions (add note, ask AI)
- [ ] Push notifications: "M2 unblocked — ready to start"
- [ ] AI commit suggestions (read-only, copy to clipboard)

### v2 Mobile Features
- [ ] GitHub write scope (opt-in)
- [ ] Auto-commit & push
- [ ] Team view (see teammate progress)
- [ ] Offline mode (queue actions, sync when online)

---

## Phase 7: Team & Enterprise (Q4 — Months 5–6)

- [ ] Multi-user projects
- [ ] Role-based access (admin, developer, viewer)
- [ ] Team roadmap view
- [ ] Slack/Discord integration
- [ ] Admin dashboard
- [ ] Enterprise SSO (SAML)

---

## Distribution Plan (To Be Defined)

| Channel | When | Effort | Potential |
|---------|------|--------|-----------|
| **Hacker News "Show HN"** | After v1 web app | Medium | High if it resonates |
| **Twitter/X build-in-public** | Start now | Low | Slow but authentic |
| **Dev.to / Hashnode** | Week 7 | Low | SEO, developer trust |
| **Product Hunt** | After beta polish | Medium | Spike, not sustained |
| **GitHub README / Open Source** | Consider v2 | High | Community, no revenue |
| **Reddit (r/webdev, r/reactjs)** | After launch | Medium | Niche, engaged |
| **Indie Hackers** | After first revenue | Low | Founder community |
| **Paid ads (Twitter, Reddit)** | After $1k MRR | Medium | Scale what works |

**Immediate action:** Start tweeting about building DevPilot today. Document the journey. "Building an AI project manager" is content whether you have a product or not.

---

## Key Decisions Log

| Decision | Choice | Date | Rationale |
|----------|--------|------|-----------|
| Backed out of Qwen hackathon | Use Claude API instead | 2026-06-08 | Flexibility, better JSON output |
| Architecture | One API, multi-client | 2026-06-08 | No sync complexity, faster iteration |
| v1 platform | Web only | 2026-06-08 | Fastest to build, test, iterate |
| GitHub scope | Read-only v1 | 2026-06-08 | Security, simpler implementation |
| Auto-commit | Suggest only, opt-in push | 2026-06-08 | User trust, liability control |
| Database | Supabase PostgreSQL | 2026-06-08 | Auth + DB + realtime in one |
| AI provider | Claude (Anthropic) | 2026-06-08 | Best structured output, reliable |

---

## Success Metrics

| Phase | Metric | Target |
|-------|--------|--------|
| Phase 1 | API endpoints working | 100% test pass |
| Phase 2 | Web app usable | Self-dogfood daily |
| Phase 3 | File scan accuracy | 80% signal match |
| Phase 4 | Waitlist signups | 500 |
| Phase 5 | Paying users | 10 |
| Phase 6 | Mobile app downloads | 1,000 |
| Phase 7 | Team customers | 5 |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Claude API costs too high | Medium | High | Implement caching, rate limits |
| GitHub OAuth rejected | Low | High | Start with file upload only |
| No one pays | Medium | High | Free tier must be genuinely useful |
| Competitor launches first | High | Low | Execution > idea, focus on UX |
| Solo burnout | High | Critical | Ship v1 in 8 weeks, not 8 months |

---

## Next Immediate Actions

1. **Today:** Create GitHub repo `devpilot`, push this roadmap
2. **This week:** Set up Node.js + Express + Supabase, test Claude API
3. **This weekend:** First working endpoint `POST /api/roadmaps/generate`
4. **Next week:** Start tweeting build-in-public thread

---

*Last updated: 2026-06-15*
*Next review: After Phase 1 completion*
