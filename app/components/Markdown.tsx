'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import './article-prose.css';

export default function Markdown({ source }: { source: string }) {
  return (
    <div className="article-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // 이미지만 든 문단은 언랩해서 figure가 블록으로 나오게(무효 중첩 방지)
          p: ({ node, children, ...props }: any) => {
            const kids = node?.children;
            if (kids?.length === 1 && kids[0].type === 'element' && kids[0].tagName === 'img') {
              return <>{children}</>;
            }
            return <p {...props}>{children}</p>;
          },
          img: ({ node, ...props }: any) => (
            <figure>
              <img {...props} loading="lazy" />
              {props.alt ? <figcaption>{props.alt}</figcaption> : null}
            </figure>
          ),
          a: ({ node, ...props }: any) => (
            <a target="_blank" rel="noopener noreferrer" {...props} />
          ),
          table: ({ node, ...props }: any) => (
            <div className="table-wrap"><table {...props} /></div>
          ),
        }}
      >
        {source || ''}
      </ReactMarkdown>
    </div>
  );
}
