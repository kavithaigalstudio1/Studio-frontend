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
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // Global Stats State for instant updates
    const [stats, setStats] = React.useState({
        galleryImages: 0,
        galleryVideos: 0,
        montages: 0,
        reviewTexts: 0,
        reviewVideos: 0,
        portfolioImages: 0,
        innerPageImages: 0
    });

    const fetchStats = React.useCallback(() => {
        fetch(`${window.API_URL}/api/admin/stats`)
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error('Error fetching dashboard stats:', err));
    }, []);

    React.useEffect(() => {
        if (isLoggedIn) {
            fetchStats();
        }
    }, [isLoggedIn, fetchStats]);

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

    return el('div', { className: `admin-dashboard-layout ${isSidebarOpen ? 'sidebar-open' : ''}` },
        // Mobile Sidebar Overlay
        isSidebarOpen && el('div', { className: 'sidebar-overlay', onClick: () => setIsSidebarOpen(false) }),

        el('aside', { className: 'admin-sidebar' },
            el('div', { className: 'sidebar-header' },
                el('img', { src: './public/logo copy.png', alt: 'Logo', className: 'admin-sidebar-logo' }),
                el('h2', null, 'Kavithaigal ', el('span', null, 'Admin')),
                // Close button for mobile
                el('button', { className: 'sidebar-close-btn', onClick: () => setIsSidebarOpen(false) },
                    el('i', { className: 'fa-solid fa-xmark' })
                )
            ),
            el('nav', { className: 'sidebar-nav' },
                el('button', {
                    className: activeTab === 'dashboard' ? 'active' : '',
                    onClick: () => { setActiveTab('dashboard'); setIsSidebarOpen(false); }
                }, el('i', { className: 'fa-solid fa-house-chimney-window' }), el('span', null, 'Dashboard')),

                el('button', {
                    className: activeTab === 'gallery' ? 'active' : '',
                    onClick: () => { setActiveTab('gallery'); setIsSidebarOpen(false); }
                }, el('i', { className: 'fa-solid fa-photo-film' }), el('span', null, 'Gallery')),

                el('button', {
                    className: activeTab === 'portfolio' ? 'active' : '',
                    onClick: () => { setActiveTab('portfolio'); setIsSidebarOpen(false); }
                }, el('i', { className: 'fa-solid fa-crown' }), el('span', null, 'Portfolio')),

                el('button', {
                    className: activeTab === 'montages' ? 'active' : '',
                    onClick: () => { setActiveTab('montages'); setIsSidebarOpen(false); }
                }, el('i', { className: 'fa-solid fa-clapperboard' }), el('span', null, 'Montages')),

                el('button', {
                    className: activeTab === 'reviews' ? 'active' : '',
                    onClick: () => { setActiveTab('reviews'); setIsSidebarOpen(false); }
                }, el('i', { className: 'fa-solid fa-comment-dots' }), el('span', null, 'Reviews')),

                el('button', {
                    className: activeTab === 'contact' ? 'active' : '',
                    onClick: () => { setActiveTab('contact'); setIsSidebarOpen(false); }
                }, el('i', { className: 'fa-solid fa-id-card' }), el('span', null, 'Contact Info')),

                el('button', {
                    className: activeTab === 'innerpages' ? 'active' : '',
                    onClick: () => { setActiveTab('innerpages'); setIsSidebarOpen(false); }
                }, el('i', { className: 'fa-solid fa-images' }), el('span', null, 'Inner Pages'))
            ),
            el('div', { className: 'sidebar-footer' },
                el('button', { onClick: handleLogout }, el('i', { className: 'fa-solid fa-power-off' }), el('span', null, 'Logout'))
            )
        ),
        el('main', { className: 'admin-main' },
            el('header', { className: 'admin-header' },
                el('div', { style: { display: 'flex', alignItems: 'center', gap: '1rem' } },
                    el('button', { className: 'admin-menu-toggle', onClick: () => setIsSidebarOpen(true) },
                        el('i', { className: 'fa-solid fa-bars-staggered' })
                    ),
                    el('h1', null, activeTab.charAt(0).toUpperCase() + activeTab.slice(1))
                ),
                el('div', { className: 'admin-profile' },
                    el('div', { className: 'admin-profile-info' },
                        el('span', { className: 'admin-welcome' }, 'Welcome, Muhilan Prabhakaran'),
                        el('span', { className: 'admin-tag' }, 'ADMIN')
                    ),
                    el('img', { src: './public/admin.png', alt: 'Admin' })
                )
            ),
            el('div', { className: 'admin-content' },
                activeTab === 'dashboard' && el(AdminDashboardOverview, { setActiveTab, stats }),
                activeTab === 'gallery' && el(React.Fragment, null,
                    el(AdminGalleryManager, { onUpdate: fetchStats }),
                    el(AdminGalleryVideosManager, { onUpdate: fetchStats })
                ),
                activeTab === 'portfolio' && el(AdminPortfolioManager, { onUpdate: fetchStats }),
                activeTab === 'montages' && el(AdminMontagesManager, { onUpdate: fetchStats }),
                activeTab === 'reviews' && el(React.Fragment, null,
                    el(AdminReviewVideoManager, { onUpdate: fetchStats }),
                    el(AdminReviewManager, { onUpdate: fetchStats })
                ),
                activeTab === 'contact' && el(AdminContactManager),
                activeTab === 'innerpages' && el(AdminInnerPagesManager, { onUpdate: fetchStats })
            )
        )
    );
}

