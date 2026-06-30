// ==========================================================
// TOXIQUE INTELLECTUAL MOTOR // ENGINE V5.0 (AUTO-REPAIR BALANCED)
// ==========================================================

const DEFAULTS_CATALOG = [
    { id: "tx-gar-01", category: "garments", tag: "Toxique Mainline", title: "Liquid Diamond Rhinestone Leotard", price: 680.00, displayPrice: "$680.00", type: "Garment", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" },
    { id: "tx-gar-02", category: "garments", tag: "Toxique Mainline", title: "Glitter Veil Floor-Length Gown", price: 1250.00, displayPrice: "$1,250.00", type: "Garment", img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80" },
    { id: "tx-cos-01", category: "cosmetics", tag: "Toxique Beauty Labs", title: "Ritualistic Velvet Matte Lipstick", price: 42.00, displayPrice: "$42.00", type: "Cosmetics", img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80" },
    { id: "tx-cos-02", category: "cosmetics", tag: "Toxique Beauty Labs", title: "Liquid Aurum High-Gloss Pigment", price: 38.00, displayPrice: "$38.00", type: "Cosmetics", img: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=600&q=80" },
    { id: "tx-perf-01", category: "fragrance", tag: "Toxique Fragrances", title: "L'Extrait de Toxique No. 01", price: 185.00, displayPrice: "$185.00", type: "Fragrance", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80" },
    { id: "xxx-01", category: "xxx", tag: "House of X // Restricted XXX", title: "Glittering Velvet Asymmetric Bodysuit", price: 450.00, displayPrice: "$450.00", adultItem: true, type: "Adult Fit", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80" },
    { id: "xxx-02", category: "xxx", tag: "House of X // Restricted XXX", title: "Strapped Mesh Caged Bodice", price: 320.00, displayPrice: "$320.00", adultItem: true, type: "Adult Fit", img: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80" },
    { id: "xxx-03", category: "xxx", tag: "House of X // Restricted XXX", title: "Latex-Overlay Sheer Intimate Slip", price: 510.00, displayPrice: "$510.00", adultItem: true, type: "Adult Fit", img: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=600&q=80" }
];

// Memory Diagnostics & Auto-Repair Engine
let rawCatalogData = localStorage.getItem("toxique_live_catalog");
let TOXIQUE_CATALOG;

try {
    // If cache data is corrupt or mismatched, trigger auto-repair reset
    if (!rawCatalogData || rawCatalogData === "undefined" || JSON.parse(rawCatalogData).length === 0) {
        localStorage.setItem("toxique_live_catalog", JSON.stringify(DEFAULTS_CATALOG));
        TOXIQUE_CATALOG = DEFAULTS_CATALOG;
    } else {
        TOXIQUE_CATALOG = JSON.parse(rawCatalogData);
    }
} catch (e) {
    console.warn("Corrupt memory trace cleared. Re-aligning catalog database.");
    localStorage.setItem("toxique_live_catalog", JSON.stringify(DEFAULTS_CATALOG));
    TOXIQUE_CATALOG = DEFAULTS_CATALOG;
}

let PURCHASE_HISTORY = [];
try {
    let rawLedger = localStorage.getItem("toxique_sales_ledger");
    PURCHASE_HISTORY = (rawLedger && rawLedger !== "undefined") ? JSON.parse(rawLedger) : [];
} catch(e) {
    PURCHASE_HISTORY = [];
}

let USER_CART = [];
let CURRENT_DEPARTMENT = "garments";

document.addEventListener("DOMContentLoaded", () => {
    renderStorefrontGrid(CURRENT_DEPARTMENT);
    setupFilterToggles();
    setupCartInterfaceTriggers();
    setupNewsletterPortal();
    setupAdminConsoleMechanics();
});

function renderStorefrontGrid(filterTarget) {
    CURRENT_DEPARTMENT = filterTarget;
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    const filteredItems = TOXIQUE_CATALOG.filter(item => item.category === filterTarget);

    if (filteredItems.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 4rem 0;">NO ASSETS IN THIS DIVISION QUEUE.</div>`;
        return;
    }

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
                        <p class="product-price">${item.displayPrice || '$' + parseFloat(item.price).toFixed(2)}</p>
                    </div>
                    <button class="add-to-cart-btn" onclick="addItemToCart('${item.id}')">ADD TO BAG</button>
                </div>
            </div>
        `;
    }).join('');

    filteredItems.forEach((item, index) => {
        setTimeout(() => {
            const cardElement = document.getElementById(`card-${item.id}`);
            if (cardElement) cardElement.classList.add("reveal-node");
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
    const checkoutBtn = document.getElementById("checkoutActionBtn");

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

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (USER_CART.length === 0) return;
            const timestamp = new Date().toISOString();
            USER_CART.forEach(item => {
                PURCHASE_HISTORY.push({
                    itemId: item.id,
                    title: item.title,
                    pricePaid: parseFloat(item.price),
                    date: timestamp
                });
            });
            localStorage.setItem("toxique_sales_ledger", JSON.stringify(PURCHASE_HISTORY));
            alert(`TRANSACTION RECORDED: ${USER_CART.length} ASSETS CHARGED.`);
            USER_CART = [];
            updateCartInterface();
            if (sideCart) sideCart.classList.remove("active");
            if (overlay) overlay.classList.remove("active");
            calculateBusinessMetrics();
            populateAdminTable();
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
            existingLogs.push({ email: emailInput, time: new Date().toLocaleTimeString() });
            localStorage.setItem("toxique_coordinates", JSON.stringify(existingLogs));
            if (feedback) feedback.innerText = `COORDINATES TRANSMITTED: ${emailInput.toUpperCase()}`;
            form.reset();
        });
    }
}

window.addItemToCart = (itemId) => {
    const targetItem = TOXIQUE_CATALOG.find(item => item.id === itemId);
    if (targetItem) {
        USER_CART.push(targetItem);
        updateCartInterface();
        const sideCart = document.getElementById("sideCart");
        const overlay = document.getElementById("cartOverlay");
        if (sideCart) sideCart.classList.add("active");
        if (overlay) overlay.classList.add("active");
    }
};

window.removeItemFromCart = (index) => {
    USER_CART.splice(index, 1);
    updateCartInterface();
};

function updateCartInterface() {
    const countBadge = document.getElementById("cartCount");
    if (countBadge) countBadge.innerText = USER_CART.length;
    const listContainer = document.getElementById("cartItemsContainer");
    if (!listContainer) return;
    
    if (USER_CART.length === 0) {
        listContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); margin-top: 3rem;">YOUR SELECTION QUEUE IS EMPTY.</p>`;
    } else {
        listContainer.innerHTML = USER_CART.map((item, idx) => `
            <div class="cart-item-node">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <span>${item.displayPrice || '$' + parseFloat(item.price).toFixed(2)} // ${item.tag.toUpperCase()}</span>
                </div>
                <button class="remove-item-btn" onclick="removeItemFromCart(${idx})">REMOVE</button>
            </div>
        `).join('');
    }
    const numericSubtotal = USER_CART.reduce((sum, item) => sum + parseFloat(item.price), 0);
    const subtotalDisplay = document.getElementById("cartSubtotal");
    if (subtotalDisplay) subtotalDisplay.innerText = `$${numericSubtotal.toFixed(2)}`;
}

// ==========================================================
// BACK OFFICE EXECUTIVES (With Safety Checkers)
// ==========================================================
function setupAdminConsoleMechanics() {
    const openBtn = document.getElementById("adminOpenTrigger");
    const closeBtn = document.getElementById("adminCloseTrigger");
    const panel = document.getElementById("adminPanelVault");
    const form = document.getElementById("adminProductForm");

    if (openBtn && panel) {
        openBtn.addEventListener("click", () => {
            panel.classList.add("active");
            calculateBusinessMetrics();
            populateAdminTable();
        });
    }
    if (closeBtn && panel) {
        closeBtn.addEventListener("click", () => panel.classList.remove("active"));
    }

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const targetId = document.getElementById("formItemId").value;
            const itemTitle = document.getElementById("formTitle").value;
            const itemPrice = parseFloat(document.getElementById("formPrice").value);
            const itemImg = document.getElementById("formImageSrc").value;
            const itemDept = document.getElementById("formCategory").value;
            const itemTag = document.getElementById("formTag").value;
            const itemType = document.getElementById("formType").value;

            if (targetId) {
                const index = TOXIQUE_CATALOG.findIndex(item => item.id === targetId);
                if (index !== -1) {
                    TOXIQUE_CATALOG[index] = {
                        ...TOXIQUE_CATALOG[index],
                        title: itemTitle,
                        price: itemPrice,
                        displayPrice: `$${itemPrice.toFixed(2)}`,
                        img: itemImg,
                        category: itemDept,
                        tag: itemTag,
                        type: itemType
                    };
                }
            } else {
                const newId = "tx-custom-" + Math.floor(Math.random() * 10000);
                TOXIQUE_CATALOG.push({
                    id: newId, category: itemDept, tag: itemTag, title: itemTitle,
                    price: itemPrice, displayPrice: `$${itemPrice.toFixed(2)}`,
                    type: itemType, img: itemImg, adultItem: itemDept === "xxx"
                });
            }

            localStorage.setItem("toxique_live_catalog", JSON.stringify(TOXIQUE_CATALOG));
            form.reset();
            document.getElementById("formItemId").value = "";
            const submitBtn = document.getElementById("formSubmitBtn");
            if (submitBtn) submitBtn.innerText = "COMPILE ASSET TO LIVE SERVER";
            
            renderStorefrontGrid(CURRENT_DEPARTMENT);
            populateAdminTable();
            calculateBusinessMetrics();
            alert("MAINFRAME SYNCHRONIZED SUCCESSFULLY.");
        });
    }
}

function calculateBusinessMetrics() {
    const grossVolumeElement = document.getElementById("metricGrossVolume");
    const ordersCounterElement = document.getElementById("metricOrdersCount");
    if (!grossVolumeElement || !ordersCounterElement) return;

    const currentYear = 2026;
    const currentMonth = 5; // June 2026 boundary query
    
    const monthlySales = PURCHASE_HISTORY.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getFullYear() === currentYear && saleDate.getMonth() === currentMonth;
    });

    const totalRevenue = monthlySales.reduce((sum, sale) => sum + sale.pricePaid, 0);
    grossVolumeElement.innerText = `$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    ordersCounterElement.innerText = `${monthlySales.length} SECURE SHIPMENTS`;
}

function populateAdminTable() {
    const tbody = document.getElementById("adminInventoryTableBody");
    if (!tbody) return;

    tbody.innerHTML = TOXIQUE_CATALOG.map(item => `
        <tr>
            <td style="color: var(--lux-gold); font-size: 0.8rem;">${item.id}</td>
            <td><strong>${item.title}</strong></td>
            <td style="text-transform: uppercase; font-size: 0.8rem; color: var(--text-muted);">${item.category}</td>
            <td>$${parseFloat(item.price).toFixed(2)}</td>
            <td>
                <button class="admin-action-edit" onclick="editAssetFromAdminRow('${item.id}')">EDIT</button>
                <button class="admin-action-delete" onclick="deleteAssetFromAdminRow('${item.id}')">WIPE</button>
            </td>
        </tr>
    `).join('');
}

window.editAssetFromAdminRow = (itemId) => {
    const item = TOXIQUE_CATALOG.find(i => i.id === itemId);
    if (!item) return;

    document.getElementById("formItemId").value = item.id;
    document.getElementById("formTitle").value = item.title;
    document.getElementById("formPrice").value = item.price;
    document.getElementById("formImageSrc").value = item.img;
    document.getElementById("formCategory").value = item.category;
    document.getElementById("formTag").value = item.tag;
    document.getElementById("formType").value = item.type;
    
    const submitBtn = document.getElementById("formSubmitBtn");
    if (submitBtn) submitBtn.innerText = `UPDATE ASSET PROFILE [${item.id}]`;
    
    const formElement = document.getElementById("adminProductForm");
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
};

window.deleteAssetFromAdminRow = (itemId) => {
    if (confirm("CONFIRM COMMAND: REMOVE ASSET PERMANENTLY?")) {
        TOXIQUE_CATALOG = TOXIQUE_CATALOG.filter(i => i.id !== itemId);
        localStorage.setItem("toxique_live_catalog", JSON.stringify(TOXIQUE_CATALOG));
        renderStorefrontGrid(CURRENT_DEPARTMENT);
        populateAdminTable();
        calculateBusinessMetrics();
    }
};
/* ==========================================================================
   ADVANCED OPERATIONS ENGINE: CAMPAIGNS & INVOICE MANAGEMENT
   ========================================================================== */

// Global state container for campaign configuration matching the system timeline
let ACTIVE_DISCOUNT_PERCENT = 0;
let ACTIVE_CAMPAIGN_NAME = "";

document.addEventListener("DOMContentLoaded", () => {
    evaluateSystemCampaignTimeline();
    interceptStorefrontCheckoutAction();
});

/**
 * Evaluates the real-time calendar index clock to activate specific campaigns
 * Black Friday: Nov 20 - Nov 30 (25% Off)
 * Christmas Luxury Sale: Dec 1 - Dec 31 (50% Off)
 * New Year Happy Prince Day: Jan 1 - Jan 14 (Special BOGO Staging / 50% Equivalent Baseline)
 */
function evaluateSystemCampaignTimeline() {
    const banner = document.getElementById("dynamicPromoBanner");
    const bannerText = document.getElementById("promoBannerText");
    if (!banner || !bannerText) return;

    const systemClock = new Date();
    const currentMonth = systemClock.getMonth(); // 0 = Jan, 10 = Nov, 11 = Dec
    const currentDate = systemClock.getDate();

    // 1. Black Friday Verification Parameters
    if (currentMonth === 10 && currentDate >= 20 && currentDate <= 30) {
        ACTIVE_DISCOUNT_PERCENT = 0.25;
        ACTIVE_CAMPAIGN_NAME = "BLACK FRIDAY LAUNCH (25% OFF APPLIED)";
    } 
    // 2. Christmas Sale Parameters
    else if (currentMonth === 11) {
        ACTIVE_DISCOUNT_PERCENT = 0.50;
        ACTIVE_CAMPAIGN_NAME = "CHRISTMAS LUXURY SALE EVENT (50% OFF APPLIED)";
    } 
    // 3. New Year "Happy Prince Day" Sale Parameters
    else if (currentMonth === 0 && currentDate >= 1 && currentDate <= 14) {
        ACTIVE_DISCOUNT_PERCENT = 0.50; // Map double-value BOGO strategy as a 50% split deduction base
        ACTIVE_CAMPAIGN_NAME = "HAPPY PRINCE DAY NEW YEAR CELEBRATION (BOGO INVOICE SPECIAL)";
    }

    // Render banner layout frame if an event is active
    if (ACTIVE_DISCOUNT_PERCENT > 0) {
        bannerText.innerText = `✦ COMING LIVE // ${ACTIVE_CAMPAIGN_NAME} ✦`;
        banner.style.display = "block";
    } else {
        banner.style.display = "none";
    }
}

/**
 * Intercepts default alerts on checkout click and routes directly to visual modal invoice window instead
 */
function interceptStorefrontCheckoutAction() {
    // Locate your store's default checkout click trigger button element
    const defaultCheckoutButton = document.getElementById("checkoutBtn") || document.querySelector(".checkout-button");
    if (!defaultCheckoutButton) return;

    // Remove existing inline behavior triggers and route into our design system modal pipeline
    defaultCheckoutButton.removeAttribute("onclick");
    defaultCheckoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        compileStagedInvoiceData();
    });
}

