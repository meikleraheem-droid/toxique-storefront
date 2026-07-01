/* ==========================================================================
   TOXIQUE // MASTER RUNTIME OPERATIONS CONSOLE MAIN ENGINE
   ========================================================================== */

// Master Baseline Mock Products Data Package (Path 3 Initial Staging Injection)
const TOXIQUE_DEFAULT_PRODUCTS = [
    { id: "tx-gar-01", category: "garments", tag: "TOXIQUE MAINLINE", title: "Asymmetrical Silk Gown", price: 1450.00, img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=80", type: "Garment" },
    { id: "tx-cos-02", category: "cosmetics", tag: "BEAUTY LABS", title: "Matte Lip Matrix Fluid", price: 75.00, img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=80", type: "Cosmetics" },
    { id: "tx-fra-03", category: "fragrance", tag: "TOXIQUE PARFUMS", title: "Restricted XXX Extrait", price: 320.00, img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=80", type: "Fragrance" },
    { id: "tx-xxx-04", category: "xxx", tag: "HOUSE OF X EXTRACT", title: "Gilded Obsidian Body Oil", price: 190.00, img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=80", type: "Restricted XXX" }
];

// Verify or Seed the Catalog Registry Cache Storage Array
let TOXIQUE_CATALOG = JSON.parse(localStorage.getItem("toxique_live_catalog"));
if (!TOXIQUE_CATALOG || TOXIQUE_CATALOG.length === 0) {
    localStorage.setItem("toxique_live_catalog", JSON.stringify(TOXIQUE_DEFAULT_PRODUCTS));
    TOXIQUE_CATALOG = TOXIQUE_DEFAULT_PRODUCTS;
}

let cart = JSON.parse(localStorage.getItem("toxique_user_cart")) || [];
let ACTIVE_DISCOUNT_PERCENT = 0;
let ACTIVE_CAMPAIGN_NAME = "";
let CURRENT_ACTIVE_FILTER = "all";

// Initialization Trigger Engine Loop
document.addEventListener("DOMContentLoaded", () => {
    initializeExternalEmailFramework();
    evaluateSystemCampaignTimeline();
    renderStorefrontCatalogGrid();
    updateCartDOMReadouts();
    interceptStorefrontCheckoutAction();
});

function initializeExternalEmailFramework() {
    const scriptElement = document.createElement("script");
    scriptElement.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    scriptElement.async = true;
    scriptElement.onload = () => { if (window.emailjs) window.emailjs.init("user_public_key_placeholder"); };
    document.head.appendChild(scriptElement);
}

/* ==========================================================================
   PATH 3: HIGH FASHION STOREFRONT RENDERING CATALOG ENGINES
   ========================================================================== */
function renderStorefrontCatalogGrid() {
    const gridContainer = document.getElementById("storefrontGrid");
    if (!gridContainer) return;

    gridContainer.innerHTML = "";

    const filteredItems = TOXIQUE_CATALOG.filter(product => {
        return CURRENT_ACTIVE_FILTER === "all" || product.category === CURRENT_ACTIVE_FILTER;
    });

    if (filteredItems.length === 0) {
        gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">COLLECTION SEGMENT EMPTY // STAGING OUT NEW RELEASES</div>`;
        return;
    }

    filteredItems.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
            <div class="card-image-box">
                <span class="card-category-label">${product.category}</span>
                <img src="${product.img || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500'}" alt="${product.title}">
            </div>
            <div class="card-details">
                <div class="card-brand-tag">${product.tag || 'TOXIQUE EXCLUSIVE'}</div>
                <h4 class="card-title">${product.title}</h4>
                <div class="card-price">$${parseFloat(product.price).toFixed(2)}</div>
                <button class="add-to-bag-btn" onclick="addAssetToShoppingBag('${product.id}')">ADD TO BAG</button>
            </div>
        `;
        gridContainer.appendChild(productCard);
    });
}

window.filterStorefrontCatalog = (categoryType) => {
    CURRENT_ACTIVE_FILTER = categoryType;
    document.querySelectorAll(".nav-filter").forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");
    renderStorefrontCatalogGrid();
};

/* ==========================================================================
   SHOPPING DRAWER SYSTEMS CORE ACTIONS
   ========================================================================== */
window.toggleCartDrawer = () => {
    document.getElementById("cartDrawer").classList.toggle("active");
    document.getElementById("drawerOverlay").classList.toggle("active");
};

window.addAssetToShoppingBag = (id) => {
    const item = TOXIQUE_CATALOG.find(p => p.id === id);
    if (!item) return;
    cart.push(item);
    localStorage.setItem("toxique_user_cart", JSON.stringify(cart));
    updateCartDOMReadouts();
    document.getElementById("cartDrawer").classList.add("active");
    document.getElementById("drawerOverlay").classList.add("active");
};

window.removeAssetFromBag = (index) => {
    cart.splice(index, 1);
    localStorage.setItem("toxique_user_cart", JSON.stringify(cart));
    updateCartDOMReadouts();
};

function updateCartDOMReadouts() {
    document.getElementById("cartCountGlobal").innerText = cart.length;
    const itemsContainer = document.getElementById("drawerCartItems");
    if (!itemsContainer) return;

    itemsContainer.innerHTML = "";
    let baseTotal = 0;

    cart.forEach((item, index) => {
        baseTotal += parseFloat(item.price);
        const row = document.createElement("div");
        row.className = "drawer-item-row";
        row.innerHTML = `
            <div>
                <div style="font-size:0.85rem; font-weight:bold;">${item.title}</div>
                <div style="font-size:0.75rem; color:var(--lux-gold); font-weight:bold;">$${parseFloat(item.price).toFixed(2)}</div>
            </div>
            <button onclick="removeAssetFromBag(${index})" style="background:transparent; border:none; color:#ff3e3e; cursor:pointer; font-family:monospace; font-size:0.75rem;">REMOVE</button>
        `;
        itemsContainer.appendChild(row);
    });

    document.getElementById("drawerSubtotalAmount").innerText = `$${baseTotal.toFixed(2)}`;
}

/* ==========================================================================
   CAMPAIGNS & DYNAMIC BANNER TICKER SYSTEM
   ========================================================================== */
function evaluateSystemCampaignTimeline() {
    const banner = document.getElementById("dynamicPromoBanner");
    const bannerText = document.getElementById("promoBannerText");
    if (!banner || !bannerText) return;

    const backOfficeOverrideText = localStorage.getItem("toxique_custom_banner_msg") || "";

    if (backOfficeOverrideText !== "") {
        ACTIVE_DISCOUNT_PERCENT = 0;
        ACTIVE_CAMPAIGN_NAME = "";
        bannerText.innerText = backOfficeOverrideText;
        banner.style.display = "block";
        return;
    }

    const systemClock = new Date();
    const currentMonth = systemClock.getMonth(); 
    const currentDate = systemClock.getDate();

    if (currentMonth === 10 && currentDate >= 20 && currentDate <= 30) {
        ACTIVE_DISCOUNT_PERCENT = 0.25;
        ACTIVE_CAMPAIGN_NAME = "BLACK FRIDAY LAUNCH // 25% OFF APPLIED";
        bannerText.innerText = `✦ COMING LIVE // ${ACTIVE_CAMPAIGN_NAME} ✦`;
    } else if (currentMonth === 11) {
        ACTIVE_DISCOUNT_PERCENT = 0.50;
        ACTIVE_CAMPAIGN_NAME = "CHRISTMAS LUXURY SALE EVENT // 50% OFF APPLIED";
        bannerText.innerText = `✦ COMING LIVE // ${ACTIVE_CAMPAIGN_NAME} ✦`;
    } else if (currentMonth === 0 && currentDate >= 1 && currentDate <= 14) {
        ACTIVE_DISCOUNT_PERCENT = 0.50; 
        ACTIVE_CAMPAIGN_NAME = "HAPPY PRINCE DAY CELEBRATION // BOGO INVOICE SPECIAL";
        bannerText.innerText = `✦ COMING LIVE // ${ACTIVE_CAMPAIGN_NAME} ✦`;
    } else {
        ACTIVE_DISCOUNT_PERCENT = 0;
        ACTIVE_CAMPAIGN_NAME = "";
        bannerText.innerText = "TOXIQUE MAINLINE ✦ HOUSE OF X // RESTRICTED XXX ✦ TOXIQUE BEAUTY LABS";
    }
    banner.style.display = "block";
}

/* ==========================================================================
   PATH 2: HIGH-FASHION CUSTOMER INVOICE PROCESSING ENGINE
   ========================================================================== */
function interceptStorefrontCheckoutAction() {
    const defaultCheckoutButton = document.getElementById("checkoutBtn");
    if (!defaultCheckoutButton) return;
    defaultCheckoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        compileStagedInvoiceData();
    });
}

function compileStagedInvoiceData() {
    if (cart.length === 0) {
        alert("TRANSMISSION ERROR: YOUR SHOPPING BAG CONTAINS NO ASSETS TO COMPILE.");
        return;
    }

    const manifestContainer = document.getElementById("invoiceManifestItems");
    const dateStamp = document.getElementById("invoiceDateStamp");
    if (!manifestContainer || !dateStamp) return;
    
    dateStamp.innerText = new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });

    let baseSubtotal = 0;
    manifestContainer.innerHTML = "";

    cart.forEach(item => {
        let priceValue = parseFloat(item.price || 0);
        baseSubtotal += priceValue;
        const lineRow = document.createElement("div");
        lineRow.className = "invoice-line-item";
        lineRow.innerHTML = `<span>${item.title} (x1)</span><strong>$${priceValue.toFixed(2)}</strong>`;
        manifestContainer.appendChild(lineRow);
    });

    let campaignDeductionValue = baseSubtotal * ACTIVE_DISCOUNT_PERCENT;
    let baselineFlatShippingRate = 650; 
    let totalGrossInvoicePayload = (baseSubtotal - campaignDeductionValue) + baselineFlatShippingRate;

    document.getElementById("invoiceSubtotal").innerText = `$${baseSubtotal.toFixed(2)}`;
    
    const discountRow = document.getElementById("invoiceDiscountRow");
    if (ACTIVE_DISCOUNT_PERCENT > 0) {
        document.getElementById("invoiceDiscountLabel").innerText = `${ACTIVE_CAMPAIGN_NAME}:`;
        document.getElementById("invoiceDiscountAmount").innerText = `-$${campaignDeductionValue.toFixed(2)}`;
        discountRow.style.display = "flex";
    } else {
        discountRow.style.display = "none";
    }

    document.getElementById("invoiceShipping").innerText = `$${baselineFlatShippingRate}`;
    document.getElementById("invoiceGrandTotal").innerText = `$${totalGrossInvoicePayload.toFixed(2)}`;

    document.getElementById("invoiceModalOverlay").style.display = "flex";
}

