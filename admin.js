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
const toastContainer = document.getElementById('toast-container');
const loginSubmitButton = loginForm?.querySelector('button[type="submit"]');

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

const SUPABASE_CONFIG_MESSAGE = "Konfigurasi Supabase belum aktif. Jalankan lewat `npm run dev` untuk lokal atau pastikan GitHub Secrets VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah diisi.";

// =============================================
// UI FEEDBACK (Toast)
// =============================================
function showToast(message, type = 'info') {
    if (!toastContainer) {
        if (type === 'error') console.error(message);
        else console.log(message);
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';

    toast.innerHTML = `<i class="fas fa-${icon}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function showConfigError(message = SUPABASE_CONFIG_MESSAGE, withToast = false) {
    if (withToast) showToast(message, 'error');

    if (loginError) {
        loginError.innerText = message;
        loginError.style.display = 'block';
    }

    if (loginSubmitButton) {
        loginSubmitButton.disabled = true;
        loginSubmitButton.title = 'Supabase configuration is missing';
    }
}

function clearConfigError() {
    if (loginError) {
        loginError.innerText = '';
        loginError.style.display = 'none';
    }

    if (loginSubmitButton) {
        loginSubmitButton.disabled = false;
        loginSubmitButton.title = '';
    }
}

function renderConfigHint() {
    if (supabase) return;

    const existingHint = document.getElementById('supabase-config-hint');
    if (existingHint) return;

    const loginBox = document.querySelector('#login-section .login-box');
    if (!loginBox) return;

    const hint = document.createElement('p');
    hint.id = 'supabase-config-hint';
    hint.style.color = '#d32f2f';
    hint.style.marginTop = '10px';
    hint.style.fontWeight = '600';
    hint.innerText = "Mode konfigurasi belum siap. Gunakan `npm run dev` (lokal) atau cek Secrets di GitHub.";
    loginBox.appendChild(hint);
}

function ensureSupabaseReady(withToast = false) {
    if (supabase) {
        clearConfigError();
        return true;
    }

    renderConfigHint();
    showConfigError(SUPABASE_CONFIG_MESSAGE, withToast);
    return false;
}

// =============================================
// AUTH (Supabase)
// =============================================
async function checkUser() {
    if (!ensureSupabaseReady(false)) {
        showLogin();
        return;
    }

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
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    dashboardSection.classList.remove('active');
}

function showDashboard(user) {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    dashboardSection.classList.add('active');
    if (userInfo) userInfo.innerText = `Halo, ${user.email}`;
    fetchProducts();
    fetchEvents();
}

// Login handler
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!ensureSupabaseReady(true)) return;

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                showToast(error.message, 'error');
                if (loginError) {
                    loginError.innerText = error.message;
                    loginError.style.display = 'block';
                }
            } else {
                showToast("Login Berhasil!", "success");
                checkUser();
            }
        } catch (err) {
            showToast("Gagal terhubung ke server. Pastikan koneksi internet stabil.", "error");
        }
    });
}

// Logout handler
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        if (!ensureSupabaseReady(true)) return;

        const { error } = await supabase.auth.signOut();
        if (error) {
            showToast("Gagal Logout: " + error.message, "error");
        } else {
            showToast("Berhasil Logout", "success");
            checkUser();
        }
    });
}

// =============================================
// PRODUCT MANAGEMENT
// =============================================
async function fetchProducts() {
    if (!ensureSupabaseReady(false)) return;

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        renderProducts(data || []);
    } catch (err) {
        showToast("Gagal memuat produk: " + err.message, "error");
    }
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
                <button class="action-btn btn-edit" data-id="${p.id}"><i class="fas fa-edit"></i> Edit</button>
                <button class="action-btn btn-delete" data-id="${p.id}"><i class="fas fa-trash"></i> Hapus</button>
            </td>
        `;
        productTableBody.appendChild(tr);
    });

    document.querySelectorAll('#product-table-body .btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editProduct(btn.dataset.id, products));
    });
    document.querySelectorAll('#product-table-body .btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
    });

    window.allProducts = products;
}

if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
        if (productForm) productForm.reset();
        document.getElementById('product-id').value = '';
        document.getElementById('form-title').innerText = 'Tambah Produk Baru';
        productFormContainer.style.display = 'block';
    });
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        productFormContainer.style.display = 'none';
    });
}

function editProduct(id, products) {
    const p = products.find(x => x.id == id);
    if (p) {
        document.getElementById('product-id').value = p.id;
        document.getElementById('prod-name').value = p.name;
        document.getElementById('prod-price').value = p.price;
        document.getElementById('prod-image').value = p.image || '';
        document.getElementById('prod-category').value = p.category;
        document.getElementById('form-title').innerText = 'Edit Produk';
        productFormContainer.style.display = 'block';
    }
}

