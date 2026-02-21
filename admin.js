import { supabase } from './supabaseClient.js';

// DOM Elements & State
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const userEmailSpan = document.getElementById('user-email');

// Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// --- AUTH (Supabase) ---
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        showDashboard(user);
    } else {
        showLogin();
    }
}

function showLogin() {
    loginSection.style.display = 'block';
    dashboardSection.classList.remove('active');
    document.getElementById('user-info').style.display = 'none';
}

function showDashboard(user) {
    loginSection.style.display = 'none';
    dashboardSection.classList.add('active');
    document.getElementById('user-info').style.display = 'flex';
    userEmailSpan.innerText = user.email;
    fetchProducts();
    fetchEvents();
    fetchCarousel();
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            loginError.innerText = error.message;
        } else {
            checkUser();
        }
    } catch (err) {
        loginError.innerText = "Connection error";
    }
});

logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    checkUser();
});

// --- TABS LOGIC ---
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
});

// =============================================
// --- PRODUCTS ---
// =============================================
const productTableBody = document.getElementById('product-table-body');
const productFormContainer = document.getElementById('product-form-container');
const productForm = document.getElementById('product-form');

async function fetchProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }
    renderProducts(data);
}

function renderProducts(products) {
    productTableBody.innerHTML = '';
    products.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.category}</td>
            <td>${p.image}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editProduct(${p.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="deleteProduct(${p.id})">Delete</button>
            </td>
        `;
        productTableBody.appendChild(tr);
    });
    window.allProducts = products;
}

document.getElementById('add-product-btn').addEventListener('click', () => {
    productForm.reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-form-title').innerText = 'Add Product';
    productFormContainer.style.display = 'block';
});

window.editProduct = (id) => {
    const p = window.allProducts.find(x => x.id == id);
    if (p) {
        document.getElementById('product-id').value = p.id;
        document.getElementById('prod-name').value = p.name;
        document.getElementById('prod-price').value = p.price;
        document.getElementById('prod-image').value = p.image;
        document.getElementById('prod-category').value = p.category;
        document.getElementById('product-form-title').innerText = 'Edit Product';
        productFormContainer.style.display = 'block';
    }
};

window.deleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) console.error('Delete error:', error);
        fetchProducts();
    }
};

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const productData = {
        name: document.getElementById('prod-name').value,
        price: document.getElementById('prod-price').value,
        image: document.getElementById('prod-image').value,
        category: document.getElementById('prod-category').value
    };

    if (id) {
        const { error } = await supabase.from('products').update(productData).eq('id', id);
        if (error) console.error('Update error:', error);
    } else {
        const { error } = await supabase.from('products').insert(productData);
        if (error) console.error('Insert error:', error);
    }

    productFormContainer.style.display = 'none';
    fetchProducts();
});


// =============================================
// --- EVENTS ---
// =============================================
const eventTableBody = document.getElementById('event-table-body');
const eventFormContainer = document.getElementById('event-form-container');
const eventForm = document.getElementById('event-form');

async function fetchEvents() {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('title', { ascending: true });

    if (error) {
        console.error('Error fetching events:', error);
        return;
    }
    renderEvents(data);
}

function renderEvents(events) {
    eventTableBody.innerHTML = '';
    events.forEach(e => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${e.title}</td>
            <td>${e.date_display}</td>
            <td>${e.description}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editEvent(${e.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="deleteEvent(${e.id})">Delete</button>
            </td>
        `;
        eventTableBody.appendChild(tr);
    });
    window.allEvents = events;
}

document.getElementById('add-event-btn').addEventListener('click', () => {
    eventForm.reset();
    document.getElementById('event-id').value = '';
    document.getElementById('event-form-title').innerText = 'Add Event';
    eventFormContainer.style.display = 'block';
});

window.editEvent = (id) => {
    const e = window.allEvents.find(x => x.id == id);
    if (e) {
        document.getElementById('event-id').value = e.id;
        document.getElementById('evt-title').value = e.title;
        document.getElementById('evt-date').value = e.date_display;
        document.getElementById('evt-desc').value = e.description;
        document.getElementById('event-form-title').innerText = 'Edit Event';
        eventFormContainer.style.display = 'block';
    }
};

window.deleteEvent = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) console.error('Delete error:', error);
        fetchEvents();
    }
};

eventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('event-id').value;
    const eventData = {
        title: document.getElementById('evt-title').value,
        date_display: document.getElementById('evt-date').value,
        description: document.getElementById('evt-desc').value
    };

    if (id) {
        const { error } = await supabase.from('events').update(eventData).eq('id', id);
        if (error) console.error('Update error:', error);
    } else {
        const { error } = await supabase.from('events').insert(eventData);
        if (error) console.error('Insert error:', error);
    }

    eventFormContainer.style.display = 'none';
    fetchEvents();
});


// =============================================
// --- CAROUSEL ---
// =============================================
const carouselTableBody = document.getElementById('carousel-table-body');
const carouselFormContainer = document.getElementById('carousel-form-container');
const carouselForm = document.getElementById('carousel-form');

async function fetchCarousel() {
    const { data, error } = await supabase
        .from('carousel')
        .select('*');

    if (error) {
        console.error('Error fetching carousel:', error);
        return;
    }
    renderCarousel(data);
}

function renderCarousel(items) {
    carouselTableBody.innerHTML = '';
    items.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.image}</td>
            <td>${c.title}</td>
            <td>${c.subtitle}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editCarousel(${c.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="deleteCarousel(${c.id})">Delete</button>
            </td>
        `;
        carouselTableBody.appendChild(tr);
    });
    window.allCarousel = items;
}

document.getElementById('add-carousel-btn').addEventListener('click', () => {
    carouselForm.reset();
    document.getElementById('carousel-id').value = '';
    document.getElementById('carousel-form-title').innerText = 'Add Slide';
    carouselFormContainer.style.display = 'block';
});

window.editCarousel = (id) => {
    const c = window.allCarousel.find(x => x.id == id);
    if (c) {
        document.getElementById('carousel-id').value = c.id;
        document.getElementById('car-image').value = c.image;
        document.getElementById('car-title').value = c.title;
        document.getElementById('car-subtitle').value = c.subtitle;
        document.getElementById('carousel-form-title').innerText = 'Edit Slide';
        carouselFormContainer.style.display = 'block';
    }
};

window.deleteCarousel = async (id) => {
    if (confirm('Are you sure you want to delete this slide?')) {
        const { error } = await supabase.from('carousel').delete().eq('id', id);
        if (error) console.error('Delete error:', error);
        fetchCarousel();
    }
};

carouselForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('carousel-id').value;
    const carouselData = {
        image: document.getElementById('car-image').value,
        title: document.getElementById('car-title').value,
        subtitle: document.getElementById('car-subtitle').value
    };

    if (id) {
        const { error } = await supabase.from('carousel').update(carouselData).eq('id', id);
        if (error) console.error('Update error:', error);
    } else {
        const { error } = await supabase.from('carousel').insert(carouselData);
        if (error) console.error('Insert error:', error);
    }

    carouselFormContainer.style.display = 'none';
    fetchCarousel();
});

// Common Cancel
document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-form').forEach(f => f.style.display = 'none');
    });
});

// Start
checkUser();
