"use client";

import { useCallback, useMemo, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import FileHandler from "@tiptap/extension-file-handler";
import { uploadImage } from "@/lib/api";

const IMAGE_MIMES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

interface Props {
  value: string;
  onChange: (html: string) => void;
  token: string;
}

function Toolbar({
  editor,
  token,
}: {
  editor: ReturnType<typeof useEditor> | null;
  token: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const addImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      try {
        const { url } = await uploadImage(file, token);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Erro no upload da imagem");
      }
    },
    [editor, token]
  );

  if (!editor) return null;

  const handleImageClick = () => inputRef.current?.click();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && IMAGE_MIMES.includes(file.type)) addImage(file);
    e.target.value = "";
  };

  const btnClass =
    "p-2 rounded text-gray-400 hover:bg-brand-surface-2 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed";
  const btnActiveClass = "bg-brand-violet/30 text-brand-violet-light";

  return (
    <div className="flex flex-wrap gap-0.5 p-2 border-b border-brand-border bg-brand-surface rounded-t-lg">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${btnClass} ${editor.isActive("bold") ? btnActiveClass : ""}`}
        title="Negrito"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${btnClass} ${editor.isActive("italic") ? btnActiveClass : ""}`}
        title="Itálico"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`${btnClass} ${editor.isActive("strike") ? btnActiveClass : ""}`}
        title="Riscado"
      >
        <s>S</s>
      </button>
      <span className="w-px h-6 bg-brand-border self-center mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${btnClass} ${editor.isActive("heading", { level: 1 }) ? btnActiveClass : ""}`}
        title="Título 1"
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${btnClass} ${editor.isActive("heading", { level: 2 }) ? btnActiveClass : ""}`}
        title="Título 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${btnClass} ${editor.isActive("heading", { level: 3 }) ? btnActiveClass : ""}`}
        title="Título 3"
      >
        H3
      </button>
      <span className="w-px h-6 bg-brand-border self-center mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${btnClass} ${editor.isActive("bulletList") ? btnActiveClass : ""}`}
        title="Lista com marcadores"
      >
        •
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${btnClass} ${editor.isActive("orderedList") ? btnActiveClass : ""}`}
        title="Lista numerada"
      >
        1.
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${btnClass} ${editor.isActive("blockquote") ? btnActiveClass : ""}`}
        title="Citação"
      >
        "
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`${btnClass} ${editor.isActive("codeBlock") ? btnActiveClass : ""}`}
        title="Bloco de código"
      >
        {"</>"}
      </button>
      <button
        type="button"
        onClick={() => {
          const href = window.prompt("URL do link:");
          if (href) editor.chain().focus().setLink({ href }).run();
        }}
        className={`${btnClass} ${editor.isActive("link") ? btnActiveClass : ""}`}
        title="Inserir link"
      >
        Link
      </button>
      <span className="w-px h-6 bg-brand-border self-center mx-1" />
      <button type="button" onClick={handleImageClick} className={btnClass} title="Inserir imagem">
        🖼
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_MIMES.join(",")}
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
}

export default function RichTextEditor({ value, onChange, token }: Props) {
  const tokenRef = useRef(token);
  tokenRef.current = token;

  const extensions = useMemo(() => {
    const handleUpload = async (file: File): Promise<string> => {
      const { url } = await uploadImage(file, tokenRef.current);
      return url;
    };

    return [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full h-auto" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-brand-violet-light underline hover:text-brand-cyan" } }),
      FileHandler.configure({
        allowedMimeTypes: IMAGE_MIMES,
        onPaste: async (editor, files) => {
          for (const file of files) {
            if (!IMAGE_MIMES.includes(file.type)) continue;
            try {
              const url = await handleUpload(file);
              editor.chain().focus().setImage({ src: url }).run();
            } catch {
              // Falha silenciosa no paste
            }
          }
        },
        onDrop: async (editor, files, pos) => {
          for (const file of files) {
            if (!IMAGE_MIMES.includes(file.type)) continue;
            try {
              const url = await handleUpload(file);
              editor.chain().focus().insertContentAt(pos, { type: "image", attrs: { src: url } }).run();
              pos += 1;
            } catch {
              // Falha silenciosa no drop
            }
          }
        },
      }),
    ];
  }, []);

  const editor = useEditor({
    extensions,
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none min-h-[300px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="rounded-lg border border-brand-border overflow-hidden bg-brand-surface">
      <Toolbar editor={editor} token={token} />
      <EditorContent editor={editor} />
    </div>
  );
}
