import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';

export const VictimLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-transparent flex-col">
      <Header />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
