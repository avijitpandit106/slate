'use client';

import { useState } from 'react';
import { Search, X, Menu } from 'lucide-react';

export default function Navbar({
  search,
  setSearch,
  filter,
  setFilter,
  onHomeClick,
  onMenuClick,
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filter: 'all' | 'title' | 'content';
  setFilter: React.Dispatch<
    React.SetStateAction<'all' | 'title' | 'content'>
  >;
  onHomeClick: () => void;
  onMenuClick: () => void;
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState(search);
  const [mobileFilter, setMobileFilter] = useState(filter);

  const handleMobileSearch = () => {
    setSearch(mobileQuery);
    setFilter(mobileFilter);
    setMobileSearchOpen(false);
  };

  return (
    <>
      <div className="p-6 pl-4 lg:pl-6 flex items-center justify-between border-b border-b-gray-200 gap-3">

        {/* LEFT: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden cursor-pointer"
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6" />
          </button>

          <button onClick={onHomeClick}>
            <h1 className="font-bold text-3xl hover:opacity-80 transition cursor-pointer">
            Slate
            </h1>
          </button>
        </div>

        {/* DESKTOP SEARCH */}
        <div className="hidden lg:flex items-center gap-3 flex-1 min-w-0 justify-end">

          <div
            className="
              group flex items-center
              bg-white border border-zinc-300 rounded-xl
              px-3 py-2
              focus-within:border-black focus-within:shadow-sm transition
              w-full max-w-xs
            "
          >
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-black transition shrink-0" />

            <input
              type="search"
              placeholder="Search notes..."
              className="
                ml-2 w-full bg-transparent outline-none
                text-black placeholder-gray-400
              "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value as 'all' | 'title' | 'content'
              )
            }
            className="
              border border-zinc-300 rounded-xl
              px-3 py-2 bg-white outline-none
              focus:border-black transition shrink-0
            "
          >
            <option value="all">All</option>
            <option value="title">Title</option>
            <option value="content">Content</option>
          </select>

        </div>

        {/* MOBILE SEARCH BUTTON */}
        <button
          className="lg:hidden cursor-pointer"
          onClick={() => {
            setMobileQuery(search);
            setMobileFilter(filter);
            setMobileSearchOpen(true);
          }}
        >
          <Search className="w-6 h-6" />
        </button>

      </div>

      {/* MOBILE SEARCH MODAL */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col lg:hidden">
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <input
              type="search"
              placeholder="Search notes..."
              className="flex-1 outline-none text-lg"
              value={mobileQuery}
              onChange={(e) => setMobileQuery(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleMobileSearch();
              }}
            />
            <button
              className="cursor-pointer"
              onClick={() => setMobileSearchOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 border-b border-gray-200">
            <select
              value={mobileFilter}
              onChange={(e) =>
                setMobileFilter(
                  e.target.value as 'all' | 'title' | 'content'
                )
              }
              className="
                w-full border border-zinc-300 rounded-xl
                px-3 py-2 bg-white outline-none
                focus:border-black transition
              "
            >
              <option value="all">All</option>
              <option value="title">Title</option>
              <option value="content">Content</option>
            </select>
          </div>

          <div className="p-4 mt-auto">
            <button
              onClick={handleMobileSearch}
              className="w-full bg-black text-white rounded-xl py-3 font-semibold cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      )}
    </>
  );
}
