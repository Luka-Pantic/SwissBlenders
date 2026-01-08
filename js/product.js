const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

fetch("products.json")
    .then(res => res.json())
    .then(products => {

        const product = products.find(p => p.id === productId);
        if (!product) {
            console.error("Produkt nicht gefunden");
            return;
        }

        // Grunddaten
        document.getElementById("productName").textContent = product.name;
        document.getElementById("productTag").textContent = product.tag;
        document.getElementById("productDescription").textContent = product.description;

        // Bild
        const imageEl = document.getElementById("productImage");
        imageEl.src = product.image;
        imageEl.alt = product.name;
        const storyImage = document.getElementById("storyImage");
        storyImage.src = product.imageStory;
        storyImage.alt = product.name;

        // Details
        document.getElementById("origin").textContent = product.details.origin;
        document.getElementById("variety").textContent = product.details.variety;
        document.getElementById("process").textContent = product.details.process;
        document.getElementById("taste").textContent = product.details.taste;

        //story
        document.getElementById("story").textContent = product.story;

        // Varianten
        const select = document.getElementById("variantSelect");
        const priceEl = document.getElementById("price");

        select.innerHTML = "";

        product.variants.forEach((variant, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = variant.size;
            select.appendChild(option);
        });

        // Initialpreis
        priceEl.textContent = `CHF ${product.variants[0].price.toFixed(2)}`;

        // Preis bei Wechsel aktualisieren
        select.addEventListener("change", () => {
            const selectedVariant = product.variants[select.value];
            priceEl.textContent = `CHF ${selectedVariant.price.toFixed(2)}`;
        });

        addToCart(product, variant);
       


    })
    .catch(err => console.error("Fehler beim Laden der Produkte:", err));


// Listener für "In den Warenkorb"-Button auf der Produktseite
document.addEventListener("DOMContentLoaded", () => {
    const addToCartBtn = document.getElementById("productPageAddToCart");
    const variantSelect = document.getElementById("variantSelect");
    const priceEl = document.getElementById("price");
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            // Hole die aktuellen Produktdaten
            const params = new URLSearchParams(window.location.search);
            const productId = params.get("id");
            
            if (!productId) {
                alert("Produkt konnte nicht gefunden werden.");
                return;
            }
            
            // Hole die Größe aus dem Select
            const selectedSize = variantSelect.options[variantSelect.selectedIndex].textContent;
            
            // Füge zum Warenkorb hinzu
            addToCart(productId, selectedSize);
            
        });
    }
    
    // ... bestehender Code für Variantenwechsel ...
});
