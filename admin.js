// =============================================
// ADMIN DASHBOARD - JavaScript Controller
// =============================================

console.log("=== ADMIN SCRIPT STARTING ===");

// =============================================
// DOM ELEMENTS
// =============================================
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const tableBody = document.getElementById('product-table-body');
const productFormContainer = document.getElementById('product-form-container');
const productForm = document.getElementById('product-form');
const addProductBtn = document.getElementById('add-product-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Validate all elements exist
if (!loginSection || !dashboardSection || !loginForm) {
    console.error("CRITICAL: Required DOM elements not found!");
    alert("Error: Page elements not found. Please refresh.");
}

// =============================================
// SESSION MANAGEMENT
// =============================================
function checkUser() {
    console.log("Checking user session...");
    const rawUser = localStorage.getItem('admin_user');
    console.log("Raw user data:", rawUser);

    if (!rawUser || rawUser === "undefined" || rawUser === "null") {
        console.log("No valid session found, showing login");
        showLogin();
        return;
    }

    try {
        const user = JSON.parse(rawUser);
        if (user && user.email) {
            console.log("Valid user found:", user.email);
            showDashboard(user);
        } else {
            console.log("Invalid user object, clearing");
            localStorage.removeItem('admin_user');
            showLogin();
        }
    } catch (e) {
        console.error("JSON parse error:", e);
        localStorage.removeItem('admin_user');
        showLogin();
    }
}

function showLogin() {
    console.log("Showing login form");
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    dashboardSection.classList.remove('active');
}

function showDashboard(user) {
    console.log("Showing dashboard for:", user.email);
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    dashboardSection.classList.add('active');

    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        userInfo.innerText = `Welcome, ${user.email}`;
    }

    fetchProducts();
    fetchEvents();
}

// =============================================
// LOGIN HANDLER
// =============================================
if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        e.stopPropagation();

        console.log("=== LOGIN FORM SUBMITTED ===");

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (!emailInput || !passwordInput) {
            console.error("Input fields not found");
            return false;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        console.log("Attempting login for:", email);

        // Clear previous errors
        if (loginError) {
            loginError.innerText = "";
            loginError.style.display = "none";
        }

        try {
            console.log("Sending fetch request to api/login.php...");

            const response = await fetch('api/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: email, password: password })
            });

            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers.get('content-type'));

            const responseText = await response.text();
            console.log("Raw response text:", responseText);

            if (!responseText) {
                throw new Error("Empty response from server");
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error("JSON Parse Error:", parseError);
                console.error("Response was:", responseText);
                throw new Error("Server returned invalid JSON. Check if Apache/MySQL is running.");
            }

            console.log("Parsed response:", data);

            if (data.status === 'success' && data.user) {
                console.log("LOGIN SUCCESS!");
                console.log("User object:", data.user);

                // Save to localStorage
                const userString = JSON.stringify(data.user);
                localStorage.setItem('admin_user', userString);
                console.log("Saved to localStorage:", userString);

                // Verify it was saved
                const verification = localStorage.getItem('admin_user');
                console.log("Verification read:", verification);

                // Show dashboard
                showDashboard(data.user);
            } else {
                const errorMsg = data.message || "Login failed - invalid credentials";
                console.log("Login failed:", errorMsg);

                if (loginError) {
                    loginError.innerText = errorMsg;
                    loginError.style.display = "block";
                } else {
                    alert(errorMsg);
                }
            }

        } catch (err) {
            console.error("=== LOGIN ERROR ===");
            console.error(err);

            const errorMsg = "Error: " + err.message;
            if (loginError) {
                loginError.innerText = errorMsg;
                loginError.style.display = "block";
            } else {
                alert(errorMsg);
            }
        }

        return false;
    });

    console.log("Login form event listener attached");
} else {
    console.error("Login form not found!");
}

// =============================================
// LOGOUT HANDLER
// =============================================
if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
        console.log("Logging out...");
        localStorage.removeItem('admin_user');
        showLogin();
    });
}

// =============================================
// PRODUCT MANAGEMENT
// =============================================
async function fetchProducts() {
    console.log("Fetching products...");
    try {
        const res = await fetch('api/products.php');
        const text = await res.text();
        console.log("Products raw response:", text);

        const data = JSON.parse(text);
        renderTable(data);
    } catch (err) {
        console.error("Error fetching products:", err);
    }
}

function renderTable(products) {
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (!Array.isArray(products)) {
        console.error("Products is not an array:", products);
        return;
    }

    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.name || ''}</td>
            <td>${product.price || ''}</td>
            <td>${product.category || ''}</td>
            <td>${product.image || ''}</td>
            <td>
                <button class="action-btn btn-edit" data-id="${product.id}">Edit</button>
                <button class="action-btn btn-delete" data-id="${product.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editProduct(btn.dataset.id, products));
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
    });

    console.log("Table rendered with", products.length, "products");
}

// =============================================
// ADD/EDIT PRODUCT
// =============================================
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

if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        if (productFormContainer) productFormContainer.style.display = 'none';
    });
}

