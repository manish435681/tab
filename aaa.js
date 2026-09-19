let goToSlide;

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentIdx = 0;
    
    // Select the counter element
    const counterEl = document.getElementById('slide-counter');

    // Function to update the text in the bottom right corner
    function updateCounter() {
        if (!counterEl) return;
        const current = String(currentIdx + 1).padStart(2, '0');
        const total = String(totalSlides).padStart(2, '0');
        counterEl.textContent = `${current}/${total} slides`;
    }

    goToSlide = function(index) {
        changeSlide(index);
    };

    function changeSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        slides[currentIdx].classList.remove('active');
        currentIdx = index;
        slides[currentIdx].classList.add('active');
        
        // Update counter whenever the slide changes
        updateCounter();
    }

    // Initialize counter on page load
    updateCounter();

    const deck = document.getElementById('deck');

    // ==========================================
    // 1. Swipe Controls (Touch Screens)
    // ==========================================
    let touchstartX = 0;
    let touchendX = 0;
    const swipeThreshold = 50; // Minimum distance for a valid swipe

    deck.addEventListener('touchstart', (e) => {
        touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    deck.addEventListener('touchend', (e) => {
        touchendX = e.changedTouches[0].screenX;
        const distance = touchendX - touchstartX;

        if (distance < -swipeThreshold) {
            changeSlide(currentIdx + 1); // Swiped left
        } else if (distance > swipeThreshold) {
            changeSlide(currentIdx - 1); // Swiped right
        }
    });

    // ==========================================
    // 2. Edge Click Controls (10% Boundary)
    // ==========================================
    deck.addEventListener('click', (e) => {
        const rect = deck.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;

        if (clickX < width * 0.05) {
            changeSlide(currentIdx - 1); // Left 10% clicked
        } else if (clickX > width * 0.95) {
            changeSlide(currentIdx + 1); // Right 10% clicked
        }
    });

    // ==========================================
    // 3. Keyboard Controls (Laptops/Clickers)
    // ==========================================
    document.addEventListener('keydown', (e) => {
        // Next Slide controls (Right Arrow, Space, Down Arrow, Page Down)
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            changeSlide(currentIdx + 1);
        } 
        // Previous Slide controls (Left Arrow, Up Arrow, Page Up)
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            changeSlide(currentIdx - 1);
        } 
        // Home key (Jump to very first slide)
        else if (e.key === 'Home') {
            e.preventDefault();
            changeSlide(0);
        } 
        // End key (Jump to very last slide)
        else if (e.key === 'End') {
            e.preventDefault();
            changeSlide(totalSlides - 1);
        }
        // Custom Section Jump Keys
        else if (e.key.toLowerCase() === 'p') {
            changeSlide(5);  // Jump to Power Supply System cover
        } else if (e.key.toLowerCase() === 'a') {
            changeSlide(20); // Jump to Air Supply System cover
        } else if (e.key.toLowerCase() === 'b') {
            changeSlide(29); // Jump to Brake System cover
        }
    });

    // ==========================================
    // 4. Cursor Highlight / Mouse Halo Effect
    // ==========================================
    const cursorHalo = document.getElementById('cursor-halo');
    
    if (cursorHalo) {
        document.addEventListener('mousemove', (e) => {
            // Update the CSS custom properties with exact cursor coordinates
            cursorHalo.style.setProperty('--mouse-x', `${e.clientX}px`);
            cursorHalo.style.setProperty('--mouse-y', `${e.clientY}px`);
        });
    }
});