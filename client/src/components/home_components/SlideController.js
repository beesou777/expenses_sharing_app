import React, { useState, useEffect } from 'react';
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { useSwiper } from 'swiper/react';

export default function SlideController() {

    const swiper = useSwiper();

    const [slideConfig, setSlideConfig] = useState({
        isBeginning: true,
        isEnd: false,
    });

    useEffect(() => {
        swiper.on("slideChange", (swipe) => {
            setSlideConfig({ isBeginning: swipe.isBeginning, isEnd: swipe.isEnd });
        });
    }, [swiper]);

    return (
        <div className="hidden lg:flex justify-center gap-10 text-3xl text-theme-light-blue my-2">
            <div 
                className= {"cursor-pointer " + ( slideConfig.isBeginning && 'opacity-50 cursor-default') }
                onClick={() => swiper.slidePrev()}
            >
                <MdNavigateBefore />
            </div>
            <div 
                className= {"cursor-pointer " + ( slideConfig.isEnd && 'opacity-50 cursor-default') }
                onClick={() => swiper.slideNext()}
            >
                <MdNavigateNext />
            </div>
        </div>
    )
}
