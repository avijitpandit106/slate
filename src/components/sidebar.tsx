'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  FileText,
  Lock,
  Archive,
  Trash,
  X,
  PanelLeftClose,
  PanelLeft,
  LucideIcon,
} from 'lucide-react';


const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

type View =
  | 'notes'
  | 'locked'
  | 'archive'
  | 'trash';

const links: {
  key: View;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    key: 'notes',
    label: 'All Notes',
    icon: FileText,
  },

  {
    key: 'locked',
    label: 'Locked',
    icon: Lock,
  },

  {
    key: 'archive',
    label: 'Archive',
    icon: Archive,
  },

  {
    key: 'trash',
    label: 'Recycle Bin',
    icon: Trash,
  },
];

export default function Sidebar({
  view,
  setView,
  open,
  onClose,
}: {
  view: 'notes' | 'locked' | 'archive' | 'trash';
  setView: React.Dispatch<
    React.SetStateAction<'notes' | 'locked' | 'archive' | 'trash'>
  >;
  open: boolean;
  onClose: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(256);
  const [smooth, setSmooth] = useState(false);
  const isResizing = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem('sidebar-width');
    if (stored) { queueMicrotask(() => {
        setWidth(JSON.parse(stored));
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-width', JSON.stringify(width));
  }, [width]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setSmooth(false);
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX)));
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isResizing.current) return;
    isResizing.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const toggleCollapse = () => {
    setSmooth(true);
    setCollapsed(prev => !prev);
  };

  const displayWidth = collapsed ? 56 : width;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          bg-white border-r border-gray-200
          flex flex-col pt-16 px-6 pb-6
          transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:hidden
        `}
      >
        <button className="self-end mb-6 cursor-pointer" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>

        <nav className="flex flex-col gap-2">
          {links.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                setView(key);
                onClose();
              }}
              className={`
                flex items-center gap-3
                px-3 py-2 rounded-lg transition cursor-pointer text-left
                ${view === key ? 'bg-black text-white' : 'hover:bg-gray-100'}
              `}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <aside
        className={`hidden lg:flex lg:flex-col bg-white border-r border-gray-200 h-screen shrink-0 overflow-hidden relative ${smooth ? 'transition-[width] duration-200' : ''}`}
        style={{ width: displayWidth }}
      >
        <div className="flex items-center justify-between h-16 px-4 shrink-0">
          <button
            className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
            onClick={toggleCollapse}
          >
            {collapsed ? (
              <PanelLeft className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
          {links.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`
                flex items-center
                ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'}
                py-2 rounded-lg transition text-left cursor-pointer w-full
                ${view === key ? 'bg-black text-white' : 'hover:bg-gray-100'}
              `}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          ))}
        </nav>

        {!collapsed && (
          <div
            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:w-1.5 hover:bg-blue-500 active:bg-blue-600"
            onMouseDown={handleMouseDown}
          />
        )}
      </aside>
    </>
  );
}
