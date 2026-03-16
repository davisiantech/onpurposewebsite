import { useState, useEffect } from 'react';
import EventCard from './EventCard';

const API_EVENTS = 'https://onpurpose-events.jdawg2450.workers.dev/';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch(API_EVENTS);
                const data = await res.json();
                const now = new Date();
                now.setHours(0, 0, 0, 0);

                const upcomingEvents = (data.items || [])
                    .map(e => ({
                        ...e,
                        startObj: e.start.dateTime ? new Date(e.start.dateTime) : new Date(e.start.date + 'T00:00:00')
                    }))
                    .filter(e => e.startObj >= now)
                    .sort((a, b) => a.startObj - b.startObj)
                    .slice(0, 4);

                if (upcomingEvents.length > 0) {
                    const first = upcomingEvents[0];
                    const diff = first.startObj - new Date();
                    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                    setCountdown(`Next Event in ${d} days, ${h} hours`);
                }

                setEvents(upcomingEvents);
            } catch (e) {
                console.error(e);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        }

        fetchEvents();
    }, []);

    return (
        <section id="events" className="max-w-6xl mx-auto px-6 pt-32 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <div>
                    <span className="text-brand-clay font-bold uppercase tracking-[0.4em] text-[10px]">What's Happening</span>
                    <h2 className="font-serif text-5xl md:text-6xl mt-4 italic">Upcoming Events.</h2>
                </div>
                <div className="text-[11px] uppercase tracking-widest text-brand-forest/40 font-bold mb-2">
                    {countdown}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {isLoading && (
                    // Skeleton Loaders
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white border border-brand-sand rounded-[1.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 animate-pulse shadow-sm">
                            <div className="w-20 h-20 bg-brand-forest/10 rounded-2xl shrink-0"></div>
                            <div className="flex-1 w-full space-y-4 py-2">
                                <div className="h-8 bg-brand-forest/5 rounded w-3/4"></div>
                                <div className="h-4 bg-brand-forest/5 rounded w-1/2"></div>
                                <div className="h-10 bg-brand-forest/5 rounded w-full mt-2"></div>
                            </div>
                            <div className="w-12 h-12 bg-brand-forest/10 rounded-full shrink-0"></div>
                        </div>
                    ))
                )}

                {error && (
                    <div className="py-20 text-center text-red-500/80 italic font-serif">Unable to load calendar. Please refresh.</div>
                )}

                {!isLoading && !error && events.length === 0 && (
                    <div className="py-20 text-center text-brand-forest/60 italic font-serif opacity-30">Stay tuned for upcoming events...</div>
                )}

                {!isLoading && !error && events.map((event, index) => (
                    <EventCard key={index} event={event} index={index} />
                ))}
            </div>

            {/* Weekly Static Card */}
            <div className="mt-12 p-8 md:p-12 bg-brand-sand/20 border border-brand-sand rounded-[2rem] flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                        <span className="w-2 h-2 bg-brand-clay rounded-full animate-pulse"></span>
                        <span className="text-brand-forest/60 text-[10px] font-bold uppercase tracking-widest">Every Week</span>
                    </div>
                    <h3 className="font-serif text-3xl mb-4 italic tracking-tight text-brand-forest">Sabbath School</h3>
                    <p className="text-brand-forest/60 text-sm leading-relaxed max-w-md">Join us every Saturday at 10:00 AM for
                        deep discussion and fellowship at God's Pantry (Right Side Entrance).</p>
                </div>
                <a href="https://maps.google.com/?q=1411+Rome+Rd+SW,+Calhoun,+GA+30701" target="_blank" rel="noopener noreferrer"
                    className="bg-brand-forest text-white px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-clay transition-all shadow-xl shadow-brand-forest/10 whitespace-nowrap">
                    📍 God's Pantry
                </a>
            </div>
        </section>
    );
}
