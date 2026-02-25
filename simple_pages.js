// simple_pages.js

function About() {
    return el('div', { className: 'page-container', style: { paddingTop: '100px' } },
        el(Reveal, { animation: 'fade-up' }, el('h1', null, 'About Us')),
        el(Reveal, { animation: 'fade-up', delay: 200 }, el('p', null, 'We are a dedicated studio focused on preserving your most cherished moments with artistic storytelling and vivid photography.'))
    );
}


function AnomaliesReview() {
    const [reviews, setReviews] = React.useState([]);
    const [videos, setVideos] = React.useState([
        { videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
        { videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
        { videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
        { videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
        { videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
        { videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' }
    ]);
    const [formData, setFormData] = React.useState({ name: '', shootType: '', stars: 5, reviewText: '' });
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [slideWidth, setSlideWidth] = React.useState(0);
    const [touchStart, setTouchStart] = React.useState(null);
    const [touchEnd, setTouchEnd] = React.useState(null);
    const sliderRef = React.useRef(null);

    React.useEffect(() => {
        // Fetch reviews
        fetch(`${window.API_URL}/api/reviews`)
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(err => console.error('Error fetching reviews:', err));

        // Fetch showcase videos
        fetch(`${window.API_URL}/api/review-videos`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) setVideos(data);
            })
            .catch(err => console.error('Error fetching showcase videos:', err));
    }, []);

    const updateWidth = () => {
        if (sliderRef.current && sliderRef.current.firstChild) {
            const card = sliderRef.current.firstChild;
            const style = window.getComputedStyle(card);
            const margin = parseFloat(style.marginRight) || 0;
            setSlideWidth(card.offsetWidth + margin);
        }
    };

    React.useEffect(() => {
        updateWidth();
        window.addEventListener('resize', updateWidth);
        const timer = setTimeout(updateWidth, 1000);
        return () => {
            window.removeEventListener('resize', updateWidth);
            clearTimeout(timer);
        };
    }, [reviews]);

    const nextSlide = React.useCallback(() => {
        if (reviews.length === 0) return;
        setCurrentIndex(prev => (prev + 1) % reviews.length);
    }, [reviews.length]);

    const prevSlide = React.useCallback(() => {
        if (reviews.length === 0) return;
        setCurrentIndex(prev => (prev - 1 + reviews.length) % reviews.length);
    }, [reviews.length]);

    React.useEffect(() => {
        if (reviews.length <= 1) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide, reviews.length]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${window.API_URL}/api/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(() => {
                setFormData({ name: '', shootType: '', stars: 5, reviewText: '' });
                return fetch(`${window.API_URL}/api/reviews`);
            })
            .then(res => res.json())
            .then(data => {
                setReviews(data);
                setCurrentIndex(0);
                setTimeout(updateWidth, 100);
            })
            .catch(err => console.error('Error submitting review:', err));
    };

    return el('div', { className: 'anomalies-review-page' },
        el('div', { className: 'portfolio-header-area', style: { position: 'absolute', top: '20px', left: '20px', zIndex: 10 } },
            el('a', { href: '#home', className: 'back-btn' }, el('i', { className: 'fa-solid fa-arrow-left' }), ' Back')
        ),

        el('div', { className: 'review-hero-section', style: { paddingBottom: '4rem' } },
            el(Reveal, { animation: 'fade-up' }, el('h1', null, 'Anomalies ', el('span', { style: { color: 'var(--pink-accent)' } }, 'Reviews'))),

            el('div', { className: 'review-videos-grid' },
                videos.map((vid, idx) => {
                    const videoUrl = vid.videoUrl || '';
                    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
                    let embedUrl = videoUrl;

                    if (isYouTube) {
                        if (videoUrl.includes('watch?v=')) {
                            const videoId = videoUrl.split('v=')[1].split('&')[0];
                            embedUrl = `https://www.youtube.com/embed/${videoId}`;
                        } else if (videoUrl.includes('youtu.be/')) {
                            const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
                            embedUrl = `https://www.youtube.com/embed/${videoId}`;
                        }
                    }

                    return el(Reveal, { key: idx, animation: 'fade-up', delay: idx * 100 },
                        el('div', { className: 'review-video-item' },
                            isYouTube ?
                                el('iframe', {
                                    src: embedUrl,
                                    style: { width: '100%', height: '100%', border: 'none' },
                                    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                                    allowFullScreen: true
                                }) :
                                el('video', {
                                    className: 'showcase-video',
                                    src: videoUrl,
                                    muted: true,
                                    loop: true,
                                    playsInline: true,
                                    autoPlay: idx === 0,
                                    onMouseEnter: (e) => { if (idx !== 0) e.target.play().catch(() => { }); },
                                    onMouseLeave: (e) => {
                                        if (idx !== 0) {
                                            e.target.pause();
                                            e.target.currentTime = 0;
                                        }
                                    },
                                    style: {
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease'
                                    }
                                })
                        )
                    );
                })
            )
        ),

        el('div', { className: 'review-form-section' },
            el(Reveal, { animation: 'fade-up' }, el('h2', null, 'Share Your Experience')),
            el('form', { className: 'customer-review-form', onSubmit: handleSubmit },
                el('div', { className: 'form-group' },
                    el('label', null, 'Full Name'),
                    el('input', {
                        type: 'text',
                        required: true,
                        value: formData.name,
                        onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                        placeholder: 'Enter your name'
                    })
                ),
                el('div', { className: 'form-group' },
                    el('label', null, 'Shoot Type'),
                    el('input', {
                        type: 'text',
                        required: true,
                        value: formData.shootType,
                        onChange: (e) => setFormData({ ...formData, shootType: e.target.value }),
                        placeholder: 'e.g. Wedding, Portrait'
                    })
                ),
                el('div', { className: 'form-group' },
                    el('label', null, 'Rating'),
                    el('div', { className: 'star-rating-input' },
                        [1, 2, 3, 4, 5].map(s => el('i', {
                            key: s,
                            className: `fa-star ${s <= formData.stars ? 'fa-solid' : 'fa-regular'}`,
                            onClick: () => setFormData({ ...formData, stars: s }),
                            style: { cursor: 'pointer', color: '#FFD700', fontSize: '1.5rem', margin: '0 5px' }
                        }))
                    )
                ),
                el('div', { className: 'form-group', style: { gridColumn: 'span 2' } },
                    el('label', null, 'Your Review'),
                    el('textarea', {
                        required: true,
                        rows: 4,
                        value: formData.reviewText,
                        onChange: (e) => setFormData({ ...formData, reviewText: e.target.value }),
                        placeholder: 'Write your experience here...'
                    })
                ),
                el('button', { type: 'submit', className: 'btn btn-primary', style: { gridColumn: 'span 2' } }, 'Submit Review')
            )
        ),

        reviews.length > 0 && el('div', { className: 'latest-reviews-display' },
            el(Reveal, { animation: 'fade-up' }, el('h2', null, 'What Our ', el('span', { style: { color: 'var(--pink-accent)' } }, 'Clients'), ' Say')),
            el('div', { className: 'reviews-carousel-wrapper' },


                el('div', {
                    className: 'reviews-viewport',
                    onTouchStart: (e) => setTouchStart(e.targetTouches[0].clientX),
                    onTouchMove: (e) => setTouchEnd(e.targetTouches[0].clientX),
                    onTouchEnd: () => {
                        if (!touchStart || !touchEnd) return;
                        const distance = touchStart - touchEnd;
                        if (distance > 50) nextSlide();
                        if (distance < -50) prevSlide();
                        setTouchStart(null);
                        setTouchEnd(null);
                    }
                },
                    el('div', {
                        ref: sliderRef,
                        className: 'reviews-slider',
                        style: { transform: `translateX(-${currentIndex * slideWidth}px)` }
                    },
                        reviews.map((rev, idx) => el('div', { key: idx, className: 'review-card' },
                            el('div', { className: 'review-stars' },
                                Array(5).fill(0).map((_, i) => el('i', {
                                    key: i,
                                    className: `fa-star ${i < rev.stars ? 'fa-solid' : 'fa-regular'}`,
                                    style: { color: '#FFD700' }
                                }))
                            ),
                            el('p', { className: 'review-text' }, `"${rev.reviewText}"`),
                            el('div', { className: 'review-author' },
                                el('h4', null, rev.name),
                                el('span', null, rev.shootType)
                            )
                        ))
                    )
                )
            )
        )
    );
}

function Contact() {
    const [info, setInfo] = React.useState(null);

    React.useEffect(() => {
        window.scrollTo(0, 0);
        fetch(`${window.API_URL}/api/contact-info`)
            .then(res => res.json())
            .then(data => setInfo(data))
            .catch(err => console.error('Error fetching contact info:', err));
    }, []);

    const phone1 = info ? info.phone1 : '+91 93846 84082';
    const phone2 = info ? info.phone2 : '';
    const email = info ? info.email : 'kavithaigalstudio@gmail.com';
    const address = info ? info.address : 'Tamil Nadu, India';
    const instagram = info ? info.instagram : 'https://www.instagram.com/kavithaigal_studio';
    const whatsapp = info ? info.whatsapp : 'https://wa.me/919384684082';
    const mapsUrl = info ? info.mapsUrl : '';
    const workingHours = info ? info.workingHours : 'Mon – Sat: 9 AM – 7 PM';

    return el('div', { className: 'contact-page' },

        // Hero
        el('div', { className: 'contact-hero' },
            el(Reveal, { animation: 'fade-up' },
                el('h1', null, 'Get In ', el('span', { style: { color: 'var(--pink-accent)' } }, 'Touch'))
            ),
            el(Reveal, { animation: 'fade-up', delay: 150 },
                el('p', null, 'We would love to hear from you. Reach out to book a shoot or just say hello!')
            )
        ),

        // Cards grid
        el('div', { className: 'contact-cards-grid' },

            // Phone 1
            el(Reveal, { animation: 'fade-up', delay: 0 },
                el('a', { href: `tel:${phone1.replace(/\s/g, '')}`, className: 'contact-card', style: { textDecoration: 'none' } },
                    el('div', { className: 'contact-card-icon', style: { background: 'linear-gradient(135deg,#ff2d6c,#c961e6)' } },
                        el('i', { className: 'fa-solid fa-phone' })
                    ),
                    el('div', { className: 'contact-card-body' },
                        el('h4', null, 'Primary Phone'),
                        el('p', null, phone1 || '—')
                    )
                )
            ),

            // Phone 2
            phone2 && el(Reveal, { animation: 'fade-up', delay: 80 },
                el('a', { href: `tel:${phone2.replace(/\s/g, '')}`, className: 'contact-card', style: { textDecoration: 'none' } },
                    el('div', { className: 'contact-card-icon', style: { background: 'linear-gradient(135deg,#e056fd,#686de0)' } },
                        el('i', { className: 'fa-solid fa-phone-volume' })
                    ),
                    el('div', { className: 'contact-card-body' },
                        el('h4', null, 'Secondary Phone'),
                        el('p', null, phone2)
                    )
                )
            ),

            // Email
            el(Reveal, { animation: 'fade-up', delay: 160 },
                el('a', { href: `mailto:${email}`, className: 'contact-card', style: { textDecoration: 'none' } },
                    el('div', { className: 'contact-card-icon', style: { background: 'linear-gradient(135deg,#f7971e,#ffd200)' } },
                        el('i', { className: 'fa-solid fa-envelope' })
                    ),
                    el('div', { className: 'contact-card-body' },
                        el('h4', null, 'Email'),
                        el('p', null, email || '—')
                    )
                )
            ),

            // WhatsApp
            el(Reveal, { animation: 'fade-up', delay: 240 },
                el('a', { href: whatsapp, target: '_blank', rel: 'noreferrer', className: 'contact-card', style: { textDecoration: 'none' } },
                    el('div', { className: 'contact-card-icon', style: { background: 'linear-gradient(135deg,#11998e,#38ef7d)' } },
                        el('i', { className: 'fa-brands fa-whatsapp' })
                    ),
                    el('div', { className: 'contact-card-body' },
                        el('h4', null, 'WhatsApp'),
                        el('p', null, 'Chat with us now')
                    )
                )
            ),

            // Instagram
            el(Reveal, { animation: 'fade-up', delay: 320 },
                el('a', { href: instagram, target: '_blank', rel: 'noreferrer', className: 'contact-card', style: { textDecoration: 'none' } },
                    el('div', { className: 'contact-card-icon', style: { background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' } },
                        el('i', { className: 'fa-brands fa-instagram' })
                    ),
                    el('div', { className: 'contact-card-body' },
                        el('h4', null, 'Instagram'),
                        el('p', null, '@kavithaigal_studio')
                    )
                )
            ),

            // Working Hours
            el(Reveal, { animation: 'fade-up', delay: 400 },
                el('div', { className: 'contact-card' },
                    el('div', { className: 'contact-card-icon', style: { background: 'linear-gradient(135deg,#4e54c8,#8f94fb)' } },
                        el('i', { className: 'fa-solid fa-clock' })
                    ),
                    el('div', { className: 'contact-card-body' },
                        el('h4', null, 'Working Hours'),
                        el('p', null, workingHours || '—')
                    )
                )
            ),

            // Address
            el(Reveal, { animation: 'fade-up', delay: 480 },
                el('div', { className: `contact-card ${mapsUrl ? '' : ''}` },
                    el('div', { className: 'contact-card-icon', style: { background: 'linear-gradient(135deg,#ff416c,#ff4b2b)' } },
                        el('i', { className: 'fa-solid fa-location-dot' })
                    ),
                    el('div', { className: 'contact-card-body' },
                        el('h4', null, 'Address'),
                        el('p', null, address || '—'),
                        mapsUrl && el('a', { href: mapsUrl, target: '_blank', rel: 'noreferrer', className: 'contact-maps-link' },
                            el('i', { className: 'fa-solid fa-map' }), ' View on Maps'
                        )
                    )
                )
            )
        ),

        // CTA
        el(Reveal, { animation: 'zoom-in', delay: 200 },
            el('div', { className: 'contact-cta' },
                el('p', null, 'Ready to book your Shoot?'),
                el('a', { href: `tel:${phone1.replace(/\s/g, '')}`, className: 'btn btn-primary' },
                    el('i', { className: 'fa-solid fa-phone', style: { marginRight: '8px' } }), 'Call Us Now'
                )
            )
        )
    );
}
