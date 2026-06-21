export interface Signal {
    type: 'file_exists' | 'dependency' | 'manual';
    pattern: string;
}

export interface Milestones {
    id: string;
    title: string;
    description: string;
    week_start: number;
    week_end: number;
    completion_percentage: number;
    depends_on: string[];
    signals: Signal[];
    status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
    notes?: string;    
    ai_notes?: string[];
}

export interface Roadmap {
    project_name: string;
    description: string;
    estimated_weeks: number;
    tracks: string[];
    milestones: Milestones[];
}

export interface Project {
    id: string;
    name: string;
    description: string;
    created_at: string;
    roadmap: Roadmap;
}

// ─── Types ───────────────────────────────────────────────────────────────────
export type AppTheme = "dark" | "light";
export type View = "roadmap" | "tasks" | "workflow";
export type NodeType = "milestone" | "task" | "decision" | "goal";

export interface RoadmapNode {
  id: string; type: NodeType;
  title: string; description: string;
  x: number; y: number;
  items?: string[];
}
export interface RoadmapConn { id: string; fromId: string; toId: string; }
