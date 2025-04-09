//import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-center py-4 mt-10 border-t border-gray-700 fixed bottom-0 left-0">
      <p className="text-sm text-white">
        © {new Date().getFullYear()} CineNiche. All rights reserved. &nbsp;
        <Link
          to="/privacy"
          className="underline text-blue-600 hover:text-blue-800"
        >
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
