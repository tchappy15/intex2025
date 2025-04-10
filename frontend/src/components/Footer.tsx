//import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full text-center py-4 border-t border-gray-700 mt-auto mb-4">
      <p className="text-sm text-white">
        © {new Date().getFullYear()} CineNiche. All rights reserved. &nbsp;
        <Link
          to="/privacy"
          className="underline text-blue-400 hover:text-blue-600"
        >
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
};


export default Footer;
