import { useEffect, type FC } from "react";

// Third-party Imports
import {
  Card,
  CardContent,
  Divider,
  FormHelperText,
  Grid,
} from "@mui/material";
import classnames from "classnames";
import type { Editor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";

// Components Imports
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";

import CustomIconButton from "@core/components/mui/IconButton";

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 pbs-5 pbe-4 pli-5">
      <CustomIconButton
        {...(editor.isActive("bold") && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i
          className={classnames("ri-bold", {
            "text-textSecondary": !editor.isActive("bold"),
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive("underline") && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i
          className={classnames("ri-underline", {
            "text-textSecondary": !editor.isActive("underline"),
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive("italic") && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i
          className={classnames("ri-italic", {
            "text-textSecondary": !editor.isActive("italic"),
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive("strike") && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i
          className={classnames("ri-strikethrough", {
            "text-textSecondary": !editor.isActive("strike"),
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: "left" }) && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <i
          className={classnames("ri-align-left", {
            "text-textSecondary": !editor.isActive({ textAlign: "left" }),
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: "center" }) && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <i
          className={classnames("ri-align-center", {
            "text-textSecondary": !editor.isActive({ textAlign: "center" }),
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: "right" }) && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <i
          className={classnames("ri-align-right", {
            "text-textSecondary": !editor.isActive({ textAlign: "right" }),
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: "justify" }) && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <i
          className={classnames("ri-align-justify", {
            "text-textSecondary": !editor.isActive({ textAlign: "justify" }),
          })}
        />
      </CustomIconButton>
    </div>
  );
};

interface Props {
  onUpdate: (html: string) => void;
  label: string;
  value: string;
  error: any;
}

const ProductDescriptionEditor: FC<Props> = ({
  onUpdate,
  label,
  value,
  error,
}): JSX.Element => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: label,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
    ],

    content: value,

    onUpdate: () => {
      const html = editor?.getHTML();

      if (html) {
        onUpdate(html);
      }
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <Grid item xs={6}>
      <Card
        className={`p-0 border border-[#686A83] hover:border-[#9FA0B8] shadow-none ${error && "border-error"}`}
      >
        <CardContent className="p-0">
          <EditorToolbar editor={editor} />
          <Divider className="mli-5" />
          <EditorContent
            editor={editor}
            className="bs-[135px] overflow-y-auto flex"
          />
        </CardContent>
      </Card>

      {error && (
        <FormHelperText className="text-error">{error.message}</FormHelperText>
      )}
    </Grid>
  );
};

export default ProductDescriptionEditor;
