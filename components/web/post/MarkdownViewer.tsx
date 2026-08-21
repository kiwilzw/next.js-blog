'use client'
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
// ✅ 客户端组件内才能导入highlight.js的css
import "highlight.js/styles/github.css";

type Props = {
  content: string
}
export function MarkdownViewer({ content }: Props) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}