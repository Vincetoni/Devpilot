'use client';

import { useState } from 'react';
import { ArrowLeft, Map, CheckSquare, GitBranch } from 'lucide-react';
import { Project } from '@/types';
import Sidebar from '@/components/Projects/Sidebar';
import TopBar from '@/components/Projects/TopBar';
import RoadmapView from '@/components/Projects/RoadmapView';
import TasksView from '@/components/Projects/TasksView';
import WorkflowView from '@/components/Projects/WorkflowView';
import EmptyState from '@/components/Projects/EmptyState';
import ShellGrid from '@/components/Projects/ShellGrid';
import GlobalStyles from '@/components/Projects/GlobalStyles';

type AppTheme = 'dark' | 'light';
type View = 'roadmap' | 'tasks' | 'workflow';

const T = {
  dark: {
    appBg: '#080b12',
    topbarBorder: '#ffffff0e',
    card: '#161c2e',
    text: '#dde2f0',
    sub: '#5e6880',
    chip: '#ffffff0a',
    cardBorder: '#ffffff12',
  },
  light: {
    appBg: '#edf0f8',
    topbarBorder: '#00000010',
    card: '#ffffff',
    text: '#141928',
    sub: '#8892aa',
    chip: '#00000008',
    cardBorder: '#00000010',
  },
} as const;

const NAV_ITEMS = [
  { id: 'roadmap' as View, icon: Map, label: 'Roadmap' },
  { id: 'tasks' as View, icon: CheckSquare, label: 'Tasks' },
  { id: 'workflow' as View, icon: GitBranch, label: 'Workflow' },
];

export default function ProjectsPage() {
  const [theme, setTheme] = useState<AppTheme>('dark');
  const [activeView, setActiveView] = useState<View>('roadmap');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  const t = T[theme];
  const hasProjects = projects.length > 0;
  const isViewingProject = !!selectedProject;

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
        background: t.appBg,
        fontFamily: "'Outfit',system-ui,sans-serif",
      }}
      className="flex-col lg:flex-row"
    >
      <GlobalStyles />
      <ShellGrid theme={theme} />

      <Sidebar theme={theme} setTheme={setTheme} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          position: 'relative',
          zIndex: 10,
          overflow: 'hidden',
        }}
      >
        <TopBar theme={theme} isViewingProject={isViewingProject} />

        {isViewingProject && (
          <div
            style={{
              height: 52,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '0 16px',
              flexShrink: 0,
              borderBottom: `1px solid ${t.cardBorder}`,
              background: t.appBg,
            }}
          >
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 10px',
                borderRadius: 8,
                background: t.chip,
                border: `1px solid ${t.cardBorder}`,
                color: t.sub,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={13} /> Back
            </button>

            <h2 style={{ fontSize: 14, fontWeight: 600, color: t.text, margin: 0, marginLeft: 8 }}>
              {selectedProject.name}
            </h2>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: activeView === item.id ? '#7c6dfa22' : t.chip,
                    border: `1px solid ${activeView === item.id ? '#7c6dfa44' : t.cardBorder}`,
                    color: activeView === item.id ? '#a89eff' : t.sub,
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <item.icon size={13} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
          className="pb-16 lg:pb-0"
        >
          {!isViewingProject && !hasProjects ? (
            <EmptyState theme={theme} onCreateProject={() => {}} />
          ) : !isViewingProject && hasProjects ? (
            <ProjectsList
              projects={projects}
              theme={theme}
              onSelectProject={setSelectedProject}
            />
          ) : selectedProject ? (
            <>
              {activeView === 'roadmap' && (
                <RoadmapView theme={theme} project={selectedProject} />
              )}
              {activeView === 'tasks' && (
                <TasksView theme={theme} project={selectedProject} />
              )}
              {activeView === 'workflow' && (
                <WorkflowView theme={theme} project={selectedProject} />
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ProjectsList({
  projects,
  theme,
  onSelectProject,
}: {
  projects: Project[];
  theme: AppTheme;
  onSelectProject: (project: Project) => void;
}) {
  const t = {
    dark: {
      card: '#161c2e',
      cardBorder: '#ffffff12',
      text: '#dde2f0',
      sub: '#5e6880',
      hover: '#ffffff0c',
      hoverBorder: '#ffffff18',
    },
    light: {
      card: '#ffffff',
      cardBorder: '#00000010',
      text: '#141928',
      sub: '#8892aa',
      hover: '#00000008',
      hoverBorder: '#00000018',
    },
  }[theme];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: 0 }}>
          Projects
        </h1>
        <p className="mono" style={{ fontSize: 11, color: t.sub, margin: '3px 0 0' }}>
          {projects.length} project{projects.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {projects.map(project => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            style={{
              padding: 20,
              borderRadius: 12,
              background: t.card,
              border: `1px solid ${t.cardBorder}`,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.background = t.hover;
              el.style.borderColor = t.hoverBorder;
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.background = t.card;
              el.style.borderColor = t.cardBorder;
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, color: t.text, margin: '0 0 8px' }}>
              {project.name}
            </h3>
            <p style={{ fontSize: 13, color: t.sub, margin: '0 0 12px', lineHeight: 1.4 }}>
              {project.description}
            </p>
            <div style={{ fontSize: 11, color: t.sub }}>
              {new Date(project.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
