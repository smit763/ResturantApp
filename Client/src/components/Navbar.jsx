import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-black fixed top-0 left-0 w-full z-10 shadow-xl py-4">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <div className="text-4xl font-extrabold text-red-600 hover:text-orange-500 transition duration-300 cursor-pointer">
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-5xl">🍽️</span>
            <span>Restaurant</span>
          </Link>
        </div>
      </div>

      <div className="w-full mt-2 bg-red-600 h-1 transform scale-x-0 transition duration-500"></div>
    </nav>
  );
};

export default Navbar;
