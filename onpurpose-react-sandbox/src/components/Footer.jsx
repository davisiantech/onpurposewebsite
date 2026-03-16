export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brand-forest text-white pt-16 pb-8 px-6 border-t border-white/10">
            <div className="max-w-4xl mx-auto text-center">
                <img
                    src="/onPurposeWhite.svg"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="h-16 mx-auto mb-6 opacity-90"
                    alt="On Purpose Logo"
                />

                <p className="text-brand-sage font-light mb-8">
                    A ministry of the Calhoun Seventh-day Adventist Church.
                </p>

                <div className="flex flex-wrap justify-center gap-6 text-sm font-medium tracking-wide mb-12">
                    <a href="#about" className="hover:text-brand-clay transition">About</a>
                    <a href="#events" className="hover:text-brand-clay transition">Events</a>
                    <a href="mailto:info@onpurposeya.com" className="hover:text-brand-clay transition">Contact</a>
                    <a href="https://adventistgiving.org/donate/ANTFEG" target="_blank" rel="noopener noreferrer" className="hover:text-brand-clay transition">Donate</a>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-cream/60 gap-4">
                    <p>&copy; {currentYear} On Purpose YA.</p>
                    <p>Designed for the Kingdom.</p>
                </div>
            </div>
        </footer>
    );
}
