// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    document.addEventListener('click', (e) => {
        if (navLinks && !navLinks.contains(e.target) && !mobileToggle.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileToggle.querySelector('i').classList.remove('fa-times');
            mobileToggle.querySelector('i').classList.add('fa-bars');
        }
    });
}

// Carousel Logic
const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const dotsContainer = document.querySelector('.carousel-dots');

let currentSlide = 0;
const slideCount = slides.length;
let slideInterval;

if (slides.length > 0) {
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetTimer();
        });
        if (dotsContainer) dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateDots() {
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (n + slideCount) % slideCount;
        slides[currentSlide].classList.add('active');
        updateDots();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetTimer();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetTimer();
        });
    }

    function startTimer() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetTimer() {
        clearInterval(slideInterval);
        startTimer();
    }
    startTimer();
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.boxShadow = 'none';
        }
    }
});

// Modal Logic
const modalContainer = document.getElementById('modal-container');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    card.addEventListener('click', async () => {
        const title = card.querySelector('h3').innerText;
        showModal(title, [], true); // Show loading

        try {
            // PHP API Fetch
            const response = await fetch('api/products.php');
            const allProducts = await response.json();

            // Filter client-side for simplicity, or could add ?category=X to API
            const filteredProducts = allProducts.filter(p => p.category === title);

            showModal(title, filteredProducts);

        } catch (error) {
            console.error('Error fetching products:', error);
            modalBody.innerHTML = `<p>Error loading products from server. Make sure XAMPP is running.</p>`;
        }
    });
});

function showModal(title, items, isLoading = false) {
    let contentHtml = `<h2 class="modal-title">${title}</h2>`;

    if (isLoading) {
        contentHtml += '<p>Loading products...</p>';
    } else if (items.length === 0) {
        contentHtml += '<p>No products found in this category.</p>';
    } else {
        contentHtml += '<div class="modal-product-grid">';
        items.forEach(item => {
            contentHtml += `
                <div class="modal-product-card">
                    <div class="modal-product-img">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='prod-stationery.png'">
                    </div>
                    <div class="modal-product-details">
                        <div class="modal-product-name">${item.name}</div>
                        <div class="modal-product-price">${item.price}</div>
                    </div>
                </div>
            `;
        });
        contentHtml += '</div>';
    }

    if (modalBody) modalBody.innerHTML = contentHtml;
    if (modalContainer) modalContainer.classList.add('active');
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modalContainer.classList.remove('active');
    });
}

if (modalContainer) {
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            modalContainer.classList.remove('active');
        }
    });
}

// =============================================
// EVENTS - Fetch from Database
// =============================================
async function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    if (!eventsContainer) return;

    try {
        const response = await fetch('api/events.php');
        const events = await response.json();

        if (!Array.isArray(events) || events.length === 0) {
            eventsContainer.innerHTML = '<p style="text-align: center; color: #888;">Belum ada event terbaru.</p>';
            return;
        }

        let html = '';
        events.forEach(event => {
            html += `
                <div class="event-card">
                    <div class="event-date">
                        <span class="day">${String(event.event_day).padStart(2, '0')}</span>
                        <span class="month">${event.event_month}</span>
                    </div>
                    <div class="event-details">
                        <h3>${event.title}</h3>
                        <p>${event.description}</p>
                    </div>
                </div>
            `;
        });

        eventsContainer.innerHTML = html;
    } catch (error) {
        console.error('Error loading events:', error);
        eventsContainer.innerHTML = '<p style="text-align: center; color: #888;">Gagal memuat events. Pastikan server berjalan.</p>';
    }
}

// Load events when page loads
loadEvents();
