import { useState } from 'react';
import { Roadmap } from '@/types';

interface CreateProjectProps {
  onCreate: (name: string, description: string, roadmap: Roadmap) => void;
  onCancel: () => void;
}

export default function CreateProject({ onCreate, onCancel }: CreateProjectProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState<'form' | 'roadmap'>('form');

  // Mock roadmap generator (replace with AI later)
  function generateMockRoadmap(projectName: string): Roadmap {
    return {
      project_name: projectName,
      description: `A software project for ${projectName.toLowerCase()}.`,
      estimated_weeks: 8,
      tracks: ['setup', 'core', 'features', 'polish', 'deploy'],
      milestones: [
        {
          id: 'M1',
          title: 'Project Setup',
          description: 'Initialize repository, configure tooling, and set up CI/CD.',
          week_start: 1,
          week_end: 2,
          completion_percentage: 0,
          depends_on: [],
          signals: [
            { type: 'file_exists', pattern: 'package.json' },
            { type: 'file_exists', pattern: 'README.md' },
            { type: 'file_exists', pattern: '.gitignore' }
          ],
          status: 'not_started',
          notes: '',
          ai_notes: ['Use pnpm for faster installs', 'Set up ESLint + Prettier']
        },
        {
          id: 'M2',
          title: 'Core Features',
          description: 'Build the main functionality and database schema.',
          week_start: 2,
          week_end: 5,
          completion_percentage: 0,
          depends_on: ['M1'],
          signals: [
            { type: 'file_exists', pattern: 'src/routes/**' },
            { type: 'file_exists', pattern: 'src/models/**' }
          ],
          status: 'not_started',
          notes: '',
          ai_notes: ['Use Prisma for type-safe queries', 'Add input validation']
        },
        {
          id: 'M3',
          title: 'UI Polish',
          description: 'Design and implement the user interface.',
          week_start: 5,
          week_end: 6,
          completion_percentage: 0,
          depends_on: ['M2'],
          signals: [
            { type: 'file_exists', pattern: 'src/components/**' },
            { type: 'file_exists', pattern: 'src/styles/**' }
          ],
          status: 'not_started',
          notes: '',
          ai_notes: ['Use Tailwind for rapid styling', 'Add dark mode support']
        },
        {
          id: 'M4',
          title: 'Testing',
          description: 'Write tests and fix critical bugs.',
          week_start: 6,
          week_end: 7,
          completion_percentage: 0,
          depends_on: ['M3'],
          signals: [
            { type: 'file_exists', pattern: 'tests/**' },
            { type: 'dependency', pattern: "package.json has 'vitest'" }
          ],
          status: 'not_started',
          notes: '',
          ai_notes: ['Aim for 80% coverage', 'Add E2E tests with Playwright']
        },
        {
          id: 'M5',
          title: 'Deployment',
          description: 'Deploy to production and configure monitoring.',
          week_start: 7,
          week_end: 8,
          completion_percentage: 0,
          depends_on: ['M4'],
          signals: [
            { type: 'file_exists', pattern: 'vercel.json' },
            { type: 'manual', pattern: 'Production URL live' }
          ],
          status: 'not_started',
          notes: '',
          ai_notes: ['Set up Sentry for error tracking', 'Configure uptime monitoring']
        }
      ]
    };
  }

  function handleSubmit() {
    if (!name.trim()) return;
    const roadmap = generateMockRoadmap(name);
    onCreate(name, description, roadmap);
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 20
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        maxWidth: 500,
        width: '100%',
        padding: 32
      }}>
        <h2 style={{ margin: '0 0 8px' }}>New Project</h2>
        <p style={{ color: '#6b7280', margin: '0 0 24px' }}>Create a new project roadmap</p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 6 }}>Project Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. FoodDash"
            style={{
              width: '100%',
              padding: 12,
              border: '1.5px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 14
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 6 }}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What are you building?"
            style={{
              width: '100%',
              padding: 12,
              border: '1.5px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 14,
              minHeight: 80,
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              background: 'none',
              border: '1.5px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            style={{
              padding: '10px 20px',
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              opacity: name.trim() ? 1 : 0.5
            }}
          >
            Create Roadmap
          </button>
        </div>
      </div>
    </div>
  );
}