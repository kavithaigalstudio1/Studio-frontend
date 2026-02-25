// admin.js

function AdminPage() {
    // Persistence for Refresh: Check localStorage for logged in state and active tab
    const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
        return localStorage.getItem('ks_admin_logged_in') === 'true';
    });

    const [userId, setUserId] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [activeTab, setActiveTabState] = React.useState(() => {
        return localStorage.getItem('ks_admin_active_tab') || 'dashboard';
    });

    const setActiveTab = (tab) => {
        setActiveTabState(tab);
        localStorage.setItem('ks_admin_active_tab', tab);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // User ID: Kavithaigal studio, PW: Admin@123
        if (userId === 'Kavithaigal studio' && password === 'Admin@123') {
            setIsLoggedIn(true);
            localStorage.setItem('ks_admin_logged_in', 'true');
            setLoginError('');
        } else {
            setLoginError('Invalid credentials. Please try again.');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('ks_admin_logged_in');
        localStorage.removeItem('ks_admin_active_tab');
    };

    const [loginError, setLoginError] = React.useState('');

    if (!isLoggedIn) {
        return el('div', { className: 'admin-login-page' },
            el('div', { className: 'admin-login-container' },
                el('img', { src: './public/logo copy.png', alt: 'Logo', className: 'admin-login-logo' }),
                el('h1', null, 'Studio ', el('span', null, 'Admin')),
                el('p', null, 'Please sign in to continue'),
                el('form', { onSubmit: handleLogin },
                    el('div', { className: 'input-group' },
                        el('label', null, 'User ID'),
                        el('input', {
                            type: 'text',
                            value: userId,
                            onChange: (e) => setUserId(e.target.value),
                            placeholder: 'Enter User ID'
                        })
                    ),
                    el('div', { className: 'input-group' },
                        el('label', null, 'Password'),
                        el('input', {
                            type: 'password',
                            value: password,
                            onChange: (e) => setPassword(e.target.value),
                            placeholder: 'Enter Password'
                        })
                    ),
                    loginError && el('p', { className: 'login-error' }, loginError),
                    el('button', { type: 'submit', className: 'btn-login' }, 'Login')
                ),
                el('a', { href: '#home', className: 'back-to-site' }, 'Back to Website')
            )
        );
    }

    return el('div', { className: 'admin-dashboard-layout' },
        el('aside', { className: 'admin-sidebar' },
            el('div', { className: 'sidebar-header' },
                el('img', { src: './public/logo copy.png', alt: 'Logo', className: 'admin-sidebar-logo' }),
                el('h2', null, 'Kavithaigal ', el('span', null, 'Admin'))
            ),
            el('nav', { className: 'sidebar-nav' },
                el('button', { className: activeTab === 'dashboard' ? 'active' : '', onClick: () => setActiveTab('dashboard') },
                    el('i', { className: 'fa-solid fa-gauge' }), ' Dashboard'),
                el('button', { className: activeTab === 'gallery' ? 'active' : '', onClick: () => setActiveTab('gallery') },
                    el('i', { className: 'fa-solid fa-images' }), ' Gallery'),
                el('button', { className: activeTab === 'portfolio' ? 'active' : '', onClick: () => setActiveTab('portfolio') },
                    el('i', { className: 'fa-solid fa-briefcase' }), ' Portfolio'),
                el('button', { className: activeTab === 'montages' ? 'active' : '', onClick: () => setActiveTab('montages') },
                    el('i', { className: 'fa-solid fa-film' }), ' Montages'),
                el('button', { className: activeTab === 'reviews' ? 'active' : '', onClick: () => setActiveTab('reviews') },
                    el('i', { className: 'fa-solid fa-star' }), ' Reviews'),
                el('button', { className: activeTab === 'contact' ? 'active' : '', onClick: () => setActiveTab('contact') },
                    el('i', { className: 'fa-solid fa-address-book' }), ' Contact Info')
            ),
            el('div', { className: 'sidebar-footer' },
                el('button', { onClick: handleLogout }, el('i', { className: 'fa-solid fa-right-from-bracket' }), ' Logout')
            )
        ),
        el('main', { className: 'admin-main' },
            el('header', { className: 'admin-header' },
                el('h1', null, activeTab.charAt(0).toUpperCase() + activeTab.slice(1)),
                el('div', { className: 'admin-profile' },
                    el('span', null, 'Welcome, Muhilan Prabhakaran'),
                    el('img', { src: './public/admin.png', alt: 'Admin' })
                )
            ),
            el('div', { className: 'admin-content' },
                activeTab === 'dashboard' && el(AdminDashboardOverview, { setActiveTab }),
                activeTab === 'gallery' && el(React.Fragment, null,
                    el(AdminGalleryManager),
                    el(AdminGalleryVideosManager)
                ),
                activeTab === 'portfolio' && el(AdminPortfolioManager),
                activeTab === 'montages' && el(AdminMontagesManager),
                activeTab === 'reviews' && el(React.Fragment, null,
                    el(AdminReviewVideoManager),
                    el(AdminReviewManager)
                ),
                activeTab === 'contact' && el(AdminContactManager)
            )
        )
    );
}

