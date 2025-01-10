"use client";

import { useEffect } from "react";
import YooptaEditor, {
  createYooptaEditor,
  YooptaContentValue,
  YooptaOnChangeOptions,
} from "@yoopta/editor";

import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import Embed from "@yoopta/embed";
import Link from "@yoopta/link";
import Callout from "@yoopta/callout";
import Accordion from "@yoopta/accordion";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from "@yoopta/marks";
import { HeadingOne, HeadingThree, HeadingTwo } from "@yoopta/headings";
import Code from "@yoopta/code";
import Table from "@yoopta/table";
import Divider from "@yoopta/divider";
import ActionMenuList, {
  DefaultActionMenuRender,
} from "@yoopta/action-menu-list";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";
import { useMemo, useRef, useState, useCallback } from "react";

const plugins = [
  Paragraph,
  Table,
  Divider,
  Accordion,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link,
  Embed,
] as any;

const TOOLS = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

function Editor({ doc, email }: { doc: any, email: string | null }) {
  console.log(doc?.content);
  const [value, setValue] = useState<YooptaContentValue>();
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSave = useCallback(async (contentToSave: YooptaContentValue) => {
    try {
      const payload = {
        user: email,
        docs: {
          id: doc?.id,
          title: doc?.title,
          isActive: doc?.isActive,
          content: contentToSave
        }
      };
      
      const response = await fetch(`/api/docs/${doc?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save document');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving document:', error);
    }
  }, [email, doc]);

  const debouncedSave = useCallback((newValue: YooptaContentValue) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      handleSave(newValue);
    }, 1000);
  }, [handleSave]);

  const onChange = useCallback((
    newValue: YooptaContentValue,
    options: YooptaOnChangeOptions
  ) => {
    setValue(newValue);
    debouncedSave(newValue);
  }, [debouncedSave]);

  useEffect(() => {
    // if (doc?.content) {
    //   setValue(doc.content);
      editor.setEditorValue(doc?.content); // Add this line to update editor content
    // }
  }, [doc]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="w-[100%] min-h-[80vh] max-h-[100%] overflow-y-scroll bg-white rounded-lg"
      ref={selectionRef}
    >
      <YooptaEditor
        style={{
          width: "100%",
        }}
        autoFocus={true}
        placeholder="Write something ..."
        editor={editor}
        plugins={plugins}
        tools={TOOLS}
        marks={MARKS}
        selectionBoxRoot={selectionRef}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default Editor;
