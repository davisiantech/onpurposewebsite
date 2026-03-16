import { useState } from 'react';

export default function EventCard({ event, index }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const date = event.startObj;

    // Clean description helper
    const cleanDescription = (text) => {
        if (!text) return { link: null, cleaned: '' };
        const div = document.createElement('div');
        div.innerHTML = text;
        let link = div.querySelector('a[href]')?.getAttribute('href') || null;
        let plain = div.textContent || div.innerText || "";
        const urlRe = /(?:(?:https?:\/\/)|(?:www\.)|(?:[a-zA-Z0-9-]+\.(?:com|org|net|edu|gov|io)))[^\s]*/gi;
        if (!link) {
            const matches = plain.match(urlRe);
            if (matches && matches.length > 0) {
                link = matches[0].startsWith('http') ? matches[0] : 'https://' + matches[0];
            }
        }
        const cleaned = plain.replace(urlRe, '').trim();
        return { link, cleaned };
    };

    const { link, cleaned } = cleanDescription(event.description || '');
    const finalLink = link || event.htmlLink;
    const needsReadMore = cleaned && cleaned.length > 120;

    const isForm = finalLink && (finalLink.includes('forms.gle') || finalLink.includes('docs.google.com/forms') || finalLink.includes('tally.so'));

    let location = event.location || '';
    if (location) {
        location = location
            .replace(/,?\s*(?:USA|United States|US)\b/gi, '')
            .replace(/,?\s*\b\d{5}(?:-\d{4})?\b/g, '')
            .trim()
            .replace(/,$/, '');
    }

    return (
        <div className="bg-white border border-brand-sand rounded-[1.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">

            {/* Optional decorative background circle on hover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-clay/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <div className="flex flex-col items-center justify-center w-20 h-20 bg-brand-forest text-brand-cream rounded-2xl shrink-0 z-10">
                <span className="text-[10px] uppercase font-bold tracking-tighter">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="font-serif text-2xl font-bold italic">{date.getDate()}</span>
            </div>

            <div className="flex-1 text-center md:text-left z-10 w-full">
                <h3
                    className="font-serif text-2xl md:text-3xl tracking-tight text-brand-forest group-hover:text-brand-clay transition-colors duration-500 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {event.summary}
                </h3>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-bold uppercase tracking-widest text-brand-forest/40 mt-2 mb-3">
                    <span>{event.start.dateTime ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'All Day'}</span>
                    <span>•</span>
                    <span>{location || 'Calhoun, GA'}</span>
                </div>

                {cleaned && (
                    <div className="mt-2 text-left w-full">
                        <p className={`text-brand-forest/60 text-sm leading-relaxed transition-all duration-500 ${isExpanded ? '' : 'line-clamp-2'}`}>
                            {cleaned}
                        </p>
                        {needsReadMore && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(!isExpanded);
                                }}
                                className="text-brand-clay text-[10px] font-bold uppercase tracking-widest mt-2 hover:text-brand-forest transition-colors"
                            >
                                {isExpanded ? 'Show Less' : 'Read More'}
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="shrink-0 z-10 mt-4 md:mt-0">
                {isForm ? (
                    <a href={finalLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-6 py-3 rounded-xl bg-brand-clay text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand-forest shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                        RSVP
                    </a>
                ) : (
                    <a href={finalLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-full border border-brand-sand text-brand-forest hover:bg-brand-clay hover:border-brand-clay hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </a>
                )}
            </div>
        </div>
    );
}
