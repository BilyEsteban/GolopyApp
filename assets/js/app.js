const FALLBACK_MENU_PRODUCTS = [
    {
        id: 'bacon',
        name: 'Bacon',
        price: 339,
        category: 'Hamburguesas',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
        coreIngredients: ['Carne de Res 100%', 'Queso Cheddar', 'Tocino Crujiente'],
        customIngredients: ['Cebolla Caramelizada', 'Pepinillos', 'Salsa Especial']
    },
    {
        id: 'bacon-go',
        name: 'Bacon Go',
        price: 439,
        category: 'Hamburguesas',
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
        coreIngredients: ['Doble Carne de Res', 'Doble Queso', 'Tocino'],
        customIngredients: ['Cebolla Caramelizada', 'Salsa de la Casa']
    },
    {
        id: 'chicken-go',
        name: 'Chicken Go',
        price: 249,
        category: 'Pollo',
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
        coreIngredients: ['Pollo Empanizado Crispy', 'Queso'],
        customIngredients: ['Tomate', 'Lechuga', 'Cebolla', 'Pepinillos', 'Mayonesa']
    },
    {
        id: 'clasica',
        name: 'Hamburguesa Clásica',
        price: 229,
        category: 'Hamburguesas',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        coreIngredients: ['Carne de Res 100%', 'Queso Cheddar'],
        customIngredients: ['Tomate', 'Lechuga', 'Cebolla', 'Pepinillos', 'Salsa Golopy']
    },
    {
        id: 'pepperoni',
        name: 'Pepperoni Burger',
        price: 319,
        category: 'Hamburguesas',
        image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=600&q=80',
        coreIngredients: ['Carne de Res', 'Pepperoni Grillado', 'Queso Fundido'],
        customIngredients: ['Cebolla Caramelizada', 'Pepinillos', 'Salsa de Tomate Especiada']
    },
    {
        id: 'mega',
        name: 'Mega Hamburguesa',
        price: 695,
        category: 'Hamburguesas',
        image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?auto=format&fit=crop&w=600&q=80',
        coreIngredients: ['3 Carnes de Res', '6 Tocinetas', 'Triple Queso', 'Papas Incluidas'],
        customIngredients: ['Pepinillos', 'Salsa Ranch', 'Salsa BBQ']
    },
    {
        id: 'pechurina-mini',
        name: 'Pechurina Mini',
        price: 359,
        category: 'Pollo',
        image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
        coreIngredients: ['Tiras de Pollo Empanizadas', 'Papas Incluidas'],
        customIngredients: ['Salsa BBQ', 'Salsa Honey Mustard', 'Salsa Ranch', 'Salsa Ketchup']
    },
    {
        id: 'papas-medianas',
        name: 'Papas Medianas',
        price: 60,
        category: 'Acompañantes',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
        coreIngredients: ['Papas Fritas Crujientes'],
        customIngredients: ['Sal de la Casa', 'Ketchup al lado']
    },
    {
        id: 'milkshake-oreo',
        name: 'Milkshake Oreo',
        price: 190,
        category: 'Bebidas',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
        coreIngredients: ['Galletas Oreo', 'Helado de Vainilla', 'Carnation', 'Chantilly', 'Hershey']
    },
    {
        id: 'milkshake-mora',
        name: 'Milkshake Mora',
        price: 270,
        category: 'Bebidas',
        image: 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=600&q=80',
        coreIngredients: ['Mora Natural', 'Helado Cremoso', 'Crema Chantilly', 'Sirope Hershey']
    }
];

let MENU_PRODUCTS = [...FALLBACK_MENU_PRODUCTS];
let currentOrder = [];
let activeCategory = 'Todos';
let orderCounter = 1;

