import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import HeaderLogo from "../../assets/Header-icons/Header-logo.svg";
import { Link } from "react-router-dom";
function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white">
      <div className="mx-auto mt-[25px] flex max-w-[1300px] items-center justify-between pt-4">

        <div className="Header-logo">
          <Link to='/'><img className="w-[91px] h-[31px]" src={HeaderLogo} alt="Логотип" /></Link>
        </div>


        <nav className="hidden md:block">
          <ul className="flex gap-[30px] text-[16px] font-600 text-[#1E1E1E]">
            <li>
              <Link to='/'>Главная</Link>
            </li>
            <li>
              <a href="/">О нас</a>
            </li>
            <li>
              <Link to='/review'>Отзывы</Link>
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
          <ul className="flex flex-col gap-4 text-[18px] font-bold text-[#1E1E1E]">
            <li>
              <Link to onClick={() => setIsOpen(false)}>
                Главная
              </Link>
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