async function deleteProduct(id) {
    if (!ensureSupabaseReady(true)) return;

    if (confirm('Hapus produk ini?')) {
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            showToast("Produk berhasil dihapus", "success");
            fetchProducts();
        } catch (err) {
            showToast("Gagal menghapus: " + err.message, "error");
        }
    }
}

if (productForm) {
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!ensureSupabaseReady(true)) return;

        const id = document.getElementById('product-id').value;

        const productData = {
            name: document.getElementById('prod-name').value,
            price: document.getElementById('prod-price').value,
            image: document.getElementById('prod-image').value,
            category: document.getElementById('prod-category').value
        };

        try {
            if (id) {
                const { error } = await supabase.from('products').update(productData).eq('id', id);
                if (error) throw error;
                showToast("Produk berhasil diperbarui", "success");
            } else {
                const { error } = await supabase.from('products').insert(productData);
                if (error) throw error;
                showToast("Produk berhasil ditambah", "success");
            }
            productFormContainer.style.display = 'none';
            fetchProducts();
        } catch (err) {
            showToast("Gagal menyimpan: " + err.message, "error");
        }
    });
}

// =============================================
// EVENTS MANAGEMENT
// =============================================
async function fetchEvents() {
    if (!ensureSupabaseReady(false)) return;

    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('title', { ascending: true });

        if (error) throw error;
        renderEvents(data || []);
    } catch (err) {
        showToast("Gagal memuat event: " + err.message, "error");
    }
}

function renderEvents(events) {
    if (!eventTableBody) return;
    eventTableBody.innerHTML = '';

    events.forEach(e => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${String(e['event-day']).padStart(2, '0')}</strong> ${e['event-month']}</td>
            <td>${e.title || ''}</td>
            <td>${e.description || ''}</td>
            <td>
                <button class="action-btn btn-edit" data-event-id="${e.id}"><i class="fas fa-edit"></i> Edit</button>
                <button class="action-btn btn-delete" data-event-id="${e.id}"><i class="fas fa-trash"></i> Hapus</button>
            </td>
        `;
        eventTableBody.appendChild(tr);
    });

    document.querySelectorAll('[data-event-id].btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editEvent(btn.dataset.eventId, events));
    });
    document.querySelectorAll('[data-event-id].btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteEvent(btn.dataset.eventId));
    });
}

if (addEventBtn) {
    addEventBtn.addEventListener('click', () => {
        if (eventForm) eventForm.reset();
        document.getElementById('event-id').value = '';
        document.getElementById('event-form-title').innerText = 'Tambah Event Baru';
        eventFormContainer.style.display = 'block';
    });
}

if (cancelEventBtn) {
    cancelEventBtn.addEventListener('click', () => {
        eventFormContainer.style.display = 'none';
    });
}

function editEvent(id, events) {
    const e = events.find(x => x.id == id);
    if (e) {
        document.getElementById('event-id').value = e.id;
        document.getElementById('event-title').value = e.title;
        document.getElementById('event-description').value = e.description;
        document.getElementById('event-day').value = e['event-day'];
        document.getElementById('event-month').value = e['event-month'];
        document.getElementById('event-form-title').innerText = 'Edit Event';
        eventFormContainer.style.display = 'block';
    }
}

async function deleteEvent(id) {
    if (!ensureSupabaseReady(true)) return;

    if (confirm('Hapus event ini?')) {
        try {
            const { error } = await supabase.from('events').delete().eq('id', id);
            if (error) throw error;
            showToast("Event berhasil dihapus", "success");
            fetchEvents();
        } catch (err) {
            showToast("Gagal menghapus event: " + err.message, "error");
        }
    }
}

if (eventForm) {
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!ensureSupabaseReady(true)) return;

        const id = document.getElementById('event-id').value;

        const eventData = {
            title: document.getElementById('event-title').value,
            description: document.getElementById('event-description').value,
            'event-day': parseInt(document.getElementById('event-day').value),
            'event-month': document.getElementById('event-month').value
        };

        try {
            if (id) {
                const { error } = await supabase.from('events').update(eventData).eq('id', id);
                if (error) throw error;
                showToast("Event berhasil diperbarui", "success");
            } else {
                const { error } = await supabase.from('events').insert(eventData);
                if (error) throw error;
                showToast("Event berhasil ditambah", "success");
            }
            eventFormContainer.style.display = 'none';
            fetchEvents();
        } catch (err) {
            showToast("Gagal menyimpan event: " + err.message, "error");
        }
    });
}

ensureSupabaseReady(false);
checkUser();
