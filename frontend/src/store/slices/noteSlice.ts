import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/config/api';
import { Note, NoteFormData, ApiResponse, PaginatedResponse } from '@/types';

interface NoteState {
  notes: Note[];
  currentNote: Note | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: NoteState = {
  notes: [],
  currentNote: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (params: { search?: string; page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<PaginatedResponse<Note>>('/notes', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch notes');
    }
  }
);

export const fetchNote = createAsyncThunk(
  'notes/fetchNote',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Note>>(`/notes/${id}`);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch note');
    }
  }
);

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (data: NoteFormData, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<Note>>('/notes', data);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create note');
    }
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ id, data }: { id: number; data: Partial<NoteFormData> }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<Note>>(`/notes/${id}`, data);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update note');
    }
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/notes/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete note');
    }
  }
);

// Slice
const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentNote: (state, action) => {
      state.currentNote = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch notes
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch note
    builder
      .addCase(fetchNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNote.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNote = action.payload;
      })
      .addCase(fetchNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create note
    builder
      .addCase(createNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.unshift(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update note
    builder
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notes.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
        if (state.currentNote?.id === action.payload.id) {
          state.currentNote = action.payload;
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete note
    builder
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.filter((n) => n.id !== action.payload);
        if (state.currentNote?.id === action.payload) {
          state.currentNote = null;
        }
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentNote } = noteSlice.actions;
export default noteSlice.reducer;