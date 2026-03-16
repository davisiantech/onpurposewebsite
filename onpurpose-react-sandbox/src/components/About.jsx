import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.utils.toArray('.gsap-fade').forEach(el => {
                gsap.from(el, {
                    opacity: 0,
                    y: 30,
                    duration: 1.2,
                    scrollTrigger: { trigger: el, start: "top 90%" }
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const verseText = "\u201cAnd we know that in all things God works for the good of those who love him, who have been called according to his purpose.\u201d";
    const verseRef = "Romans 8:28";

    return (
        <section id="about" ref={containerRef} className="py-32 bg-brand-forest text-brand-cream rounded-t-[3rem] lg:rounded-t-[5rem] relative z-10 shadow-2xl">
            <div className="max-w-5xl mx-auto px-6 text-center">
                <span className="text-brand-clay font-bold tracking-[0.4em] text-[10px] uppercase mb-8 block">
                    Our Foundation
                </span>

                <blockquote className="font-serif text-2xl md:text-5xl text-brand-cream leading-tight italic mb-12 gsap-fade">
                    <span>
                        {verseText} <br />
                        <span className="block text-sm font-sans font-bold not-italic mt-6 text-brand-clay uppercase tracking-[0.3em]">- {verseRef}</span>
                    </span>
                </blockquote>

                <div className="h-[1px] w-24 bg-brand-clay/40 mx-auto mb-20"></div>

                <div className="grid md:grid-cols-3 gap-16 text-left gsap-fade">
                    <div className="group">
                        <span className="font-serif italic text-brand-clay text-3xl mb-4 block">1.</span>
                        <h3 className="font-serif font-bold text-2xl mb-4 italic tracking-tight">Connect</h3>
                        <p className="text-sm text-brand-cream/50 leading-relaxed font-light">Building genuine friendships that
                            go beyond Sabbath morning. We do lunch, hikes, game nights, and life together.</p>
                    </div>
                    <div className="group">
                        <span className="font-serif italic text-brand-sage text-3xl mb-4 block">2.</span>
                        <h3 className="font-serif font-bold text-2xl mb-4 italic tracking-tight">Grow</h3>
                        <p className="text-sm text-brand-cream/50 leading-relaxed font-light">Deep diving into Scripture without
                            the fluff. Join our Sabbath School class every week at 10:00 AM.</p>
                    </div>
                    <div className="group">
                        <span className="font-serif italic text-brand-sand text-3xl mb-4 block">3.</span>
                        <h3 className="font-serif font-bold text-2xl mb-4 italic tracking-tight">Serve</h3>
                        <p className="text-sm text-brand-cream/50 leading-relaxed font-light">Putting faith into action. We get
                            involved in local initiatives and church projects to love our neighbors.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
