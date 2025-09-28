import React, { useState } from "react";
import { Menu, X } from "lucide-react"; 
import HeaderLogo from "../../assets/Header-icons/Header-logo.svg";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white">
      <div className="mx-auto flex max-w-[1300px] items-center justify-between p-4">
        
        <div className="Header-logo">
          <img className="w-[91px] h-[31px]" src={HeaderLogo} alt="Логотип" />
        </div>

        
        <nav className="hidden md:block">
          <ul className="flex gap-[30px] text-[16px] font-600 text-[#1E1E1E]">
            <li>
              <a href="/">Главная</a>
            </li>
            <li>
              <a href="/">О нас</a>
            </li>
            <li>
              <a href="/">Отзывы</a>
            </li>
          </ul>
        </nav>

      
        <button
          className="md:hidden text-[#1E1E1E]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col gap-4 p-4 text-[18px] font-bold text-[#1E1E1E]">
            <li>
              <a href="/" onClick={() => setIsOpen(false)}>
                Главная
              </a>
            </li>
            <li>
              <a href="/" onClick={() => setIsOpen(false)}>
                О нас
              </a>
            </li>
            <li>
              <a href="/" onClick={() => setIsOpen(false)}>
                Отзывы
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;
