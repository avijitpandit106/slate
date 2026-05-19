import { JSONContent } from '@tiptap/react';

export type Note = {
  id: string;

  title: string;

  content: JSONContent | null;

  contentText: string | null;

  isLocked: boolean;

  isArchived: boolean;

  isDeleted: boolean;

  deletedAt: Date | null;

  createdAt: Date;
};