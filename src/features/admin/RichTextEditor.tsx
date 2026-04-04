"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import FileHandler from "@tiptap/extension-file-handler";
import { uploadImage } from "@core/api-client";

function ImportHtmlModal({
  onConfirm,
  onClose,
}: {
  onConfirm: (html: string) => void;
  onClose: () => void;
}) {
  const [raw, setRaw] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-brand-surface border border-brand-border rounded-xl shadow-2xl w-full max-w-2xl flex flex-col gap-4 p-6">
        <h2 className="text-foreground font-bold text-lg">Importar HTML</h2>
        <p className="text-sm text-gray-400">
          Cole o HTML gerado pela IA abaixo. O conteúdo atual do editor será
          substituído.
        </p>
        <textarea
          className="w-full h-64 px-3 py-2 rounded-lg bg-black/40 border border-brand-border text-foreground text-sm font-mono resize-y focus:outline-none focus:border-violet-500"
          placeholder="<h2>Título da seção</h2><p>Parágrafo...</p>"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-brand-surface-2 text-gray-400 hover:text-white border border-brand-border text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!raw.trim()}
            onClick={() => onConfirm(raw.trim())}
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm disabled:opacity-40"
          >
            Importar
          </button>
        </div>
      </div>
    </div>
  );
}

const IMAGE_MIMES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

function parseYoutubeUrl(input: string): string | null {
  const trimmed = input?.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") {
      const v = url.searchParams.get("v");
      if (v) return `https://www.youtube.com/watch?v=${v}`;
      if (url.pathname.startsWith("/embed/")) {
        const id = url.pathname.split("/").pop();
        if (id) return `https://www.youtube.com/watch?v=${id}`;
      }
    }
    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      if (id) return `https://www.youtube.com/watch?v=${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

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
  const [showImport, setShowImport] = useState(false);

  const handleImportHtml = (html: string) => {
    editor?.commands.setContent(html);
    setShowImport(false);
  };
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
    [editor, token],
  );

  if (!editor) return null;

  const handleImageClick = () => inputRef.current?.click();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && IMAGE_MIMES.includes(file.type)) addImage(file);
    e.target.value = "";
  };

  const handleYoutubeClick = () => {
    const url = window.prompt("URL do vídeo (YouTube):");
    const src = url ? parseYoutubeUrl(url) : null;
    if (src) editor.chain().focus().setYoutubeVideo({ src }).run();
    else if (url) alert("URL do YouTube inválida.");
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
        {'"'}
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
      <button
        type="button"
        onClick={handleImageClick}
        className={btnClass}
        title="Inserir imagem"
      >
        🖼
      </button>
      <button
        type="button"
        onClick={handleYoutubeClick}
        className={btnClass}
        title="Inserir vídeo YouTube"
      >
        ▶
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_MIMES.join(",")}
        onChange={handleImageChange}
        className="hidden"
      />
      <span className="w-px h-6 bg-brand-border self-center mx-1" />
      <button
        type="button"
        onClick={() => setShowImport(true)}
        className={`${btnClass} text-xs font-semibold text-violet-400 hover:text-violet-300`}
        title="Importar HTML gerado por IA"
      >
        {"</> IA"}
      </button>
      {showImport && (
        <ImportHtmlModal
          onConfirm={handleImportHtml}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}

function RichTextEditorInner({ value, onChange, token }: Props) {
  const extensions = useMemo(() => {
    const handleUpload = async (file: File): Promise<string> => {
      const { url } = await uploadImage(file, token);
      return url;
    };

    return [
      StarterKit.configure(),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand-violet-light underline hover:text-brand-cyan",
        },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full h-auto" },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        nocookie: true,
        HTMLAttributes: { class: "rounded-lg w-full aspect-video" },
      }),
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
              editor
                .chain()
                .focus()
                .insertContentAt(pos, { type: "image", attrs: { src: url } })
                .run();
              pos += 1;
            } catch {
              // Falha silenciosa no drop
            }
          }
        },
      }),
    ];
  }, [token]);

  const editor = useEditor({
    extensions,
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm max-w-none min-h-[300px] px-4 py-3 focus:outline-none [&_*]:!my-0.5",
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

export default function RichTextEditor(props: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-lg border border-brand-border overflow-hidden bg-brand-surface">
        <div className="min-h-[300px] flex items-center justify-center text-gray-500">
          Carregando editor...
        </div>
      </div>
    );
  }

  return <RichTextEditorInner {...props} />;
}
