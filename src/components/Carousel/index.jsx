import React from "react";
import { Carousel } from "antd";
import { motion } from "framer-motion";

import Fura from "../../assets/Content-carousel/fura.png";
import Cafe from "../../assets/Content-carousel/cafe.png";
import Zapravka from "../../assets/Content-carousel/zapravka.png";
import BigZapravka from "../../assets/Content-carousel/bigzapravka.png";
import VezdZapravka from "../../assets/Content-carousel/vezdzapravka.png";
import VNK from "../../assets/Content-carousel/vnk.png"

const slides = [
    { img: Fura, title: "Грузовые заправки", desc: "Удобно и быстро для дальнобойщиков" },
    { img: VezdZapravka, title: "Лёгкий въезд", desc: "Просторная территория для всех видов транспорта" },
    { img: Zapravka, title: "Современное оборудование", desc: "Высокое качество топлива" },
    { img: BigZapravka, title: "Крупная АЗС", desc: "Всегда есть место для вашего авто" },
    { img: Cafe, title: "Уютное кафе", desc: "Горячий кофе и свежие блюда" },
    { img: VNK, title: "Отличный от других дизайн", desc: "В темное время суток вы отличите нас от других" }
];

const CarouselComp = () => (
    <div className="max-w-[1200px] mx-auto mt-6 relative">
        <Carousel autoplay dots arrows infinite className="rounded-2xl overflow-hidden">
            {slides.map((slide, index) => (
                <div key={index} className="relative">
                    <motion.img
                        src={slide.img}
                        alt={slide.title}
                        className="h-[650px] w-full object-cover rounded-2xl"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-2xl"></div>

                    <motion.div
                        className="absolute bottom-12 left-12 text-white max-w-[500px]"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold drop-shadow-lg">{slide.title}</h2>
                        <p className="mt-2 text-lg md:text-2xl opacity-90">{slide.desc}</p>
                    </motion.div>
                </div>
            ))}
        </Carousel>
    </div>
);

export default CarouselComp;
