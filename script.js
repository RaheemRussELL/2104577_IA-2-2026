/* Raheem Russell
   2104577
   IA 2- JSS
*/

// IA#2 JS - Q1: Product data used to dynamically render products
const products = [
    {
        id: 1,
        name: "bmw m performance exhaust",
        brand: "bmw",
        category: "custom exhaust",
        price: 165000.00,
        image: "../assets/exhaust1.jpg",
        description: "A custom exhaust system designed for deeper tone and improved exhaust flow."
    },
    {
        id: 2,
        name: "mercedes amg slotted rotors",
        brand: "benz",
        category: "disc rotors",
        price: 78000.00,
        image: "../assets/rotors1.jpg",
        description: "Performance rotors designed to improve braking response and heat control."
    },
    {
        id: 3,
        name: "vw gti intake manifold",
        brand: "vw",
        category: "intake manifold",
        price: 87000.00,
        image: "../assets/intake1.jpg",
        description: "Custom intake manifold made to support improved airflow and throttle response."
    },
    {
        id: 4,
        name: "audi rs6 custom exhaust",
        brand: "audi",
        category: "custom exhaust",
        price: 470000.00,
        image: "../assets/exhaust2.jpg",
        description: "A premium exhaust setup for stronger sound and performance styling."
    },
    {
        id: 5,
        name: "bmw drilled rotors",
        brand: "bmw",
        category: "disc rotors",
        price: 55000.00,
        image: "../assets/rotors2.jpg",
        description: "Drilled rotors built for stable braking feel and reduced fade."
    },
    {
        id: 6,
        name: "audi high flow intake manifold",
        brand: "audi",
        category: "intake manifold",
        price: 390000.00,
        image: "../assets/intake2.jpg",
        description: "A performance intake manifold for better airflow under load."
    }
];

// IA#2 JS - Q2: Utility functions for localStorage cart and users
function getCart() {
    return JSON.parse(localStorage.getItem("r-euro-cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("r-euro-cart", JSON.stringify(cart));
}

function getUsers() {
    return JSON.parse(localStorage.getItem("r-euro-users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("r-euro-users", JSON.stringify(users));
}

function formatMoney(value) {
    return `$${value.toFixed(2)}`;
}

// IA#2 JS - Q3: DOM manipulation to update cart count in navigation
function updateCartCount() {
    const countElements = document.querySelectorAll("#cart-count");
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    countElements.forEach((element) => {
        element.textContent = totalItems;
    });
}

// IA#2 JS - Q4: Event handling for mobile menu toggle
function setupMenu() {
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", function () {
            navLinks.classList.toggle("show");
        });
    }
}

// IA#2 JS - Q5: Render products dynamically to products page using DOM functions
function renderProducts(filter = "all") {
    const productList = document.getElementById("product-list");
    if (!productList) return;

    const filteredProducts = filter === "all"
        ? products
        : products.filter((product) => product.brand === filter);

    productList.innerHTML = "";

    filteredProducts.forEach((product) => {
        const productCard = document.createElement("article");
        productCard.className = "card product-card";

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="card-body">
                <h3>${product.name}</h3>
                <p class="product-meta">${product.brand.toUpperCase()} | ${product.category}</p>
                <p>${product.description}</p>
                <p class="product-price">${formatMoney(product.price)}</p>
                <div class="product-actions">
                    <input type="number" min="1" value="1" id="qty-${product.id}">
                    <button class="btn primary-btn add-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;

        productList.appendChild(productCard);
    });

    const addButtons = document.querySelectorAll(".add-btn");

    addButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const productId = Number(this.dataset.id);
            const qtyInput = document.getElementById(`qty-${productId}`);
            const quantity = Number(qtyInput.value);

            if (quantity < 1 || Number.isNaN(quantity)) {
                alert("Please enter a valid quantity.");
                return;
            }

            addToCart(productId, quantity);
        });
    });
}

// IA#2 JS - Q6: Event handling for brand filter select
function setupBrandFilter() {
    const brandFilter = document.getElementById("brand-filter");
    if (!brandFilter) return;

    brandFilter.addEventListener("change", function () {
        renderProducts(this.value);
    });
}

// IA#2 JS - Q7: Add selected product to cart with control structures and calculations
function addToCart(productId, quantity) {
    const cart = getCart();
    const selectedProduct = products.find((product) => product.id === productId);

    if (!selectedProduct) return;

    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            image: selectedProduct.image,
            quantity: quantity
        });
    }

    saveCart(cart);
    updateCartCount();
    alert("Item added to cart successfully.");
}