function AdminReviewVideoManager() {
    const [videos, setVideos] = React.useState([]);
    const [newUrl, setNewUrl] = React.useState('');
    const MAX_SIZE = 16 * 1024 * 1024; // 16MB (MongoDB Document Limit)

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/review-videos`)
            .then(res => res.json())
            .then(data => setVideos(data))
            .catch(err => console.error('Error fetching review videos:', err));
    }, []);

    const saveChanges = (newList) => {
        setVideos(newList);
        fetch(`${window.API_URL}/api/review-videos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videos: newList })
        }).catch(err => console.error('Error saving review videos:', err));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > MAX_SIZE) {
            alert('File size exceeds 250MB limit!');
            return;
        }
        handleFileUpload(file, (base64) => {
            if (videos.length >= 6) {
                alert('Only 6 videos allowed!');
                return;
            }
            saveChanges([...videos, { videoUrl: base64 }]);
        });
    };

    const addByUrl = () => {
        if (!newUrl) return;
        if (videos.length >= 6) {
            alert('Only 6 videos allowed!');
            return;
        }
        saveChanges([...videos, { videoUrl: newUrl }]);
        setNewUrl('');
    };

    return el('div', { className: 'admin-section', style: { marginBottom: '3rem' } },
        el('div', { className: 'welcome-card', style: { marginBottom: '2rem' } },
            el('h2', null, 'Showcase Videos (Max 6)'),
            el('p', null, 'Add up to 6 videos for the Anomalies Review page. The 1st video plays automatically.'),
            el('p', { style: { color: 'var(--pink-accent)', fontSize: '0.85rem', fontWeight: 'bold' } },
                'Note: Standard video files must be under 16MB. For larger videos, please use YouTube links.')
        ),
        el('div', { className: 'upload-controls' },
            el('div', { className: 'control-group' },
                el('h4', null, 'Add via YouTube URL'),
                el('div', { className: 'input-row' },
                    el('input', { type: 'text', placeholder: 'Paste Video URL...', value: newUrl, onChange: (e) => setNewUrl(e.target.value) }),
                    el('button', { className: 'btn-add', onClick: addByUrl }, 'Add')
                )
            ),
            el('div', { className: 'control-group' },
                el('h4', null, 'Upload File (Max 16MB)'),
                el('input', { type: 'file', accept: 'video/*', onChange: handleFileChange })
            )
        ),
        el('div', { className: 'admin-grid', style: { gridTemplateColumns: 'repeat(3, 1fr)' } },
            videos.map((vid, idx) => {
                const isYouTube = vid.videoUrl.includes('youtube.com') || vid.videoUrl.includes('youtu.be');
                let thumb;
                if (isYouTube) {
                    let videoId = '';
                    if (vid.videoUrl.includes('watch?v=')) videoId = vid.videoUrl.split('v=')[1].split('&')[0];
                    else if (vid.videoUrl.includes('youtu.be/')) videoId = vid.videoUrl.split('youtu.be/')[1].split('?')[0];
                    thumb = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                }

                return el('div', { key: idx, className: 'admin-item-card' },
                    isYouTube ?
                        el('div', { style: { height: '150px', position: 'relative', background: '#000' } },
                            el('img', { src: thumb, style: { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 } }),
                            el('i', { className: 'fa-brands fa-youtube', style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'red', fontSize: '2rem' } })
                        ) :
                        el('video', { src: vid.videoUrl, style: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px' } }),
                    el('div', { style: { padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                        el('span', null, `Video ${idx + 1}`),
                        el('button', { className: 'btn-delete', onClick: () => saveChanges(videos.filter((_, i) => i !== idx)) }, el('i', { className: 'fa-solid fa-trash' }))
                    )
                );
            })
        )
    );
}

function AdminReviewManager() {
    const [reviews, setReviews] = React.useState([]);

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/reviews`)
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(err => console.error('Error fetching reviews:', err));
    }, []);

    const deleteReview = (id) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        fetch(`${window.API_URL}/api/reviews/${id}`, { method: 'DELETE' })
            .then(() => setReviews(reviews.filter(r => r._id !== id)))
            .catch(err => console.error('Error deleting review:', err));
    };

    return el('div', { className: 'admin-section' },
        el('div', { className: 'welcome-card', style: { marginBottom: '2rem' } },
            el('h2', null, 'Manage Customer Reviews'),
            el('p', null, 'Latest reviews submitted by your customers will appear here. You can delete inappropriate reviews. Only the latest 6 are shown on the website.')
        ),
        el('div', { className: 'admin-grid' },
            reviews.map((rev, idx) => el('div', { key: rev._id, className: 'admin-item-card', style: { padding: '1.5rem' } },
                el('div', { className: 'review-stars', style: { marginBottom: '10px' } },
                    Array(5).fill(0).map((_, i) => el('i', {
                        key: i,
                        className: `fa-star ${i < rev.stars ? 'fa-solid' : 'fa-regular'}`,
                        style: { color: '#FFD700', fontSize: '0.9rem' }
                    }))
                ),
                el('p', { style: { fontSize: '0.9rem', color: '#555', marginBottom: '1rem', fontStyle: 'italic' } }, `"${rev.reviewText}"`),
                el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' } },
                    el('div', null,
                        el('h4', { style: { fontSize: '1rem', margin: 0 } }, rev.name),
                        el('span', { style: { fontSize: '0.8rem', color: 'var(--pink-accent)' } }, rev.shootType)
                    ),
                    el('button', { className: 'btn-delete', onClick: () => deleteReview(rev._id) }, el('i', { className: 'fa-solid fa-trash' }))
                )
            ))
        )
    );
}

// Helper for file upload to base64
const handleFileUpload = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
        callback(reader.result);
    };
    reader.readAsDataURL(file);
};

function AdminDashboardOverview({ setActiveTab }) {
    const [stats, setStats] = React.useState({
        galleryImages: 0,
        galleryVideos: 0,
        montages: 0,
        reviewTexts: 0,
        reviewVideos: 0,
        portfolioImages: 0
    });

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/admin/stats`)
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error('Error fetching dashboard stats:', err));
    }, []);

    return el('div', { className: 'dashboard-overview' },
        el('div', { className: 'stats-grid' },
            el('div', { className: 'stat-card', onClick: () => setActiveTab('gallery') },
                el('div', { className: 'stat-icon', style: { backgroundColor: '#4cc9f0' } }, el('i', { className: 'fa-solid fa-images' })),
                el('div', { className: 'stat-info' },
                    el('h3', null, 'Gallery'),
                    el('p', null, `${stats.galleryImages} Images`),
                    el('p', { style: { fontSize: '0.8rem', opacity: 0.8 } }, `${stats.galleryVideos} Videos`)
                )
            ),
            el('div', { className: 'stat-card', onClick: () => setActiveTab('portfolio') },
                el('div', { className: 'stat-icon', style: { backgroundColor: '#4361ee' } }, el('i', { className: 'fa-solid fa-briefcase' })),
                el('div', { className: 'stat-info' },
                    el('h3', null, 'Portfolio'),
                    el('p', null, `${stats.portfolioImages} Images`),
                    el('p', { style: { fontSize: '0.8rem', opacity: 0.8 } }, 'All Categories')
                )
            ),
            el('div', { className: 'stat-card', onClick: () => setActiveTab('montages') },
                el('div', { className: 'stat-icon', style: { backgroundColor: '#f72585' } }, el('i', { className: 'fa-solid fa-film' })),
                el('div', { className: 'stat-info' },
                    el('h3', null, 'Montages'),
                    el('p', null, `${stats.montages} Videos`)
                )
            ),
            el('div', { className: 'stat-card', onClick: () => setActiveTab('reviews') },
                el('div', { className: 'stat-icon', style: { backgroundColor: '#7209b7' } }, el('i', { className: 'fa-solid fa-star' })),
                el('div', { className: 'stat-info' },
                    el('h3', null, 'Reviews'),
                    el('p', null, `${stats.reviewTexts} Text Reviews`),
                    el('p', { style: { fontSize: '0.8rem', opacity: 0.8 } }, `${stats.reviewVideos} Showcase Videos`)
                )
            )
        ),
        el('div', { className: 'welcome-card' },
            el('h2', null, 'Studio Administration'),
            el('p', null, 'The system now remembers your session. If you refresh the page, you will stay on the same section. Use the selectors below to upload images or videos.')
        )
    );
}

