import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".gsap-hero-content", {
                opacity: 0,
                y: 20, /* Used the updated 20px so it doesn't float as high */
                duration: 1.2,
                ease: "power3.out",
                delay: 0.1
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <header ref={containerRef} className="relative min-h-[90vh] flex flex-col justify-center max-w-7xl mx-auto px-6 pt-20 pb-32">
            {/* We remove the manual opacity-0 class here so GSAP controls it beautifully from its intrinsic state */}
            <div className="max-w-4xl mx-auto text-center gsap-hero-content">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <span className="h-[1px] w-10 bg-brand-clay"></span>
                    <span className="text-brand-clay font-bold uppercase tracking-[0.4em] text-[10px]">Calhoun YA</span>
                    <span className="h-[1px] w-10 bg-brand-clay"></span>
                </div>
                <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl leading-[1.05] mb-10 text-balance tracking-tight">
                    Purpose isn't <br /><em className="italic font-serif text-brand-clay">accidental.</em>
                </h1>
                <p className="text-lg md:text-2xl text-brand-forest/70 max-w-2xl mx-auto font-light leading-relaxed mb-20">
                    A Christ-centered community of young adults in Calhoun, GA. Doing life together, growing in faith, and
                    serving our city.
                </p>
                <div className="flex flex-wrap gap-8 justify-center">
                    <a href="#events"
                        className="bg-brand-clay text-white px-12 py-5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-brand-clay/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-clay/30 transition-all duration-300">
                        See What's Happening
                    </a>
                    <a href="#about"
                        className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest group">
                        New Here?
                        <span className="w-12 h-[1px] bg-brand-clay group-hover:w-20 transition-all duration-500"></span>
                    </a>
                </div>
            </div>

            {/* Fixed background blur sizing for mobile */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-brand-clay/5 rounded-full blur-[100px] md:blur-[120px] -z-10">
            </div>
        </header>
    );
}
