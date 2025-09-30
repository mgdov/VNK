import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import HeaderLogo from "../../assets/Header-icons/Header-logo.svg";
import { Link } from "react-router-dom";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="w-full bg-white relative">
      <div className="mx-auto mt-[25px] flex max-w-[1300px] items-center justify-between pt-4">

        <div className="Header-logo">
          <Link to='/'><img className="w-[91px] h-[31px]" src={HeaderLogo} alt="Логотип" /></Link>
        </div>

        <nav className="hidden md:block">
          <ul className="flex gap-[30px] text-[16px] font-600 text-[#1E1E1E]">
            <li>
              <Link to='/' className="hover:text-blue-600 transition-colors duration-200">Главная</Link>
            </li>
            <li>
              <a href="/" className="hover:text-blue-600 transition-colors duration-200">О нас</a>
            </li>
            <li>
              <Link to='/review' className="hover:text-blue-600 transition-colors duration-200">Отзывы</Link>
            </li>
          </ul>
        </nav>

        <button
          className="md:hidden text-[#1E1E1E] p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 relative z-50"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-6">
            <Menu
              size={24}
              className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`}
            />
            <X
              size={24}
              className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={closeMenu} />

      {/* Mobile Menu */}
      <nav className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Меню</h2>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <ul className="flex-1 px-6 py-8 space-y-2">
            <li>
              <Link
                to='/'
                onClick={closeMenu}
                className="block px-4 py-3 text-lg font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                🏠 Главная
              </Link>
            </li>
            <li>
              <a
                href="/"
                onClick={closeMenu}
                className="block px-4 py-3 text-lg font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                ℹ️ О нас
              </a>
            </li>
            <li>
              <Link
                to='/review'
                onClick={closeMenu}
                className="block px-4 py-3 text-lg font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                ⭐ Отзывы
              </Link>
            </li>
          </ul>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              VNK - Ваш надежный партнер
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
