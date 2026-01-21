import React from 'react';

const WhatsAppButton = () => {
  return (
    <a 
      href="https://api.whatsapp.com/send?phone=919390147883&text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services." 
      target="_blank" 
      rel="noopener noreferrer"
      className="whatsapp-button fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] rounded-full shadow-lg flex justify-center items-center transition-transform duration-300 hover:scale-110"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" 
        alt="WhatsApp Chat" 
        className="w-10 h-10"
      />
    </a>
  );
};

export default WhatsAppButton;