// IA#2 JS - Q8: Calculate cart subtotal, discount, tax and total
function calculateCartTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = subtotal > 800 ? subtotal * 0.05 : 0;
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * 0.15;
    const total = taxableAmount + tax;

    return { subtotal, discount, tax, total };
}

// IA#2 JS - Q9: Render cart items and update summary values dynamically
function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    if (!cartItemsContainer) return;

    const cart = getCart();
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is currently empty.</p>";
        updateCartSummary(0, 0, 0, 0);
        return;
    }

    cart.forEach((item) => {
        const itemSubtotal = item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h3>${item.name}</h3>
                <p>Price: ${formatMoney(item.price)}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Sub-total: ${formatMoney(itemSubtotal)}</p>
            </div>
            <div>
                <button class="btn secondary-btn remove-btn" data-id="${item.id}">Remove</button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    const totals = calculateCartTotals(cart);
    updateCartSummary(totals.subtotal, totals.discount, totals.tax, totals.total);

    const removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach((button) => {
        button.addEventListener("click", function () {
            removeFromCart(Number(this.dataset.id));
        });
    });
}

// IA#2 JS - Q10: Update cart summary text values in the DOM
function updateCartSummary(subtotal, discount, tax, total) {
    const subtotalEl = document.getElementById("subtotal");
    const discountEl = document.getElementById("discount");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");

    if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
    if (discountEl) discountEl.textContent = formatMoney(discount);
    if (taxEl) taxEl.textContent = formatMoney(tax);
    if (totalEl) totalEl.textContent = formatMoney(total);
}

// IA#2 JS - Q11: Remove item from cart and refresh cart display
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter((item) => item.id !== productId);
    saveCart(cart);
    renderCart();
    updateCartCount();
}

// IA#2 JS - Q12: Clear all cart items with button event listener
function setupClearCart() {
    const clearCartBtn = document.getElementById("clear-cart-btn");
    if (!clearCartBtn) return;

    clearCartBtn.addEventListener("click", function () {
        localStorage.removeItem("r-euro-cart");
        renderCart();
        updateCartCount();
    });
}

// IA#2 JS - Q13: Validation helper to set and clear form error messages
function setError(id, message) {
    const errorElement = document.getElementById(id);
    if (errorElement) errorElement.textContent = message;
}

function clearErrors(errorIds) {
    errorIds.forEach((id) => setError(id, ""));
}

// IA#2 JS - Q14: Registration form validation and input handling
function setupRegisterForm() {
    const registerForm = document.getElementById("register-form");
    if (!registerForm) return;

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        clearErrors([
            "full-name-error",
            "dob-error",
            "email-error",
            "reg-username-error",
            "reg-password-error",
            "confirm-password-error"
        ]);

        const fullName = document.getElementById("full-name").value.trim();
        const dob = document.getElementById("dob").value.trim();
        const email = document.getElementById("email").value.trim();
        const username = document.getElementById("reg-username").value.trim();
        const password = document.getElementById("reg-password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();
        const message = document.getElementById("register-message");

        let isValid = true;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (fullName === "") {
            setError("full-name-error", "Full name is required.");
            isValid = false;
        }

        if (dob === "") {
            setError("dob-error", "Date of birth is required.");
            isValid = false;
        }

        if (email === "") {
            setError("email-error", "Email is required.");
            isValid = false;
        } else if (!emailPattern.test(email)) {
            setError("email-error", "Enter a valid email address.");
            isValid = false;
        }

        if (username === "") {
            setError("reg-username-error", "Username is required.");
            isValid = false;
        }

        if (password === "") {
            setError("reg-password-error", "Password is required.");
            isValid = false;
        } else if (password.length < 6) {
            setError("reg-password-error", "Password must be at least 6 characters.");
            isValid = false;
        }

        if (confirmPassword === "") {
            setError("confirm-password-error", "Please confirm your password.");
            isValid = false;
        } else if (password !== confirmPassword) {
            setError("confirm-password-error", "Passwords do not match.");
            isValid = false;
        }

        if (!isValid) {
            message.textContent = "";
            return;
        }

        const users = getUsers();
        const userExists = users.some((user) => user.username === username);

        if (userExists) {
            setError("reg-username-error", "Username already exists.");
            message.textContent = "";
            return;
        }

        users.push({ fullName, dob, email, username, password });
        saveUsers(users);

        message.textContent = "Registration successful. You can now log in.";
        registerForm.reset();
    });
}

