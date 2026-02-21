import { supabase } from './supabaseClient.js';

// --- Mobile Menu Toggle ---
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

// --- Navbar scroll effect ---
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

// --- DYNAMIC CAROUSEL (Supabase) ---
async function loadCarousel() {
    try {
        const { data: slidesData, error } = await supabase
            .from('carousel')
            .select('*');

        if (error) throw error;

        const container = document.getElementById('carousel-container');
        const dotsContainer = document.getElementById('carousel-dots');

        if (!container || !slidesData || slidesData.length === 0) return;

        container.innerHTML = slidesData.map((slide, index) => `
            <div class="slide ${index === 0 ? 'active' : ''}">
                <img src="${slide.image}" alt="${slide.title}" onerror="this.src='hero-image-v3.png'">
                <div class="slide-content">
                    <h1>${slide.title}</h1>
                    <p>${slide.subtitle}</p>
                    <a href="#products" class="btn-primary">Lihat Produk</a>
                </div>
            </div>
        `).join('');

        dotsContainer.innerHTML = slidesData.map((_, index) => `
            <div class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
        `).join('');

        initCarouselLogic();
    } catch (err) {
        console.error('Error loading carousel:', err);
    }
}

// ... initCarouselLogic unchanged ...

// --- DYNAMIC EVENTS (Supabase) ---
async function loadEvents() {
    try {
        const { data: eventsData, error } = await supabase
            .from('events')
            .select('*')
            .order('title', { ascending: true });

        if (error) throw error;

        const container = document.getElementById('events-container');
        if (!container) return;

        if (!eventsData || eventsData.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#888;">Belum ada event terbaru.</p>';
            return;
        }

        container.innerHTML = eventsData.map(evt => `
            <div class="event-card">
                <div class="event-date">
                    <span class="day">${String(evt.event_day).padStart(2, '0')}</span>
                    <span class="month">${evt.event_month}</span>
                </div>
                <div class="event-details">
                    <h3>${evt.title}</h3>
                    <p>${evt.description}</p>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Error loading events:', err);
        const container = document.getElementById('events-container');
        if (container) container.innerHTML = '<p style="text-align:center; color:#888;">Gagal memuat event.</p>';
    }
}


// --- MODAL & PRODUCTS (Supabase) ---
const modalContainer = document.getElementById('modal-container');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    card.addEventListener('click', async () => {
        const title = card.querySelector('h3').innerText;
        showModal(title, [], true); // Show loading

        try {
            const { data: allProducts, error } = await supabase
                .from('products')
                .select('*')
                .order('name', { ascending: true });

            if (error) {
                console.error('Error fetching products:', error);
                if (modalBody) modalBody.innerHTML = `<p>Error loading products.</p>`;
                return;
            }

            const filteredProducts = (allProducts || []).filter(p => p.category === title);
            showModal(title, filteredProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            if (modalBody) modalBody.innerHTML = `<p>Error loading products.</p>`;
        }
    });
});

function showModal(title, items, isLoading = false) {
    let contentHtml = `<h2 class="modal-title">${title}</h2>`;

    if (isLoading) {
        contentHtml += '<p>Loading products...</p>';
    } else if (items.length === 0) {
        contentHtml += '<p>Belum ada produk di kategori ini.</p>';
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

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    loadCarousel();
    loadEvents();
});
