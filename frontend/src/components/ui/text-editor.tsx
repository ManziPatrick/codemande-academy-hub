import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface TextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['blockquote', 'code-block'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'color', 'background',
  'align',
  'link', 'image', 'video',
  'blockquote', 'code-block'
];

export function TextEditor({ value, onChange, placeholder }: TextEditorProps) {
  return (
    <div className="bg-background rounded-md overflow-hidden border border-border/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all shadow-sm">
      <style>{`
        .quill {
          background: transparent;
        }
        .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid rgba(139, 139, 139, 0.1);
          background: rgba(255, 255, 255, 0.02);
          padding: 8px 12px;
        }
        .ql-container.ql-snow {
          border: none;
          font-family: inherit;
          font-size: 0.875rem;
          min-height: 180px;
        }
        .ql-editor {
          padding: 12px 16px;
          min-height: 180px;
          color: inherit;
        }
        .ql-editor.ql-blank::before {
          color: rgba(139, 139, 139, 0.5);
          font-style: normal;
          left: 16px;
        }
        .ql-snow .ql-stroke {
          stroke: currentColor;
          opacity: 0.7;
        }
        .ql-snow .ql-fill {
          fill: currentColor;
          opacity: 0.7;
        }
        .ql-snow .ql-picker {
          color: currentColor;
          opacity: 0.7;
        }
        .ql-snow.ql-toolbar button:hover .ql-stroke,
        .ql-snow.ql-toolbar button:hover .ql-fill,
        .ql-snow.ql-toolbar button.ql-active .ql-stroke,
        .ql-snow.ql-toolbar button.ql-active .ql-fill {
          stroke: #B8860B;
          fill: #B8860B;
          opacity: 1;
        }
      `}</style>
      <ReactQuill 
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
