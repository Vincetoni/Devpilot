import { useState } from 'react';
import { Project } from '@/types';
import { mockProject } from '@/lib/mock-data';
import Dashboard from '@/components/Dashboard';
import RoadmapView from '@/components/RoadmapView';
import CreateProject from '@/components/CreateProject';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(mockProject);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  function handleCreateProject(name: string, description: string, roadmap: any) {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name,
      description,
      created_at: new Date().toISOString(),
      roadmap
    };
    setProjects([...projects, newProject]);
    setShowCreate(false);
  }

  function handleUpdateMilestone(projectId: string, milestoneId: string, updates: any) {
    setProjects(projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        roadmap: {
          ...p.roadmap,
          milestones: p.roadmap.milestones.map(m => 
            m.id === milestoneId ? { ...m, ...updates } : m
          )
        }
      };
    }));
  }

  // Show roadmap view if project selected
  if (activeProject) {
    return (
      <div>
        <div style={{ 
          padding: '16px 40px', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <button 
            onClick={() => setActiveProject(null)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 14,
              color: '#6b7280',
              cursor: 'pointer'
            }}
          >
            ← Back to Projects
          </button>
          <span style={{ color: '#e5e7eb' }}>|</span>
          <span style={{ fontWeight: 500 }}>{activeProject.name}</span>
        </div>
        <RoadmapView 
          roadmap={activeProject.roadmap}
          onUpdateMilestone={(id, updates) => handleUpdateMilestone(activeProject.id, id, updates)}
        />
      </div>
    );
  }

  // Show dashboard
  return (
    <div>
      <Dashboard 
        projects={projects}
        onCreateProject={() => setShowCreate(true)}
      />
      {showCreate && (
        <CreateProject 
          onCreate={handleCreateProject}
          onCancel={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}