import React, { useMemo, useState, useCallback } from 'react'

export default function ReviewsTop() {
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
        <div className="mt-12 pb-10 md:pt-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">⭐ Отзывы клиентов</h2>

            <div className="mt-6 w-full overflow-x-auto">
                <div className="inline-flex gap-2 md:gap-3 border border-gray-200 rounded-xl p-1.5 bg-gray-50 shadow-inner mt-4">
                    {locations.map((loc) => (
                        <button
                            key={loc.id}
                            onClick={() => handleLocationChange(loc.id)}
                            className={`px-4 md:px-6 py-2.5 rounded-lg text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-1 ${activeId === loc.id ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                        >
                            ⛽ {loc.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-8 md:mt-10">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 flex items-center gap-2">{active.title}</h3>
                            <p className="mt-2 text-sm md:text-base text-gray-500">📍 Откройте страницу на Яндекс.Картах, чтобы посмотреть отзывы клиентов и оставить свой</p>
                        </div>

                        <a href={active.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 text-white px-5 py-2.5 text-sm md:text-base font-medium shadow hover:shadow-lg transition-all duration-200">
                            ✍️ Оставить отзыв
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
