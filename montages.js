// montages.js

function MontageVideoCard({ videoUrl, clientName, thumbnail }) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const videoRef = React.useRef(null);

    // Safety check for empty URLs
    if (!videoUrl) return null;

    const getYouTubeId = (url) => {
        if (!url) return '';
        if (url.length === 11) return url;
        if (url.includes('watch?v=')) return url.split('v=')[1].split('&')[0];
        if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
        if (url.includes('embed/')) return url.split('embed/')[1].split('?')[0];
        return '';
    };

    const videoId = getYouTubeId(videoUrl);
    const isYouTube = videoId !== '' || videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    let embedUrl = videoUrl;

    if (isYouTube && videoId) {
        embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&origin=${window.location.origin}&controls=1`;
    } else if (!videoUrl.startsWith('http') && !videoUrl.startsWith('//') && !videoUrl.startsWith('data:')) {
        return null;
    }

    const togglePlay = (e) => {
        if (e) e.stopPropagation();
        if (isYouTube) {
            setIsPlaying(!isPlaying);
            return;
        }
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const toggleMute = (e) => {
        if (e) e.stopPropagation();
        setIsMuted(!isMuted);
    };

    const closePlayer = (e) => {
        if (e) e.stopPropagation();
        setIsPlaying(false);
    };

    return el('div', {
        className: `montage-card ${isPlaying ? 'active-video' : ''}`,
        onClick: !isPlaying ? () => setIsPlaying(true) : undefined,
        style: { cursor: !isPlaying ? 'pointer' : 'default' }
    },
        !isPlaying ? el('div', { className: 'montage-thumb-container' },
            el('img', { src: thumbnail || 'https://via.placeholder.com/600x338?text=Kavithakal+Studio', alt: clientName, className: 'montage-thumb' }),
            el('div', { className: 'montage-overlay' },
                el(Reveal, { animation: 'fade-up' },
                    el('h3', null, clientName)
                ),
                el('div', { className: 'play-btn-circle' },
                    el('i', { className: 'fa-solid fa-play' })
                )
            )
        ) : el('div', { className: 'montage-video-container', style: { position: 'relative', width: '100%', height: '100%' } },
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
                    controls: false, // Disable native
                    autoPlay: true,
                    muted: isMuted,
                    style: { width: '100%', height: '100%', backgroundColor: '#000' }
                }),
            
            // Custom Control Overlay
            el('div', { 
                className: 'video-custom-controls',
                style: {
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    padding: '12px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    zIndex: 10
                }
            },
                el('button', {
                    onClick: togglePlay,
                    className: 'video-mini-btn',
                    style: { width: '32px', height: '32px' }
                }, el('i', { className: isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play' })),
                
                el('button', {
                    onClick: toggleMute,
                    className: 'video-mini-btn',
                    style: { width: '32px', height: '32px' }
                }, el('i', { className: isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high' }))
            ),

            el('button', {
                onClick: closePlayer,
                className: 'close-video-btn',
                style: {
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 100,
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                }
            }, el('i', { className: 'fa-solid fa-xmark' }))
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
