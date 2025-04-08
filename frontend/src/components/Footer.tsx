//import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 text-center py-4 mt-10 border-t">
      <p className="text-sm text-gray-600">
        © {new Date().getFullYear()} CineNiche. All rights reserved. &nbsp;
        <Link to="/privacy" className="underline text-blue-600 hover:text-blue-800">
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
