const PRICE_PER_ARTICLE = 10000;
const ADMIN_PHONE = "0702797128";
let cart = [];

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('active');
}

function addToCart(productName) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: productName, quantity: 1 });
    }
    updateCartUI();
    alert(`✅ ${productName} ajouté au panier !`);
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalArticles = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalArticles;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-msg">Votre panier est vide.</p>';
        cartTotal.textContent = "0 FCFA";
        return;
    }
    
    let html = "";
    let totalMoney = 0;
    
    cart.forEach((item, index) => {
        const itemCost = item.quantity * PRICE_PER_ARTICLE;
        totalMoney += itemCost;
        html += `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <p>${PRICE_PER_ARTICLE.toLocaleString()} x ${item.quantity}</p>
                </div>
                <button class="remove-item-btn" onclick="removeFromCart(${index})">✕</button>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = `${totalMoney.toLocaleString()} FCFA`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function validateCheckout() {
    if (cart.length === 0) {
        alert("Votre panier est vide !");
        return;
    }
    
    const delivery = document.getElementById('deliveryLocation').value;
    const paymentMethod = document.getElementById('payMethod').value;
    const clientName = localStorage.getItem('nordic_user_name') || "Client Privé";
    const clientPhone = localStorage.getItem('nordic_user_phone') || "Non communiqué";
    
    if (!delivery.trim()) {
        alert("Veuillez indiquer le lieu pour la livraison.");
        return;
    }
    
    let orderDetails = `*NOUVELLE COMMANDE NORDIC 🇨🇮*\n`;
    orderDetails += `-----------------------------\n`;
    orderDetails += `👤 *Client :* ${clientName}\n`;
    orderDetails += `📞 *Téléphone :* ${clientPhone}\n`;
    orderDetails += `📍 *Livraison :* ${delivery}\n`;
    orderDetails += `💳 *Paiement :* ${paymentMethod}\n`;
    orderDetails += `-----------------------------\n`;
    orderDetails += `🛒 *Articles :*\n`;
    
    let totalFinal = 0;
    cart.forEach(item => {
        const cost = item.quantity * PRICE_PER_ARTICLE;
        totalFinal += cost;
        orderDetails += `- ${item.name} (x${item.quantity}) : ${cost.toLocaleString()} FCFA\n`;
    });
    
    orderDetails += `-----------------------------\n`;
    orderDetails += `💰 *TOTAL FINAL :* *${totalFinal.toLocaleString()} FCFA*\n\n`;
    orderDetails += `Je souhaite valider et passer au paiement !`;

    window.location.href = `https://wa.me/225${ADMIN_PHONE}?text=${encodeURIComponent(orderDetails)}`;
}
