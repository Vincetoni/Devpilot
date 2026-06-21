# DevPilot — Build Plan & Roadmap

> Last updated: 2026-06-19
> Status: Frontend UI built (Figma → React), backend in progress

---

## Product Vision

DevPilot is an AI-powered project management platform built specifically for software developers. It understands your codebase, generates development roadmaps, tracks progress automatically, and helps you ship faster — from any device.

Unlike traditional task managers, DevPilot acts as an AI tech lead that reads your code, suggests next steps, and lets you commit changes from your phone.

---

## Current Status

| Layer | Status | Notes |
|-------|--------|-------|
| Frontend UI | ✅ Built | Roadmap, Tasks, Workflow views (Figma → React) |
| Dashboard | ❌ Missing | No entry point with AI input |
| Database | ❌ Not started | Need Supabase schema |
| API | 🟡 Partial | `/api/roadmaps/generate` exists, needs CRUD |
| Data flow | ❌ Not connected | Frontend uses hardcoded mocks |
| Branding | ❌ Placeholder | Still says "Launchpad", not DevPilot |

---

## Known Problems (Must Fix)

### 1. Missing Dashboard
**Problem:** No entry point. Users land directly in project views with no way to create a project.
**Fix:** Build a dashboard with centered input:
- "What are you building?" text field
- [Generate with AI] button
- [Create manually] button
- List of existing projects below

### 2. Empty States Missing
**Problem:** New users see blank Kanban boards, empty workflow analytics, and a roadmap canvas with nothing. Looks broken.
**Fix:** Every view needs an empty state:
```
┌─────────────────────────────────────┐
│  📊 Workflow Analytics              │
│                                     │
│  Complete 5 tasks to see            │
│  your velocity and cycle time.      │
│                                     │
│  [Go to Tasks →]                    │
└─────────────────────────────────────┘
```

### 3. AI Input Buried
**Problem:** The AI assistant input is at the bottom of the roadmap canvas. DevPilot's core value (AI-generated roadmaps) is not the main flow.
**Fix:** AI generation should be the **primary action** on the dashboard, not a secondary feature inside a project view.

### 4. Generic Task Cards
**Problem:** Task cards look like Trello/Linear (tag, assignee, days left). They don't show what makes DevPilot unique: codebase signals.
**Fix:** Each card should show:
```
┌─────────────────────────┐
│  🔴 Authentication      │
│                         │
│  Signals:               │
│  📁 src/auth/**         │
│  📦 package.json has    │
│     'jsonwebtoken'      │
│                         │
│  [2/3 complete]         │
└─────────────────────────┘
```

### 5. Branding Inconsistency
**Problem:** UI says "Launchpad 2026", "Alex Rivera", not DevPilot.
**Fix:** Before showing anyone:
- Logo → DevPilot bolt icon
- "Launchpad" → "DevPilot"
- User avatar → generic or user's profile

### 6. Missing File Upload / GitHub Connect
**Problem:** No entry point for DevPilot's growth engine. User can't upload code or connect a repo.
**Fix:** Add to dashboard:
- "Upload your codebase (zip)" → scan → generate tasks
- "Connect GitHub repository" → OAuth → auto-sync progress

### 7. No Real Data Flow
**Problem:** Frontend uses hardcoded `INIT_NODES`, `KANBAN`, `WORKFLOW_STAGES`. Changes don't persist.
**Fix:** Connect to Supabase. Every interaction (status change, note addition) should save to database.

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
           │PostgreSQL│ OpenAI │   │GitHub  │
           │Supabase  │  API   │   │  API   │
           └─────────┘ └───────┘   └────────┘
