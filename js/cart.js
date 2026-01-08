// cart.js - Mit Mengensteuerung (+/- Buttons)

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const counter = document.getElementById("cart-count");
    if (counter) {
        counter.textContent = count;
    }
}

function addToCart(productId, size) {
    fetch("products.json")
        .then(res => res.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            const variant = product.variants.find(v => v.size === size);
            if (!variant) return;

            const cart = getCart();

            const existingItem = cart.find(
                item => item.id === product.id && item.size === size
            );

            if (existingItem) {
                existingItem.quantity += 1;
                showNotification(`${product.name} - Menge erhöht`, "info");
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: variant.price,
                    size: variant.size,
                    quantity: 1,
                    image: product.image
                });
                showNotification(`${product.name} hinzugefügt`, "success");
            }

            saveCart(cart);
            updateCartCount();
        })
        .catch(err => {
            console.error("Fehler beim Hinzufügen zum Warenkorb:", err);
            showNotification("Fehler beim Hinzufügen", "error");
        });
}

function removeFromCart(index) {
    const cart = getCart();
    
    if (index >= 0 && index < cart.length) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        saveCart(cart);
        updateCartCount();
        renderCartModal();
        
        showNotification(`${removedItem.name} entfernt`, "info");
    }
}

function updateQuantity(index, change) {
    const cart = getCart();
    
    if (index >= 0 && index < cart.length) {
        cart[index].quantity += change;
        
        // Wenn Menge <= 0, entferne Artikel
        if (cart[index].quantity <= 0) {
            removeFromCart(index);
        } else {
            saveCart(cart);
            updateCartCount();
            renderCartModal();
            
            /* Optional: Benachrichtigung bei Mengenänderung
            if (change > 0) {
                showNotification(`${cart[index].name} - Menge erhöht`, "info");
            } else {
                showNotification(`${cart[index].name} - Menge verringert`, "info");
            }*/
        }
    }
}

function renderCartModal() {
    const cart = getCart();
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    const emptyCartEl = document.getElementById("empty-cart-message");
    const checkoutBtn = document.getElementById("checkout-btn");
    
    if (!container || !totalEl) return;
    
    container.innerHTML = "";
    
    if (cart.length === 0) {
        if (emptyCartEl) emptyCartEl.style.display = "block";
        if (checkoutBtn) checkoutBtn.style.display = "none";
        totalEl.textContent = "0.00";
        return;
    }
    
    if (emptyCartEl) emptyCartEl.style.display = "none";
    if (checkoutBtn) checkoutBtn.style.display = "block";
    
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        container.innerHTML += `
        <div class="cart-item-large mb-4 pb-4 border-bottom">
            <div class="row align-items-center">
                <div class="col-4 col-lg-3">
                    <img src="${item.image}" class="img-fluid rounded cart-img-large" 
                         alt="${item.name}" style="max-height: 120px; width: 100%; object-fit: cover;">
                </div>
                <div class="col-8 col-lg-9">
                    <div class="row align-items-center">
                        <div class="col-12 col-md-6 mb-3 mb-md-0">
                            <h6 class="fw-bold mb-1">${item.name}</h6>
                            <p class="text-muted small mb-2">${item.size}</p>
                            <div class="price-per-unit text-muted">
                                CHF ${item.price.toFixed(2)} pro Stück
                            </div>
                        </div>
                        <div class="col-12 col-md-4 mb-3 mb-md-0">
                            <div class="quantity-control d-flex align-items-center">
                                <button class="btn btn-sm btn-outline-secondary decrease-qty" 
                                        data-index="${index}"
                                        ${item.quantity <= 1 ? 'disabled' : ''}>
                                    <i class="bi bi-dash"></i>
                                </button>
                                <span class="quantity-display mx-3 fw-bold fs-5">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary increase-qty" 
                                        data-index="${index}">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                        </div>
                        <div class="col-12 col-md-2 text-end">
                            <div class="fw-bold text-primary fs-5 mb-2">CHF ${itemTotal.toFixed(2)}</div>
                            <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
    
    totalEl.textContent = total.toFixed(2);
    
    // Event Listener für alle Buttons
    container.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const index = parseInt(btn.dataset.index);
            removeFromCart(index);
        });
    });
    
    container.querySelectorAll(".decrease-qty").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const index = parseInt(btn.dataset.index);
            updateQuantity(index, -1);
        });
    });
    
    container.querySelectorAll(".increase-qty").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const index = parseInt(btn.dataset.index);
            updateQuantity(index, 1);
        });
    });
}

function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.textContent = message;
    
    const colors = {
        success: "#28a745",
        error: "#dc3545",
        info: "#17a2b8"
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 9999;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        font-weight: 500;
        animation: fadeInOut 3s ease-in-out;
        min-width: 200px;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

function simulatePayment() {
    const cart = getCart();

    if (cart.length === 0) {
        showNotification("Dein Warenkorb ist leer.", "info");
        return;
    }

    // Modal schließen
    const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (modal) modal.hide();
    
    showNotification("Bestellung erfolgreich! Danke für Ihren Einkauf.", "success");

    // Warenkorb leeren
    saveCart([]);
    updateCartCount();
    renderCartModal();
}

// Event Listener
document.addEventListener("DOMContentLoaded", () => {
    // Listener für "In den Warenkorb"-Buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            const size = button.dataset.size || "250g";
            addToCart(id, size);
        });
    });
    
    // Checkout-Button
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            simulatePayment();
        });
    }
    
    // Modal Event Listener
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('show.bs.modal', () => {
            renderCartModal();
        });
    }
    
    // Initialisiere Cart Count
    updateCartCount();
});