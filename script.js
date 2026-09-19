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
        
        // If we are on the hidden index slide, display "INDEX" instead of a number
        if (slides[currentIdx].id === 'index-slide') {
            counterEl.textContent = 'INDEX';
            return;
        }

        const current = String(currentIdx + 1).padStart(2, '0');
        // Subtract 1 from the total so the hidden slide isn't counted in the UI
        const total = String(totalSlides - 1).padStart(2, '0');
        counterEl.textContent = `${current}/${total} slides`;
    }

    goToSlide = function(index, isShortcut = false) {
        changeSlide(index, isShortcut);
    };

    function changeSlide(index, isShortcut = false) {
        if (index < 0 || index >= totalSlides) return;
        
        // INVISIBILITY MAGIC: Prevent normal arrow/click navigation from entering the index slide
        if (!isShortcut && slides[index].id === 'index-slide') {
            return; 
        }
        
        slides[currentIdx].classList.remove('active');
        currentIdx = index;
        slides[currentIdx].classList.add('active');
        
        updateCounter();
    }

    // Initialize counter on page load
    updateCounter();

    const deck = document.getElementById('deck');

  // ==========================================
    // 1. Swipe Controls (Touch Screens) - FIXED
    // ==========================================
    let touchstartX = 0;
    let touchendX = 0;
    const swipeThreshold = 50; // Minimum distance for a valid swipe
    let isValidSwipe = true; // Tracks if the gesture is a single-finger swipe

    deck.addEventListener('touchstart', (e) => {
        // If multiple fingers touch the screen (e.g., pinch), cancel the swipe
        if (e.touches.length > 1) {
            isValidSwipe = false;
            return;
        }
        isValidSwipe = true; // Reset for a valid single touch
        touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    // Listen for movement in case a second finger lands mid-swipe
    deck.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) {
            isValidSwipe = false;
        }
    }, { passive: true });

    deck.addEventListener('touchend', (e) => {
        // Abort navigation if the gesture involved multiple fingers
        if (!isValidSwipe) return;

        touchendX = e.changedTouches[0].screenX;
        const distance = touchendX - touchstartX;

        if (distance < -swipeThreshold) {
            // Swiped left (Next Slide)
            changeSlide(currentIdx + 1);
        } else if (distance > swipeThreshold) {
            // Swiped right (Previous Slide)
            changeSlide(currentIdx - 1);
        }
    });

    // ==========================================
    // 2. Edge Click Controls (10% Boundary)
    // ==========================================
    deck.addEventListener('click', (e) => {
        const rect = deck.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;

        if (clickX < width * 0.1) {
            changeSlide(currentIdx - 1); 
        } else if (clickX > width * 0.90) {
            changeSlide(currentIdx + 1); 
        }
    });

    // ==========================================
    // 3. Keyboard Controls (Laptops/Clickers)
    // ==========================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            changeSlide(currentIdx + 1);
        } 
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            changeSlide(currentIdx - 1);
        } 
        else if (e.key === 'Home') {
            e.preventDefault();
            changeSlide(0, true);
        } 
        else if (e.key === 'End') {
            e.preventDefault();
            // Send to the Thank You slide (skips the hidden index)
            changeSlide(totalSlides - 2, true);
        }
        // Custom Section Jump Keys (Notice the 'true' bypasses the invisibility block)
        else if (e.key.toLowerCase() === 'i') {
            const idx = Array.from(slides).findIndex(s => s.id === 'index-slide');
            if (idx !== -1) changeSlide(idx, true);
        }
        else if (e.key.toLowerCase() === 'p') {
            changeSlide(5, true);  
        } 
        else if (e.key.toLowerCase() === 'a') {
            changeSlide(20, true); 
        } 
        else if (e.key.toLowerCase() === 'b') {
            changeSlide(29, true); 
        }
    });

    // ==========================================
    // 4. Cursor Highlight / Mouse Halo Effect
    // ==========================================
    const cursorHalo = document.getElementById('cursor-halo');
    
    if (cursorHalo) {
        document.addEventListener('mousemove', (e) => {
            cursorHalo.style.setProperty('--mouse-x', `${e.clientX}px`);
            cursorHalo.style.setProperty('--mouse-y', `${e.clientY}px`);
        });
    }
});
