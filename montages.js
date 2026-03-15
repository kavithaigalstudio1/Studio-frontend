// montages.js

function MontageVideoCard({ videoUrl, clientName, thumbnail }) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const videoRef = React.useRef(null);

    React.useEffect(() => {
        if (isPlaying && videoRef.current) {
            videoRef.current.play().catch(err => console.log("Video play failed:", err));
        }
    }, [isPlaying]);

    // Safety check for empty URLs
    if (!videoUrl) return null;

    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    let embedUrl = videoUrl;

    if (isYouTube) {
        if (videoUrl.includes('watch?v=')) {
            const videoId = videoUrl.split('v=')[1].split('&')[0];
            embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
        } else if (videoUrl.includes('youtu.be/')) {
            const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
            embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
        }
    }

    if (!isPlaying) {
        return el('div', {
            className: 'montage-card',
            onClick: () => setIsPlaying(true)
        },
            el('div', { className: 'montage-thumb-container' },
                el('img', { src: thumbnail || 'https://via.placeholder.com/600x338?text=Kavithakal+Studio', alt: clientName, className: 'montage-thumb' }),
                el('div', { className: 'montage-overlay' },
                    el(Reveal, { animation: 'fade-up' },
                        el('h3', null, clientName)
                    ),
                    el('div', { className: 'play-btn-circle' },
                        el('i', { className: 'fa-solid fa-play' })
                    )
                )
            )
        );
    }

    return el('div', { className: 'montage-card active-video' },
        el('div', { className: 'montage-video-container', style: { position: 'relative', width: '100%', aspectRatio: '16/9' } },
            isYouTube ?
                el('iframe', {
                    src: embedUrl,
                    style: { width: '100%', height: '100%', border: 'none' },
                    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                    allowFullScreen: true
                }) :
                el('video', {
                    ref: videoRef,
                    src: videoUrl,
                    poster: thumbnail,
                    className: 'full-video',
                    controls: true,
                    playsInline: true,
                    style: { width: '100%', height: '100%', backgroundColor: '#000' }
                }),
            el('button', {
                onClick: (e) => { e.stopPropagation(); setIsPlaying(false); },
                className: 'close-video-btn',
                style: {
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 10,
                    background: 'rgba(0,0,0,0.5)',
                    color: '#white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer'
                }
            }, el('i', { className: 'fa-solid fa-xmark', style: { color: 'white' } }))
        )
    );
}

function Montages() {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [montageData, setMontageData] = React.useState(window.globalAssetCache.montages || []);

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/montages`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setMontageData(data);
                    window.globalAssetCache.montages = data;
                }
            })
            .catch(err => console.error('Error fetching montages:', err));
    }, []);

    return el('div', { className: 'montages-page' },
        el('div', { className: 'montages-hero', style: { textAlign: 'center', padding: '120px 8% 60px' } },
            el(AppleTextReveal, { text: 'Wedding Montages' }),
            el(Reveal, { animation: 'fade-up', delay: 150 }, el('p', { style: { fontSize: '1.2rem', color: '#666', marginTop: '1.5rem' } }, 'Relive the cinematic highlights of our most precious stories.'))
        ),

        el('div', { className: 'montages-grid-container' },
            el('div', { className: 'montages-grid' },
                montageData.map((montage, idx) => {
                    const cardContent = el(MontageVideoCard, {
                        clientName: montage.clientName,
                        videoUrl: montage.url,
                        thumbnail: montage.thumb
                    });

                    // First 3 cards are instant. Deep cards reveal on scroll.
                    if (idx < 3) {
                        return el('div', { key: idx, className: 'montage-card-wrapper' }, cardContent);
                    }

                    return el(Reveal, {
                        key: idx,
                        animation: 'fade-up',
                        delay: (idx % 3) * 50,
                        duration: 0.6,
                        className: 'montage-card-reveal'
                    }, cardContent);
                })
            )
        ),

        el(BookShootCTA, null)
    );
}