function AdminGalleryManager() {
    const defaultImages = ['./public/b1.jpg', './public/b2.jpg', './public/b3.jpg', './public/b4.jpg', './public/b5.jpg', './public/b6.jpg'];
    const [images, setImages] = React.useState(defaultImages);
    const [newImageUrl, setNewImageUrl] = React.useState('');

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/gallery`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setImages(data);
                }
            })
            .catch(err => console.error('Error fetching gallery:', err));
    }, []);

    const saveChanges = (newList) => {
        setImages(newList);
        fetch(`${window.API_URL}/api/gallery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ images: newList })
        }).catch(err => console.error('Error saving gallery:', err));
    };

    const addImage = () => {
        if (!newImageUrl) return;
        saveChanges([...images, newImageUrl]);
        setNewImageUrl('');
    };

    return el('div', { className: 'admin-section' },
        el('div', { className: 'upload-controls' },
            el('div', { className: 'control-group' },
                el('h4', null, 'Option 1: Add via URL'),
                el('div', { className: 'input-row' },
                    el('input', { type: 'text', placeholder: 'Paste Image URL...', value: newImageUrl, onChange: (e) => setNewImageUrl(e.target.value) }),
                    el('button', { className: 'btn-add', onClick: addImage }, 'Add')
                )
            ),
            el('div', { className: 'control-group' },
                el('h4', null, 'Option 2: Upload File'),
                el('input', {
                    type: 'file',
                    accept: 'image/*',
                    onChange: (e) => handleFileUpload(e.target.files[0], (base64) => saveChanges([...images, base64]))
                })
            )
        ),
        el('div', { className: 'admin-grid' },
            images.map((src, idx) =>
                el('div', { key: idx, className: 'admin-item-card' },
                    el('img', { src: src, alt: '' }),
                    el('button', { className: 'btn-delete', onClick: () => saveChanges(images.filter((_, i) => i !== idx)) }, el('i', { className: 'fa-solid fa-trash' }))
                )
            )
        )
    );
}