```

**Principle:** Same database, same API, different UIs. No sync problem — everything lives in one place.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js 14 (App Router) + Tailwind + shadcn/ui | Already built, fast |
| Mobile (future) | React Native or Flutter | Cross-platform, reuse API |
| Desktop (future) | Tauri (Rust wrapper) | Lightweight, same web code |
| API | Next.js API routes | One codebase, Vercel deploy |
| Database | PostgreSQL via Supabase | Auth included, realtime ready |
| AI | OpenAI GPT-4o (now) / Claude (later) | JSON mode works, switchable |
| File Analysis | tree-sitter + regex | Parse code without building ASTs |
| GitHub | OAuth App, read-only v1 | Standard, secure |
| Hosting | Vercel (frontend + API) | Free tier, easy deploy |

---

## Phase 1: Fix Foundation (Week 1)

**Goal:** Address all 7 known problems. Make the app feel real.

### Day 1–2: Database Schema

```sql
-- Supabase PostgreSQL

projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  user_id uuid references auth.users not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

roadmaps (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade,
  project_name text,
  description text,
  estimated_weeks int,
  tracks text[],
  created_at timestamptz default now()
);

milestones (
  id uuid primary key default gen_random_uuid(),
  roadmap_id uuid references roadmaps on delete cascade,
  milestone_id text not null, -- "M1", "M2", etc.
  title text not null,
  description text,
  week_start int,
  week_end int,
  completion_percentage int default 0,
  depends_on text[] default '{}',
  status text default 'not_started',
  notes text default '',
  ai_notes text[] default '{}',
  created_at timestamptz default now()
);

signals (
  id uuid primary key default gen_random_uuid(),
  milestone_id uuid references milestones on delete cascade,
  type text not null check (type in ('file_exists', 'dependency', 'manual')),
  pattern text not null
);
```

**Tasks:**
- [ ] Create Supabase project
- [ ] Run schema SQL in SQL Editor
- [ ] Set up Row Level Security (RLS) policies
- [ ] Test connection from Next.js

### Day 3–4: API Endpoints

| Endpoint | Method | What It Does |
|----------|--------|--------------|
| `/api/projects` | POST | Create new project |
| `/api/projects` | GET | List user's projects |
| `/api/projects/:id` | GET | Get project with full roadmap |
| `/api/projects/:id/roadmap` | POST | Generate AI roadmap (or mock fallback) |
| `/api/milestones/:id` | PATCH | Update status, notes, completion |
| `/api/projects/:id/upload` | POST | Accept zip, extract file tree |

**Tasks:**
- [ ] Build each endpoint with proper error handling
- [ ] Add validation (Zod or manual)
- [ ] Test with curl/Thunder Client

### Day 5: Connect Frontend to Real Data

**Replace hardcoded data:**
```typescript
// Before (hardcoded)
const nodes = INIT_NODES;
const kanban = KANBAN;

