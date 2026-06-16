import { create } from 'zustand';

interface File {
  id: string;
  name: string;
  content: string;
  language: string;
}

interface AppState {
  files: File[];
  activeFileId: string | null;
  setActiveFile: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  files: [
    { id: '1',
      name: 'App.tsx',
      content: '// Start coding...\nfunction App() {\n  return <div>Hello DevPilot</div>;\n}',
      language: 'typescript'
     }
  ],
  activeFileId: '1',
  setActiveFile: (id) => set({ activeFileId: id }),
  updateFileContent: (id, content) => set((state) => ({
    files: state.files.map((f) => f.id === id ? { ...f, content } : f)
  })),
}));