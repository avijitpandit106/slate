'use client';

import { Trash, Lock, LockOpen, Archive, RotateCcw } from 'lucide-react';

import { JSONContent } from '@tiptap/react';

import { extractText } from '@/lib/extract-text';

import { Note } from '@/types/note';


export default function Card({
  notes,
  setNotes,
  onEdit,
  onLock,
  onDelete,
  onArchive,
  onRestore,
  view,
}: {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;

  onEdit: (note: Note) => void;

  onLock: (note: Note) => Promise<void>;

  onDelete: (note: Note) => Promise<void>;

  onArchive: (note: Note) => Promise<void>;

  onRestore: (note: Note) => Promise<void>;

  view: string;
}) {

  return (
    <>
      {notes.map(note => (
        <div
          key={note.id}
          onClick={() => onEdit(note)}
          className="
            bg-white
            rounded-2xl
            p-5
            shadow-md
            border
            border-gray-200
            hover:shadow-lg
            transition
            hover:scale-105
            cursor-pointer
            relative
          "
        >
          {/* TITLE */}
          <h2
            className="
              font-semibold
              text-lg
              text-gray-900
              mb-1
              break-words
              line-clamp-2
            "
          >
            {note.isLocked
              ? '🔒 Locked Note'
              : note.title || extractText(note.content as JSONContent)}
          </h2>

          {/* DATE */}
          <p className="text-xs text-gray-400">
            {new Date(note.createdAt).toLocaleString()}
          </p>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 mt-4">
            {/* LOCK */}
            <button
              onClick={e => {
                e.stopPropagation();
                onLock(note);
              }}
              className="
                text-gray-400
                hover:text-yellow-500
                transition
              "
            >
              {note.isLocked ? <Lock size={18} /> : <LockOpen size={18} />}
            </button>

            {/* DELETE */}
            <button
              onClick={e => {
                e.stopPropagation();
                onDelete(note);
              }}
              className="
                text-gray-400
                hover:text-red-500
                transition
              "
            >
              <Trash size={18} />
            </button>
            {/* ARCHIVE / UNARCHIVE / RESTORE */}
            <button
              onClick={e => {
                e.stopPropagation();
                if (view === 'trash') {
                  onRestore(note);
                } else {
                  onArchive(note);
                }
              }}
              className="
                text-gray-400
                hover:text-blue-500
                transition
              "
            >
              {view === 'trash' || view === 'archive' ? (
                <RotateCcw size={18} />
              ) : (
                <Archive size={18} />
              )}
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
