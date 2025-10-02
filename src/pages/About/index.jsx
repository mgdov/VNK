import React from 'react'

export default function AboutPage() {
    return (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-4 my-8 sm:my-12">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-12 mb-8 bg-gradient-to-r from-slate-800 to-gray-900 text-white shadow-xl ring-1 ring-black/10">
                {/* decorative blurred shapes */}
                <div className="hidden sm:block absolute -top-16 -left-16 w-72 h-72 rounded-full bg-indigo-600/30 blur-3xl transform -rotate-12 pointer-events-none" aria-hidden />
                <div className="hidden sm:block absolute -bottom-16 -right-12 w-56 h-56 rounded-full bg-purple-600/20 blur-2xl pointer-events-none" aria-hidden />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-sm font-medium mb-4">Официальная АЗС VNK</span>

                    <h1 className="mb-3 text-2xl sm:text-3xl md:text-4xl leading-tight font-bold tracking-tight">О VNK — ваша заправка</h1>

                    <p className="text-base sm:text-lg md:text-xl font-normal mb-5 leading-relaxed text-white/90">VNK — это современная автозаправочная сеть. Мы предлагаем качественный бензин, внимательное обслуживание и дружелюбный персонал, чтобы каждая заправка была быстрой и надёжной.</p>

                    {/* controls removed per request */}
                </div>
            </section>

            {/* Core strengths */}
            <section id="values" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-lg hover:scale-[1.02]">
                    <h3 className="text-lg font-semibold mb-2">⛽️ Качественный бензин</h3>
                    <p className="text-gray-600">Мы реализуем только проверенное топливо с высокой октановой стабильностью — для лучшей работы двигателя и экономии топлива.</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-lg hover:scale-[1.02]">
                    <h3 className="text-lg font-semibold mb-2">👷 Хорошие работники</h3>
                    <p className="text-gray-600">Наш персонал проходит обучение и работает по стандартам сервиса: вежливо, быстро и профессионально помогут с любой операцией.</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-lg hover:scale-[1.02]">
                    <h3 className="text-lg font-semibold mb-2">🧰 Качественное обслуживание</h3>
                    <p className="text-gray-600">Чистые площадки, исправное оборудование и внимательное отношение — мы заботимся о комфорте клиентов и безопасности на заправке.</p>
                </div>
            </section>

            {/* Additional info - full width services block */}
            <section className="w-full bg-white rounded-2xl p-8 md:p-10 mb-8 shadow-md border border-gray-100">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">Наши услуги</h3>
                        <p className="text-gray-600 mb-6">Мы предлагаем полный набор услуг на заправке, чтобы вы могли продолжить путь с комфортом и уверенностью.</p>
                        {/* CTAs removed per request */}
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <div className="p-4 bg-gray-50 rounded-lg flex items-start gap-3">
                            <div className="text-2xl">⛽️</div>
                            <div>
                                <h4 className="font-semibold">Заправка топлива</h4>
                                <p className="text-sm text-gray-500">АИ‑92, АИ‑95, ДТ и газ — только качественное топливо.</p>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg flex items-start gap-3">
                            <div className="text-2xl">💳</div>
                            <div>
                                <h4 className="font-semibold">Удобная оплата</h4>
                                <p className="text-sm text-gray-500">Оплата картой, наличными и бесконтактно для быстрого обслуживания.</p>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg flex items-start gap-3">
                            <div className="text-2xl">🛒</div>
                            <div>
                                <h4 className="font-semibold">Магазин и кафе</h4>
                                <p className="text-sm text-gray-500">Кафе с горячими напитками и небольшой магазин товаров для дороги.</p>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg flex items-start gap-3">
                            <div className="text-2xl">🔧</div>
                            <div>
                                <h4 className="font-semibold">Шиномонтаж и сервис</h4>
                                <p className="text-sm text-gray-500">Быстрые проверки давления, мелкий ремонт и базовый техосмотр.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
