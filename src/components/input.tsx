'use client';

import { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

export default function Input({
  onCreate,
}: {
  onCreate: (data: { title: string; content: JSONContent }) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
  
      Placeholder.configure({
        placeholder: 'Take a note...',
      }),
    ],
  
    content: '',
  
    immediatelyRender: false,
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (!title.trim() && editor?.isEmpty) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [title, editor]);

  return (
    <div
      ref={ref}
      className="mb-4 max-w-4xl mx-auto border rounded-lg shadow p-3 bg-white"
    >
      {isExpanded && (
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full outline-none mb-2"
        />
      )}

      <div
        onClick={() => setIsExpanded(true)}
        className="min-h-10 cursor-text focus:outline-none"
      >
        <EditorContent editor={editor} />
      </div>

      {/*<textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        onFocus={() => setIsExpanded(true)}
        placeholder="Take a note..."
        className="w-full outline-none resize-none"
      />*/}

      {isExpanded && (
        <div className="flex justify-end mt-2">
          <button
          onClick={() => {
            if (!title.trim() && editor?.isEmpty) {
              alert("Note cannot be empty");
              return;
            }
          
            onCreate({
              title,
              content: editor?.getJSON() ?? {}, 
            });
          
            setTitle('');
            editor?.commands.clearContent();
            setIsExpanded(false);
          }}
            className="bg-black text-white px-3 py-1 rounded"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
