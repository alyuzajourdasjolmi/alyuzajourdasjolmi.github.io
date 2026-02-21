import { supabase } from './supabaseClient.js';

// =============================================
// DOM ELEMENTS
// =============================================
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');

// Product elements
const productTableBody = document.getElementById('product-table-body');
const productFormContainer = document.getElementById('product-form-container');
const productForm = document.getElementById('product-form');
const addProductBtn = document.getElementById('add-product-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Event elements
const eventTableBody = document.getElementById('event-table-body');
const eventFormContainer = document.getElementById('event-form-container');
const eventForm = document.getElementById('event-form');
const addEventBtn = document.getElementById('add-event-btn');
const cancelEventBtn = document.getElementById('cancel-event-btn');

// --- AUTH (Supabase) ---
async function checkUser() {
    console.log("Checking authentication status...");
    try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.error("Auth check error:", error);
            showLogin();
            return;
        }

        if (data.user) {
            console.log("User found:", data.user.email);
            showDashboard(data.user);
        } else {
            console.log("No active session.");
            showLogin();
        }
    } catch (err) {
        console.error("Critical error in checkUser:", err);
        showLogin();
    }
}

function showLogin() {
    console.log("Showing login screen");
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    dashboardSection.classList.remove('active');
}

function showDashboard(user) {
    console.log("Showing dashboard for:", user.email);
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    dashboardSection.classList.add('active');
    if (userInfo) userInfo.innerText = `Welcome, ${user.email}`;
    fetchProducts();
    fetchEvents();
}

// Login handler
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log("Attempting login for:", email);

        if (loginError) {
            loginError.innerText = '';
            loginError.style.display = 'none';
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                console.error("Login failed:", error.message);
                if (loginError) {
                    loginError.innerText = error.message;
                    loginError.style.display = 'block';
                }
            } else {
                console.log("Login success!");
                checkUser();
            }
        } catch (err) {
            console.error("CORS or Connection Error during login:", err);
            if (loginError) {
                loginError.innerText = 'Connection error. Please ensure you are running the project via "npm run dev".';
                loginError.style.display = 'block';
            }
        }
    });
}

// Logout handler
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        checkUser();
    });
}

// =============================================
// PRODUCT MANAGEMENT
// =============================================
async function fetchProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }
    renderProducts(data || []);
}

