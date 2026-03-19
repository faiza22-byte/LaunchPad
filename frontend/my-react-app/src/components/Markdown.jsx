import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ content, className = "" }) {
  return (
    <div
      className={`prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content || "*No content provided.*"}
      </ReactMarkdown>
    </div>
  );
}