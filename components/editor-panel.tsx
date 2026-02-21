'use client';

import { useCompiler } from '@/context/compiler-context';
import dynamic from 'next/dynamic';
import { memo, useCallback } from 'react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react').then(mod => mod.default), {
  loading: () => <div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading editor...</div>,
  ssr: false
});

export const EditorPanel = memo(function EditorPanel() {
  const { code, setCode, theme } = useCompiler();

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  }, [setCode]);

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border border-border-soft bg-surface-dark relative group">
      {/* Subtle inner shadow on focus */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none group-focus-within:shadow-inset opacity-100" style={{
        boxShadow: 'inset 0 0 20px rgba(66, 15, 231, 0.05)',
      }} />
      
      <MonacoEditor
        height="100%"
        defaultLanguage="javascript"
        value={code}
        onChange={handleEditorChange}
        theme={theme === 'dark' ? 'vs-dark' : 'vs'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: '"Geist Mono", monospace',
          lineHeight: 1.6,
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          formatOnPaste: true,
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  );
});
