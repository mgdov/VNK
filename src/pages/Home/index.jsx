import React, { Suspense, lazy } from 'react'

// Lazy load components for better performance
const CarouselComp = lazy(() => import('../../components/Carousel'))
const NewsBlock = lazy(() => import('../../components/News'))

// Loading component
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
)

function Home() {
    return (
        <div className="HomeWrapper">
            <Suspense fallback={<LoadingSpinner />}>
                <CarouselComp />
            </Suspense>
            <Suspense fallback={<LoadingSpinner />}>
                <NewsBlock />
            </Suspense>
        </div>
    )
}

export default Home