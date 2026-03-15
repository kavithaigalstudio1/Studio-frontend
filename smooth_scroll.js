// smooth_scroll.js
// Apple-style Lenis initialization

(function () {
    // Wait for libraries to load
    window.addEventListener('load', () => {
        if (typeof Lenis === 'undefined') {
            console.error('Lenis not found');
            return;
        }

const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
            lerp: 0.1
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Update ScrollTrigger & handle pointer-events class
        lenis.on('scroll', (e) => {
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
            
            // Add/Remove class for CSS pointer-event handling
            if (e.velocity !== 0) {
                document.documentElement.classList.add('lenis-scrolling');
            } else {
                document.documentElement.classList.remove('lenis-scrolling');
            }
        });

        // Ensure class is removed when scrolling stops
        lenis.on('scrollEnd', () => {
            document.documentElement.classList.remove('lenis-scrolling');
        });

        window.lenis = lenis;

        console.log('Lenis initialized: Apple free-flow scroll active');
    });
})();
