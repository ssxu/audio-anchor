import React from 'react';
import TranscriptionPlayer from './components/TranscriptionPlayer';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>音轨文踪</h1>
      </header>
      <main className="app-main">
        <TranscriptionPlayer />
      </main>
      <footer className="app-footer">
        <p>© 2024 音视频转录系统</p>
      </footer>
    </div>
  );
}

export default App; 