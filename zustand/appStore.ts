import {create} from 'zustand';
import NoteSchema from '../model/NoteSchema';
import {createJSONStorage, persist} from 'zustand/middleware';
import zustandStorage from './storage';
import {User} from 'realm';

interface AppStore {
  noteViewType: 'list' | 'grid';
  setNoteViewType: (noteViewType: 'list' | 'grid') => void;
  selectedMode: boolean;
  setSelectedMode: (selectedMode: boolean) => void;
  selectedNotes: NoteSchema[];
  setSelectedNotes: (notes: NoteSchema[]) => void;
  currentNote: NoteSchema;
  setCurrentNote: (note: NoteSchema) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  noteOrderBy: 'created_at' | 'updated_at';
  setNoteOrderBy: (orderBy: 'created_at' | 'updated_at') => void;
  user: User | undefined;
}

export const useAppStore = create<AppStore>()(
  persist(
    set => ({
      noteViewType: 'grid',
      setNoteViewType: noteViewType => set({noteViewType}),
      selectedMode: false,
      setSelectedMode: selectedMode => set({selectedMode}),
      selectedNotes: [],
      setSelectedNotes: selectedNotes => set({selectedNotes: selectedNotes}),
      currentNote: {
        color: 'transparent',
        title: '',
        content: '',
        image: '',
      } as NoteSchema,
      setCurrentNote: currentNote => set({currentNote}),
      theme: 'light',
      setTheme: theme => set({theme}),
      noteOrderBy: 'created_at',
      setNoteOrderBy: noteOrderBy => set({noteOrderBy}),
      user: undefined,
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
