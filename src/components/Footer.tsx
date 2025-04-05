import React from 'react';

const Footer = ({ version }: { version: string }) => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          © {new Date().getFullYear()} AI Detection Tool. All rights reserved.
        </p>
        <p className="text-sm mt-2 md:mt-0">
          Version: {version}
        </p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="/privacy" className="hover:text-white">Privacy Policy</a>
          <a href="/about" className="hover:text-white">About</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
