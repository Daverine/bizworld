<script setup lang="ts">
import { useEditor, EditorContent, type Content } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";

const model = defineModel();
const props = defineProps<{ placeholder?: string }>();

const editor = useEditor({
  content: model.value as Content,
  extensions: [
    StarterKit.configure({
      bulletList: {
        HTMLAttributes: {
          class: "list",
        },
      },
      orderedList: {
        HTMLAttributes: {
          class: "list",
        },
      },
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
  ],
  onUpdate: ({ editor }) => {
    model.value = editor.isEmpty ? "" : editor.getHTML();
  },
});

watch(
  () => model.value,
  (value) => {
    if (editor.value?.getHTML() !== value) editor.value?.commands.setContent(value as Content);
  },
);
</script>
<template>
  <div class="richtextbox input">
    <div class="icon-items menu text-xs">
      <button
        type="button"
        class="item"
        @click="editor?.chain().focus().toggleBold().run()"
        :class="{ active: editor?.isActive('bold') }"
      >
        <Icon name="material-symbols:format-bold-rounded" />
      </button>
      <button
        type="button"
        class="item"
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="{ active: editor?.isActive('italic') }"
      >
        <Icon name="material-symbols:format-italic-rounded" />
      </button>
      <button
        type="button"
        class="item"
        @click="editor?.chain().focus().toggleUnderline().run()"
        :class="{ active: editor?.isActive('underline') }"
      >
        <Icon name="material-symbols:format-underlined-rounded" />
      </button>
      <button
        type="button"
        class="item"
        @click="editor?.chain().focus().toggleBulletList().run()"
        :class="{ active: editor?.isActive('bulletList') }"
      >
        <Icon name="material-symbols:format-list-bulleted-rounded" />
      </button>
      <button
        type="button"
        class="item"
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :class="{ active: editor?.isActive('orderedList') }"
      >
        <Icon name="material-symbols:format-list-numbered-rounded" />
      </button>
    </div>
    <hr />
    <EditorContent :editor="editor" />
  </div>
</template>
<style>
.richtextbox {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.25em;
  padding: 0.25rem;

  .tiptap {
    outline-width: 0px;
    padding: 0.5em 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    p.is-editor-empty:first-child::before {
      opacity: 0.5;
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }
  }
}
</style>
