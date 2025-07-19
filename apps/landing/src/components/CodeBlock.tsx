import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({ code }: { code: string }) {
  return (
    <SyntaxHighlighter language="bash" style={atomDark} wrapLongLines>
      {code}
    </SyntaxHighlighter>
  );
}
