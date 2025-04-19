import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold text-gray-800">My Company Name</h1>
        </div>
        <nav className="space-x-4">
          <Link href="/upload" className="text-gray-600 hover:text-blue-600">
            Upload
          </Link>
          <Link href="/download" className="text-gray-600 hover:text-blue-600">
            Download
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
