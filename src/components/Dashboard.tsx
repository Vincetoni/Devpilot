import { Project } from '@/types';
import { calculateProgress } from '@/lib/mock-data';
import Link from 'next/link';

interface DashboardProps {
  projects: Project[];
  onCreateProject: () => void;
}

export default function Dashboard({ projects, onCreateProject }: DashboardProps) {
  return (
    <div style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32 }}>DevPilot</h1>
          <p style={{ color: '#6b7280', margin: '5px 0 0' }}>AI project manager for developers</p>
        </div>
        <button 
          onClick={onCreateProject}
          style={{
            padding: '12px 24px',
            background: '#111',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          + New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
          <p>No projects yet.</p>
          <p>Create your first project to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {projects.map(project => {
            const progress = calculateProgress(project.roadmap);
            return (
              <Link 
                key={project.id} 
                href={`/project/${project.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 24,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h2 style={{ margin: '0 0 4px', fontSize: 20 }}>{project.name}</h2>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>{project.description}</p>
                    </div>
                    <span style={{ 
                      fontSize: 24, 
                      fontWeight: 700,
                      color: progress === 100 ? '#22c55e' : '#111'
                    }}>
                      {progress}%
                    </span>
                  </div>
                  
                  <div style={{ marginTop: 16 }}>
                    <div style={{ 
                      height: 6, 
                      background: '#f3f4f6', 
                      borderRadius: 3,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: progress === 100 ? '#22c55e' : '#3b82f6',
                        borderRadius: 3,
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {project.roadmap.tracks.map(track => (
                      <span key={track} style={{
                        fontSize: 12,
                        padding: '4px 10px',
                        background: '#f3f4f6',
                        borderRadius: 20,
                        color: '#374151'
                      }}>
                        {track}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}