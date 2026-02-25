// montages.js

function MontageVideoCard({ videoUrl, clientName, thumbnail }) {
    const [isPlaying, setIsPlaying] = React.useState(false);

    // Safety check for empty URLs
    if (!videoUrl) return null;

    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    let embedUrl = videoUrl;

    if (isYouTube) {
        if (videoUrl.includes('watch?v=')) {
            const videoId = videoUrl.split('v=')[1].split('&')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        } else if (videoUrl.includes('youtu.be/')) {
            const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
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
                    el('h3', null, clientName),
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
                    src: videoUrl,
                    className: 'full-video',
                    controls: true,
                    autoPlay: true,
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

    const [montageData, setMontageData] = React.useState([
        { clientName: "Pravin & Sakthi", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600" },
        { clientName: "Surya & Jothika", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", thumb: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=600" },
        { clientName: "Vijay & Sangeetha", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", thumb: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&q=80&w=600" },
        { clientName: "Ajith & Shalini", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", thumb: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600" },
        { clientName: "Gautham & Priya", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", thumb: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600" },
        { clientName: "Vikram & Anu", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", thumb: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600" }
    ]);

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/montages`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) setMontageData(data);
            })
            .catch(err => console.error('Error fetching montages:', err));
    }, []);

    return el('div', { className: 'montages-page' },
        el('div', { className: 'montages-hero' },
            el(Reveal, { animation: 'fade-up' },
                el('h1', null, 'Wedding ', el('span', null, 'Montages'))
            ),
            el(Reveal, { animation: 'fade-up', delay: 200 },
                el('p', null, 'Relive the cinematic highlights of our most precious stories.')
            )
        ),

        el('div', { className: 'montages-grid-container' },
            el('div', { className: 'montages-grid' },
                montageData.map((montage, idx) =>
                    el(Reveal, { key: idx, animation: 'fade-up', delay: idx * 100 },
                        el(MontageVideoCard, {
                            clientName: montage.clientName,
                            videoUrl: montage.url,
                            thumbnail: montage.thumb
                        })
                    )
                )
            )
        ),

        el('div', { className: 'book-shoot-cta' },
            el(Reveal, { animation: 'zoom-in' },
                el('div', { className: 'cta-card' },
                    el('h2', null, 'Ready to book your Shoot?'),
                    el('a', { href: '#contact', className: 'btn-pink-pill' }, 'Get in touch')
                )
            )
        )
    );
}
