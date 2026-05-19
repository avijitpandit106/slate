'use client';

import { useState, useRef, useEffect } from 'react';
import { JSONContent, useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Note } from '@/types/note';

export default function EditNoteModal({
  note,
  onSave,
  onClose,
}: {
  note: Note;
  onSave: (
    id: string,
    title: string,
    content: JSONContent
  ) => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(note.title || '');
  const ref = useRef<HTMLDivElement>(null);
  
  const editor = useEditor({
    extensions: [StarterKit],
  
    content: note.content || '',
  
    immediatelyRender: false,
  });

  useEffect(() => {
    const handler = async (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        const content = editor?.getJSON();
        const isEmpty = !title.trim() && editor?.isEmpty;
        if (!isEmpty && content) {
          await onSave(note.id, title, content);
        }
        onClose();
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [title, editor, note.id, onSave, onClose]);

  if (!editor) return null;

  return (
    <div ref={ref} className="bg-white w-full max-w-3xl h-[80vh] rounded-2xl shadow-xl flex flex-col">
      <div className="p-6">
        <input
          value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="text-2xl font-bold outline-none"
        />
      </div>
      <div className="p-6 flex-1 overflow-y-auto" onClick={() => editor?.commands.focus()}>
        <EditorContent
          editor={editor}
          className="min-h-[300px] flex-1 outline-none"
        />
      </div>

      
    </div>
  );
}