function editProduct(id, products) {
    const product = products.find(p => p.id == id);
    if (product) {
        const productId = document.getElementById('product-id');
        const prodName = document.getElementById('prod-name');
        const prodPrice = document.getElementById('prod-price');
        const prodImage = document.getElementById('prod-image');
        const prodCategory = document.getElementById('prod-category');
        const formTitle = document.getElementById('form-title');

        if (productId) productId.value = product.id;
        if (prodName) prodName.value = product.name;
        if (prodPrice) prodPrice.value = product.price;
        if (prodImage) prodImage.value = product.image;
        if (prodCategory) prodCategory.value = product.category;
        if (formTitle) formTitle.innerText = 'Edit Product';
        if (productFormContainer) productFormContainer.style.display = 'block';
    }
}

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

        let method = 'POST';
        if (id) {
            method = 'PUT';
            productData.id = id;
        }

        try {
            const res = await fetch('api/products.php', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            const result = await res.json();

            if (result.status === 'success') {
                if (productFormContainer) productFormContainer.style.display = 'none';
                fetchProducts();
            } else {
                alert('Error: ' + (result.message || 'Unknown error'));
            }
        } catch (err) {
            console.error("Product save error:", err);
            alert('Request failed: ' + err.message);
        }
    });
}

async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await fetch(`api/products.php?id=${id}`, { method: 'DELETE' });
            fetchProducts();
        } catch (err) {
            console.error("Delete error:", err);
        }
    }
}

// =============================================
// EVENTS MANAGEMENT
// =============================================
const eventTableBody = document.getElementById('event-table-body');
const eventFormContainer = document.getElementById('event-form-container');
const eventForm = document.getElementById('event-form');
const addEventBtn = document.getElementById('add-event-btn');
const cancelEventBtn = document.getElementById('cancel-event-btn');

// Fetch Events
async function fetchEvents() {
    console.log("Fetching events...");
    try {
        const res = await fetch('api/events.php');
        const text = await res.text();
        console.log("Events raw response:", text);

        const data = JSON.parse(text);
        renderEventTable(data);
    } catch (err) {
        console.error("Error fetching events:", err);
    }
}

function renderEventTable(events) {
    if (!eventTableBody) return;

    eventTableBody.innerHTML = '';

    if (!Array.isArray(events)) {
        console.error("Events is not an array:", events);
        return;
    }

    events.forEach(event => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${event.event_day}</strong> ${event.event_month}</td>
            <td>${event.title || ''}</td>
            <td>${event.description || ''}</td>
            <td>
                <button class="action-btn btn-edit" data-event-id="${event.id}">Edit</button>
                <button class="action-btn btn-delete" data-event-id="${event.id}">Delete</button>
            </td>
        `;
        eventTableBody.appendChild(tr);
    });

    // Event edit buttons
    document.querySelectorAll('[data-event-id].btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editEvent(btn.dataset.eventId, events));
    });

    // Event delete buttons
    document.querySelectorAll('[data-event-id].btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteEvent(btn.dataset.eventId));
    });

    console.log("Event table rendered with", events.length, "events");
}

// Add Event Button
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

// Cancel Event Button
if (cancelEventBtn) {
    cancelEventBtn.addEventListener('click', () => {
        if (eventFormContainer) eventFormContainer.style.display = 'none';
    });
}

// Edit Event
function editEvent(id, events) {
    const event = events.find(e => e.id == id);
    if (event) {
        const eventId = document.getElementById('event-id');
        const eventTitle = document.getElementById('event-title');
        const eventDescription = document.getElementById('event-description');
        const eventDay = document.getElementById('event-day');
        const eventMonth = document.getElementById('event-month');
        const formTitle = document.getElementById('event-form-title');

        if (eventId) eventId.value = event.id;
        if (eventTitle) eventTitle.value = event.title;
        if (eventDescription) eventDescription.value = event.description;
        if (eventDay) eventDay.value = event.event_day;
        if (eventMonth) eventMonth.value = event.event_month;
        if (formTitle) formTitle.innerText = 'Edit Event';
        if (eventFormContainer) eventFormContainer.style.display = 'block';
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
            event_day: document.getElementById('event-day')?.value || 1,
            event_month: document.getElementById('event-month')?.value || 'Jan'
        };

        let method = 'POST';
        if (id) {
            method = 'PUT';
            eventData.id = id;
        }

        try {
            const res = await fetch('api/events.php', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            });
            const result = await res.json();

            if (result.status === 'success') {
                if (eventFormContainer) eventFormContainer.style.display = 'none';
                fetchEvents();
            } else {
                alert('Error: ' + (result.message || 'Unknown error'));
            }
        } catch (err) {
            console.error("Event save error:", err);
            alert('Request failed: ' + err.message);
        }
    });
}

// Delete Event
async function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        try {
            await fetch(`api/events.php?id=${id}`, { method: 'DELETE' });
            fetchEvents();
        } catch (err) {
            console.error("Event delete error:", err);
        }
    }
}

// =============================================
// INITIALIZATION
// =============================================
console.log("=== INITIALIZING ===");
checkUser();
console.log("=== ADMIN SCRIPT READY ===");