function renderProducts(products) {
    if (!productTableBody) return;
    productTableBody.innerHTML = '';

    products.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.name || ''}</td>
            <td>${p.price || ''}</td>
            <td>${p.category || ''}</td>
            <td>${p.image || ''}</td>
            <td>
                <button class="action-btn btn-edit" data-id="${p.id}">Edit</button>
                <button class="action-btn btn-delete" data-id="${p.id}">Delete</button>
            </td>
        `;
        productTableBody.appendChild(tr);
    });

    // Attach event listeners
    document.querySelectorAll('#product-table-body .btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editProduct(btn.dataset.id, products));
    });
    document.querySelectorAll('#product-table-body .btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
    });

    window.allProducts = products;
}

// Add Product button
if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
        if (productForm) productForm.reset();
        const productId = document.getElementById('product-id');
        if (productId) productId.value = '';
        const formTitle = document.getElementById('form-title');
        if (formTitle) formTitle.innerText = 'Add Product';
        if (productFormContainer) productFormContainer.style.display = 'block';
    });
}

// Cancel Product button
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        if (productFormContainer) productFormContainer.style.display = 'none';
    });
}

// Edit Product
function editProduct(id, products) {
    const p = products.find(x => x.id == id);
    if (p) {
        document.getElementById('product-id').value = p.id;
        document.getElementById('prod-name').value = p.name;
        document.getElementById('prod-price').value = p.price;
        document.getElementById('prod-image').value = p.image || '';
        document.getElementById('prod-category').value = p.category;
        const formTitle = document.getElementById('form-title');
        if (formTitle) formTitle.innerText = 'Edit Product';
        if (productFormContainer) productFormContainer.style.display = 'block';
    }
}

// Delete Product
async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) console.error('Delete error:', error);
        fetchProducts();
    }
}

// Product Form Submit
if (productForm) {
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productId = document.getElementById('product-id');
        const id = productId ? productId.value : '';

        const productData = {
            name: document.getElementById('prod-name')?.value || '',
            price: document.getElementById('prod-price')?.value || '',
            image: document.getElementById('prod-image')?.value || '',
            category: document.getElementById('prod-category')?.value || ''
        };

        if (id) {
            const { error } = await supabase.from('products').update(productData).eq('id', id);
            if (error) { console.error('Update error:', error); alert('Error: ' + error.message); }
        } else {
            const { error } = await supabase.from('products').insert(productData);
            if (error) { console.error('Insert error:', error); alert('Error: ' + error.message); }
        }

        if (productFormContainer) productFormContainer.style.display = 'none';
        fetchProducts();
    });
}

// =============================================
// EVENTS MANAGEMENT
// =============================================
async function fetchEvents() {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('title', { ascending: true });

    if (error) {
        console.error('Error fetching events:', error);
        return;
    }
    renderEvents(data || []);
}

function renderEvents(events) {
    if (!eventTableBody) return;
    eventTableBody.innerHTML = '';

    events.forEach(e => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${String(e.event_day).padStart(2, '0')}</strong> ${e.event_month}</td>
            <td>${e.title || ''}</td>
            <td>${e.description || ''}</td>
            <td>
                <button class="action-btn btn-edit" data-event-id="${e.id}">Edit</button>
                <button class="action-btn btn-delete" data-event-id="${e.id}">Delete</button>
            </td>
        `;
        eventTableBody.appendChild(tr);
    });

    // Attach event listeners
    document.querySelectorAll('[data-event-id].btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editEvent(btn.dataset.eventId, events));
    });
    document.querySelectorAll('[data-event-id].btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteEvent(btn.dataset.eventId));
    });
}

// Add Event button
if (addEventBtn) {
    addEventBtn.addEventListener('click', () => {
        if (eventForm) eventForm.reset();
        const eventId = document.getElementById('event-id');
        if (eventId) eventId.value = '';
        const formTitle = document.getElementById('event-form-title');
        if (formTitle) formTitle.innerText = 'Add Event';
        if (eventFormContainer) eventFormContainer.style.display = 'block';
    });
}

// Cancel Event button
if (cancelEventBtn) {
    cancelEventBtn.addEventListener('click', () => {
        if (eventFormContainer) eventFormContainer.style.display = 'none';
    });
}

// Edit Event
function editEvent(id, events) {
    const e = events.find(x => x.id == id);
    if (e) {
        document.getElementById('event-id').value = e.id;
        document.getElementById('event-title').value = e.title;
        document.getElementById('event-description').value = e.description;
        document.getElementById('event-day').value = e.event_day;
        document.getElementById('event-month').value = e.event_month;
        const formTitle = document.getElementById('event-form-title');
        if (formTitle) formTitle.innerText = 'Edit Event';
        if (eventFormContainer) eventFormContainer.style.display = 'block';
    }
}

// Delete Event
async function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) console.error('Delete error:', error);
        fetchEvents();
    }
}

// Event Form Submit
if (eventForm) {
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const eventId = document.getElementById('event-id');
        const id = eventId ? eventId.value : '';

        const eventData = {
            title: document.getElementById('event-title')?.value || '',
            description: document.getElementById('event-description')?.value || '',
            event_day: parseInt(document.getElementById('event-day')?.value) || 1,
            event_month: document.getElementById('event-month')?.value || 'Jan'
        };

        if (id) {
            const { error } = await supabase.from('events').update(eventData).eq('id', id);
            if (error) { console.error('Update error:', error); alert('Error: ' + error.message); }
        } else {
            const { error } = await supabase.from('events').insert(eventData);
            if (error) { console.error('Insert error:', error); alert('Error: ' + error.message); }
        }

        if (eventFormContainer) eventFormContainer.style.display = 'none';
        fetchEvents();
    });
}

// =============================================
// INITIALIZATION
// =============================================
checkUser();
