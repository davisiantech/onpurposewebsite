import { useState, useEffect } from 'react';

const API_INSTA = 'https://onpurpose-insta.jdawg2450.workers.dev/';

export default function Gallery() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchInstagram() {
            try {
                const res = await fetch(API_INSTA);
                const data = await res.json();

                if (data.error || !data.data) {
                    setError(true);
                    return;
                }

                setPosts(data.data.slice(0, 4));
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        }

        fetchInstagram();
    }, []);

    return (
        <section id="journal" className="py-24 px-4 bg-brand-cream relative z-20">
            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-12">
                    <h2 className="font-serif text-4xl font-bold text-brand-forest">Life On Purpose</h2>
                    <a href="https://instagram.com/onpurpose.ya" target="_blank" rel="noopener noreferrer"
                        className="inline-block mt-2 text-brand-clay font-medium hover:underline">@onpurpose.ya</a>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {isLoading && (
                        // Skeleton Grid
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="aspect-square rounded-xl bg-brand-forest/10 animate-pulse"></div>
                        ))
                    )}

                    {error && !isLoading && (
                        <p className="col-span-full text-center text-brand-forest/60 text-sm py-12">
                            Couldn't load feed. Follow us @onpurpose.ya
                        </p>
                    )}

                    {!isLoading && !error && posts.map((post, index) => {
                        let imgUrl = post.media_url;
                        if (post.media_type === 'VIDEO' || post.media_type === 'CAROUSEL_ALBUM') {
                            imgUrl = post.thumbnail_url || post.media_url;
                        }

                        const typeEmoji = post.media_type === 'VIDEO' ? '▶️' : (post.media_type === 'CAROUSEL_ALBUM' ? '✨' : '📸');
                        const caption = post.caption || 'View Post';

                        return (
                            <a
                                key={post.id || index}
                                href={post.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-md hover:shadow-xl transition-all duration-500"
                            >
                                <img
                                    src={imgUrl}
                                    alt={caption}
                                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-brand-forest/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="text-3xl mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                        {typeEmoji}
                                    </div>
                                    <p className="text-white text-sm font-medium line-clamp-4 mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100 leading-relaxed">
                                        {caption}
                                    </p>
                                    <span className="text-brand-clay text-xs font-bold uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                                        View on Instagram
                                    </span>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
