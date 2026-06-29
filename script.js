// TOXIQUE UNIFIED BRAND CATALOG (WITH RESTRICTED VAULT)
const TOXIQUE_CATALOG = [
    // --- MAINLINE DROPS ---
    {
        id: "tx-01",
        category: "mainline",
        tag: "Toxique Mainline",
        title: "Liquid Diamond Rhinestone Leotard",
        price: 680.00,
        displayPrice: "$680.00"
    },
    {
        id: "tx-02",
        category: "mainline",
        tag: "Toxique Mainline",
        title: "Glitter Veil Floor-Length Gown",
        price: 1250.00,
        displayPrice: "$1,250.00"
    },
    {
        id: "tx-cos-01",
        category: "mainline",
        tag: "Toxique Beauty Labs",
        title: "Ritualistic Velvet Matte Lipstick",
        price: 42.00,
        displayPrice: "$42.00"
    },
    {
        id: "tx-cos-02",
        category: "mainline",
        tag: "Toxique Beauty Labs",
        title: "Liquid Aurum High-Gloss Pigment",
        price: 38.00,
        displayPrice: "$38.00"
    },

    // --- HOUSE OF X // ADULT XXX CAPSULE ---
    {
        id: "xxx-01",
        category: "xxx",
        tag: "House of X // Restricted XXX",
        title: "Glittering Velvet Asymmetric Bodysuit",
        price: 450.00,
        displayPrice: "$450.00",
        adultItem: true
    },
    {
        id: "xxx-02",
        category: "xxx",
        tag: "House of X // Restricted XXX",
        title: "Strapped Mesh Caged Bodice",
        price: 320.00,
        displayPrice: "$320.00",
        adultItem: true
    },
    {
        id: "xxx-03",
        category: "xxx",
        tag: "House of X // Restricted XXX",
        title: "Latex-Overlay Sheer Intimate Slip",
        price: 510.00,
        displayPrice: "$510.00",
        adultItem: true
    }
];

let USER_CART = [];

document.addEventListener("DOMContentLoaded", () => {
    // Render default state (All items)
    renderStorefrontGrid("all");

    // Connect Filtering Nodes
    setupFilterToggles();

    // Setup Cart Open/Close UI Mechanics
    setupCartInterfaceTriggers();

    // Handle Newsletter Data Capture
    setupNewsletterPortal();
});

// CORE ENGINE FUNCTIONS
function renderStorefrontGrid(filterTarget) {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    // Filter array according to click state
    const filteredItems = TOXIQUE_CATALOG.filter(item => {
        if (filterTarget === "all") return true;
        return item.category === filterTarget;
    });

    grid.innerHTML = filteredItems.map(item => {
        const itemClass = item.adultItem ? "product-card xxx-item" : "product-card";
        const placeholderLabel = item.adultItem ? "HOUSE OF X // XXX IMAGERY" : `${item.category.toUpperCase()} IMAGERY`;
        
        return `
            <div class="${itemClass}">
                <div class="image-placeholder">[ ${placeholderLabel} ]</div>
                <div class="card-details">
                    <div>
                        <span class="vendor-tag">${item.tag}</span>
                        <h3 class="product-title">${item.title}</h3>
                        <p class="product-price">${item.displayPrice}</p>
                    </div>
                    <button class="add-to-cart-btn" onclick="addItemToCart('${item.id}')">ADD TO BAG</button>
                </div>
            </div>
        `;
    }).join('');
}

function setupFilterToggles() {
    const buttons = {
        all: document.getElementById("btn-all"),
        mainline: document.getElementById("btn-main"),
        xxx: document.getElementById("btn-xxx")
    };

    Object.keys(buttons).forEach(key => {
        const btn = buttons[key];
        if (btn) {
            btn.addEventListener("click", () => {
                // Clear active states across buttons
                Object.values(buttons).forEach(b => b.classList.remove("active"));
                // Activate clicked state
                btn.classList.add("active");
                // Fire array grid rebuild
                renderStorefrontGrid(key);
            });
        }
    });
}

function setupCartInterfaceTriggers() {
    const sideCart = document.getElementById("sideCart");
    const overlay = document.getElementById("cartOverlay");
    const openBtn = document.getElementById("cartToggleBtn");
    const closeBtn = document.getElementById("cartCloseBtn");

    if (openBtn && sideCart && overlay) {
        openBtn.addEventListener("click", () => {
            sideCart.classList.add("active");
            overlay.classList.add("active");
        });
    }
    if (closeBtn && sideCart && overlay) {
        closeBtn.addEventListener("click", () => {
            sideCart.classList.remove("active");
            overlay.classList.remove("active");
        });
        overlay.addEventListener("click", () => {
            sideCart.classList.remove("active");
            overlay.classList.remove("active");
        });
    }
}

function setupNewsletterPortal() {
    const form = document.getElementById("universeForm");
    const feedback = document.getElementById("portalFeedback");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = document.getElementById("userEmail").value;
            let existingLogs = JSON.parse(localStorage.getItem("toxique_coordinates")) || [];
            const now = new Date().toLocaleTimeString();
            existingLogs.push({ email: emailInput, time: now });
            localStorage.setItem("toxique_coordinates", JSON.stringify(existingLogs));
            feedback.innerText = `COORDINATES TRANSMITTED: ${emailInput.toUpperCase()} IS NOW IN SYNC.`;
            form.reset();
        });
    }
}

// CART MECHANICS GLOBAL ROUTERS
window.addItemToCart = (itemId) => {
    const targetItem = TOXIQUE_CATALOG.find(item => item.id === itemId);
    if (targetItem) {
        USER_CART.push(targetItem);
        updateCartInterface();
        
        document.getElementById("sideCart").classList.add("active");
        document.getElementById("cartOverlay").classList.add("active");
    }
};

window.removeItemFromCart = (index) => {
    USER_CART.splice(index, 1);
    updateCartInterface();
};

function updateCartInterface() {
    document.getElementById("cartCount").innerText = USER_CART.length;
    const listContainer = document.getElementById("cartItemsContainer");
    
    if (USER_CART.length === 0) {
        listContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); margin-top: 3rem;">YOUR SELECTION QUEUE IS EMPTY.</p>`;
    } else {
        listContainer.innerHTML = USER_CART.map((item, idx) => `
            <div class="cart-item-node">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <span>${item.displayPrice} // ${item.tag.toUpperCase()}</span>
                </div>
                <button class="remove-item-btn" onclick="removeItemFromCart(${idx})">REMOVE</button>
            </div>
        `).join('');
    }

    const numericSubtotal = USER_CART.reduce((sum, item) => sum + item.price, 0);
    document.getElementById("cartSubtotal").innerText = `$${numericSubtotal.toFixed(2)}`;
}