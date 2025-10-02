import React, { useMemo } from 'react'
import { Carousel } from 'antd'
import { motion } from 'framer-motion'

// Import images
import Fura from '../../assets/Content-carousel/fura.png'
import Cafe from '../../assets/Content-carousel/cafe.png'
import Zapravka from '../../assets/Content-carousel/zapravka.png'
import BigZapravka from '../../assets/Content-carousel/bigzapravka.png'
import VezdZapravka from '../../assets/Content-carousel/vezdzapravka.png'
import VNK from '../../assets/Content-carousel/vnk.png'

// Slide data
const SLIDES = [
    {
        img: Fura,
        title: 'Грузовые заправки',
        desc: 'Удобно и быстро для дальнобойщиков',
        alt: 'Грузовая заправка VNK'
    },
    {
        img: VezdZapravka,
        title: 'Лёгкий въезд',
        desc: 'Просторная территория для всех видов транспорта',
        alt: 'Въезд на АЗС VNK'
    },
    {
        img: Zapravka,
        title: 'Современное оборудование',
        desc: 'Высокое качество топлива',
        alt: 'Современное оборудование АЗС'
    },
    {
        img: BigZapravka,
        title: 'Крупная АЗС',
        desc: 'Всегда есть место для вашего авто',
        alt: 'Крупная АЗС VNK'
    },
    {
        img: Cafe,
        title: 'Уютное кафе',
        desc: 'Горячий кофе и свежие блюда',
        alt: 'Кафе на АЗС VNK'
    },
    {
        img: VNK,
        title: 'Красивый дизайн',
        desc: 'В темное время суток вы отличите нас от других',
        alt: 'Дизайн АЗС VNK в темное время'
    }
]

// Carousel settings
const CAROUSEL_SETTINGS = {
    autoplay: true,
    dots: true,
    arrows: true,
    infinite: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    fade: false,
    speed: 1000
}

// Slide component
const SlideItem = ({ slide, index }) => (
    <div className="relative">
        <motion.img
            src={slide.img}
            alt={slide.alt}
            className="w-full object-cover rounded-2xl h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] xl:h-[650px]"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            loading={index === 0 ? 'eager' : 'lazy'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-2xl" />

        <motion.div
            className="absolute bottom-4 sm:bottom-8 md:bottom-12 left-4 sm:left-8 md:left-12 text-white max-w-[90%] sm:max-w-[500px]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold drop-shadow-lg">
                {slide.title}
            </h2>
            <p className="mt-2 text-base sm:text-lg md:text-2xl opacity-90">
                {slide.desc}
            </p>
        </motion.div>
    </div>
)

const CarouselComp = () => {
    const slides = useMemo(() => SLIDES, [])

    return (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-4 mt-6 relative">
            <Carousel
                {...CAROUSEL_SETTINGS}
                className="rounded-2xl overflow-hidden"
            >
                {slides.map((slide, index) => (
                    <SlideItem
                        key={`${slide.title}-${index}`}
                        slide={slide}
                        index={index}
                    />
                ))}
            </Carousel>
        </div>
    )
}

export default CarouselComp
