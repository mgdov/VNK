import React from 'react'
import CarouselComp from '../../components/Carousel'
import NewsBlock from '../../components/News'
import Header from '../../components/Header'
import Map2GIS from '../../components/2GIS'

function Home() {
    return (
        <div className='HomeWrapper'>
            <Header />
            <CarouselComp />
            <NewsBlock />
            <Map2GIS />
        </div>
    )
}

export default Home