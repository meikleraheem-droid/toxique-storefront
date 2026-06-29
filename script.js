// ==========================================================
// TOXIQUE OPERATING SYSTEM // MASTER ENGINE + MEDIA SOURCE ROUTING
// ==========================================================
const TOXIQUE_CATALOG = [
    // --- GARMENTS DIVISION ---
    {
        id: "tx-gar-01",
        category: "garments",
        tag: "Toxique Mainline",
        title: "Liquid Diamond Rhinestone Leotard",
        price: 680.00,
        displayPrice: "$680.00",
        type: "Garment",
        img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "tx-gar-02",
        category: "garments",
        tag: "Toxique Mainline",
        title: "Glitter Veil Floor-Length Gown",
        price: 1250.00,
        displayPrice: "$1,250.00",
        type: "Garment",
        img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80"
    },

    // --- COSMETICS DIVISION ---
    {
        id: "tx-cos-01",
        category: "cosmetics",
        tag: "Toxique Beauty Labs",
        title: "Ritualistic Velvet Matte Lipstick",
        price: 42.00,
        displayPrice: "$42.00",
        type: "Cosmetics",
        img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "tx-cos-02",
        category: "cosmetics",
        tag: "Toxique Beauty Labs",
        title: "Liquid Aurum High-Gloss Pigment",
        price: 38.00,
        displayPrice: "$38.00",
        type: "Cosmetics",
        img: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=600&q=80"
    },

    // --- FRAGRANCE DIVISION ---
    {
        id: "tx-perf-01",
        category: "fragrance",
        tag: "Toxique Fragrances",
        title: "L'Extrait de Toxique No. 01",
        price: 185.00,
        displayPrice: "$185.00",
        type: "Fragrance",
        img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80"
    },

    // --- HOUSE OF X ADULT 18+ DIVISION ---
    {
        id: "xxx-01",
        category: "xxx",
        tag: "House of X // Restricted XXX",
        title: "Glittering Velvet Asymmetric Bodysuit",
        price: 450.00,
        displayPrice: "$450.00",
        adultItem: true,
        type: "Adult Fit",
        img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "xxx-02",
        category: "xxx",
        tag: "House of X // Restricted XXX",
        title: "Strapped Mesh Caged Bodice",
        price: 320.00,
        displayPrice: "$320.00",
        adultItem: true,
        type: "Adult Fit",
        img: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "xxx-03",
        category: "xxx",
        tag: "House of X // Restricted XXX",
        title: "Latex-Overlay Sheer Intimate Slip",
        price: 510.00,
        displayPrice: "$510.00",
        adultItem: true,
        type: "Adult Fit",
        img: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=600&q=80"
    }
];

let USER_CART = [];

document.addEventListener("DOMContentLoaded", () => {
    renderStorefrontGrid("garments");
    setupFilterToggles();
    setupCartInterfaceTriggers();
    setupNewsletterPortal();
});

function renderStorefrontGrid(filterTarget) {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    const filteredItems = TOXIQUE_CATALOG.filter(item => item.category === filterTarget);

    grid.innerHTML = filteredItems.map(item => {
        const itemClass = item.adultItem ? "product-card xxx-item" : "product-card";
        
        return `
            <div class="${itemClass}" id="card-${item.id}">
                <div class="media-container">
                    <img src="${item.img}" alt="${item.title}" class="editorial-asset" loading="lazy">
                    <div class="media-overlay"></div>
                </div>
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

    filteredItems.forEach((item, index) => {
        setTimeout(() => {
            const cardElement = document.getElementById(`card-${item.id}`);
            if (cardElement) {
                cardElement.classList.add("reveal-node");
            }
        }, index * 120);
    });
}

function setupFilterToggles() {
    const buttons = {
        garments: document.getElementById("btn-garments"),
        cosmetics: document.getElementById("btn-cosmetics"),
        fragrance: document.getElementById("btn-fragrance"),
        xxx: document.getElementById("btn-xxx")
    };

    Object.keys(buttons).forEach(key => {
        const btn = buttons[key];
        if (btn) {
            btn.addEventListener("click", () => {
                Object.values(buttons).forEach(b => { if(b) b.classList.remove("active"); });
                btn.classList.add("active");
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