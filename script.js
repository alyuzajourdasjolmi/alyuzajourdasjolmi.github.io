// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

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

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileToggle.querySelector('i').classList.remove('fa-times');
        mobileToggle.querySelector('i').classList.add('fa-bars');
    }
});

// Carousel Logic
const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const dotsContainer = document.querySelector('.carousel-dots');

let currentSlide = 0;
const slideCount = slides.length;
let slideInterval;

// Create dots
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
        goToSlide(index);
        resetTimer();
    });
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function updateDots() {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
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
    slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

function resetTimer() {
    clearInterval(slideInterval);
    startTimer();
}

// Start auto-play
startTimer();

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '10px 0';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    } else {
        navbar.style.padding = '20px 0';
        navbar.style.boxShadow = 'none';
    }
});

// Modal Logic
const modalContainer = document.getElementById('modal-container');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');
const productCards = document.querySelectorAll('.product-card');

// Augmented Product Data with Images and Prices
const productsData = {
    'Alat Tulis': [
        { name: 'Buku Tulis Sidu', price: 'Rp 3.000', image: 'SIDU BC-01.jpg' },
        { name: 'Buku Tulis Kiky', price: 'Rp 6.000', image: 'prod-stationery.png' },
        { name: 'Pulpen Standard', price: 'Rp 3.000', image: 'penastandar.jpg' },
        { name: 'Pulpen Gel', price: 'Rp 5.000', image: 'prod-stationery.png' },
        { name: 'Pensil 2B', price: 'Rp 4.000', image: 'prod-stationery.png' },
        { name: 'Penghapus', price: 'Rp 2.000', image: 'prod-stationery.png' },
        { name: 'Penggaris 30cm', price: 'Rp 3.000', image: 'prod-stationery.png' },
        { name: 'Tipe-X', price: 'Rp 5.000', image: 'prod-stationery.png' },
        { name: 'Kertas HVS A4 (Rim)', price: 'Rp 55.000', image: 'prod-stationery.png' },
        { name: 'Lem Kertas', price: 'Rp 3.000', image: 'prod-stationery.png' }
    ],
    'Frozen Food': [
        { name: 'Nugget Ayam Toraduo', price: 'Rp 25.000', image: 'NUGGET_AYAM_TORADUO.PNG' },
        { name: 'Sosis', price: 'Rp 30.000', image: 'prod-frozen.png' },
        { name: 'Sosis Ayam', price: 'Rp 25.000', image: 'sosis.png' },
        { name: 'Sosis Sapi', price: 'Rp 20.000', image: 'prod-frozen.png'},
        { name: 'Bakso Sapi', price: 'Rp 35.000', image: 'prod-frozen.png' },
        { name: 'Kentang Goreng', price: 'Rp 28.000', image: 'prod-frozen.png' },
        { name: 'Dimsum (isi 12)', price: 'Rp 35.000', image: 'prod-frozen.png' },
        { name: 'Cireng Bulat Merah', price: 'Rp 6.000', image: 'cirengmerah.png' }
    ],
    'Snack & Minuman': [
        { name: 'Keripik Singkong', price: 'Rp 10.000', image: 'prod-stationery.png' }, // Placeholder image
        { name: 'Wafer', price: 'Rp 8.000', image: 'prod-stationery.png' },
        { name: 'Minuman Teh', price: 'Rp 4.000', image: 'prod-stationery.png' },
        { name: 'Es Krim', price: 'Rp 5.000', image: 'prod-frozen.png' }
    ]
};

productCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('h3').innerText;

        if (productsData[title]) {
            showModal(title, productsData[title]);
        }
    });
});

function showModal(title, items) {
    let contentHtml = `<h2 class="modal-title">${title}</h2><div class="modal-product-grid">`;

    items.forEach(item => {
        contentHtml += `
            <div class="modal-product-card">
                <div class="modal-product-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="modal-product-details">
                    <div class="modal-product-name">${item.name}</div>
                    <div class="modal-product-price">${item.price}</div>
                </div>
            </div>
        `;
    });

    contentHtml += '</div>';

    modalBody.innerHTML = contentHtml;
    modalContainer.classList.add('active');
}

closeModal.addEventListener('click', () => {
    modalContainer.classList.remove('active');
});

// Close when clicking outside modal
modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
        modalContainer.classList.remove('active');
    }
});
