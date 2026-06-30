/* ==========================================================================
   TOXIQUE // CORE OPERATION CORE MATRIX & MASTER DATABASE
   ========================================================================== */

// Global State Indicators
let TOXIQUE_CATALOG = JSON.parse(localStorage.getItem("toxique_live_catalog")) || [];
let PURCHASE_HISTORY = JSON.parse(localStorage.getItem("toxique_sales_ledger")) || [];
let COORDINATES_LOGS = JSON.parse(localStorage.getItem("toxique_coordinates")) || [];
let cart = JSON.parse(localStorage.getItem("toxique_user_cart")) || [];

let ACTIVE_DISCOUNT_PERCENT = 0;
let ACTIVE_CAMPAIGN_NAME = "";

// Unified Initialization Interface
document.addEventListener("DOMContentLoaded", () => {
    evaluateSystemCampaignTimeline();
    interceptStorefrontCheckoutAction();
    if (typeof renderCart === "function") renderCart();
});

/* ==========================================================================
   CAMPAIGNS & DYNAMIC BANNER ENGINE
   ========================================================================== */

/**
 * Evaluates the real-time calendar index clock to activate specific campaigns.
 * If no campaign is active, defaults to a premium permanent brand identity ticker.
 */
function evaluateSystemCampaignTimeline() {
    const banner = document.getElementById("dynamicPromoBanner");
    const bannerText = document.getElementById("promoBannerText");
    if (!banner || !bannerText) return;

    const systemClock = new Date();
    const currentMonth = systemClock.getMonth(); // 0 = Jan, 10 = Nov, 11 = Dec
    const currentDate = systemClock.getDate();

    // 1. Black Friday Verification Parameters (Nov 20 - Nov 30)
    if (currentMonth === 10 && currentDate >= 20 && currentDate <= 30) {
        ACTIVE_DISCOUNT_PERCENT = 0.25;
        ACTIVE_CAMPAIGN_NAME = "BLACK FRIDAY LAUNCH // 25% OFF APPLIED";
        bannerText.innerText = `✦ COMING LIVE // ${ACTIVE_CAMPAIGN_NAME} ✦`;
    } 
    // 2. Christmas Sale Parameters (Dec 1 - Dec 31)
    else if (currentMonth === 11) {
        ACTIVE_DISCOUNT_PERCENT = 0.50;
        ACTIVE_CAMPAIGN_NAME = "CHRISTMAS LUXURY SALE EVENT // 50% OFF APPLIED";
        bannerText.innerText = `✦ COMING LIVE // ${ACTIVE_CAMPAIGN_NAME} ✦`;
    } 
    // 3. New Year "Happy Prince Day" Sale Parameters (Jan 1 - Jan 14)
    else if (currentMonth === 0 && currentDate >= 1 && currentDate <= 14) {
        ACTIVE_DISCOUNT_PERCENT = 0.50; 
        ACTIVE_CAMPAIGN_NAME = "HAPPY PRINCE DAY CELEBRATION // BOGO INVOICE SPECIAL";
        bannerText.innerText = `✦ COMING LIVE // ${ACTIVE_CAMPAIGN_NAME} ✦`;
    }
    // 4. Permanent Baseline Brand Mode (Active all other days of the year)
    else {
        ACTIVE_DISCOUNT_PERCENT = 0;
        ACTIVE_CAMPAIGN_NAME = "";
        bannerText.innerText = "TOXIQUE MAINLINE ✦ HOUSE OF X // RESTRICTED XXX ✦ TOXIQUE BEAUTY LABS";
    }

    // The banner now stays permanently visible to show off your styling!
    banner.style.display = "block";
}

/* ==========================================================================
   HIGH-FASHION CUSTOMER INVOICE PROCESSING ENGINE
   ========================================================================== */

/**
 * Intercepts default alerts on checkout click and routes directly to visual modal invoice window instead
 */
function interceptStorefrontCheckoutAction() {
    const defaultCheckoutButton = document.getElementById("checkoutBtn") || document.querySelector(".checkout-button");
    if (!defaultCheckoutButton) return;

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
    let operationalCartArray = cart;

    if (operationalCartArray.length === 0) {
        alert("TRANSMISSION ERROR: YOUR SHOPPING BAG CONTAINS NO ASSETS TO COMPILE.");
        return;
    }

    const manifestContainer = document.getElementById("invoiceManifestItems");
    const dateStamp = document.getElementById("invoiceDateStamp");
    if (!manifestContainer || !dateStamp) return;
    
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
    let baselineFlatShippingRate = 650; 
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
    const modal = document.getElementById("invoiceModalOverlay");
    if (modal) {
        modal.style.removeProperty("display");
        modal.style.display = "flex";
    }
}

/**
 * Closes modal interface
 */
function closeInvoiceStage() {
    const modal = document.getElementById("invoiceModalOverlay");
    if (modal) modal.style.display = "none";
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
        cart = [];
        if (typeof renderCart === "function") renderCart();
    }
}