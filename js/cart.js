function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
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
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: variant.price,
                    size: variant.size,
                    quantity: 1,
                    image: product.image
                });
            }

            saveCart(cart);
            updateCartCount();


        });
}

function renderCartDropdown() {
    const cart = getCart();
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");

    if (!container || !totalEl) return;

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p>Dein Warenkorb ist leer.</p>";
        totalEl.textContent = "0.00";
        return;
    }

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        container.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" width="60">
        <strong>${item.name}</strong> (${item.size})<br>
        CHF ${item.price} × ${item.quantity}
      </div>
    `;
    });

    totalEl.textContent = total.toFixed(2);
}


const cartToggle = document.getElementById("cart-toggle");
const cartDropdown = document.getElementById("cart-dropdown");

cartToggle.addEventListener("click", (e) => {
    e.preventDefault();
    cartDropdown.classList.toggle("hidden");
    renderCartDropdown();
});

document.addEventListener("click", (e) => {
    if (!cartToggle.contains(e.target) && !cartDropdown.contains(e.target)) {
        cartDropdown.classList.add("hidden");
    }
});


function simulatePayment() {
    const cart = getCart();

    if (cart.length === 0) {
        alert("Dein Warenkorb ist leer.");
        return;
    }

    // Hier könntest du z.B. eine Ladeanimation oder Ähnliches simulieren
    alert("Zahlung erfolgreich! Danke für deinen Einkauf.");

    // Warenkorb leeren
    saveCart([]);
    updateCartCount();
    renderCartDropdown();
}



document.addEventListener("DOMContentLoaded", () => {
    // Listener für alle "In den Warenkorb"-Buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            const size = button.dataset.size || "250g";

            addToCart(id, size);
            alert(`${id} (${size}) wurde zum Warenkorb hinzugefügt`);
        });
    });

    // Listener für Checkout-Button nur EINMAL hinzufügen
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            simulatePayment();
        });
    }

    updateCartCount();
});