// IA#2 JS - Q15: Login form validation and credential check
function setupLoginForm() {
    const loginForm = document.getElementById("login-form");
    if (!loginForm) return;

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        clearErrors(["login-username-error", "login-password-error"]);

        const username = document.getElementById("login-username").value.trim();
        const password = document.getElementById("login-password").value.trim();
        const message = document.getElementById("login-message");

        let isValid = true;

        if (username === "") {
            setError("login-username-error", "Username is required.");
            isValid = false;
        }

        if (password === "") {
            setError("login-password-error", "Password is required.");
            isValid = false;
        }

        if (!isValid) {
            message.textContent = "";
            return;
        }

        const users = getUsers();
        const matchedUser = users.find(
            (user) => user.username === username && user.password === password
        );

        if (!matchedUser) {
            message.textContent = "";
            setError("login-password-error", "Invalid username or password.");
            return;
        }

        localStorage.setItem("r-euro-current-user", JSON.stringify(matchedUser));
        message.textContent = `Welcome back, ${matchedUser.fullName}.`;
        loginForm.reset();
    });
}

// IA#2 JS - Q16: Render checkout items and summary dynamically
function renderCheckout() {
    const checkoutItems = document.getElementById("checkout-items");
    if (!checkoutItems) return;

    const cart = getCart();
    checkoutItems.innerHTML = "";

    if (cart.length === 0) {
        checkoutItems.innerHTML = "<p>No items in cart.</p>";
    } else {
        cart.forEach((item) => {
            const itemLine = document.createElement("div");
            itemLine.className = "checkout-item";
            itemLine.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>${formatMoney(item.price * item.quantity)}</span>
            `;
            checkoutItems.appendChild(itemLine);
        });
    }

    const totals = calculateCartTotals(cart);
    const subtotalEl = document.getElementById("checkout-subtotal");
    const discountEl = document.getElementById("checkout-discount");
    const taxEl = document.getElementById("checkout-tax");
    const totalEl = document.getElementById("checkout-total");

    if (subtotalEl) subtotalEl.textContent = formatMoney(totals.subtotal);
    if (discountEl) discountEl.textContent = formatMoney(totals.discount);
    if (taxEl) taxEl.textContent = formatMoney(totals.tax);
    if (totalEl) totalEl.textContent = formatMoney(totals.total);
}

// IA#2 JS - Q17: Checkout form validation and button actions
function setupCheckout() {
    const checkoutForm = document.getElementById("checkout-form");
    if (!checkoutForm) return;

    const confirmBtn = document.getElementById("confirm-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const clearBtn = document.getElementById("checkout-clear-btn");
    const closeBtn = document.getElementById("close-btn");
    const message = document.getElementById("checkout-message");

    if (confirmBtn) {
        confirmBtn.addEventListener("click", function () {
            message.textContent = "Order details confirmed.";
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
            checkoutForm.reset();
            message.textContent = "Checkout was cancelled.";
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            checkoutForm.reset();
            localStorage.removeItem("r-euro-cart");
            renderCheckout();
            updateCartCount();
            message.textContent = "All checkout data has been cleared.";
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            message.textContent = "Checkout panel closed.";
        });
    }

    checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault();

        clearErrors([
            "ship-name-error",
            "ship-address-error",
            "amount-paid-error"
        ]);

        const shipName = document.getElementById("ship-name").value.trim();
        const shipAddress = document.getElementById("ship-address").value.trim();
        const amountPaid = Number(document.getElementById("amount-paid").value);
        const cart = getCart();
        const totals = calculateCartTotals(cart);

        let isValid = true;

        if (shipName === "") {
            setError("ship-name-error", "Full name is required.");
            isValid = false;
        }

        if (shipAddress === "") {
            setError("ship-address-error", "Address is required.");
            isValid = false;
        }

        if (document.getElementById("amount-paid").value.trim() === "") {
            setError("amount-paid-error", "Amount being paid is required.");
            isValid = false;
        } else if (amountPaid < totals.total) {
            setError("amount-paid-error", "Amount paid must cover the total cost.");
            isValid = false;
        }

        if (cart.length === 0) {
            setError("amount-paid-error", "Your cart is empty.");
            isValid = false;
        }

        if (!isValid) {
            message.textContent = "";
            return;
        }

        const change = amountPaid - totals.total;
        message.textContent = `Checkout completed successfully. Change: ${formatMoney(change)}.`;
        localStorage.removeItem("r-euro-cart");
        checkoutForm.reset();
        renderCheckout();
        updateCartCount();
    });
}

// IA#2 JS - Q18: Initialize page-specific functions on page load
document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    setupMenu();
    renderProducts();
    setupBrandFilter();
    renderCart();
    setupClearCart();
    setupRegisterForm();
    setupLoginForm();
    renderCheckout();
    setupCheckout();
});