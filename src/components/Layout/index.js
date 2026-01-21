import React from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from '../../UI/WhatsAppButton';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;