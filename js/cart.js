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

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            const size = button.dataset.size || "250g";

            addToCart(id, size);
            alert(`${product.name} (${size}) wurde zum Warenkorb hinzugefügt`);
        });
    });

    updateCartCount();
});
