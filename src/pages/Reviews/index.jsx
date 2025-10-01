import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Minus } from 'lucide-react'

function Review() {
    const locations = useMemo(() => ([
        { id: 'sabnova', title: 'Дербентский район, с.п. Сабнова', url: 'https://yandex.ru/maps/-/CHdbnKj~' },
        { id: 'izberbash', title: 'г. Избербаш', url: 'https://yandex.ru/maps/-/CLubbPMF' },
        { id: 'mahachkala-bulacha', title: 'Махачкала, ул. Хаджи Булача, 74', url: 'https://yandex.ru/maps/-/CLubfUPS' },
        { id: 'gurbuki-raion', title: 'Карабудахкентский р-н, с.п. Гурбуки', url: 'https://yandex.ru/maps/-/CLe1VZMA' },
        { id: 'gurbuki-alych', title: 'с. Гурбуки, мкр. Алычовый сад, 1700', url: 'https://yandex.ru/maps/-/CHdPVLz8' },
        { id: 'mahachkala-akush', title: 'Махачкала, просп. А.-Г. Акушинского, 77', url: 'https://yandex.ru/maps/-/CLubjCIX' },
        { id: 'korkmaskala', title: 'Кумторкалинский р-н, с. Коркмаскала', url: 'https://yandex.ru/maps/-/CLubjHyS' },
    ]), []);

    const [activeId, setActiveId] = useState(locations[0].id);

    const active = useMemo(
        () => locations.find(l => l.id === activeId) || locations[0],
        [locations, activeId]
    );

    const handleLocationChange = useCallback((id) => {
        setActiveId(id);
    }, []);

    return (
        <div className='HomeWrapper'>
            <div className="mt-12 pb-10 md:pt-16">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                    ⭐ Отзывы клиентов
                </h2>
            </div>

            {/* Переключатель АЗС */}
            <div className="w-full overflow-x-auto">
                <div className="inline-flex gap-2 md:gap-3 border border-gray-200 rounded-xl p-1.5 bg-gray-50 shadow-inner">
                    {locations.map((loc) => (
                        <button
                            key={loc.id}
                            onClick={() => handleLocationChange(loc.id)}
                            className={`
          px-4 md:px-6 py-2.5 rounded-lg text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-1
          ${activeId === loc.id
                                    ? "bg-gray-900 text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }
        `}
                        >
                            ⛽ {loc.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Карточка активной АЗС */}
            <div className="mt-8 md:mt-10">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 flex items-center gap-2">
                                {active.title}
                            </h3>
                            <p className="mt-2 text-sm md:text-base text-gray-500">
                                📍 Откройте страницу на Яндекс.Картах, чтобы посмотреть отзывы клиентов
                                и оставить свой
                            </p>
                        </div>

                        <a
                            href={active.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 text-white px-5 py-2.5 text-sm md:text-base font-medium shadow hover:shadow-lg transition-all duration-200"
                        >
                            ✍️ Оставить отзыв
                        </a>
                    </div>
                </div>
            </div>


            {/* Thematic content */}
            <div className="mt-10 md:mt-14 grid grid-cols-1 gap-6">
                {/* Rating summary */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h4 className="text-lg font-semibold">Рейтинг сети VNK</h4>
                            <p className="mt-1 text-sm text-gray-500">Средняя оценка по Яндекс.Картам за последние 12 месяцев</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-2xl font-bold">4.8</div>
                            <div className="flex items-center text-yellow-500" aria-label="Рейтинг 4.8 из 5">
                                <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-gray-300">★</span>
                            </div>
                            <div className="text-sm text-gray-500">1 200+ отзывов</div>
                        </div>
                    </div>
                </div>

                {/* Why choose section */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 md:p-6">
                    <h4 className="text-lg font-semibold">Почему выбирают VNK</h4>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="rounded-lg border border-gray-100 p-4">
                            <div className="text-sm font-medium">Качество топлива</div>
                            <p className="mt-1 text-sm text-gray-500">Сертификация и регулярные проверки качества.</p>
                        </div>
                        <div className="rounded-lg border border-gray-100 p-4">
                            <div className="text-sm font-medium">Сервис 24/7</div>
                            <p className="mt-1 text-sm text-gray-500">Удобный график и оперативное обслуживание.</p>
                        </div>
                        <div className="rounded-lg border border-gray-100 p-4">
                            <div className="text-sm font-medium">Честные цены</div>
                            <p className="mt-1 text-sm text-gray-500">Прозрачная стоимость без скрытых наценок.</p>
                        </div>
                        <div className="rounded-lg border border-gray-100 p-4">
                            <div className="text-sm font-medium">Инфраструктура</div>
                            <p className="mt-1 text-sm text-gray-500">Кофе-зона, магазин и удобные парковки.</p>
                        </div>
                    </div>
                </div>



                {/* FAQ Accordion */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm mb-[40px] p-5 md:p-6">
                    <h4 className="text-lg font-semibold">Частые вопросы</h4>
                    <Accordion
                        items={[
                            {
                                q: 'Где посмотреть актуальные цены на топливо?',
                                a: 'Цены указаны на стелах АЗС и в наших новостях на сайте.'
                            },
                            {
                                q: 'Работаете ли вы ночью?',
                                a: 'Да, большинство станций сети работают круглосуточно.'
                            },
                            {
                                q: 'Можно ли оплатить картой?',
                                a: 'Принимаем наличные и банковские карты, включая бесконтактные платежи.'
                            }
                        ]}
                    />
                </div>
            </div>
        </div>
    )
}

function Accordion({ items }) {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = useCallback((index) => {
        setOpenIndex(prev => prev === index ? null : index);
    }, []);

    return (
        <div className="mt-4 divide-y divide-gray-100">
            {items.map((item, index) => (
                <AccordionItem
                    key={`faq-${index}`}
                    index={index}
                    question={item.q}
                    answer={item.a}
                    opened={openIndex === index}
                    onToggle={handleToggle}
                />
            ))}
        </div>
    );
}

const AccordionItem = React.memo(({ index, question, answer, opened, onToggle }) => {
    const contentRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState(0);

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;

        if (opened) {
            setMaxHeight(el.scrollHeight);
        } else {
            setMaxHeight(0);
        }
    }, [opened]);

    const handleClick = useCallback(() => {
        onToggle(index);
    }, [onToggle, index]);

    return (
        <div className="py-2">
            <button
                className="w-full flex items-center justify-between text-left py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                onClick={handleClick}
                aria-expanded={opened}
                aria-controls={`acc-panel-${index}`}
            >
                <span className="text-sm md:text-base font-medium text-gray-900 pr-4">
                    {question}
                </span>
                <span className={`ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-200 flex-shrink-0 ${opened ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>
                    {opened ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
            </button>
            <div
                id={`acc-panel-${index}`}
                ref={contentRef}
                style={{
                    maxHeight,
                    transition: 'max-height 220ms ease, opacity 220ms ease, transform 220ms ease'
                }}
                className={`overflow-hidden ${opened ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
            >
                <div className="pt-1 pb-3 pr-10 text-sm text-gray-600">
                    {answer}
                </div>
            </div>
        </div>
    );
});

export default Review