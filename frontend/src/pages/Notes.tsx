import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchNotes, createNote, updateNote, deleteNote } from '@/store/slices/noteSlice';
import type { Note, CreateNoteDto, UpdateNoteDto } from '@/types';
import './Notes.css';

const Notes = () => {
  const dispatch = useAppDispatch();
  const { notes, loading } = useAppSelector((state) => state.notes);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<CreateNoteDto>({
    title: '',
    content: '',
  });

  useEffect(() => {
    dispatch(fetchNotes({ page: 1, limit: 1000 }));
  }, [dispatch]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setFormData({
      title: note.title,
      content: note.content,
    });
    setIsEditing(false);
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setFormData({
      title: '',
      content: '',
    });
    setIsEditing(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (selectedNote) {
      setFormData({
        title: selectedNote.title,
        content: selectedNote.content,
      });
      setIsEditing(false);
    } else {
      setSelectedNote(null);
      setFormData({
        title: '',
        content: '',
      });
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      if (selectedNote) {
        const updateData: UpdateNoteDto = { ...formData };
        const result = await dispatch(
          updateNote({ id: selectedNote.id, data: updateData })
        ).unwrap();
        setSelectedNote(result);
        toast.success('Note updated successfully');
      } else {
        const result = await dispatch(createNote(formData)).unwrap();
        setSelectedNote(result);
        toast.success('Note created successfully');
      }
      setIsEditing(false);
      dispatch(fetchNotes({ page: 1, limit: 1000 }));
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await dispatch(deleteNote(id)).unwrap();
        toast.success('Note deleted successfully');
        if (selectedNote?.id === id) {
          setSelectedNote(null);
          setFormData({ title: '', content: '' });
        }
        dispatch(fetchNotes({ page: 1, limit: 1000 }));
      } catch (error: any) {
        toast.error(error.message || 'An error occurred');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="notes-page">
      <div className="notes-sidebar">
        <div className="sidebar-header">
          <h2>Notes</h2>
          <button className="btn btn-primary btn-sm" onClick={handleNewNote}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        <div className="sidebar-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
          />
        </div>

        <div className="notes-list">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <p className="empty-state">
              {searchTerm ? 'No notes found' : 'No notes yet. Create your first note!'}
            </p>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
                onClick={() => handleSelectNote(note)}
              >
                <div className="note-item-header">
                  <h3>{note.title}</h3>
                  <button
                    className="btn-icon btn-icon-danger btn-icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                    title="Delete"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
                <p className="note-preview">{note.content}</p>
                <span className="note-date">{formatDate(note.updated_at)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="notes-content">
        {selectedNote || isEditing ? (
          <>
            <div className="content-header">
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input title-input"
                  placeholder="Note title"
                />
              ) : (
                <h1>{selectedNote?.title}</h1>
              )}
              <div className="content-actions">
                {isEditing ? (
                  <>
                    <button className="btn btn-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-secondary" onClick={handleEdit}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                    {selectedNote && (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(selectedNote.id)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                        Delete
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="content-body">
              {isEditing ? (
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="textarea content-textarea"
                  placeholder="Start writing your note..."
                />
              ) : (
                <div className="note-content">
                  <p>{selectedNote?.content}</p>
                  {selectedNote && (
                    <div className="note-metadata">
                      <span>Created: {formatDate(selectedNote.created_at)}</span>
                      <span>Last updated: {formatDate(selectedNote.updated_at)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="empty-content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
            <h3>No note selected</h3>
            <p>Select a note from the sidebar or create a new one</p>
            <button className="btn btn-primary" onClick={handleNewNote}>
              Create New Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;