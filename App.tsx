/**
 * BookPublisher MD2Docx
 * Copyright (c) 2025 EricHuang
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

import React, { useState, useEffect } from 'react';
import MarkdownEditor from './components/MarkdownEditor';
import { AudienceView } from './components/presenter/AudienceView';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route === '#/audience') {
    // In a real scenario, AudienceView needs to receive data via BroadcastChannel or similar.
    // For now, it will render the "Waiting" state.
    return <AudienceView slides={[]} currentIndex={0} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <MarkdownEditor />
      </main>
    </div>
  );
};

export default App;
