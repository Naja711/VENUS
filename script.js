document.addEventListener('DOMContentLoaded', () => {

    /* --- HAMBURGER MENU --- */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinksEl = document.getElementById('nav-links');

    if (hamburgerBtn && navLinksEl) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('open');
            navLinksEl.classList.toggle('open');
            document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu on link click
        navLinksEl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('open');
                navLinksEl.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* --- BRAND CARD FLIP --- */
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Check if clicking the button inside
            if (e.target.classList.contains('btn-flip-action')) {
                return; // Let the link work normally
            }
            this.classList.toggle('flipped');
        });
    });

    /* --- GLOBE EXPRESS HERO CAROUSEL --- */
    const hero = document.getElementById('hero');
    const mainTitle = document.getElementById('main-title');
    const mainDesc = document.getElementById('main-description');
    const cards = document.querySelectorAll('.destination-card');

    let currentIndex = 0;
    const intervalTime = 5000; // Increased to 5s for readability

    const nav = document.querySelector('.navbar');

    function updateSlide(index) {
        const card = cards[index];
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-description');
        const bg = card.getAttribute('data-bg');

        // Update Background with Fade
        const bgPos = card.getAttribute('data-bg-pos') || 'center';
        hero.classList.remove('hero-fade');
        void hero.offsetWidth; // Trigger reflow
        hero.style.backgroundImage = `url('${bg}')`;
        hero.style.backgroundPosition = bgPos;
        hero.classList.add('hero-fade');

        // Update Text
        mainTitle.textContent = title;
        mainDesc.textContent = desc;

        // Update Cards
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    }

    // Modal Logic
    const modal = document.getElementById('info-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalImg = document.getElementById('modal-img');
    const closeModal = document.querySelector('.close-modal');

    function openInfoModal(title, description, image) {
        if (!modal) return;
        modalTitle.textContent = title;
        modalDesc.textContent = description;
        modalImg.style.backgroundImage = `url('${image}')`;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    // Trigger Modal from Hero Cards (Double Click or specific button)
    cards.forEach((card) => {
        card.addEventListener('click', (e) => {
            // If already active, open modal on second click
            if (card.classList.contains('active')) {
                const title = card.getAttribute('data-title');
                const desc = card.getAttribute('data-description');
                const bg = card.getAttribute('data-bg');
                openInfoModal(title, desc, bg);
            }
        });
    });

    // Trigger New Page from Service Cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = encodeURIComponent(card.getAttribute('data-title'));
            const desc = encodeURIComponent(card.getAttribute('data-description'));
            const img = encodeURIComponent(card.getAttribute('data-image'));
            window.location.href = `service.html?title=${title}&desc=${desc}&img=${img}`;
        });
    });

    // Close Modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlide(currentIndex);
    }

    let slideInterval;

    function startSlideShow() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    // Initialize First Slide
    if (hero && cards.length > 0) {
        updateSlide(0);
        startSlideShow();
    }

    // Manual Click
    cards.forEach((card, idx) => {
        card.addEventListener('click', () => {
            currentIndex = idx;
            updateSlide(idx);
            startSlideShow(); // Reset interval on manual selection
        });
    });

    // Smooth Scroll for Navbar Links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Dynamic Navbar Color based on Section Theme
    const themeSections = document.querySelectorAll('[data-theme]');

    window.addEventListener('scroll', () => {
        if (!nav) return;
        const navRect = nav.getBoundingClientRect();
        // Check element directly behind the navbar's vertical center
        const triggerY = navRect.bottom - Math.max(navRect.height / 2, 20);

        let activeTheme = 'dark'; // Default to dark background (white text)

        themeSections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            // If the trigger point is within the section bounds
            if (rect.top <= triggerY && rect.bottom >= triggerY) {
                activeTheme = sec.getAttribute('data-theme');
            }
        });

        if (activeTheme === 'light') {
            nav.classList.add('nav-dark-text');
        } else {
            nav.classList.remove('nav-dark-text');
        }
    });

    // Initialize navbar color on load
    window.dispatchEvent(new Event('scroll'));

});
