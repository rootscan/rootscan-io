'use client';

import { Suspense } from 'react';
import ReactJson from 'react18-json-view';
import 'react18-json-view/src/dark.css';
import 'react18-json-view/src/style.css';

export default function JsonViewer({ json }) {
  return (
    <Suspense fallback={'Loading...'}>
      <div className="overflow-x-auto rounded-lg bg-black/5 p-3 dark:bg-white/5">
        <ReactJson src={json} theme="a11y" collapsed={true} />
      </div>
    </Suspense>
  );
}
