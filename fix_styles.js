const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'styles.css');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Keep first 1912 lines (0 to 1911 in 0-indexed)
const preservedLines = lines.slice(0, 1912);

const newContent = `
/* ============================================================ 
   ANOMALIES REVIEW PAGE - CONSOLIDATED & RESPONSIVE
   ============================================================ */

.anomalies-review-page {
    width: 100%;
    background-color: #fff;
    min-height: 100vh;
    overflow-x: hidden;
}

.review-hero-section {
    padding: 6rem 0 2rem;
    text-align: center;
    background: #fff;
    width: 100%;
    overflow-x: hidden;
}

.review-hero-section h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    padding: 0 5%;
}

.review-videos-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    padding: 2rem 5%;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
}

.review-video-item {
    width: 100% !important;
    max-width: 100% !important;
    aspect-ratio: 16/10;
    height: auto !important;
    background: #000;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    transition: all 0.4s ease;
    flex: 0 0 auto !important;
}

/* Review Form Section */
.review-form-section {
    padding: 4rem 5%;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
}

.review-form-section h2 {
    font-size: 2.22rem;
    margin-bottom: 2rem;
    text-align: center;
}

.customer-review-form {
    width: 100%;
    max-width: 1000px;
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 15px;
    background: white;
    padding: 1.5rem !important;
    border-radius: 15px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.05);
    box-sizing: border-box;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    grid-column: span 1 !important;
}

/* Latest Reviews Section */
.latest-reviews-display {
    padding: 4rem 0;
    background: var(--soft-pink-bg);
    width: 100%;
    overflow-x: hidden;
}

.latest-reviews-display h2 {
    font-size: 2.2rem;
    text-align: center;
    margin-bottom: 2rem;
}

.reviews-viewport {
    overflow: hidden;
    width: 100%;
    padding: 1rem 0;
}

.reviews-slider {
    display: flex;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.review-card {
    background: #fff;
    padding: 1.5rem;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.05);
    min-width: 85vw;
    margin-right: 15px;
    flex-shrink: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
}

/* ==========================================
   DESKTOP & LARGE SCREEN REFINEMENTS (>1024px)
   ========================================== */
@media (min-width: 1025px) {
    .review-hero-section h1 {
        font-size: 4rem;
    }

    .review-videos-grid {
        flex-direction: row;
        overflow-x: auto;
        gap: 40px;
        padding: 4rem 5%;
        scroll-snap-type: x mandatory;
    }

    .review-video-item {
        flex: 0 0 1000px !important;
        width: 1000px !important;
        height: 600px !important;
        aspect-ratio: auto;
        border-radius: 60px;
        box-shadow: 0 30px 80px rgba(0,0,0,0.18);
        scroll-snap-align: center;
    }

    .customer-review-form {
        grid-template-columns: 1fr 1fr !important;
        padding: 4rem !important;
        gap: 25px;
    }

    .form-group:nth-last-child(2),
    .customer-review-form button[type="submit"] {
        grid-column: span 2 !important;
    }

    .review-card {
        min-width: 450px;
        padding: 3rem;
        margin-right: 2rem;
        border-radius: 40px;
    }

    .latest-reviews-display h2 {
        font-size: 3.5rem;
    }

    .latest-reviews-display {
        padding: 8rem 0;
    }
}

/* ==========================================
   TABLET REFINEMENTS (769px - 1024px)
   ========================================== */
@media (min-width: 769px) and (max-width: 1024px) {
    .review-videos-grid {
        flex-direction: row;
        overflow-x: auto;
    }

    .review-video-item {
        flex: 0 0 85vw !important;
        width: 85vw !important;
        height: 50vw !important;
        aspect-ratio: auto;
    }
    
    .customer-review-form {
        grid-template-columns: 1fr 1fr !important;
    }

    .form-group:nth-last-child(2),
    .customer-review-form button[type="submit"] {
        grid-column: span 2 !important;
    }

    .review-card {
        min-width: 70vw;
    }
}

/* ==========================================
   GLOBAL BODY FIX FOR MOBILE
   ========================================== */
@media (max-width: 768px) {
    body, html {
        overflow-x: hidden !important;
        position: relative;
        width: 100%;
        max-width: 100%;
    }
}

/* ==========================================
   MOBILE TINY SCREEN TWEAKS (320px - 425px)
   ========================================== */
@media (max-width: 425px) {
    .review-hero-section h1 {
        font-size: 1.8rem;
    }
    .review-video-item {
        height: 65vw !important;
    }
}
`;

fs.writeFileSync(filePath, preservedLines.join('\n') + newContent);
console.log('Styles fixed successfully!');