async function fetchMenu() {
    try {
        const response = await fetch('/api/menu');
        if (!response.ok) {
            throw new Error('No se pudo cargar el menú');
        }

        const data = await response.json();
        MENU_PRODUCTS = Array.isArray(data) && data.length ? data : FALLBACK_MENU_PRODUCTS;
    } catch (error) {
        MENU_PRODUCTS = FALLBACK_MENU_PRODUCTS;
    }

    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const searchVal = document.getElementById('searchInput').value.toLowerCase();

    const filtered = MENU_PRODUCTS.filter(prod => {
        const matchesCat = activeCategory === 'Todos' || prod.category === activeCategory;
        const matchesSearch = prod.name.toLowerCase().includes(searchVal) ||
            prod.coreIngredients.join(' ').toLowerCase().includes(searchVal);
        return matchesCat && matchesSearch;
    });

    grid.innerHTML = filtered.map(prod => `
        <div onclick="addProductToOrder('${prod.id}')" class="bg-golopy-cardDark border border-golopy-borderDark rounded-2xl overflow-hidden hover:border-golopy-gold transition cursor-pointer flex flex-col justify-between group shadow-lg hover:scale-[1.01]">
            <div>
                <div class="h-40 w-full overflow-hidden relative">
                    <img src="${prod.image}" alt="${prod.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <span class="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-golopy-gold font-bold px-2.5 py-1 rounded-lg text-xs border border-golopy-gold/30">
                        RD$ ${prod.price}
                    </span>
                </div>

                <div class="p-4 space-y-2">
                    <div class="flex justify-between items-start">
                        <h3 class="font-bold text-white text-lg group-hover:text-golopy-gold transition">${prod.name}</h3>
                    </div>

                    <p class="text-xs text-gray-400 line-clamp-2">
                        <span class="text-gray-300 font-semibold">Lleva:</span> ${prod.coreIngredients.concat(prod.customIngredients || []).join(', ')}
                    </p>
                </div>
            </div>

            <div class="px-4 pb-4">
                <button class="w-full bg-golopy-gold/10 hover:bg-golopy-gold text-golopy-gold hover:text-golopy-darkRed font-bold py-2 rounded-xl text-xs transition border border-golopy-gold/30 flex items-center justify-center gap-2">
                    <i class="fa-solid fa-plus"></i> Agregar al Pedido
                </button>
            </div>
        </div>
    `).join('');
}

function addProductToOrder(productId) {
    const product = MENU_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const selectedCustoms = product.customIngredients ? [...product.customIngredients] : [];

    currentOrder.push({
        cartItemId: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        productId: product.id,
        name: product.name,
        unitPrice: product.price,
        quantity: 1,
        coreIngredients: [...product.coreIngredients],
        availableCustoms: product.customIngredients ? [...product.customIngredients] : [],
        selectedCustoms
    });

    renderOrderList();
}

function toggleIngredient(cartItemId, ingredientName) {
    const item = currentOrder.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    const idx = item.selectedCustoms.indexOf(ingredientName);
    if (idx > -1) {
        item.selectedCustoms.splice(idx, 1);
    } else {
        item.selectedCustoms.push(ingredientName);
    }
    renderOrderList();
}

function updateQuantity(cartItemId, delta) {
    const item = currentOrder.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        currentOrder = currentOrder.filter(i => i.cartItemId !== cartItemId);
    }
    renderOrderList();
}

function removeItem(cartItemId) {
    currentOrder = currentOrder.filter(i => i.cartItemId !== cartItemId);
    renderOrderList();
}

function clearCurrentOrder() {
    if (currentOrder.length === 0) return;
    currentOrder = [];
    renderOrderList();
}