// After (fetched)
const { data: project } = useSWR(`/api/projects/${id}`, fetcher);
const nodes = project?.roadmap?.milestones || [];
```

**Tasks:**
- [ ] Install SWR or React Query for data fetching
- [ ] Update RoadmapView to use API data
- [ ] Update TasksView to use API data
- [ ] Update WorkflowView to use API data (or hide if no data)

### Day 6: Build Dashboard

```tsx
// pages/index.tsx or app/page.tsx
export default function Dashboard() {
  const [input, setInput] = useState('');
  const [projects, setProjects] = useState([]);

  // Load existing projects
  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(setProjects);
  }, []);

  async function createWithAI() {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: input, generateRoadmap: true })
    });
    const project = await res.json();
    router.push(`/project/${project.id}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-2">DevPilot</h1>
      <p className="text-gray-500 mb-8">AI project manager for developers</p>

      <div className="w-full max-w-xl">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="What are you building? (e.g. food delivery app)"
          className="w-full p-4 rounded-xl border text-lg"
        />
        <div className="flex gap-3 mt-4">
          <button onClick={createWithAI} className="flex-1 bg-black text-white p-3 rounded-lg">
            ✨ Generate with AI
          </button>
          <button onClick={() => router.push('/project/new')} className="flex-1 border p-3 rounded-lg">
            Create manually
          </button>
        </div>
      </div>

      {/* Existing projects */}
      {projects.length > 0 && (
        <div className="w-full max-w-xl mt-12">
          <h2 className="text-lg font-semibold mb-4">Your Projects</h2>
          {projects.map(p => (
            <Link key={p.id} href={`/project/${p.id}`}>
              <div className="p-4 border rounded-lg mb-3 hover:shadow-md transition">
                <h3 className="font-medium">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Tasks:**
- [ ] Build dashboard page
- [ ] Style to match existing dark theme
- [ ] Add project list with progress indicators

### Day 7: Empty States + Branding

**Tasks:**
- [ ] Add empty state component for each view
- [ ] Replace "Launchpad" with "DevPilot" everywhere
- [ ] Replace "Alex Rivera" with dynamic user or generic avatar
- [ ] Add DevPilot logo/icon

---

## Phase 2: Core Features (Week 2)

**Goal:** File scanning, progress tracking, AI notes.

### Week 2, Day 1–2: File Upload & Scan

```typescript
// API: POST /api/projects/:id/upload
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  // Save zip temporarily
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Extract file tree (using adm-zip or similar)
  const files = extractZip(buffer);

  // Match against milestone signals
  const project = await getProject(params.id);
  const updatedMilestones = project.roadmap.milestones.map(m => {
    const matchedSignals = m.signals.filter(s => matchSignal(s, files));
    const completion = Math.round((matchedSignals.length / m.signals.length) * 100);
    return { ...m, completion_percentage: completion };
  });

  // Save to database
  await updateMilestones(updatedMilestones);

  return Response.json({ scanned: files.length, milestones: updatedMilestones });
}
```

**Tasks:**
- [ ] Install `adm-zip` for zip extraction
- [ ] Build file tree scanner (ignore node_modules, .git)
- [ ] Match files against signals (glob patterns)
- [ ] Update milestone completion in database

### Week 2, Day 3–4: AI Notes

```typescript
// API: POST /api/milestones/:id/ai-notes
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const milestone = await getMilestone(params.id);

  const prompt = `Given this milestone: "${milestone.title}" - "${milestone.description}"
  Suggest 3 implementation tips or things to watch out for.
  Return as JSON array of strings.`;

  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  const suggestions = JSON.parse(aiResponse.choices[0].message.content);
  await updateMilestone(params.id, { ai_notes: suggestions.tips });

  return Response.json({ suggestions: suggestions.tips });
}
```

**Tasks:**
- [ ] Build AI notes endpoint
- [ ] Add "Get AI Suggestions" button to milestone detail
- [ ] Display AI notes in UI

### Week 2, Day 5–7: Polish & Bug Fixes

**Tasks:**
- [ ] Fix status toggle (not_started → in_progress → completed)
- [ ] Add dependency blocking (can't complete M2 if M1 not done)
- [ ] Add progress recalculation on status change
- [ ] Test full flow: create → generate → upload → track → complete

---

## Phase 3: Growth Features (Weeks 3–4)

**Goal:** GitHub integration, sharing, landing page.

### Week 3: GitHub Read-Only Integration

**Tasks:**
- [ ] Register GitHub OAuth App
- [ ] Build OAuth flow (`/api/auth/github`)
- [ ] Scan connected repo via GitHub API
- [ ] Auto-create tasks from missing files
- [ ] Show "last synced" timestamp

### Week 4: Landing Page & Launch Prep

**Tasks:**
- [ ] Landing page: hero, features, pricing, CTA
- [ ] Waitlist collection (ConvertKit)
- [ ] Demo video (screen recording)
- [ ] Twitter/X thread about building DevPilot
- [ ] Dev.to blog post

---

## Phase 4: Monetization (Weeks 5–6)

**Goal:** First paying users.

### Pricing

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 3 projects, manual roadmaps, file upload |
| **Pro** | $12/mo | Unlimited projects, AI generation, GitHub sync, AI notes |
| **Team** (future) | $20/seat | Shared projects, admin, SSO |

### Tasks
- [ ] Stripe integration
- [ ] Subscription middleware (check plan limits)
- [ ] Upgrade prompts in UI
- [ ] First 10 paid users (friends, Twitter, HN)

---

## Phase 5: Mobile App (Q3)

**Goal:** iOS + Android using same API.

### v1 Mobile Features
- [ ] View roadmaps & tasks
- [ ] Swipe right: mark complete
- [ ] Swipe left: archive
- [ ] Long press: quick actions
- [ ] Push notifications
- [ ] AI commit suggestions (read-only)

### v2 Mobile Features
- [ ] GitHub write scope (opt-in)
- [ ] Auto-commit & push
- [ ] Team view
- [ ] Offline mode

---

## Phase 6: Team & Enterprise (Q4)

- [ ] Multi-user projects
- [ ] Role-based access
- [ ] Team roadmap view
- [ ] Slack/Discord integration
- [ ] Admin dashboard
- [ ] Enterprise SSO

---

## Success Metrics

| Phase | Metric | Target |
|-------|--------|--------|
| Phase 1 | Database + API working | 100% test pass |
| Phase 1 | Dashboard functional | Can create + view project |
| Phase 2 | File scan accuracy | 80% signal match |
| Phase 3 | GitHub OAuth working | Can connect + scan repo |
| Phase 4 | Waitlist signups | 500 |
| Phase 5 | Paying users | 10 |
| Phase 6 | Team customers | 5 |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI API costs too high | Medium | High | Implement caching, rate limits |
| GitHub OAuth rejected | Low | High | Start with file upload only |
| No one pays | Medium | High | Free tier must be genuinely useful |
| Solo burnout | High | Critical | Ship v1 in 2 weeks, not 2 months |
| Schema changes break data | Medium | High | Design schema carefully now |

---

## Key Decisions Log

| Decision | Choice | Date | Rationale |
|----------|--------|------|-----------|
| Backed out of Qwen hackathon | Use OpenAI now, Claude later | 2026-06-08 | Flexibility, better JSON mode |
| Architecture | One API, multi-client | 2026-06-08 | No sync complexity |
| v1 platform | Web only | 2026-06-08 | Fastest to build, test, iterate |
| GitHub scope | Read-only v1 | 2026-06-08 | Security, simpler implementation |
| Auto-commit | Suggest only, opt-in push | 2026-06-08 | User trust, liability control |
| Database | Supabase PostgreSQL | 2026-06-19 | Auth + DB + realtime in one |
| AI provider | OpenAI GPT-4o | 2026-06-19 | JSON mode, works now |
| Frontend source | Figma → React | 2026-06-19 | Reusable components, fast iteration |

---

## Immediate Next Actions

1. **Today:** Create Supabase project, run schema SQL
2. **Tomorrow:** Build `POST /api/projects` and `GET /api/projects`
3. **This weekend:** Connect frontend to API (replace hardcoded data)
4. **Next week:** Build dashboard, add empty states, fix branding

---

## Distribution Plan

| Channel | When | Effort | Potential |
|---------|------|--------|-----------|
| **Twitter/X build-in-public** | Start now | Low | Slow but authentic |
| **Hacker News "Show HN"** | After v1 backend | Medium | High if it resonates |
| **Dev.to / Hashnode** | After dashboard | Low | SEO, developer trust |
| **Product Hunt** | After polish | Medium | Spike, not sustained |
| **Reddit (r/webdev, r/reactjs)** | After launch | Medium | Niche, engaged |
| **Indie Hackers** | After first revenue | Low | Founder community |

**Immediate action:** Start tweeting about building DevPilot today. Document the journey.

---

*Next review: After Phase 1 completion (end of Week 1)*
