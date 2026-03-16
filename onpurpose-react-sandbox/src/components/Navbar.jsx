import { useState, useEffect } from 'react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed w-full z-50 transition-all duration-500 px-6 lg:px-12 flex justify-between items-center ${isScrolled ? 'bg-brand-cream/90 backdrop-blur-md py-4 shadow-sm' : 'py-6'
                    }`}
            >
                <a href="#" className="font-serif font-bold text-2xl tracking-tight italic group">
                    On<span className="text-brand-clay group-hover:text-brand-forest transition-colors font-serif">Purpose</span>
                </a>

                <div className="hidden md:flex items-center space-x-12 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-forest/70">
                    <a href="#about" className="hover:text-brand-clay transition-colors">About</a>
                    <a href="#events" className="hover:text-brand-clay transition-colors">Events</a>
                    <a href="#journal" className="hover:text-brand-clay transition-colors">Gallery</a>
                </div>

                <button
                    className="md:hidden p-2 text-brand-forest"
                    onClick={() => setIsMenuOpen(true)}
                    aria-label="Open Mobile Menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8h16M4 16h16"></path>
                    </svg>
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 z-[60] bg-brand-cream flex flex-col items-center justify-center gap-10 text-center transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div className="flex flex-col gap-6 text-3xl font-serif italic font-bold text-brand-forest">
                    <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
                    <a href="#events" onClick={() => setIsMenuOpen(false)}>Events</a>
                    <a href="#journal" onClick={() => setIsMenuOpen(false)}>Gallery</a>
                </div>
                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xs uppercase tracking-widest opacity-40 font-bold"
                >
                    Close Menu
                </button>
            </div>
        </>
    );
}
