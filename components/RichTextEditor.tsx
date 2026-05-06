'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

const btn: React.CSSProperties = {
  background: 'none', border: '1px solid #ccd5de', borderRadius: 5,
  padding: '4px 9px', fontSize: 12, cursor: 'pointer', color: '#4a6278',
  fontFamily: 'inherit', lineHeight: 1.4,
}
const btnActive: React.CSSProperties = { ...btn, background: '#dce8f4', borderColor: '#1a5a8a', color: '#1a5a8a' }

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder || 'Artikeltext hier eingeben…' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        style: 'min-height: 400px; outline: none; font-size: 14px; line-height: 1.75; color: #0f1e2e; font-family: "DM Sans", sans-serif;',
      },
    },
    immediatelyRender: false,
  })

  // sync external value changes (e.g. when loading existing article)
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value !== current && value !== '<p></p>') {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) return null

  const isActive = (type: string, attrs?: Record<string, unknown>) =>
    editor.isActive(type, attrs)

  function setLink() {
    if (!editor) return
    const url = window.prompt('URL:', editor.getAttributes('link').href || 'https://')
    if (url === null) return
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div style={{ border: '1px solid #ccd5de', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '10px 12px', borderBottom: '1px solid #e8edf2', background: '#f8fafc' }}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={isActive('bold') ? btnActive : btn}><b>B</b></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={isActive('italic') ? btnActive : btn}><i>I</i></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} style={isActive('underline') ? btnActive : btn}><u>U</u></button>
        <div style={{ width: 1, background: '#ccd5de', margin: '0 4px' }} />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={isActive('heading', { level: 2 }) ? btnActive : btn}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={isActive('heading', { level: 3 }) ? btnActive : btn}>H3</button>
        <div style={{ width: 1, background: '#ccd5de', margin: '0 4px' }} />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={isActive('bulletList') ? btnActive : btn}>• Liste</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={isActive('orderedList') ? btnActive : btn}>1. Liste</button>
        <div style={{ width: 1, background: '#ccd5de', margin: '0 4px' }} />
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} style={isActive('blockquote') ? btnActive : btn}>❝ Zitat</button>
        <button type="button" onClick={setLink} style={isActive('link') ? btnActive : btn}>🔗 Link</button>
        <div style={{ width: 1, background: '#ccd5de', margin: '0 4px' }} />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} style={btn} disabled={!editor.can().undo()}>↩</button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} style={btn} disabled={!editor.can().redo()}>↪</button>
      </div>

      {/* Editor area */}
      <div style={{ padding: '16px 20px' }}>
        <EditorContent editor={editor} />
      </div>

      {/* HTML toggle */}
      <details style={{ borderTop: '1px solid #e8edf2' }}>
        <summary style={{ padding: '8px 12px', fontSize: 11, color: '#8aa0b8', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
          HTML-Quellcode anzeigen
        </summary>
        <textarea
          value={editor.getHTML()}
          onChange={e => editor.commands.setContent(e.target.value)}
          rows={8}
          style={{ width: '100%', padding: '12px', fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.6, border: 'none', borderTop: '1px solid #e8edf2', outline: 'none', resize: 'vertical', color: '#4a6278' }}
        />
      </details>
    </div>
  )
}