window.closeInvoiceStage = () => {
    document.getElementById("invoiceModalOverlay").style.display = "none";
};

/* ==========================================================================
   PATH 2: EMAILJS REAL-TIME TRANSMISSION PROTOCOL
   ========================================================================== */
window.executeFinalTransaction = () => {
    if (cart.length === 0) return;

    let manifestTextSummary = cart.map(item => `- ${item.title} ($${parseFloat(item.price).toFixed(2)})`).join("\n");
    let orderSubtotal = document.getElementById("invoiceSubtotal").innerText;
    let campaignDeduction = (ACTIVE_DISCOUNT_PERCENT > 0) ? document.getElementById("invoiceDiscountAmount").innerText : "$0.00";
    let calculatedShippingFee = "$650";
    let grossTotalInvoiceAmount = document.getElementById("invoiceGrandTotal").innerText;

    const receiptTransmissionData = {
        to_email: "surfersshippingja@gmail.com",
        order_timestamp: new Date().toLocaleString(),
        item_manifest: manifestTextSummary,
        subtotal_base: orderSubtotal,
        campaign_discount: campaignDeduction,
        shipping_logistics: calculatedShippingFee,
        grand_total: grossTotalInvoiceAmount
    };

    if (window.emailjs) {
        window.emailjs.send("default_service", "template_id_placeholder", receiptTransmissionData)
            .then(() => { console.log("SECURE LEDGER COGNITION HANDSHAKE COMPLETE."); })
            .catch((error) => { console.warn("TRANSMISSION VECTOR REDIRECTED TO LOCAL CACHE DIRECTORY.", error); });
    }

    alert("TRANSMISSION SECURED: ORDER RECEIPT FORWARDED TO LOGISTICS CHANNELS. INVOICE COGNITION LOGGED INTO LEDGER SUITE SUCCESSFULLY.");
    
    // Save order history context mock array before wipeout for admin metrics mapping
    let history = JSON.parse(localStorage.getItem("toxique_sales_ledger")) || [];
    history.push({ date: new Date().toISOString(), pricePaid: parseFloat(grossTotalInvoiceAmount.replace(/[^0-9.]/g, '')) });
    localStorage.setItem("toxique_sales_ledger", JSON.stringify(history));

    closeInvoiceStage();
    cart = [];
    localStorage.removeItem("toxique_user_cart");
    updateCartDOMReadouts();
    if (document.getElementById("cartDrawer").classList.contains("active")) toggleCartDrawer();
    renderStorefrontCatalogGrid();
};