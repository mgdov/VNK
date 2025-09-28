import React from 'react'
import CarouselComp from '../../components/Carousel'
import NewsBlock from '../../components/News'
import Header from '../../components/Header'
import Map2GIS from '../../components/2GIS'
import Footer from '../../components/Footer/Footer.jsx'

function Home() {
    return (
        <div>
            <div className='HomeWrapper'>
                <Header />
                <CarouselComp />
                <NewsBlock />
                <Map2GIS />

            </div>
            <Footer/>
        </div>

    )
}

export default Home