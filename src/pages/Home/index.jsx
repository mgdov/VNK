import React from 'react'
import CarouselComp from '../../components/Carousel'
import NewsBlock from '../../components/News'
import Header from '../../components/Header'


function Home() {
    return (
        <div className='HomeWrapper'>
            <CarouselComp />
            <NewsBlock />
        </div>
    )
}

export default Home