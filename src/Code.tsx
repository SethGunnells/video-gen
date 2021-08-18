import SyntaxHighlighter from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const Code: React.FC<{
  opacity: number;
}> = ({ children, opacity }) => (
  <SyntaxHighlighter
    language="javascript"
    style={nord}
    customStyle={{
      background: 'none',
      fontSize: 80,
      margin: 0,
      padding: 0,
      opacity
    }}
  >
    {children}
  </SyntaxHighlighter>
);

export default Code;
