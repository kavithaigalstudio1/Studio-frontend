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
            duration: 1.05,
            smoothWheel: true,
            smoothTouch: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Update ScrollTrigger on Lenis scroll
        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
        }

        // Expose globally if needed
        window.lenis = lenis;

        console.log('Lenis initialized: Apple free-flow scroll active');
    });
})();
