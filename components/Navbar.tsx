import React from "react";

function Navbar() {
  return (
    <nav className="min-w-full">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <div className="text-2xl font-bold">Obecność</div>
        </div>
        <div className="flex items-center">
          <a href="/login" className="text-blue-500">
            Zaloguj się
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
