// gallery.js

function VideoCard({ videoUrl, title, thumbnail }) {
    const videoRef = React.useRef(null);
    const wrapperRef = React.useRef(null);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(true);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    // Listen for fullscreen change to update icon
    React.useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);
        document.addEventListener('webkitfullscreenchange', onFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
        };
    }, []);

    // Detect if the URL is a YouTube link
    const isYouTube = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
    const isVimeo = videoUrl && videoUrl.includes('vimeo.com');

    const getYouTubeEmbedUrl = (url) => {
        let videoId = '';
        if (url.includes('watch?v=')) videoId = url.split('v=')[1].split('&')[0];
        else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
        else if (url.includes('embed/')) videoId = url.split('embed/')[1].split('?')[0];
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}`;
    };

    const togglePlay = (e) => {
        if (e) e.stopPropagation();
        if (isYouTube) {
            setIsPlaying(!isPlaying);
            return;
        }
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(err => console.error("Video playback failed:", err));
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const toggleMute = (e) => {
        if (e) e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
        }
        setIsMuted(!isMuted);
    };

    const goFullscreen = (e) => {
        e.stopPropagation();

        // If already in fullscreen, exit it
        if (document.fullscreenElement) {
            document.exitFullscreen && document.exitFullscreen();
            return;
        }

        // For YouTube: start playing first so the iframe/video is visible
        if (isYouTube && !isPlaying) {
            setIsPlaying(true);
        }
        // For hosted video: start playing if not already
        if (!isYouTube && videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch(() => { });
        }

        // Make the whole wrapper go fullscreen (works for both YouTube & hosted)
        const wrapper = wrapperRef.current;
        if (wrapper) {
            if (wrapper.requestFullscreen) wrapper.requestFullscreen();
            else if (wrapper.webkitRequestFullscreen) wrapper.webkitRequestFullscreen();
            else if (wrapper.msRequestFullscreen) wrapper.msRequestFullscreen();
        }
    };

    return el('div', {
        ref: wrapperRef,
        className: 'video-card-wrapper',
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        onClick: togglePlay,
        style: { cursor: 'pointer', background: '#000' }
    },
        isYouTube ?
            el('iframe', {
                id: `yt-${title.replace(/\s+/g, '')}`,
                src: isPlaying ? getYouTubeEmbedUrl(videoUrl) : '',
                className: 'film-video',
                frameBorder: '0',
                allow: 'autoplay; fullscreen; picture-in-picture',
                allowFullScreen: true,
                style: { width: '100%', height: '100%', display: isPlaying ? 'block' : 'none', position: 'absolute', top: 0, left: 0 }
            }) :
            el('video', {
                ref: videoRef,
                className: 'film-video',
                poster: thumbnail,
                src: videoUrl,
                muted: isMuted,
                loop: true,
                playsInline: true,
                onPlay: () => setIsPlaying(true),
                onPause: () => setIsPlaying(false)
            }),

        (!isPlaying || !isYouTube) && el('img', {
            src: thumbnail || 'https://via.placeholder.com/600x338?text=Play+Video',
            className: 'film-video',
            style: { display: isPlaying && !isYouTube ? 'none' : 'block', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }
        }),

        el('div', {
            className: `video-overlay ${isHovered || !isPlaying ? 'visible' : ''}`,
            style: {
                opacity: (isHovered || !isPlaying) ? 1 : 0,
                pointerEvents: (isHovered || !isPlaying) ? 'auto' : 'none',
                background: isPlaying ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.5)',
                zIndex: 10
            }
        },
            el('div', { className: 'video-controls-center' },
                el('button', { className: 'video-btn play-btn', onClick: togglePlay, title: isPlaying ? 'Pause' : 'Play' },
                    el('i', { className: isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play' })
                )
            ),
            !isYouTube && el('div', { className: 'video-controls-bottom' },
                el('button', { className: 'video-mini-btn mute-btn', onClick: toggleMute, title: isMuted ? 'Unmute' : 'Mute' },
                    el('i', { className: isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high' })
                )
            )
        ),

        // Fullscreen button — always visible in the corner, independent of the hover overlay
        el('button', {
            className: 'video-fullscreen-corner-btn',
            onClick: goFullscreen,
            title: isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'
        },
            el('i', { className: isFullscreen ? 'fa-solid fa-compress' : 'fa-solid fa-expand' })
        ),
        el('div', { className: 'video-info', style: { color: 'white', zIndex: 11 } },
            el(Reveal, { animation: 'fade-up' },
                el('h4', { style: { color: 'white', fontWeight: '700', fontSize: '1.2rem', margin: 0 } }, title)
            )
        )
    );
}

function Gallery({ onMenuToggle }) {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [activeImageIndex, setActiveImageIndex] = React.useState(null);

    const [masonryImages, setMasonryImages] = React.useState(() => {
        return window.globalAssetCache.gallery || [];
    });

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/gallery`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setMasonryImages(data);
                    window.globalAssetCache.gallery = data;
                    // Background pre-load entire gallery for smooth scroll
                    data.forEach(url => {
                        const img = new Image();
                        img.src = url;
                    });
                }
            })
            .catch(err => console.error('Error fetching gallery:', err));
    }, []);

    const [films, setFilms] = React.useState([]);

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/gallery-films`)
            .then(res => res.json())
            .then(data => {
                // Ensure data is an array before setting state
                if (Array.isArray(data)) setFilms(data);
            })
            .catch(err => console.error('Error fetching gallery films:', err));
    }, []);

    const extendedFilms = films;

    return el('div', { className: 'montages-page' },
        el('div', { className: 'portfolio-header-area', style: { padding: '20px' } }),

        el('div', { className: 'montages-hero', style: { textAlign: 'center', padding: '120px 8% 60px' } },
            el(AppleTextReveal, { text: 'Our Gallery' }),
            el(Reveal, { animation: 'fade-up', delay: 150 },
                el('p', { style: { fontSize: '1.2rem', color: '#666', marginTop: '1.5rem', maxWidth: '700px', margin: '1.5rem auto 0' } }, 'A curated collection of our most cherished moments and cinematic stories.')
            )
        ),

        el('div', { className: 'montages-grid-container' },
            el('div', { className: 'fancy-masonry-grid' },
                masonryImages.map((src, idx) => {
                    const itemContent = el('div', {
                        onClick: () => setActiveImageIndex(idx),
                        style: { cursor: 'pointer' }
                    },
                        el('img', {
                            src: src,
                            alt: `Gallery image ${idx + 1}`,
                            loading: 'eager',
                            fetchpriority: idx < 12 ? 'high' : 'auto',
                            decoding: 'sync',
                            style: { display: 'block', width: '100%', minHeight: '100px' }
                        })
                    );

                    // Photos 1-8 are rendered INSTANTLY (0s delay) for immediate page paint.
                    // Further photos use the Reveal component for the premium on-scroll pops.
                    if (idx < 8) {
                        return el('div', { key: idx, className: 'fancy-masonry-item' }, itemContent);
                    }

                    return el(Reveal, {
                        key: idx,
                        animation: 'fade-up',
                        delay: (idx % 4) * 40,
                        duration: 0.5,
                        className: 'fancy-masonry-item'
                    }, itemContent);
                })
            )
        ),

        films.length > 0 && el('div', { className: 'montages-grid-container', style: { paddingTop: 0 } },
            el(AppleTextReveal, { text: 'Cinematic Films', style: { textAlign: 'center', marginBottom: '3rem', fontSize: 'clamp(2.5rem, 6vw, 4rem)' } }),
            el('div', { className: 'montages-grid' },
                films.map((film, idx) =>
                    el(VideoCard, {
                        key: idx,
                        title: film.title,
                        videoUrl: film.url,
                        thumbnail: film.thumb
                    })
                )
            )
        ),

        activeImageIndex !== null && el(Lightbox, {
            images: masonryImages,
            activeIndex: activeImageIndex,
            onClose: () => setActiveImageIndex(null),
            onNext: () => setActiveImageIndex((prev) => (prev + 1) % masonryImages.length),
            onPrev: () => setActiveImageIndex((prev) => (prev - 1 + masonryImages.length) % masonryImages.length)
        }),

        el(BookShootCTA, null)
    );
}
