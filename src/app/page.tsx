'use client';

import { useState, useEffect } from 'react';

import {
  Sidebar,
  Card,
  Navbar,
  Input,
  Modal,
  EditNoteModal,
  PasswordModal,
} from '@/components';

import { Note } from '@/types/note';

import { JSONContent } from '@tiptap/react';

export default function Home() {
  const [notes, setNote] = useState<Note[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState('');

  const [filter, setFilter] = useState<'all' | 'title' | 'content'>('all');

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [passwordMode, setPasswordMode] = useState<
    'lock' | 'verify' | 'delete'
  >('lock');

  const [view, setView] = useState<'notes' | 'locked' | 'archive' | 'trash'>('notes');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      setNote(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  
    const loadNotes = async () => {
      await fetchNotes();
    };
  
    loadNotes();
  
  }, []);

  const createNote = async (data: { title: string; content: JSONContent }) => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      alert('Note Cannot be empty');
      return;
    }

    const newNote = await res.json();

    setNote(prev => [
      {
        ...newNote,

        createdAt: new Date(newNote.createdAt),

        content: newNote.content as JSONContent,
      },

      ...prev,
    ]);
  };

  const handleUpdate = async (
    id: string,
    title: string,
    content: JSONContent,
  ) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) return;

    setNote(prev =>
      prev.map(note =>
        note.id === id
          ? {
              ...note,
              title,
              content,
            }
          : note,
      ),
    );

    setIsModalOpen(false);

    setSelectedNote(null);
  };

  const handleLock = async (note: Note) => {
    setSelectedNote(note);

    if (note.isLocked) {
      setPasswordMode('verify');
    } else {
      setPasswordMode('lock');
    }

    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = async (password: string) => {
    if (!selectedNote) return;

    // LOCK NOTE
    if (passwordMode === 'lock') {
      const res = await fetch(`/api/notes/${selectedNote.id}/lock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        alert('Failed to lock note');
        return;
      }

      setNote(prev =>
        prev.map(note =>
          note.id === selectedNote.id
            ? {
                ...note,
                isLocked: true,
              }
            : note,
        ),
      );

      setIsPasswordModalOpen(false);

      setSelectedNote(null);

      return;
    }

    // VERIFY PASSWORD
    if (passwordMode === 'verify') {
      const res = await fetch(`/api/notes/${selectedNote.id}/unlock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        alert('Invalid password');

        return;
      }

      setNote(prev =>
        prev.map(note =>
          note.id === selectedNote.id
            ? {
                ...note,
                isLocked: false,
              }
            : note,
        ),
      );

      setIsPasswordModalOpen(false);

      setSelectedNote(null);

      return;
    }

    // DELETE NOTE
    if (passwordMode === 'delete') {
      const verifyRes = await fetch(`/api/notes/${selectedNote.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!verifyRes.ok) {
        alert('Invalid password');

        return;
      }

      const deleteRes = await fetch(`/api/notes/${selectedNote.id}`, {
        method: 'DELETE',
      });

      if (!deleteRes.ok) {
        alert('Failed to delete');

        return;
      }

      setNote(prev =>
        prev.map(n =>
          n.id === selectedNote.id
            ? { ...n, isDeleted: true, deletedAt: new Date() }
            : n,
        ),
      );

      setIsPasswordModalOpen(false);

      setSelectedNote(null);
    }
  };

  const handleDelete = async (note: Note) => {
    // LOCKED NOTE
    if (note.isLocked) {
      setSelectedNote(note);

      setPasswordMode('delete');

      setIsPasswordModalOpen(true);

      return;
    }

    // PUBLIC NOTE
    const res = await fetch(`/api/notes/${note.id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      alert('Failed to delete');

      return;
    }

    setNote(prev =>
      prev.map(n =>
        n.id === note.id ? { ...n, isDeleted: true, deletedAt: new Date() } : n,
      ),
    );
  };

  const handleArchive = async (note: Note) => {
    const res = await fetch(`/api/notes/${note.id}/archive`, {
      method: 'PUT',
    });

    if (!res.ok) {
      alert('Failed to archive note');
      return;
    }

    setNote(prev =>
      prev.map(n =>
        n.id === note.id ? { ...n, isArchived: !n.isArchived } : n,
      ),
    );
  };

  const handleRestore = async (note: Note) => {
    const res = await fetch(`/api/notes/${note.id}/restore`, {
      method: 'PUT',
    });

    if (!res.ok) {
      alert('Failed to restore note');
      return;
    }

    setNote(prev =>
      prev.map(n =>
        n.id === note.id
          ? { ...n, isDeleted: false, deletedAt: null, isArchived: false }
          : n,
      ),
    );

    setView('notes');
  };

  const filteredNotes = notes
    .filter(note => {

      // NOTES
      if (view === 'notes') {
        return !note.isDeleted && !note.isArchived;
      }

      // LOCKED
      if (view === 'locked') {
        return note.isLocked && !note.isDeleted;
      }

      // ARCHIVE
      if (view === 'archive') {
        return note.isArchived && !note.isDeleted;
      }

      // TRASH
      return note.isDeleted;
    })
    .filter(note => {
      if (note.isLocked) return true;

      const query = search.toLowerCase();
      const titleMatch = note.title?.toLowerCase().includes(query);
      const contentMatch = (note.contentText || '').toLowerCase().includes(query);

      if (filter === 'title') return titleMatch;
      if (filter === 'content') return contentMatch;
      return titleMatch || contentMatch;
    })

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar view={view} setView={setView} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 flex items-center justify-center min-w-0">
          <p className="text-gray-400 text-lg">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar view={view} setView={setView} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0">
        <Navbar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          onHomeClick={() => setView('notes')}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="p-4 sm:p-6">
          {/* INPUT */}
          <Input onCreate={createNote} />

          {/* LIST */}
          <div className="max-w-6xl mx-auto">
            {filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-lg">No notes yet</p>
              </div>
            ) : (
              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  gap-4 sm:gap-6
                  mt-6
                "
              >
                <Card
                  notes={filteredNotes}
                  setNotes={setNote}
                  onEdit={note => {
                    if (note.isLocked) {
                      setSelectedNote(note);

                      setPasswordMode('verify');

                      setIsPasswordModalOpen(true);

                      return;
                    }

                    setSelectedNote(note);

                    setIsModalOpen(true);
                  }}
                onLock={handleLock}
                onDelete={handleDelete}
                onArchive={handleArchive}
                onRestore={handleRestore}
                view={view}
                />
              </div>
            )}
          </div>
        </div>

        {selectedNote && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);

              setSelectedNote(null);
            }}
          >
            <EditNoteModal
              note={selectedNote}
              onSave={handleUpdate}
              onClose={() => {
                setIsModalOpen(false);

                setSelectedNote(null);
              }}
            />
          </Modal>
        )}
        {selectedNote && (
          <Modal
            isOpen={isPasswordModalOpen}
            onClose={() => {
              setIsPasswordModalOpen(false);

              setSelectedNote(null);
            }}
          >
            <PasswordModal
              title={
                passwordMode === 'lock'
                  ? 'Lock Note'
                  : passwordMode === 'verify'
                    ? 'Unlock Note'
                    : 'Delete Note'
              }
              buttonText={
                passwordMode === 'lock'
                  ? 'Lock'
                  : passwordMode === 'verify'
                    ? 'Unlock'
                    : 'Delete'
              }
              onSubmit={handlePasswordSubmit}
              onClose={() => {
                setIsPasswordModalOpen(false);

                setSelectedNote(null);
              }}
            />
          </Modal>
        )}
      </main>
    </div>
  );
}
