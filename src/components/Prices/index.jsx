import React, { useEffect, useMemo, useState } from 'react'

const API_URL = 'https://68d0487dec1a5ff33826f151.mockapi.io/price'

function formatPrice(value) {
    if (value === undefined || value === null || value === '') return '—'
    const num = Number(value)
    if (Number.isNaN(num)) return '—'
    return num.toFixed(2)
}

function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

export default function PricesWidget() {
    const [prices, setPrices] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()

        const load = async () => {
            try {
                setLoading(true)
                const res = await fetch(API_URL, { signal: controller.signal })
                if (!res.ok) throw new Error('Не удалось загрузить цены')
                const data = await res.json()
                // Берём самую свежую запись
                const sorted = Array.isArray(data)
                    ? [...data].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
                    : []
                if (isMounted) setPrices(sorted[0] || null)
            } catch (e) {
                if (isMounted) setError('Ошибка загрузки цен')
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        load()
        return () => {
            isMounted = false
            controller.abort()
        }
    }, [])

    const items = useMemo(() => ([
        { key: 'diesel', label: 'ДТ' },
        { key: 'dieselEuro', label: 'ДТ Евро' },
        { key: 'gas', label: 'Газ' },
        { key: 'ai92', label: 'АИ‑92' },
        { key: 'ai95', label: 'АИ‑95' },
        { key: 'ai100', label: 'АИ‑100' },
    ]), [])

    return (
        <div className="max-w-[1200px] mx-auto mt-12">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                {/* Заголовок */}
                <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 border-b border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        ⛽ Актуальные цены на топливо
                    </h3>
                    {prices?.updatedAt && (
                        <div className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-0 flex items-center gap-1">
                            🔄 Обновлено: {formatDate(prices.updatedAt)}
                        </div>
                    )}
                </div>

                {/* Контент */}
                <div className="px-6 py-8">
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-28 rounded-2xl bg-gray-100 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-red-600 text-sm">{error}</div>
                    ) : !prices ? (
                        <div className="text-gray-500 text-sm">Цены пока не добавлены</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                            {items.map((it, idx) => (
                                <div
                                    key={it.key}
                                    className={`rounded-2xl p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:scale-[1.03]
                ${idx % 2 === 0
                                            ? "bg-gradient-to-br from-indigo-50 to-indigo-100"
                                            : "bg-gradient-to-br from-emerald-50 to-emerald-100"
                                        }
              `}
                                >
                                    {/* Метка */}
                                    <div className="text-sm font-semibold text-gray-700 flex items-center justify-center gap-1">
                                        {it.icon} {it.label}
                                    </div>

                                    {/* Цена */}
                                    <div className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
                                        {formatPrice(prices[it.key])}
                                    </div>

                                    {/* Подпись */}
                                    <div className="mt-1 text-xs text-gray-500 uppercase tracking-wide">
                                        рублей
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>



    )
}


