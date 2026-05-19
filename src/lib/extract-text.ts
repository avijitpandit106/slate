import { JSONContent } from '@tiptap/react'

export const extractText = (node: JSONContent | null): string => {
  if (!node) return ''
  if (node.text) return node.text
  if (node.content) return node.content.map(extractText).join('')
  return ''
}