// TOXIQUE MULTI-VENDOR ARCHITECTURE DATA ENGINE
const TOXIQUE_CATALOG = [
    {
        id: "tx-01",
        vendor: "Toxique Mainline",
        title: "Liquid Diamond Rhinestone Leotard",
        price: "$680.00",
        description: "Heavyweight stretch mesh completely encrusted in hyper-reflective premium rhinestones."
    },
    {
        id: "tx-02",
        vendor: "Toxique Mainline",
        title: "Glitter Veil Floor-Length Gown",
        price: "$1,250.00",
        description: "Deconstructed structural gown featuring an architectural shoulder line and cascading midnight glitter mesh."
    },
    {
        id: "vendor-x-01",
        vendor: "Guest Designer // House of X",
        title: "Glittering Velvet Asymmetric Bodysuit",
        price: "$450.00",
        description: "Multi-vendor capsule exclusive. Deep royal purple velvet slashed with high-grade cosmic glitter paneling."
    }
];

// Dynamically build the catalog storefront grid on page load
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    grid.innerHTML = TOXIQUE_CATALOG.map(item => `
        <div class="product-card">
            <div class="image-placeholder">
                [ CAMPAIGN IMAGERY SLAPPED HERE ]
            </div>
            <div class="card-details">
                <span class="vendor-tag">${item.vendor}</span>
                <h3 class="product-title">${item.title}</h3>
                <p class="product-price">${item.price}</p>
            </div>
        </div>
    `).join('');
});
