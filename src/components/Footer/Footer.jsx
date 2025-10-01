import React, { useState } from "react";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import HeaderLogo from "../../assets/Header-icons/Header-logo.svg"; // путь под свой проект
import axios from "axios"; // опционально, можно убрать если не используешь форму

function Footer() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(null); // null | "loading" | "ok" | "error"

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setStatus("error");
            return;
        }

        try {
            setStatus("loading");
            // Пример: отправляем на свой API (замени URL на реальный)
            // await axios.post("http://localhost:3001/subscribe", { email });
            // Для учебного примера просто задержка
            await new Promise((r) => setTimeout(r, 900));
            setStatus("ok");
            setEmail("");
            setTimeout(() => setStatus(null), 2500);
        } catch (err) {
            console.error(err);
            setStatus("error");
            setTimeout(() => setStatus(null), 2500);
        }
    };

    return (
        <footer className="bg-gray-900 mt-[30px] text-gray-100 w-full">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-4 mt-[80px] py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Блок логотипа + описание */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <img src={HeaderLogo} alt="Логотип" className="w-[90px] h-auto" />
                            <div>
                                <h3 className="text-lg font-semibold">АЗС «Твой Бензин»</h3>
                                <p className="text-sm text-gray-300">Качество топлива • Уютное кафе • 24/7</p>
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm">
                            Наша заправка — место, где скорость обслуживания и качество топлива идут
                            рука об руку. Заходите в кафе на чашечку кофе или воспользуйтесь
                            автомойкой на территории.
                        </p>

                        <div className="flex gap-3 mt-2">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Навигация */}
                    <div className="flex flex-col md:items-start">
                        <h4 className="text-lg font-semibold mb-4">Навигация</h4>
                        <ul className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                            <li>
                                <a href="/" className="hover:text-white transition">Главная</a>
                            </li>
                            <li>
                                <a href="/about" className="hover:text-white transition">О нас</a>
                            </li>
                            <li>
                                <a href="/services" className="hover:text-white transition">Услуги</a>
                            </li>
                            <li>
                                <a href="/prices" className="hover:text-white transition">Цены</a>
                            </li>
                            <li>
                                <a href="/news" className="hover:text-white transition">Новости</a>
                            </li>
                            <li>
                                <a href="/contacts" className="hover:text-white transition">Контакты</a>
                            </li>
                        </ul>

                        <div className="mt-6 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-300" />
                                <a href="mailto:info@example.com" className="hover:text-white">info@example.com</a>
                            </div>
                            <div className="mt-2">Тел.: <a href="tel:+1234567890" className="hover:text-white">+1 (234) 567-890</a></div>
                            <div className="mt-1 text-gray-500 text-xs">Адрес: г. Пример, ул. Главная, 10</div>
                        </div>
                    </div>

                    {/* Подписка */}
                    <div className="flex flex-col">
                        <h4 className="text-lg font-semibold mb-4">Подписка на новости</h4>
                        <p className="text-sm text-gray-300 mb-4">
                            Получайте акции и новости прямо на почту. Обещаем — только важное.
                        </p>

                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                            <label htmlFor="footer-email" className="sr-only">Email</label>
                            <input
                                id="footer-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Введите ваш email"
                                className="min-w-0 flex-1 px-4 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 border border-transparent focus:border-green-500 focus:outline-none"
                                aria-label="Email для подписки"
                            />
                            <button
                                type="submit"
                                className="px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                                disabled={status === "loading"}
                            >
                                {status === "loading" ? "Подписка..." : "Подписаться"}
                            </button>
                        </form>

                        <div className="mt-3 min-h-[24px]">
                            {status === "ok" && (
                                <p className="text-sm text-green-400">Спасибо! Вы подписаны.</p>
                            )}
                            {status === "error" && (
                                <p className="text-sm text-red-400">Проверьте e-mail и попробуйте снова.</p>
                            )}
                        </div>

                        <div className="mt-6 text-xs text-gray-500">
                            <p>Работаем 24/7 · Оплата наличными и картой · Wi-Fi для гостей</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>© {new Date().getFullYear()} АЗС «Твой Бензин». Все права защищены.</div>
                    <div className="flex items-center gap-4">
                        <a href="/privacy" className="hover:text-white">Политика конфиденциальности</a>
                        <a href="/terms" className="hover:text-white">Условия использования</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