function AdminReviewVideoManager({ onUpdate }) {
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
        })
            .then(() => onUpdate && onUpdate())
            .catch(err => console.error('Error saving review videos:', err));
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

function AdminReviewManager({ onUpdate }) {
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
            .then(() => {
                setReviews(reviews.filter(r => r._id !== id));
                onUpdate && onUpdate();
            })
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

// Helper for image compression before upload
const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Only resize if bigger than maxWidth
                if (width > maxWidth || height > maxWidth) {
                    if (width > height) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    } else {
                        width *= maxWidth / height;
                        height = maxWidth;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Return high-efficiency JPEG base64 (roughly 10x smaller)
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

function AdminDropdown({ options, value, onChange, label }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    return el('div', { className: 'admin-dropdown-container', ref: dropdownRef },
        label && el('label', { className: 'admin-dropdown-label' }, label),
        el('div', {
            className: `admin-dropdown-trigger ${isOpen ? 'active' : ''}`,
            onClick: () => setIsOpen(!isOpen)
        },
            el('span', null, selectedOption ? selectedOption.label : 'Select...'),
            el('i', { className: `fa-solid fa-chevron-down ${isOpen ? 'rotate' : ''}` })
        ),
        el('div', { className: `admin-dropdown-menu ${isOpen ? 'show' : ''}` },
            options.map((opt, idx) => el('div', {
                key: idx,
                className: `admin-dropdown-item ${value === opt.value ? 'selected' : ''}`,
                onClick: () => {
                    onChange(opt.value);
                    setIsOpen(false);
                }
            }, opt.label))
        )
    );
}

// Refined single-file handler with compression
const handleFileUpload = (file, callback) => {
    if (!file) return;
    compressImage(file)
        .then(base64 => callback(base64))
        .catch(err => {
            console.error('Compression failed:', err);
            // Fallback to direct read if compression fails
            const reader = new FileReader();
            reader.onload = () => callback(reader.result);
            reader.readAsDataURL(file);
        });
};

// Multi-file helper with parallel compression
const filesToBase64 = (files) => {
    return Promise.all(Array.from(files).map(file => compressImage(file)));
};

function AdminDashboardOverview({ setActiveTab, stats }) {
    return el('div', { className: 'dashboard-overview' },
        el('div', { className: 'stats-grid' },
            el('div', { className: 'stat-card', onClick: () => setActiveTab('gallery') },
                el('div', { className: 'stat-icon', style: { background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)' } }, el('i', { className: 'fa-solid fa-photo-film' })),
                el('div', { className: 'stat-info' },
                    el('h3', null, 'Gallery'),
                    el('p', null, `${stats.galleryImages} Images`),
                    el('p', { style: { fontSize: '0.8rem', opacity: 0.8, fontWeight: 400 } }, `${stats.galleryVideos || 0} Videos`)
                )
            ),
            el('div', { className: 'stat-card', onClick: () => setActiveTab('portfolio') },
                el('div', { className: 'stat-icon', style: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' } }, el('i', { className: 'fa-solid fa-crown' })),
                el('div', { className: 'stat-info' },
                    el('h3', null, 'Portfolio'),
                    el('p', null, `${stats.portfolioImages} Images`),
                    el('p', { style: { fontSize: '0.8rem', opacity: 0.8, fontWeight: 400 } }, 'All Categories')
                )
            ),
            el('div', { className: 'stat-card', onClick: () => setActiveTab('montages') },
                el('div', { className: 'stat-icon', style: { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' } }, el('i', { className: 'fa-solid fa-clapperboard' })),
                el('div', { className: 'stat-info' },
                    el('h3', null, 'Montages'),
                    el('p', null, `${stats.montages} Videos`),
                    el('p', { style: { fontSize: '0.8rem', opacity: 0.8, fontWeight: 400 } }, 'Client Showcases')
                )
            ),
            el('div', { className: 'stat-card', onClick: () => setActiveTab('reviews') },
                el('div', { className: 'stat-icon', style: { background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' } }, el('i', { className: 'fa-solid fa-comment-dots' })),
                el('div', { className: 'stat-info' },
                    el('h3', null, 'Reviews'),
                    el('p', null, `${stats.reviewTexts} Reviews`),
                    el('p', { style: { fontSize: '0.8rem', opacity: 0.8, fontWeight: 400 } }, `${stats.reviewVideos || 0} Showcase Videos`)
                )
            ),
            el('div', { className: 'stat-card', onClick: () => setActiveTab('innerpages') },
                el('div', { className: 'stat-icon', style: { background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)' } }, el('i', { className: 'fa-solid fa-images' })),
                el('div', { className: 'stat-info' },
                    el('h3', null, 'Inner Pages'),
                    el('p', null, `${stats.innerPageImages || 0} Images`),
                    el('p', { style: { fontSize: '0.8rem', opacity: 0.8, fontWeight: 400 } }, '4 Wedding Stories')
                )
            )
        ),
        el('div', { className: 'welcome-card' },
            el('h2', null, 'Studio Administration'),
            el('p', null, 'Welcome to your premium dashboard. Manage your gallery, portfolio, and client reviews with ease. Your session is synchronized across refreshes.')
        )
    );
}

function AdminGalleryManager({ onUpdate }) {
    const [images, setImages] = React.useState([]);
    const [newImageUrl, setNewImageUrl] = React.useState('');
    const [selectedIndices, setSelectedIndices] = React.useState([]);

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/gallery`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setImages(data);
                }
            })
            .catch(err => console.error('Error fetching gallery:', err));
    }, []);

    const saveChanges = (newList) => {
        setImages(newList);
        setSelectedIndices([]);

        // Clear frontend caches to ensure immediate update on Gallery page
        window.globalAssetCache.gallery = newList;

        fetch(`${window.API_URL}/api/gallery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ images: newList })
        })
            .then(() => {
                onUpdate && onUpdate();
                console.log('Gallery synchronized with MongoDB');
            })
            .catch(err => console.error('Error saving gallery:', err));
    };

    const addImage = () => {
        if (!newImageUrl) return;
        if (images.length >= 50) {
            alert('Maximum 50 images allowed in Gallery!');
            return;
        }
        saveChanges([newImageUrl, ...images]);
        setNewImageUrl('');
    };

    const toggleSelect = (idx) => {
        setSelectedIndices(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const deleteSelected = () => {
        if (!selectedIndices.length) return;
        if (!confirm(`Delete ${selectedIndices.length} selected images?`)) return;
        const newList = images.filter((_, idx) => !selectedIndices.includes(idx));
        saveChanges(newList);
    };

    return el('div', { className: 'admin-section' },
        el('div', { className: 'welcome-card', style: { marginBottom: '2rem' } },
            el('h2', null, 'Manage Gallery Images (Max 50)'),
            el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                el('p', { style: { margin: 0 } }, `${images.length}/50 images uploaded. ${50 - images.length} slots remaining.`),
                images.length > 0 && el('button', {
                    className: 'btn-secondary',
                    style: { padding: '5px 12px', fontSize: '0.8rem' },
                    onClick: () => {
                        if (selectedIndices.length === images.length) setSelectedIndices([]);
                        else setSelectedIndices(images.map((_, i) => i));
                    }
                }, selectedIndices.length === images.length ? 'Deselect All' : 'Select All')
            )
        ),
        el('div', { className: 'upload-controls' },
            el('div', { className: 'control-group' },
                el('h4', null, 'Option 1: Add via URL'),
                el('div', { className: 'input-row' },
                    el('input', { type: 'text', placeholder: 'Paste Image URL...', value: newImageUrl, onChange: (e) => setNewImageUrl(e.target.value) }),
                    el('button', { className: 'btn-add', onClick: addImage }, 'Add')
                )
            ),
            el('div', { className: 'control-group' },
                el('h4', null, 'Option 2: Upload Files (Select 1 to 5)'),
                el('input', {
                    type: 'file',
                    accept: 'image/*',
                    multiple: true,
                    onChange: (e) => {
                        const totalRemaining = 50 - images.length;
                        if (totalRemaining <= 0) {
                            alert('Gallery is full (Max 50)! Delete some to add more.');
                            e.target.value = "";
                            return;
                        }

                        // Limit batch to 5 and also check remaining capacity
                        const batchLimit = Math.min(5, totalRemaining);
                        const files = Array.from(e.target.files).slice(0, batchLimit);

                        if (e.target.files.length > batchLimit) {
                            alert(`You can add up to 5 images at once. Adding the first ${batchLimit} selected files.`);
                        }

                        filesToBase64(files).then(base64s => {
                            saveChanges([...base64s, ...images]);
                            e.target.value = "";
                        });
                    }
                })
            ),
            selectedIndices.length > 0 && el('div', { className: 'selection-actions' },
                el('span', { className: 'selection-info' },
                    el('i', { className: 'fa-solid fa-check-double', style: { marginRight: '8px' } }),
                    `${selectedIndices.length} items selected`
                ),
                el('button', { className: 'btn-delete bulk-delete', onClick: deleteSelected },
                    el('i', { className: 'fa-solid fa-trash-can' }),
                    `Delete Selected`
                )
            )
        ),
        el('div', { className: 'admin-grid' },
            images.map((src, idx) =>
                el('div', { key: idx, className: `admin-item-card ${selectedIndices.includes(idx) ? 'selected' : ''}`, onClick: () => toggleSelect(idx) },
                    el('div', { className: 'selection-checkbox' },
                        el('i', { className: selectedIndices.includes(idx) ? 'fa-solid fa-square-check' : 'fa-regular fa-square' })
                    ),
                    el('img', { src: src, alt: '' }),
                    el('button', { className: 'btn-delete single-delete', onClick: (e) => { e.stopPropagation(); saveChanges(images.filter((_, i) => i !== idx)); } }, el('i', { className: 'fa-solid fa-trash' }))
                )
            )
        )
    );
}

function AdminGalleryVideosManager({ onUpdate }) {
    const [films, setFilms] = React.useState([]);
    const [newFilm, setNewFilm] = React.useState({ title: '', url: '', thumb: '' });

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/gallery-films`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setFilms(data);
            })
            .catch(err => console.error('Error fetching gallery films:', err));
    }, []);

    const saveChanges = (newList) => {
        setFilms(newList);
        fetch(`${window.API_URL}/api/gallery-films`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ films: newList })
        })
            .then(() => onUpdate && onUpdate())
            .catch(err => console.error('Error saving gallery films:', err));
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

function AdminPortfolioManager({ onUpdate }) {
    const initialCategories = [
        { title: 'Portraits', image: './public/b6.jpg' },
        { title: 'Pre Weddings', image: './public/b5.jpg' },
        { title: 'Weddings', image: './public/b4.jpg' },
        { title: 'Reception', image: './public/b3.jpg' },
        { title: 'Model Shoot', image: './public/b2.jpg' },
        { title: 'Engagement', image: './public/b1.jpg' }
    ];

    const [categories, setCategories] = React.useState(initialCategories);

    const [selectedCat, setSelectedCat] = React.useState(() => {
        return localStorage.getItem('ks_admin_portfolio_selected_cat') || categories[0]?.title || '';
    });

    const [catImages, setCatImages] = React.useState([]);
    const [selectedIndices, setSelectedIndices] = React.useState([]);

    React.useEffect(() => {
        if (selectedCat) {
            localStorage.setItem('ks_admin_portfolio_selected_cat', selectedCat);
            fetch(`${window.API_URL}/api/portfolio/${encodeURIComponent(selectedCat)}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setCatImages(data);
                        setSelectedIndices([]);
                    }
                })
                .catch(err => {
                    console.error('Error fetching portfolio:', err);
                    setCatImages([]); // Default to empty on error
                });
        }
    }, [selectedCat]);

    const saveCatImages = (newList) => {
        if (newList.length > 50) {
            alert('Maximum 50 images allowed per category!');
            return;
        }
        setCatImages(newList);
        setSelectedIndices([]);

        // Update selective cache for this category
        if (!window.globalAssetCache.portfolio) window.globalAssetCache.portfolio = {};
        window.globalAssetCache.portfolio[selectedCat] = newList;

        fetch(`${window.API_URL}/api/portfolio/${encodeURIComponent(selectedCat)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ images: newList })
        })
            .then(res => {
                if (!res.ok) throw new Error(res.statusText || 'Update failed');
                onUpdate && onUpdate();
                console.log(`Portfolio: ${selectedCat} synchronized with MongoDB`);
            })
            .catch(err => {
                console.error('Error saving portfolio:', err);
                alert(`Error: ${err.message}. If uploading images, ensure they aren't extremely large (total payload under 16MB).`);
            });
    };

    const toggleSelect = (idx) => {
        setSelectedIndices(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const deleteSelected = () => {
        if (!selectedIndices.length) return;
        if (!confirm(`Delete ${selectedIndices.length} selected images from ${selectedCat}?`)) return;
        const newList = catImages.filter((_, idx) => !selectedIndices.includes(idx));
        saveCatImages(newList);
    };

    return el('div', { className: 'admin-section' },
        el('div', { className: 'welcome-card', style: { marginBottom: '2rem' } },
            el('h2', null, 'Portfolio Category Content (Max 50)'),
            el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                el('p', { style: { margin: 0 } }, selectedCat ? `${catImages.length}/50 images in "${selectedCat}". ${50 - catImages.length} slots remaining.` : 'Please select a category below.'),
                selectedCat && catImages.length > 0 && el('button', {
                    className: 'btn-secondary',
                    style: { padding: '5px 12px', fontSize: '0.8rem' },
                    onClick: () => {
                        if (selectedIndices.length === catImages.length) setSelectedIndices([]);
                        else setSelectedIndices(catImages.map((_, i) => i));
                    }
                }, selectedIndices.length === catImages.length ? 'Deselect All' : 'Select All')
            )
        ),
        el('div', { className: 'admin-modal-form' },
            el('h3', null, 'Select & Add Portfolio Content'),
            el(AdminDropdown, {
                label: 'Choose Category',
                value: selectedCat,
                options: categories.map(cat => ({ label: cat.title, value: cat.title })),
                onChange: (val) => setSelectedCat(val)
            }),
            selectedCat && el('div', { className: 'upload-controls', style: { marginTop: '1.5rem', background: 'rgba(255,255,255,0.03)' } },
                el('div', { className: 'control-group' },
                    el('h4', null, `Upload Images to "${selectedCat}" (Select 1 to 5)`),
                    el('input', {
                        type: 'file',
                        accept: 'image/*',
                        multiple: true,
                        onChange: (e) => {
                            const totalRemaining = 50 - catImages.length;
                            if (totalRemaining <= 0) {
                                alert('This category is full (Max 50)!');
                                e.target.value = "";
                                return;
                            }
                            const batchLimit = Math.min(5, totalRemaining);
                            const files = Array.from(e.target.files).slice(0, batchLimit);
                            if (e.target.files.length > batchLimit) {
                                alert(`You can add up to 5 images at once. Adding the first ${batchLimit} selected files.`);
                            }
                            filesToBase64(files).then(base64s => {
                                saveCatImages([...base64s, ...catImages]);
                                e.target.value = "";
                            });
                        }
                    })
                ),
            )
        ),
        selectedIndices.length > 0 && el('div', { className: 'selection-actions' },
            el('span', { className: 'selection-info' },
                el('i', { className: 'fa-solid fa-check-double', style: { marginRight: '8px' } }),
                `${selectedIndices.length} items selected from ${selectedCat}`
            ),
            el('button', { className: 'btn-delete bulk-delete', onClick: deleteSelected },
                el('i', { className: 'fa-solid fa-trash-can' }),
                `Delete Selected`
            )
        ),
        selectedCat && el('div', { className: 'admin-grid' },
            catImages.map((src, idx) =>
                el('div', { key: idx, className: `admin-item-card ${selectedIndices.includes(idx) ? 'selected' : ''}`, onClick: () => toggleSelect(idx) },
                    el('div', { className: 'selection-checkbox' },
                        el('i', { className: selectedIndices.includes(idx) ? 'fa-solid fa-square-check' : 'fa-regular fa-square' })
                    ),
                    el('img', { src: src, alt: '' }),
                    el('button', { className: 'btn-delete single-delete', onClick: (e) => { e.stopPropagation(); saveCatImages(catImages.filter((_, i) => i !== idx)); } }, el('i', { className: 'fa-solid fa-trash' }))
                )
            )
        )
    );
}

function AdminMontagesManager({ onUpdate }) {
    const [montages, setMontages] = React.useState([]);
    const [newMon, setNewMon] = React.useState({ clientName: '', url: '', thumb: '' });

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/montages`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
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
            .then(async res => {
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || res.statusText || 'Update failed');
                }
                onUpdate && onUpdate();
                alert('Montages updated successfully!');
            })
            .catch(err => {
                console.error('Error saving montages:', err);
                alert(`Error: ${err.message}. Ensure video links are valid and total data (Base64 images) is under 16MB.`);
            });
    };

    const addMontage = () => {
        if (!newMon.clientName || !newMon.url) return;
        saveChanges([...montages, newMon]);
        setNewMon({ clientName: '', url: '', thumb: '' });
        // Clear file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = "");
    };

    return el('div', { className: 'admin-section' },
        el('div', { className: 'admin-modal-form' },
            el('h3', null, 'Add New Montage'),
            el('div', { className: 'form-grid' },
                el('input', { type: 'text', placeholder: 'Client Name (Overlay text)', value: newMon.clientName, onChange: (e) => setNewMon({ ...newMon, clientName: e.target.value }) }),
                el('input', { type: 'text', placeholder: 'Video URL (or paste link)', value: newMon.url, onChange: (e) => setNewMon({ ...newMon, url: e.target.value }) }),
                el('input', { type: 'text', placeholder: 'Thumbnail URL (Optional)', value: newMon.thumb, onChange: (e) => setNewMon({ ...newMon, thumb: e.target.value }) }),

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

function AdminInnerPagesManager({ onUpdate }) {
    const CARDS = [
        { title: 'Pravin Weds Sakthi' },
        { title: 'Surya Weds Jothika' },
        { title: 'Vijay Weds Sangeetha' },
        { title: 'Ajith Weds Shalini' }
    ];

    const [selectedCard, setSelectedCard] = React.useState(CARDS[0].title);
    const [cardImages, setCardImages] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedIndices, setSelectedIndices] = React.useState([]);

    React.useEffect(() => {
        if (!selectedCard) return;
        setLoading(true);
        fetch(`${window.API_URL}/api/inner-images/${encodeURIComponent(selectedCard)}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCardImages(data);
                else setCardImages([]);
                setSelectedIndices([]);
                setLoading(false);
            })
            .catch(err => { console.error('Error fetching inner images:', err); setLoading(false); });
    }, [selectedCard]);

    const saveImages = (newList) => {
        if (newList.length > 50) {
            alert('Maximum 50 images per inner page!');
            return;
        }
        setCardImages(newList);
        setSelectedIndices([]);

        // Internal cache update for Stories
        if (!window.globalAssetCache.innerImages) window.globalAssetCache.innerImages = {};
        window.globalAssetCache.innerImages[selectedCard] = newList;

        fetch(`${window.API_URL}/api/inner-images/${encodeURIComponent(selectedCard)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ images: newList })
        })
            .then(res => {
                if (!res.ok) throw new Error(res.statusText);
                onUpdate && onUpdate();
                console.log(`Inner Page: ${selectedCard} synchronized with MongoDB`);
            })
            .catch(err => {
                console.error('Error saving inner images:', err);
                alert(`Error: ${err.message}`);
            });
    };

    const toggleSelect = (idx) => {
        setSelectedIndices(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const deleteSelected = () => {
        if (!selectedIndices.length) return;
        if (!confirm(`Delete ${selectedIndices.length} selected images from ${selectedCard}?`)) return;
        const newList = cardImages.filter((_, idx) => !selectedIndices.includes(idx));
        saveImages(newList);
    };

    return el('div', { className: 'admin-section' },
        el('div', { className: 'welcome-card', style: { marginBottom: '2rem' } },
            el('h2', null, 'Inner Page Gallery (Max 50 per Story)'),
            el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                el('p', { style: { margin: 0 } }, selectedCard ? `${cardImages.length}/50 images in "${selectedCard}". ${50 - cardImages.length} slots remaining.` : 'Please select a story below.'),
                selectedCard && cardImages.length > 0 && el('button', {
                    className: 'btn-secondary',
                    style: { padding: '5px 12px', fontSize: '0.8rem' },
                    onClick: () => {
                        if (selectedIndices.length === cardImages.length) setSelectedIndices([]);
                        else setSelectedIndices(cardImages.map((_, i) => i));
                    }
                }, selectedIndices.length === cardImages.length ? 'Deselect All' : 'Select All')
            )
        ),
        el('div', { className: 'admin-modal-form' },
            el('h3', null, 'Select Story & Manage Images'),
            el(AdminDropdown, {
                label: 'Choose Story',
                value: selectedCard,
                options: CARDS.map(c => ({ label: c.title, value: c.title })),
                onChange: (val) => setSelectedCard(val)
            }),
            selectedCard && el('div', { className: 'upload-controls', style: { marginTop: '1.5rem' } },
                el('div', { className: 'control-group' },
                    el('h4', null, `Upload Images to "${selectedCard}" (1 to 5 at a time)`),
                    el('p', { style: { fontSize: '0.8rem', color: '#999', marginBottom: '8px' } },
                        `${cardImages.length}/50 images uploaded. ${50 - cardImages.length} slots remaining.`),
                    el('input', {
                        type: 'file',
                        accept: 'image/*',
                        multiple: true,
                        onChange: (e) => {
                            const remaining = 50 - cardImages.length;
                            if (remaining <= 0) {
                                alert('This story is full (Max 50 images)! Delete some to add more.');
                                e.target.value = '';
                                return;
                            }
                            const batchLimit = Math.min(5, remaining);
                            const files = Array.from(e.target.files).slice(0, batchLimit);
                            if (e.target.files.length > batchLimit) {
                                alert(`Adding the first ${batchLimit} selected files.`);
                            }
                            filesToBase64(files).then(base64s => {
                                saveImages([...base64s, ...cardImages]);
                                e.target.value = '';
                            });
                        }
                    })
                ),
            )
        ),
        selectedIndices.length > 0 && el('div', { className: 'selection-actions' },
            el('span', { className: 'selection-info' },
                el('i', { className: 'fa-solid fa-check-double', style: { marginRight: '8px' } }),
                `${selectedIndices.length} selected from "${selectedCard}"`
            ),
            el('button', { className: 'btn-delete bulk-delete', onClick: deleteSelected },
                el('i', { className: 'fa-solid fa-trash-can' }),
                `Delete Selected`
            )
        ),
        loading && el('p', { style: { padding: '2rem', color: '#999' } }, 'Loading images...'),
        !loading && selectedCard && el('div', { className: 'admin-grid' },
            cardImages.length === 0
                ? el('p', { style: { color: '#999', gridColumn: '1/-1', padding: '2rem 0' } }, 'No images yet. Upload some above.')
                : cardImages.map((src, idx) =>
                    el('div', { key: idx, className: `admin-item-card ${selectedIndices.includes(idx) ? 'selected' : ''}`, onClick: () => toggleSelect(idx) },
                        el('div', { className: 'selection-checkbox' },
                            el('i', { className: selectedIndices.includes(idx) ? 'fa-solid fa-square-check' : 'fa-regular fa-square' })
                        ),
                        el('img', { src: src, alt: '' }),
                        el('button', { className: 'btn-delete single-delete', onClick: (e) => { e.stopPropagation(); saveImages(cardImages.filter((_, i) => i !== idx)); } },
                            el('i', { className: 'fa-solid fa-trash' })
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
