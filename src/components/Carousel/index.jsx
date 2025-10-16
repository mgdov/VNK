import React, { useMemo } from 'react'
import { Carousel } from 'antd'
import { motion } from 'framer-motion'

// Import images
import Fura from '../../assets/Content-carousel/CG0A5543.jpg'
import Cafe from '../../assets/Content-carousel/коркмаскала.jpg'
import Zapravka from '../../assets/Content-carousel/CG0A5830_resized.jpg'
import BigZapravka from '../../assets/Content-carousel/CG0A6205_resized.jpg'
import VezdZapravka from '../../assets/Content-carousel/CG0A5748_resized.jpg'
import NewPhoto from '../../assets/Content-carousel/Манас.jpg'
import WhatsAppPhoto from '../../assets/Content-carousel/WhatsApp Image 2025-10-16 at 18.58.33 (1).jpeg'

// Slide data
const SLIDES = [
    {
        img: Fura,
        title: 'Грузовые заправки',
        desc: 'Быстрая и качественная заправка для дальнобойщиков 24/7',
        alt: 'Грузовая заправка VNK'
    },
    {
        img: VezdZapravka,
        title: 'Удобный подъезд',
        desc: 'Просторная территория для комфортного обслуживания',
        alt: 'Въезд на АЗС VNK'
    },
    {
        img: Zapravka,
        title: 'Современное оборудование',
        desc: 'Высокотехнологичное оборудование для качественного топлива',
        alt: 'Современное оборудование АЗС'
    },
    {
        img: BigZapravka,
        title: 'Просторная АЗС',
        desc: 'Множество колонок для быстрого обслуживания всех клиентов',
        alt: 'Крупная АЗС VNK'
    },
    {
        img: Cafe,
        title: 'Уютное кафе',
        desc: 'Ароматный кофе и свежие блюда в комфортной обстановке',
        alt: 'Кафе на АЗС VNK'
    },
    {
        img: NewPhoto,
        title: 'Ночной дизайн',
        desc: 'Красивая подсветка делает нашу АЗС узнаваемой даже ночью',
        alt: 'Ночная подсветка АЗС VNK'
    },
    {
        img: WhatsAppPhoto,
        title: 'Комфорт и удобство',
        desc: 'Создаем все условия для приятного отдыха во время поездки',
        alt: 'Комфортная обстановка АЗС VNK'
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
            className="absolute bottom-[26px] xs:bottom-8 sm:bottom-8 md:bottom-12 lg:bottom-12 xl:bottom-16 left-2 xs:left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 text-white max-w-[95%] xs:max-w-[90%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <h2 className="text-sm xs:text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold drop-shadow-lg mb-0.5 xs:mb-1">
                {slide.title}
            </h2>
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl opacity-90">
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
                        key={`${slide.alt}-${index}`}
                        slide={slide}
                        index={index}
                    />
                ))}
            </Carousel>
        </div>
    )
}

export default CarouselComp
