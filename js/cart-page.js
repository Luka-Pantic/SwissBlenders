const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

const cart = getCart();
let total = 0;

cartItemsEl.innerHTML = "";

cart.forEach(item => {
  total += item.price * item.quantity;

  cartItemsEl.innerHTML += `
    <div class="cart-item">
      <img src="${item.image}" width="80">
      <strong>${item.name}</strong>
      <span>${item.size}</span>
      <span>${item.quantity} × CHF ${item.price.toFixed(2)}</span>
    </div>
  `;
});

cartTotalEl.textContent = `Total: CHF ${total.toFixed(2)}`;
