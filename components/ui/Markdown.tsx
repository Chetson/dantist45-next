import ReactMarkdown from "react-markdown";

// react-markdown строит React-элементы и не вставляет сырой HTML, поэтому
// тексты из БД (статьи, уведомления) безопасно выводить без санитизации.
export function Markdown({ children, compact }: { children: string; compact?: boolean }) {
  return (
    <div className={compact ? "space-y-2" : "space-y-4 text-base leading-relaxed sm:text-lg"}>
      <ReactMarkdown
        skipHtml
        components={{
          h2: (props) => <h2 className="pt-2 font-display text-2xl font-bold text-brand-deep" {...props} />,
          h3: (props) => <h3 className="pt-2 text-lg font-semibold text-brand-deep" {...props} />,
          ul: (props) => <ul className="list-disc space-y-1.5 pl-6 marker:text-brand" {...props} />,
          ol: (props) => <ol className="list-decimal space-y-1.5 pl-6 marker:text-brand" {...props} />,
          a: (props) => (
            <a className="font-medium text-brand underline underline-offset-2" {...props} />
          ),
          strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
