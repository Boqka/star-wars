import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Content from './Content';

function App() {
  const queryClient = new QueryClient();
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Content />
      </QueryClientProvider>
    </Router>
  );
}
export default App;
