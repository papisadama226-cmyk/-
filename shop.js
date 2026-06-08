// Configuration globale du site NORDIC
const PRICE_PER_ARTICLE = 10000;
const ADMIN_PHONE = "0702797128";
let cart = [];

// Sécurité : Vérifier si le client s'est connecté (nom et téléphone enregistrés)
window.addEventListener('DOMContentLoaded', () => {
    const clientName = localStorage.getItem('nordic_user_name');
    const clientPhone = localStorage.getItem('nordic_user_phone');
    
    // Si les infos n'existent pas, on force le retour à l'index pour s'enregistrer
    if (!clientName || !clientPhone) {
        alert("⚠️ Veuillez vous identifier avant d'accéder à la boutique.");
        window.location.href = "index.html";
    }
});

// Ouvrir ou fermer le volet du panier
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('active');
}

// Ajouter un article au panier
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

// Mettre à jour l'affichage du panier (compteur, liste, total)
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Calcul du nombre total de t-shirts
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
                    <p>${PRICE_PER_ARTICLE.toLocaleString('fr-FR')} x ${item.quantity}</p>
                </div>
                <button class="remove-item-btn" onclick="removeFromCart(${index})">✕</button>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = `${totalMoney.toLocaleString('fr-FR')} FCFA`;
}

// Retirer un article du panier
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Valider la commande et envoyer sur le WhatsApp de l'admin
function validateCheckout() {
    if (cart.length === 0) {
        alert("Votre panier est vide !");
        return;
    }
    
    const delivery = document.getElementById('deliveryLocation').value;
    const paymentMethod = document.getElementById('payMethod').value;
    const clientName = localStorage.getItem('nordic_user_name') || "Client Privé";
    const clientPhone = localStorage.getItem('nordic_user_phone') || "Non spécifié";
    
    if (!delivery.trim()) {
        alert("Veuillez spécifier un lieu de livraison (Commune / Quartier).");
        return;
    }
    
    // Construction propre du texte de la facture pour WhatsApp (\n gère les retours à la ligne)
    let orderDetails = `*NOUVELLE COMMANDE NORDIC 🇨🇮*\n`;
    orderDetails += `-----------------------------\n`;
    orderDetails += `👤 *Client :* ${clientName}\n`;
    orderDetails += `📞 *Téléphone :* ${clientPhone}\n`;
    orderDetails += `📍 *Livraison :* ${delivery}\n`;
    orderDetails += `💳 *Paiement choisi :* ${paymentMethod}\n`;
    orderDetails += `-----------------------------\n`;
    orderDetails += `🛒 *Articles commandés :*\n`;
    
    let totalFinal = 0;
    cart.forEach(item => {
        const cost = item.quantity * PRICE_PER_ARTICLE;
        totalFinal += cost;
        orderDetails += `- ${item.name} (x${item.quantity}) : ${cost.toLocaleString('fr-FR')} FCFA\n`;
    });
    
    orderDetails += `-----------------------------\n`;
    orderDetails += `💰 *TOTAL À PAYER :* *${totalFinal.toLocaleString('fr-FR')} FCFA*\n\n`;
    orderDetails += `Merci de valider ma commande et de m'envoyer les instructions de paiement !`;

    // Génération finale de l'URL WhatsApp sans crash
    const whatsappUrl = `https://wa.me/225${ADMIN_PHONE}?text=${encodeURIComponent(orderDetails)}`;
    
    // Redirection immédiate
    window.location.href = whatsappUrl;
}

    
    
