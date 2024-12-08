import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <h1>Welcome to My Library Bookie</h1>
      </main>
    </div>
  );
}

export default App;