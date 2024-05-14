'use client';

import AceEditor from 'react-ace';

import { CopyButton } from '@/components/copy-button';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

export default function CodeEditor({ fileName, value }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <span className="text-muted-foreground text-sm">{fileName}</span>
        <CopyButton value={JSON.stringify(value)} />
      </div>
      <AceEditor
        value={value}
        mode="javascript"
        theme="monokai"
        readOnly
        fontSize={14}
        width="100%"
        className="rounded-xl bg-black/70 dark:bg-white/5"
      />
    </div>
  );
}