/**
 * Computes math vectors, generates raw invoice list lines, maps flat shipping rates, and launches modal overlay window 
 */
function compileStagedInvoiceData() {
    // Pull active items out of your existing shopping cart array matrix (assumed global variable 'cart')
    // Fall back to localStorage array state context if global reference layer isn't attached
    let operationalCartArray = (typeof cart !== 'undefined') ? cart : (JSON.parse(localStorage.getItem("toxique_user_cart")) || []);

    if (operationalCartArray.length === 0) {
        alert("TRANSMISSION ERROR: YOUR SHOPPING BAG CONTAINS NO ASSETS TO COMPILE.");
        return;
    }

    const manifestContainer = document.getElementById("invoiceManifestItems");
    const dateStamp = document.getElementById("invoiceDateStamp");
    
    // Set current formatted calendar snapshot timestamp inside the invoice profile matrix
    dateStamp.innerText = new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });

    let baseSubtotal = 0;
    manifestContainer.innerHTML = "";

    // Map through array item selections to construct row strings
    operationalCartArray.forEach(item => {
        let priceValue = parseFloat(item.price || 0);
        baseSubtotal += priceValue;

        const lineRow = document.createElement("div");
        lineRow.className = "invoice-line-item";
        lineRow.innerHTML = `
            <span>${item.title} (x1)</span>
            <strong>$${priceValue.toFixed(2)}</strong>
        `;
        manifestContainer.appendChild(lineRow);
    });

    // Compute promotional discounts and flat logistics rates matching corporate parameters (Flat 650 with no decimal values displayed)
    let campaignDeductionValue = baseSubtotal * ACTIVE_DISCOUNT_PERCENT;
    let baselineFlatShippingRate = 650; // Flat currency value parameters matching Surfers Shipping standards
    let totalGrossInvoicePayload = (baseSubtotal - campaignDeductionValue) + baselineFlatShippingRate;

    // Bind mathematical calculation text outputs safely straight to UI element nodes
    document.getElementById("invoiceSubtotal").innerText = `$${baseSubtotal.toFixed(2)}`;
    
    const discountRow = document.getElementById("invoiceDiscountRow");
    if (ACTIVE_DISCOUNT_PERCENT > 0) {
        document.getElementById("invoiceDiscountLabel").innerText = `${ACTIVE_CAMPAIGN_NAME}:`;
        document.getElementById("invoiceDiscountAmount").innerText = `-$${campaignDeductionValue.toFixed(2)}`;
        discountRow.style.display = "flex";
    } else {
        discountRow.style.display = "none";
    }

    // Render the flat shipping parameter visually without decimal extensions
    document.getElementById("invoiceShipping").innerText = `$${baselineFlatShippingRate}`;
    document.getElementById("invoiceGrandTotal").innerText = `$${totalGrossInvoicePayload.toFixed(2)}`;

    // Slide up structural transparency block overlay layout view frames
    document.getElementById("invoiceModalOverlay").style.style.removeProperty("display");
    document.getElementById("invoiceModalOverlay").style.display = "flex";
}

/**
 * Closes modal interface
 */
function closeInvoiceStage() {
    document.getElementById("invoiceModalOverlay").style.display = "none";
}

/**
 * Executes a simulated secure ledger authorization sequence
 */
function executeFinalTransaction() {
    alert("TRANSMISSION SECURED: ACCESS PAYLOAD TRANSLATED. INVOICE COGNITION LOGGED INTO LEDGER SUITE SUCCESSFULLY.");
    closeInvoiceStage();
    
    // Wipe local cache bag context arrays clear once transaction loop clears out safely
    if (typeof clearCart === "function") {
        clearCart();
    } else {
        localStorage.removeItem("toxique_user_cart");
        if (typeof renderCart === "function") renderCart();
    }
}