<template>
  <div
    class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 transition-all focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/10"
    :class="{ 'border-red-500/50': error }"
  >
    <div
      v-if="showToolbar"
      class="flex flex-wrap items-center gap-0.5 border-b border-zinc-800/60 px-2 py-1.5"
    >
      <button
        type="button"
        @click="editor?.chain().focus().toggleBold().run()"
        :class="editor?.isActive('bold') ? 'bg-violet-500/20 text-violet-300' : 'text-zinc-500 hover:text-zinc-300'"
        class="rounded-md px-1.5 py-0.5 text-xs font-bold transition-colors"
        title="Bold"
      >B</button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="editor?.isActive('italic') ? 'bg-violet-500/20 text-violet-300' : 'text-zinc-500 hover:text-zinc-300'"
        class="rounded-md px-1.5 py-0.5 text-xs italic transition-colors"
        title="Italic"
      >I</button>
      <span class="mx-0.5 h-4 w-px bg-zinc-800"></span>
      <button
        type="button"
        @click="editor?.chain().focus().toggleBulletList().run()"
        :class="editor?.isActive('bulletList') ? 'bg-violet-500/20 text-violet-300' : 'text-zinc-500 hover:text-zinc-300'"
        class="rounded-md px-1.5 py-0.5 text-xs transition-colors"
        title="Bullet list"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :class="editor?.isActive('orderedList') ? 'bg-violet-500/20 text-violet-300' : 'text-zinc-500 hover:text-zinc-300'"
        class="rounded-md px-1.5 py-0.5 text-xs transition-colors"
        title="Numbered list"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="editor?.isActive('heading', { level: 3 }) ? 'bg-violet-500/20 text-violet-300' : 'text-zinc-500 hover:text-zinc-300'"
        class="rounded-md px-1.5 py-0.5 text-xs font-bold transition-colors"
        title="Heading"
      >H</button>
      <span class="mx-0.5 h-4 w-px bg-zinc-800"></span>
      <button
        type="button"
        @click="editor?.chain().focus().toggleLink().run()"
        :class="editor?.isActive('link') ? 'bg-violet-500/20 text-violet-300' : 'text-zinc-500 hover:text-zinc-300'"
        class="rounded-md px-1.5 py-0.5 text-xs transition-colors"
        title="Link"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
      </button>
    </div>
    <editor-content :editor="editor" class="prose prose-invert max-w-none px-4 py-2.5 text-sm text-zinc-200" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { onBeforeUnmount, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  showToolbar?: boolean
  error?: string
}>(), {
  modelValue: '',
  placeholder: 'Tulis sesuatu...',
  showToolbar: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: { levels: [3] },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { class: 'text-violet-400 underline hover:text-violet-300' },
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(() => props.modelValue, (newVal) => {
  if (editor.value && newVal !== editor.value.getHTML()) {
    editor.value.commands.setContent(newVal, { emitUpdate: false })
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
.tiptap {
  outline: none;
  min-height: 80px;
}
.tiptap p { margin: 0.25em 0; }
.tiptap ul, .tiptap ol { padding-left: 1.25em; margin: 0.25em 0; }
.tiptap li { margin: 0.15em 0; }
.tiptap h3 { font-size: 1rem; font-weight: 600; margin: 0.5em 0 0.25em; color: #e4e4e7; }
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: #52525b;
  pointer-events: none;
  float: left;
  height: 0;
}
</style>
