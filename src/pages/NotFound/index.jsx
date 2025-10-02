import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-16 md:py-24">
      <div className="text-center">
        <div className="text-7xl md:text-9xl font-extrabold text-gray-200 select-none">404</div>
        <h1 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900">Страница не найдена</h1>
        <p className="mt-2 text-gray-500">Возможно, страница была удалена или вы перешли по неверной ссылке.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 text-white px-5 py-2.5 text-sm md:text-base font-medium shadow hover:shadow-lg transition-all duration-200"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  )
}