function AdminGalleryVideosManager() {
    const [films, setFilms] = React.useState([]);
    const [newFilm, setNewFilm] = React.useState({ title: '', url: '', thumb: '' });

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/gallery-films`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) setFilms(data);
            })
            .catch(err => console.error('Error fetching gallery films:', err));
    }, []);

    const saveChanges = (newList) => {
        setFilms(newList);
        fetch(`${window.API_URL}/api/gallery-films`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ films: newList })
        }).catch(err => console.error('Error saving gallery films:', err));
    };

    const addFilm = () => {
        if (!newFilm.title || !newFilm.url) return;
        saveChanges([...films, newFilm]);
        setNewFilm({ title: '', url: '', thumb: '' });
    };

    return el('div', { className: 'admin-section', style: { marginTop: '3rem' } },
        el('div', { className: 'admin-modal-form' },
            el('h3', null, 'Manage "View My Films" (Gallery Page)'),
            el('p', { style: { fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' } },
                'Add cinematic films to your gallery page. Use YouTube URLs for large videos or upload small clips directly (Max 16MB).'),
            el('div', { className: 'form-grid' },
                el('input', { type: 'text', placeholder: 'Film Title...', value: newFilm.title, onChange: (e) => setNewFilm({ ...newFilm, title: e.target.value }) }),
                el('input', { type: 'text', placeholder: 'Video URL (YouTube or Direct)...', value: newFilm.url, onChange: (e) => setNewFilm({ ...newFilm, url: e.target.value }) }),
                el('div', { className: 'control-group', style: { gridColumn: 'span 2' } },
                    el('p', { style: { fontSize: '0.9rem', marginBottom: '5px', fontWeight: 'bold' } }, 'Or Upload directly:'),
                    el('div', { style: { display: 'flex', gap: '15px' } },
                        el('div', null, el('label', { style: { fontSize: '0.75rem' } }, 'Video:'), el('input', { type: 'file', accept: 'video/*', onChange: (e) => handleFileUpload(e.target.files[0], (b) => setNewFilm({ ...newFilm, url: b })) })),
                        el('div', null, el('label', { style: { fontSize: '0.75rem' } }, 'Thumbnail:'), el('input', { type: 'file', accept: 'image/*', onChange: (e) => handleFileUpload(e.target.files[0], (b) => setNewFilm({ ...newFilm, thumb: b })) }))
                    )
                ),
                el('button', { className: 'btn-add', style: { gridColumn: 'span 2', marginTop: '10px' }, onClick: addFilm }, 'Add Film to Gallery')
            )
        ),
        el('div', { className: 'admin-grid' },
            films.map((film, idx) =>
                el('div', { key: idx, className: 'admin-item-card' },
                    el('img', { src: film.thumb || 'https://via.placeholder.com/300x169?text=No+Thumbnail', alt: '' }),
                    el('div', { className: 'admin-item-info' },
                        el('h4', null, film.title),
                        el('button', { className: 'btn-delete', onClick: () => saveChanges(films.filter((_, i) => i !== idx)) }, el('i', { className: 'fa-solid fa-trash' }))
                    )
                )
            )
        )
    );
}

function AdminPortfolioManager() {
    const initialCategories = [
        { title: 'Portraits', image: './public/b6.jpg' },
        { title: 'Pre Weddings', image: './public/b5.jpg' },
        { title: 'Weddings', image: './public/b4.jpg' },
        { title: 'Reception', image: './public/b3.jpg' },
        { title: 'Model Shoot', image: './public/b2.jpg' },
        { title: 'Engagement', image: './public/b1.jpg' }
    ];

    const [categories, setCategories] = React.useState(() => {
        const saved = localStorage.getItem('ks_portfolio_data');
        return saved ? JSON.parse(saved) : initialCategories;
    });

    const [selectedCat, setSelectedCat] = React.useState(() => {
        return localStorage.getItem('ks_admin_portfolio_selected_cat') || categories[0]?.title || '';
    });

    const defaultPortfolio = ['./public/b6.jpg', './public/b5.jpg', './public/b4.jpg', './public/b3.jpg', './public/b2.jpg', './public/b1.jpg'];
    const [catImages, setCatImages] = React.useState(defaultPortfolio);

    React.useEffect(() => {
        if (selectedCat) {
            localStorage.setItem('ks_admin_portfolio_selected_cat', selectedCat);
            fetch(`${window.API_URL}/api/portfolio/${encodeURIComponent(selectedCat)}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        setCatImages(data);
                    } else {
                        setCatImages(defaultPortfolio);
                    }
                })
                .catch(err => { console.error('Error fetching portfolio:', err); setCatImages(defaultPortfolio); });
        }
    }, [selectedCat]);

    const saveCatImages = (newList) => {
        setCatImages(newList);
        fetch(`${window.API_URL}/api/portfolio/${encodeURIComponent(selectedCat)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ images: newList })
        })
            .then(res => {
                if (!res.ok) throw new Error('Update failed');
                alert(`${selectedCat} updated successfully!`);
            })
            .catch(err => {
                console.error('Error saving portfolio:', err);
                alert('Large images might fail to save to MongoDB (16MB limit). Try smaller files.');
            });
    };

    return el('div', { className: 'admin-section' },
        el('div', { className: 'admin-modal-form' },
            el('h3', null, 'Manage Portfolio Content'),
            el('div', { className: 'input-group' },
                el('label', null, 'Select Category (Dropbox)'),
                el('select', {
                    value: selectedCat,
                    onChange: (e) => setSelectedCat(e.target.value),
                    className: 'admin-select'
                },
                    categories.map((cat, idx) => el('option', { key: idx, value: cat.title }, cat.title))
                )
            ),
            selectedCat && el('div', { className: 'upload-controls' },
                el('div', { className: 'control-group' },
                    el('h4', null, `Upload Image to "${selectedCat}"`),
                    el('input', {
                        type: 'file',
                        accept: 'image/*',
                        onChange: (e) => handleFileUpload(e.target.files[0], (base64) => saveCatImages([...catImages, base64]))
                    })
                )
            )
        ),
        selectedCat && el('div', { className: 'admin-grid' },
            catImages.map((src, idx) =>
                el('div', { key: idx, className: 'admin-item-card' },
                    el('img', { src: src, alt: '' }),
                    el('button', { className: 'btn-delete', onClick: () => saveCatImages(catImages.filter((_, i) => i !== idx)) }, el('i', { className: 'fa-solid fa-trash' }))
                )
            )
        )
    );
}

function AdminMontagesManager() {
    const defaultMontages = [
        { clientName: "Pravin & Sakthi", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600" },
        { clientName: "Surya & Jothika", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", thumb: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=600" },
        { clientName: "Vijay & Sangeetha", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", thumb: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&q=80&w=600" }
    ];
    const [montages, setMontages] = React.useState(defaultMontages);
    const [newMon, setNewMon] = React.useState({ clientName: '', url: '', thumb: '' });

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/montages`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setMontages(data);
                }
            })
            .catch(err => console.error('Error fetching montages:', err));
    }, []);

    const saveChanges = (newList) => {
        setMontages(newList);
        fetch(`${window.API_URL}/api/montages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ montages: newList })
        })
            .then(res => {
                if (!res.ok) throw new Error('Update failed');
                alert('Montages updated successfully!');
            })
            .catch(err => {
                console.error('Error saving montages:', err);
                alert('Large video files (Base64) cannot be saved to MongoDB. Please use external URLs for large videos.');
            });
    };

    const addMontage = () => {
        if (!newMon.clientName || !newMon.url) return;
        saveChanges([...montages, newMon]);
        setNewMon({ clientName: '', url: '', thumb: '' });
    };

    return el('div', { className: 'admin-section' },
        el('div', { className: 'admin-modal-form' },
            el('h3', null, 'Add New Montage'),
            el('div', { className: 'form-grid' },
                el('input', { type: 'text', placeholder: 'Client Name (Overlay text)', value: newMon.clientName, onChange: (e) => setNewMon({ ...newMon, clientName: e.target.value }) }),
                el('input', { type: 'text', placeholder: 'Video URL (or paste link)', value: newMon.url, onChange: (e) => setNewMon({ ...newMon, url: e.target.value }) }),

                el('div', { className: 'control-group', style: { gridColumn: 'span 2' } },
                    el('p', { style: { fontSize: '0.9rem', marginBottom: '5px', fontWeight: 'bold' } }, 'Or Upload directly:'),
                    el('div', { style: { display: 'flex', gap: '15px' } },
                        el('div', null, el('label', { style: { fontSize: '0.75rem' } }, 'Video:'), el('input', { type: 'file', accept: 'video/*', onChange: (e) => handleFileUpload(e.target.files[0], (b) => setNewMon({ ...newMon, url: b })) })),
                        el('div', null, el('label', { style: { fontSize: '0.75rem' } }, 'Thumbnail:'), el('input', { type: 'file', accept: 'image/*', onChange: (e) => handleFileUpload(e.target.files[0], (b) => setNewMon({ ...newMon, thumb: b })) }))
                    )
                ),
                el('button', { className: 'btn-add', style: { gridColumn: 'span 2', marginTop: '10px' }, onClick: addMontage }, 'Save & Add Montage')
            )
        ),
        el('div', { className: 'admin-grid' },
            montages.map((mon, idx) =>
                el('div', { key: idx, className: 'admin-item-card' },
                    el('img', { src: mon.thumb || 'https://via.placeholder.com/300x169', alt: '' }),
                    el('div', { className: 'admin-item-info' },
                        el('h4', null, mon.clientName),
                        el('button', { className: 'btn-delete', onClick: () => saveChanges(montages.filter((_, i) => i !== idx)) }, el('i', { className: 'fa-solid fa-trash' }))
                    )
                )
            )
        )
    );
}

function AdminContactManager() {
    const [form, setForm] = React.useState({
        phone1: '', phone2: '', email: '', address: '',
        instagram: '', whatsapp: '', mapsUrl: '', workingHours: ''
    });
    const [saved, setSaved] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/contact-info`)
            .then(res => res.json())
            .then(data => {
                setForm({
                    phone1: data.phone1 || '',
                    phone2: data.phone2 || '',
                    email: data.email || '',
                    address: data.address || '',
                    instagram: data.instagram || '',
                    whatsapp: data.whatsapp || '',
                    mapsUrl: data.mapsUrl || '',
                    workingHours: data.workingHours || ''
                });
                setLoading(false);
            })
            .catch(err => { console.error('Error:', err); setLoading(false); });
    }, []);

    const handleSave = () => {
        fetch(`${window.API_URL}/api/contact-info`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(res => res.json())
            .then(() => { setSaved(true); setTimeout(() => setSaved(false), 3000); })
            .catch(err => { console.error('Error saving contact:', err); alert('Failed to save contact info.'); });
    };

    const field = (label, key, type = 'text', placeholder = '') =>
        el('div', { className: 'contact-admin-field' },
            el('label', null, label),
            el('input', {
                type,
                value: form[key],
                placeholder: placeholder || label,
                onChange: (e) => setForm({ ...form, [key]: e.target.value })
            })
        );

    if (loading) return el('div', { className: 'admin-section' }, el('p', null, 'Loading...'));

    return el('div', { className: 'admin-section' },
        el('div', { className: 'welcome-card', style: { marginBottom: '2rem' } },
            el('h2', null, 'Manage Contact Information'),
            el('p', null, 'Update the contact details shown on the public Contact page. Changes are saved to MongoDB immediately.')
        ),
        el('div', { className: 'contact-admin-form' },
            field('Primary Phone Number', 'phone1', 'tel', '+91 XXXXX XXXXX'),
            field('Secondary Phone Number (optional)', 'phone2', 'tel', '+91 XXXXX XXXXX'),
            field('Email Address', 'email', 'email', 'studio@email.com'),
            field('WhatsApp Link', 'whatsapp', 'text', 'https://wa.me/91XXXXXXXXXX'),
            field('Instagram URL', 'instagram', 'text', 'https://www.instagram.com/yourhandle'),
            field('Address', 'address', 'text', 'City, State, Country'),
            field('Working Hours', 'workingHours', 'text', 'Mon – Sat: 9 AM – 7 PM'),
            field('Google Maps Embed URL (optional)', 'mapsUrl', 'text', 'https://maps.google.com/...'),
            el('button', {
                className: 'btn-add',
                style: { marginTop: '1.5rem', padding: '0.9rem 2.5rem', fontSize: '1rem' },
                onClick: handleSave
            },
                saved
                    ? el(React.Fragment, null, el('i', { className: 'fa-solid fa-check', style: { marginRight: '8px' } }), 'Saved!')
                    : el(React.Fragment, null, el('i', { className: 'fa-solid fa-floppy-disk', style: { marginRight: '8px' } }), 'Save Changes')
            )
        )
    );
}
