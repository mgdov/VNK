import React, { useState, useCallback } from 'react'

const Map2GIS = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)

    const handleLoad = useCallback(() => {
        setIsLoaded(true)
    }, [])

    const handleError = useCallback(() => {
        setHasError(true)
        setIsLoaded(true)
    }, [])

    if (hasError) {
        return (
            <div className="mt-10 p-8 bg-gray-100 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Карта временно недоступна
                </h3>
                <p className="text-gray-600">
                    Попробуйте обновить страницу или зайти позже
                </p>
            </div>
        )
    }

    return (
        <div className="mt-10 relative">
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Загрузка карты...</p>
                    </div>
                </div>
            )}
            <iframe
                src="https://swdgts.ru/899f18f7560288b8fb6374a93fd1a415"
                width="100%"
                height="700"
                frameBorder="0"
                onLoad={handleLoad}
                onError={handleError}
                title="Карта 2GIS"
                loading="lazy"
                className="rounded-lg shadow-lg"
            />
        </div>
    )
}

export default Map2GIS