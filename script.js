// Catálogo de produtos da MultiBichos (Cães, Gatos, Aves & Roedores)
const products = [
    {
        id: 1,
        name: "Ração Premium Cães Adultos 15kg",
        category: "caes",
        tag: "Cães",
        price: 134.90,
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Guia Peitoral Reforçada Azul",
        category: "caes",
        tag: "Cães",
        price: 64.90,
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Ração Super Premium Gatos Castrados 10kg",
        category: "gatos",
        tag: "Gatos",
        price: 159.90,
        image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Arranhador Torre com Bolinha",
        category: "gatos",
        tag: "Gatos",
        price: 119.90,
        image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Mix de Sementes e Frutas para Calopsitas 1kg",
        category: "aves",
        tag: "Aves",
        price: 28.90,
        image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Ração Extrusada e Alfafa para Roedores 1.5kg",
        category: "aves",
        tag: "Roedores",
        price: 39.90,
        image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=600&q=80"
    }
];

let cart = [];

// Elementos do DOM
const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

// Menu Mobile
mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Fechar menu mobile ao clicar num link
document.querySelectorAll('#navMenu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Renderizar produtos na loja
function displayProducts(category = 'all') {
    productsGrid.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image}')">
                <span class="product-badge">${product.tag}</span>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fa-solid fa-cart-plus"></i> Adicionar
                </button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// Eventos dos filtros
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        displayProducts(btn.getAttribute('data-filter'));
    });
});

// Adicionar ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    cartModal.classList.add('active');
}

// Alterar quantidade no carrinho
function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
    }
}

// Remover item do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Atualizar visualização do carrinho
function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
        cartCount.textContent = '0';
        cartTotal.textContent = 'R$ 0,00';
        return;
    }

    let total = 0;
    let totalCount = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        totalCount += item.quantity;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remover">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    cartCount.textContent = totalCount;
    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Abrir e fechar modal do carrinho
cartBtn.addEventListener('click', () => cartModal.classList.add('active'));
closeCart.addEventListener('click', () => cartModal.classList.remove('active'));

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
    }
});

// Pré-selecionar assunto ao clicar nos botões dos serviços
function selecionarAssunto(valor) {
    const select = document.getElementById('assuntoSelect');
    if (select) {
        select.value = valor;
    }
}

// Finalizar pedido via WhatsApp
function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    let message = "Olá, *MultiBichos*! Gostaria de fazer o seguinte pedido:\n\n";
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `• ${item.quantity}x ${item.name} — R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    });

    message += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;

    const whatsappUrl = `https://wa.me/5511999998888?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Envio do formulário de agendamento/contato
function enviarMensagem(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const pet = document.getElementById('petNome').value;
    
    alert(`Obrigado, ${nome}! Recebemos sua solicitação para o pet ${pet} e entraremos em contato em breve.`);
    document.getElementById('contactForm').reset();
}

// Inicializar loja
document.addEventListener('DOMContentLoaded', () => {
    displayProducts('all');
});