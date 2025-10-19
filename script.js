document.addEventListener('DOMContentLoaded', () => {
    const addItemForm = document.getElementById('add-item-form');
    const makananGallery = document.getElementById('makanan-gallery');
    const minumanGallery = document.getElementById('minuman-gallery');
    const selectedItemNameSpan = document.getElementById('selected-item-name');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const itemQuantityInput = document.getElementById('item-quantity');
    const cartItemsTbody = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const totalPriceSpan = document.getElementById('total-price');
    const taxSpan = document.getElementById('tax');
    const grandTotalSpan = document.getElementById('grand-total');
    const printBtn = document.getElementById('print-receipt-btn');

    let cart = [];
    let selectedItemId = null;
    const PAJAK_RATE = 0.11;

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    const createMenuCard = (item) => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.dataset.id = item.id;
        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>${formatRupiah(item.price)}</p>
        `;
        return card;
    };

    const populateMenuGalleries = () => {
        if (typeof menuItems !== 'undefined' && menuItems.length > 0) {
            makananGallery.innerHTML = '';
            minumanGallery.innerHTML = '';

            const makanan = menuItems.filter(item => item.category === 'makanan');
            const minuman = menuItems.filter(item => item.category === 'minuman');

            makanan.forEach(item => {
                const card = createMenuCard(item);
                makananGallery.appendChild(card);
            });

            minuman.forEach(item => {
                const card = createMenuCard(item);
                minumanGallery.appendChild(card);
            });
        } else {
            console.error("Gagal memuat menu. Pastikan 'menu.js' ter-load dengan benar.");
        }
    };

    const handleMenuCardClick = (e) => {
        const card = e.target.closest('.menu-card');
        if (!card) return;

        document.querySelectorAll('.menu-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        selectedItemId = parseInt(card.dataset.id);
        const item = menuItems.find(i => i.id === selectedItemId);

        selectedItemNameSpan.textContent = item.name;
        selectedItemNameSpan.classList.remove('placeholder');
        itemQuantityInput.value = "1";
        addToCartBtn.disabled = false;
    };
    
    const resetOrderControls = () => {
        selectedItemId = null;
        selectedItemNameSpan.textContent = '-- Pilih item dari galeri --';
        selectedItemNameSpan.classList.add('placeholder');
        itemQuantityInput.value = "1";
        addToCartBtn.disabled = true;

        document.querySelectorAll('.menu-card').forEach(c => c.classList.remove('selected'));
    }

    const saveCartToLocalStorage = () => {
        localStorage.setItem('posCart', JSON.stringify(cart));
    };

    const loadCartFromLocalStorage = () => {
        const savedCart = localStorage.getItem('posCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    };

    const addItemToCart = (item, quantity) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: quantity
            });
        }
        updateCart();
    };
    
    const removeItemFromCart = (itemId) => {
        cart = cart.filter(item => item.id !== itemId);
        updateCart();
    };

    const updateCart = () => {
        cartItemsTbody.innerHTML = '';

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            printBtn.disabled = true;
        } else {
            emptyCartMessage.style.display = 'none';
            printBtn.disabled = false;
            
            cart.forEach(item => {
                const tr = document.createElement('tr');
                const subtotal = item.price * item.quantity;
                tr.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>
                        <button class="btn-delete" data-id="${item.id}">✖</button>
                    </td>
                `;
                cartItemsTbody.appendChild(tr);
            });
        }
        
        updateTotals();
        saveCartToLocalStorage();
    };
    
    const updateTotals = () => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = total * PAJAK_RATE;
        const grandTotal = total + tax;

        totalPriceSpan.textContent = formatRupiah(total);
        taxSpan.textContent = formatRupiah(tax);
        grandTotalSpan.textContent = formatRupiah(grandTotal);
    };

    const printReceipt = () => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = total * PAJAK_RATE;
        const grandTotal = total + tax;
        const now = new Date();

        let receiptContent = `
            <html>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Noto+Serif+JP:wght@400;500;600&display=swap" rel="stylesheet">
                
                <style>
                    body { 
                        font-family: 'Merriweather', 'Noto Serif JP', serif; 
                        font-size: 12px; 
                        color: #333333;
                        margin: 0;
                        padding: 10px;
                    }
                    .container {
                        width: 280px; /* Lebar struk thermal standar */
                        margin: 0 auto;
                    }
                    h2 { 
                        text-align: center; 
                        margin: 0; 
                        color: #D32F2F; /* Warna Merah Tema */
                        font-size: 20px;
                        font-weight: 700;
                    }
                    p { 
                        text-align: center; 
                        margin: 2px 0; 
                        font-family: 'Noto Serif JP', serif; /* Font untuk Katakana */
                        font-size: 14px;
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-top: 10px; 
                    }
                    td { 
                        padding: 3px 0; /* Padding vertikal */
                    }
                    .text-left { text-align: left; }
                    .text-right { text-align: right; }

                    .amount-col {
                        text-align: right;
                        white-space: nowrap;
                    }
                    
                    /* Garis pemisah */
                    .line { 
                        border-top: 1px dashed #6D4C41; /* Warna Cokelat Tema */
                        margin: 10px 0; 
                    }
                    
                    /* Baris Total */
                    .total-row strong {
                         color: #D32F2F; /* Warna Merah Tema */
                    }

                    /* Footer */
                    .footer {
                        text-align: center;
                        margin-top: 10px;
                        font-size: 14px;
                        font-family: 'Noto Serif JP', serif;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>NekoRamen</h2>
                    <p>ネコラーメン</p>
                    <p style="font-size: 10px; text-align: center; margin-top: 5px;">
                        Tanggal: ${now.toLocaleDateString('id-ID')} Waktu: ${now.toLocaleTimeString('id-ID')}
                    </p>
                    <div class="line"></div>
                    
                    <table>
        `;

        cart.forEach(item => {
            receiptContent += `
                <tr>
                    <td class="text-left">${item.name} (x${item.quantity})</td>
                    <td class="amount-col">${formatRupiah(item.price * item.quantity)}</td>
                </tr>
            `;
        });
        
        receiptContent += `
            </table>
                    <div class="line"></div>
                    
                    <table>
                        <tr>
                            <td class="text-left">Total</td>
                            <td class="text-right">${formatRupiah(total)}</td>
                        </tr>
                        <tr>
                            <td class="text-left">Pajak (11%)</td>
                            <td class="text-right">${formatRupiah(tax)}</td>
                        </tr>
                        <tr class="total-row">
                            <td class="text-left"><strong>Total Bayar</strong></td>
                            <td class="text-right"><strong>${formatRupiah(grandTotal)}</strong></td>
                        </tr>
                    </table>
                    
                    <div class="line"></div>
                    <p class="footer">ありがとうございます！</p>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('printstruk', '_blank');
        printWindow.document.write(receiptContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const quantity = parseInt(itemQuantityInput.value);

        if (selectedItemId && !isNaN(quantity) && quantity > 0) {
            const selectedItem = menuItems.find(item => item.id === selectedItemId);
            addItemToCart(selectedItem, quantity);
            
            resetOrderControls();
        } else {
            alert('Harap pilih menu dari galeri dan masukkan jumlah yang valid.');
        }
    });

    makananGallery.addEventListener('click', handleMenuCardClick);
    minumanGallery.addEventListener('click', handleMenuCardClick);

    cartItemsTbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const itemId = parseInt(e.target.dataset.id);
            removeItemFromCart(itemId);
        }
    });
    
    printBtn.addEventListener('click', printReceipt);
    
    populateMenuGalleries(); 
    loadCartFromLocalStorage();
    updateCart();
});