function renderOrderList() {
    const container = document.getElementById('orderItemsContainer');
    const emptyMsg = document.getElementById('emptyCartMessage');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (currentOrder.length === 0) {
        container.innerHTML = '';
        container.appendChild(emptyMsg);
        emptyMsg.classList.remove('hidden');
        checkoutBtn.disabled = true;
        calculateTotals(0);
        return;
    }

    let subtotalAcc = 0;

    container.innerHTML = currentOrder.map(item => {
        const itemTotal = item.unitPrice * item.quantity;
        subtotalAcc += itemTotal;

        return `
            <div class="bg-golopy-cardDark border border-golopy-borderDark rounded-xl p-3 space-y-2 relative group">
                <div class="flex justify-between items-start gap-2">
                    <div>
                        <h4 class="font-bold text-white text-sm flex items-center gap-1.5">${item.name}</h4>
                        <p class="text-xs text-golopy-gold font-mono font-medium">RD$ ${item.unitPrice} c/u</p>
                    </div>

                    <div class="flex items-center gap-1.5 bg-golopy-bgDark border border-golopy-borderDark rounded-lg p-1">
                        <button onclick="updateQuantity('${item.cartItemId}', -1)" class="w-5 h-5 rounded flex items-center justify-center text-xs text-gray-400 hover:bg-white/10 hover:text-white">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <span class="text-xs font-bold font-mono px-1 text-white">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.cartItemId}', 1)" class="w-5 h-5 rounded flex items-center justify-center text-xs text-gray-400 hover:bg-white/10 hover:text-white">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                        <button onclick="removeItem('${item.cartItemId}')" class="w-5 h-5 rounded flex items-center justify-center text-xs text-red-400 hover:bg-red-500/20 ml-1">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>

                <div class="text-[11px] text-gray-400 bg-black/20 p-2 rounded-lg border border-white/5 space-y-1">
                    <p class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Base Predeterminada:</p>
                    <p class="text-gray-300">${item.coreIngredients.join(', ')}</p>

                    ${item.availableCustoms.length > 0 ? `
                        <p class="text-[10px] text-golopy-gold font-semibold uppercase tracking-wider pt-1 border-t border-white/5 mt-1">
                            Personalizar Vegetales / Extras:
                        </p>
                        <div class="grid grid-cols-2 gap-1 pt-0.5">
                            ${item.availableCustoms.map(cust => {
                                const isChecked = item.selectedCustoms.includes(cust);
                                return `
                                    <label class="flex items-center gap-1.5 cursor-pointer text-[11px] ${isChecked ? 'text-gray-200' : 'text-gray-500 line-through'}">
                                        <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleIngredient('${item.cartItemId}', '${cust}')" class="rounded accent-golopy-gold w-3 h-3 cursor-pointer">
                                        <span>${cust}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}
                </div>

                <div class="text-right text-xs font-mono font-bold text-white pt-1">
                    Total Item: <span class="text-golopy-gold">RD$ ${itemTotal.toFixed(2)}</span>
                </div>
            </div>
        `;
    }).join('');

    checkoutBtn.disabled = false;
    calculateTotals(subtotalAcc);
}

function calculateTotals(subtotal) {
    const itbis = subtotal * 0.18;
    const total = subtotal + itbis;

    document.getElementById('subtotalDisplay').innerText = `RD$ ${subtotal.toFixed(2)}`;
    document.getElementById('itbisDisplay').innerText = `RD$ ${itbis.toFixed(2)}`;
    document.getElementById('totalDisplay').innerText = `RD$ ${total.toFixed(2)}`;
}

function showReceiptModal() {
    let modal = document.getElementById('receiptModalModal');

    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'receiptModalModal';
        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white text-gray-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div class="bg-golopy-darkRed p-4 text-white flex justify-between items-center no-print">
                    <h3 class="font-bebas text-xl tracking-wide flex items-center gap-2">
                        <i class="fa-solid fa-circle-check text-green-400"></i> Factura Generada
                    </h3>
                </div>
                <div class="p-6 overflow-y-auto text-xs font-mono space-y-4">
                    <div class="text-center space-y-1 pb-3 border-b border-dashed border-gray-400">
                        <h2 class="font-bebas text-3xl text-black font-bold tracking-wider">GOLOPY BURGERS</h2>
                    </div>
                    <div class="space-y-0.5 text-[11px] pb-2 border-b border-dashed border-gray-400">
                        <div class="flex justify-between"><span class="text-gray-600">Factura #:</span><span id="recNum" class="font-bold">--</span></div>
                    </div>
                    <div id="receiptItemsList" class="space-y-1.5"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    modal.classList.remove('hidden');
}

async function processCheckout() {
    if (currentOrder.length === 0) return;

    const customer = document.getElementById('customerName').value || 'Cliente General';
    const orderType = document.getElementById('orderType').value;
    const now = new Date();

    const payload = {
        customer,
        orderType,
        items: currentOrder.map(item => ({
            ...item,
            selectedCustoms: item.selectedCustoms,
            availableCustoms: item.availableCustoms,
            subtotal: item.unitPrice * item.quantity
        }))
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('La orden no fue creada');
        }

        const data = await response.json();
        const subtotalAcc = Number(data.subtotal || 0);
        const itbis = Number(data.itbis || 0);
        const total = Number(data.total || 0);

        const recNum = document.getElementById('recNum');
        const recDate = document.getElementById('recDate');
        const recCustomer = document.getElementById('recCustomer');
        const recType = document.getElementById('recType');
        const recSubtotal = document.getElementById('recSubtotal');
        const recItbis = document.getElementById('recItbis');
        const recTotal = document.getElementById('recTotal');

        if (recNum) recNum.innerText = data.receiptNumber || `ORD-00${orderCounter}`;
        if (recDate) recDate.innerText = now.toLocaleString();
        if (recCustomer) recCustomer.innerText = data.customer || customer;
        if (recType) recType.innerText = data.orderType || orderType;
        if (recSubtotal) recSubtotal.innerText = `RD$ ${subtotalAcc.toFixed(2)}`;
        if (recItbis) recItbis.innerText = `RD$ ${itbis.toFixed(2)}`;
        if (recTotal) recTotal.innerText = `RD$ ${total.toFixed(2)}`;

        const itemsHTML = currentOrder.map(item => {
            const itemTotal = item.unitPrice * item.quantity;
            const removedCustoms = item.availableCustoms.filter(c => !item.selectedCustoms.includes(c));
            let modText = '';
            if (removedCustoms.length > 0) {
                modText = `<div class="text-[9px] text-red-600 font-sans">SIN: ${removedCustoms.join(', ')}</div>`;
            }

            return `
                <div class="grid grid-cols-12 py-1 border-b border-gray-100">
                    <span class="col-span-2 font-bold">${item.quantity}x</span>
                    <div class="col-span-6">
                        <span class="font-bold">${item.name}</span>
                        ${modText}
                    </div>
                    <span class="col-span-4 text-right">RD$ ${itemTotal.toFixed(2)}</span>
                </div>
            `;
        }).join('');

        const receiptItemsList = document.getElementById('receiptItemsList');
        if (receiptItemsList) receiptItemsList.innerHTML = itemsHTML;

        showReceiptModal();
    } catch (error) {
        console.error(error);
        alert('No se pudo generar la factura. Inténtalo de nuevo.');
    }
}

function closeReceiptModal(isNewOrder = false) {
    const modal = document.getElementById('receiptModalModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    if (isNewOrder) {
        orderCounter++;
        const orderDisplay = document.getElementById('orderNumberDisplay');
        if (orderDisplay) orderDisplay.innerText = `ORD-00${orderCounter}`;
        clearCurrentOrder();
    }
}

function setCategory(catName) {
    activeCategory = catName;
    document.querySelectorAll('.category-btn').forEach(btn => {
        if (btn.innerText.includes(catName)) {
            btn.className = 'category-btn active border border-golopy-gold bg-golopy-gold text-golopy-darkRed font-bold px-5 py-2 rounded-xl text-sm transition whitespace-nowrap shadow-sm';
        } else {
            btn.className = 'category-btn border border-golopy-borderDark bg-golopy-cardDark hover:border-golopy-gold text-gray-300 font-medium px-5 py-2 rounded-xl text-sm transition whitespace-nowrap';
        }
    });
    renderProducts();
}

function filterMenu() {
    renderProducts();
}

function updateClock() {
    const now = new Date();
    document.getElementById('clockTime').innerText = now.toLocaleTimeString();
    document.getElementById('clockDate').innerText = now.toLocaleDateString('es-DO', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatCurrency(value) {
    return `RD$ ${Number(value || 0).toFixed(2)}`;
}

async function fetchDetailedOrders() {
    const search = document.getElementById('orderSearch')?.value || '';
    const startDate = document.getElementById('orderStartDate')?.value || '';
    const endDate = document.getElementById('orderEndDate')?.value || '';

    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);

    try {
        const response = await fetch(`/api/orders/detail?${params.toString()}`);
        if (!response.ok) throw new Error('No se pudo cargar el detalle de órdenes');
        const data = await response.json();
        renderDetailedOrders(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error(error);
        renderDetailedOrders([]);
    }
}

function renderDetailedOrders(rows) {
    const tableBody = document.getElementById('ordersTableBody');
    if (!tableBody) return;

    if (!rows.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-4 py-10 text-center text-gray-400">No se encontraron órdenes.</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = rows.map((order) => `
        <tr class="align-top border-b border-golopy-borderDark text-sm">
            <td class="px-4 py-3 text-golopy-gold font-bold">${order.receipt_number}</td>
            <td class="px-4 py-3 text-gray-200">${order.customer}</td>
            <td class="px-4 py-3 text-gray-300">${order.order_type}</td>
            <td class="px-4 py-3 text-gray-300">
                <div class="space-y-1">
                    ${order.items.map(item => `
                        <div class="rounded-lg bg-black/10 px-2 py-1">
                            <span class="font-medium text-white">${item.product_name}</span>
                            <span class="text-gray-400"> x${item.quantity}</span>
                            ${item.selected_customs.length ? `<div class="text-[10px] text-golopy-gold">${item.selected_customs.join(', ')}</div>` : ''}
                        </div>
                    `).join('') || '<span class="text-gray-500">Sin items</span>'}
                </div>
            </td>
            <td class="px-4 py-3 text-gray-300">${formatCurrency(order.subtotal)}</td>
            <td class="px-4 py-3 text-gray-300">${formatCurrency(order.total)}</td>
            <td class="px-4 py-3 text-gray-300">${new Date(order.created_at).toLocaleString('es-DO')}</td>
        </tr>
    `).join('');
}

async function fetchSalesHistory() {
    const startDate = document.getElementById('salesStartDate')?.value || '';
    const endDate = document.getElementById('salesEndDate')?.value || '';

    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);

    try {
        const response = await fetch(`/api/sales?${params.toString()}`);
        if (!response.ok) {
            throw new Error('No se pudo cargar el historial de ventas');
        }

        const data = await response.json();
        renderSalesHistory(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error(error);
        renderSalesHistory([]);
    }
}

function renderSalesHistory(rows) {
    const tableBody = document.getElementById('salesTableBody');
    const salesSummary = document.getElementById('salesSummary');
    const salesCount = document.getElementById('salesCount');
    const salesAverage = document.getElementById('salesAverage');

    if (!tableBody || !salesSummary || !salesCount || !salesAverage) return;

    if (!rows.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-4 py-8 text-center text-gray-400">
                    No hay ventas para el filtro seleccionado.
                </td>
            </tr>
        `;
        salesSummary.innerText = formatCurrency(0);
        salesCount.innerText = '0 ventas';
        salesAverage.innerText = formatCurrency(0);
        return;
    }

    const totalSales = rows.reduce((sum, row) => sum + Number(row.total || 0), 0);
    const averageSales = totalSales / rows.length;

    tableBody.innerHTML = rows.map((row) => `
        <tr class="border-b border-golopy-borderDark text-sm">
            <td class="px-4 py-3 text-gray-200">${row.receipt_number}</td>
            <td class="px-4 py-3 text-gray-300">${row.customer}</td>
            <td class="px-4 py-3 text-gray-300">${row.order_type}</td>
            <td class="px-4 py-3 text-gray-300">${row.item_count}</td>
            <td class="px-4 py-3 text-gray-300">${formatCurrency(row.subtotal)}</td>
            <td class="px-4 py-3 text-gray-300">${formatCurrency(row.total)}</td>
            <td class="px-4 py-3 text-gray-300">${new Date(row.created_at).toLocaleString('es-DO')}</td>
        </tr>
    `).join('');

    salesSummary.innerText = formatCurrency(totalSales);
    salesCount.innerText = `${rows.length} ventas`;
    salesAverage.innerText = formatCurrency(averageSales);
}

async function fetchTopSellingProducts() {
    const startDate = document.getElementById('salesStartDate')?.value || '';
    const endDate = document.getElementById('salesEndDate')?.value || '';

    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);

    try {
        const response = await fetch(`/api/products/top-selling?${params.toString()}`);
        if (!response.ok) throw new Error('No se pudo cargar el ranking de productos');
        const data = await response.json();
        renderTopSellingProducts(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error(error);
        renderTopSellingProducts([]);
    }
}

function renderTopSellingProducts(rows) {
    const list = document.getElementById('topSellingProducts');
    if (!list) return;

    if (!rows.length) {
        list.innerHTML = '<div class="text-gray-400 p-4">Sin datos para este rango.</div>';
        return;
    }

    list.innerHTML = rows.map((product, index) => `
        <div class="flex items-center justify-between rounded-xl border border-golopy-borderDark bg-black/10 px-3 py-2">
            <div class="flex items-center gap-3">
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-golopy-gold text-sm font-bold text-golopy-darkRed">${index + 1}</span>
                <div>
                    <p class="font-semibold text-white">${product.name}</p>
                    <p class="text-xs text-gray-400">${product.sold_quantity} unidades vendidas</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-bold text-golopy-gold">${formatCurrency(product.revenue)}</p>
                <p class="text-[10px] text-gray-400">${product.order_count} órdenes</p>
            </div>
        </div>
    `).join('');
}

function exportSalesCsv() {
    const startDate = document.getElementById('salesStartDate')?.value || '';
    const endDate = document.getElementById('salesEndDate')?.value || '';

    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);

    window.location.href = `/api/sales/export?${params.toString()}`;
}

function switchTab(tabName) {
    const navItems = ['pedidos', 'ordenes', 'recetas', 'inventario', 'informes', 'config'];
    navItems.forEach(item => {
        const el = document.getElementById(`nav-${item}`);
        if (el) {
            if (item === tabName) {
                el.className = 'flex items-center gap-3 px-4 py-3 rounded-xl bg-golopy-gold text-golopy-darkRed font-bold shadow-md transition';
            } else {
                el.className = 'flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 transition';
            }
        }
    });

    if (tabName === 'informes') {
        const mainPos = document.getElementById('mainPosContainer');
        mainPos.innerHTML = `
            <div class="space-y-6">
                <div class="bg-golopy-cardDark border border-golopy-borderDark rounded-2xl p-5">
                    <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                        <div>
                            <p class="text-xs uppercase tracking-[0.2em] text-golopy-gold font-semibold">Historial de ventas</p>
                            <h2 class="font-bebas text-3xl text-white mt-1">Informes y reportes</h2>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <div class="flex flex-col text-xs text-gray-400">
                                <label for="salesStartDate">Desde</label>
                                <input id="salesStartDate" type="date" class="mt-1 bg-golopy-bgDark border border-golopy-borderDark rounded-lg px-3 py-2 text-white focus:outline-none focus:border-golopy-gold">
                            </div>
                            <div class="flex flex-col text-xs text-gray-400">
                                <label for="salesEndDate">Hasta</label>
                                <input id="salesEndDate" type="date" class="mt-1 bg-golopy-bgDark border border-golopy-borderDark rounded-lg px-3 py-2 text-white focus:outline-none focus:border-golopy-gold">
                            </div>
                            <div class="flex items-end gap-2">
                                <button onclick="fetchSalesHistory(); fetchTopSellingProducts();" class="bg-golopy-gold hover:bg-golopy-goldHover text-golopy-darkRed font-bold px-4 py-2.5 rounded-xl transition">
                                    Filtrar
                                </button>
                                <button onclick="exportSalesCsv()" class="bg-golopy-darkRed border border-golopy-gold/40 hover:bg-golopy-brightRed text-white font-bold px-4 py-2.5 rounded-xl transition">
                                    Exportar CSV
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-golopy-cardDark border border-golopy-borderDark rounded-2xl p-4">
                        <p class="text-xs uppercase tracking-[0.2em] text-gray-400">Total facturado</p>
                        <p id="salesSummary" class="mt-3 text-3xl font-bold text-golopy-gold">RD$ 0.00</p>
                    </div>
                    <div class="bg-golopy-cardDark border border-golopy-borderDark rounded-2xl p-4">
                        <p class="text-xs uppercase tracking-[0.2em] text-gray-400">Órdenes</p>
                        <p id="salesCount" class="mt-3 text-3xl font-bold text-white">0 ventas</p>
                    </div>
                    <div class="bg-golopy-cardDark border border-golopy-borderDark rounded-2xl p-4">
                        <p class="text-xs uppercase tracking-[0.2em] text-gray-400">Promedio</p>
                        <p id="salesAverage" class="mt-3 text-3xl font-bold text-white">RD$ 0.00</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
                    <div class="bg-golopy-cardDark border border-golopy-borderDark rounded-2xl overflow-hidden">
                        <div class="border-b border-golopy-borderDark bg-black/10 px-4 py-3">
                            <h3 class="font-bebas text-2xl text-white">Ventas por orden</h3>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full text-left">
                                <thead class="bg-black/20 text-golopy-gold uppercase text-[10px] tracking-[0.2em]">
                                    <tr>
                                        <th class="px-4 py-3">Factura</th>
                                        <th class="px-4 py-3">Cliente</th>
                                        <th class="px-4 py-3">Tipo</th>
                                        <th class="px-4 py-3">Items</th>
                                        <th class="px-4 py-3">Subtotal</th>
                                        <th class="px-4 py-3">Total</th>
                                        <th class="px-4 py-3">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody id="salesTableBody" class="divide-y divide-golopy-borderDark"></tbody>
                            </table>
                        </div>
                    </div>

                    <div class="bg-golopy-cardDark border border-golopy-borderDark rounded-2xl overflow-hidden">
                        <div class="border-b border-golopy-borderDark bg-black/10 px-4 py-3">
                            <h3 class="font-bebas text-2xl text-white">Productos más vendidos</h3>
                        </div>
                        <div id="topSellingProducts" class="space-y-3 p-4"></div>
                    </div>
                </div>
            </div>
        `;
        fetchSalesHistory();
        fetchTopSellingProducts();
        return;
    }

    if (tabName === 'ordenes') {
        const mainPos = document.getElementById('mainPosContainer');
        mainPos.innerHTML = `
            <div class="space-y-5">
                <div class="bg-golopy-cardDark border border-golopy-borderDark rounded-2xl p-5">
                    <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                        <div>
                            <p class="text-xs uppercase tracking-[0.2em] text-golopy-gold font-semibold">Listado de órdenes</p>
                            <h2 class="font-bebas text-3xl text-white mt-1">Órdenes detalladas</h2>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <div class="flex flex-col text-xs text-gray-400">
                                <label for="orderSearch">N° de orden</label>
                                <input id="orderSearch" type="text" placeholder="Buscar ORD-..." class="mt-1 bg-golopy-bgDark border border-golopy-borderDark rounded-lg px-3 py-2 text-white focus:outline-none focus:border-golopy-gold">
                            </div>
                            <div class="flex flex-col text-xs text-gray-400">
                                <label for="orderStartDate">Desde</label>
                                <input id="orderStartDate" type="date" class="mt-1 bg-golopy-bgDark border border-golopy-borderDark rounded-lg px-3 py-2 text-white focus:outline-none focus:border-golopy-gold">
                            </div>
                            <div class="flex flex-col text-xs text-gray-400">
                                <label for="orderEndDate">Hasta</label>
                                <input id="orderEndDate" type="date" class="mt-1 bg-golopy-bgDark border border-golopy-borderDark rounded-lg px-3 py-2 text-white focus:outline-none focus:border-golopy-gold">
                            </div>
                            <div class="flex items-end gap-2">
                                <button onclick="fetchDetailedOrders()" class="bg-golopy-gold hover:bg-golopy-goldHover text-golopy-darkRed font-bold px-4 py-2.5 rounded-xl transition">
                                    Buscar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-golopy-cardDark border border-golopy-borderDark rounded-2xl overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-left">
                            <thead class="bg-black/20 text-golopy-gold uppercase text-[10px] tracking-[0.2em]">
                                <tr>
                                    <th class="px-4 py-3">Factura</th>
                                    <th class="px-4 py-3">Cliente</th>
                                    <th class="px-4 py-3">Tipo</th>
                                    <th class="px-4 py-3">Detalle</th>
                                    <th class="px-4 py-3">Subtotal</th>
                                    <th class="px-4 py-3">Total</th>
                                    <th class="px-4 py-3">Fecha</th>
                                </tr>
                            </thead>
                            <tbody id="ordersTableBody" class="divide-y divide-golopy-borderDark"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        fetchDetailedOrders();
        return;
    }

    if (tabName !== 'pedidos') {
        const mainPos = document.getElementById('mainPosContainer');
        mainPos.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-center p-8 bg-golopy-cardDark/40 rounded-2xl border border-golopy-borderDark">
                <i class="fa-solid fa-screwdriver-wrench text-5xl text-golopy-gold mb-4 animate-bounce"></i>
                <h2 class="font-bebas text-3xl text-white">Módulo de ${tabName.toUpperCase()}</h2>
                <p class="text-sm text-gray-400 max-w-md mt-2">
                    Esta sección de la aplicación está conectada al menú lateral para la gestión del negocio de hamburguesas GOLOPY.
                </p>
                <button onclick="switchTab('pedidos'); renderProducts();" class="mt-6 bg-golopy-gold text-golopy-darkRed font-bold px-6 py-2.5 rounded-xl shadow-lg hover:bg-golopy-goldHover transition">
                    Volver al Punto de Venta (Pedidos)
                </button>
            </div>
        `;
    } else {
        document.getElementById('mainPosContainer').innerHTML = `
            <div class="flex items-center gap-2 overflow-x-auto pb-1">
                <button onclick="setCategory('Todos')" class="category-btn active border border-golopy-gold bg-golopy-gold text-golopy-darkRed font-bold px-5 py-2 rounded-xl text-sm transition whitespace-nowrap shadow-sm">Todos</button>
                <button onclick="setCategory('Hamburguesas')" class="category-btn border border-golopy-borderDark bg-golopy-cardDark hover:border-golopy-gold text-gray-300 font-medium px-5 py-2 rounded-xl text-sm transition whitespace-nowrap"><i class="fa-solid fa-burger mr-1.5"></i> Hamburguesas</button>
                <button onclick="setCategory('Pollo')" class="category-btn border border-golopy-borderDark bg-golopy-cardDark hover:border-golopy-gold text-gray-300 font-medium px-5 py-2 rounded-xl text-sm transition whitespace-nowrap"><i class="fa-solid fa-drumstick-bite mr-1.5"></i> Pollo</button>
                <button onclick="setCategory('Acompañantes')" class="category-btn border border-golopy-borderDark bg-golopy-cardDark hover:border-golopy-gold text-gray-300 font-medium px-5 py-2 rounded-xl text-sm transition whitespace-nowrap"><i class="fa-solid fa-bowl-food mr-1.5"></i> Acompañantes</button>
                <button onclick="setCategory('Bebidas')" class="category-btn border border-golopy-borderDark bg-golopy-cardDark hover:border-golopy-gold text-gray-300 font-medium px-5 py-2 rounded-xl text-sm transition whitespace-nowrap"><i class="fa-solid fa-glass-water mr-1.5"></i> Milkshakes & Bebidas</button>
            </div>
            <div id="productsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"></div>
        `;
        renderProducts();
    }
}

window.onload = async function() {
    await fetchMenu();
    updateClock();
    setInterval(updateClock, 1000);
};
