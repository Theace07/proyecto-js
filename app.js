(() => {
  const PRODUCTS = [
    {
      id: "p1",
      title: "Tenis Deportivo",
      price: 12.99,
      img: "https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dw81126292/images/hi-res/Todo/tenis-sport-para-hombre-60720101-75668_2.jpg?sw=800&sh=960",
      desc: "Tenis comodos para correr y entrenar",
      color: "red",
    },
    {
      id: "p2",
      title: "Botas de Montaña",
      price: 24.5,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE9WuPv4vEeNKOU7LIYFVIedusuU-w4DdnNA&s",
      desc: "Botas para todo tipo de terreno",
      color: "blue",
    },
    {
      id: "p3",
      title: "Sandalias Casual",
      price: 7.75,
      img: "https://img.kwcdn.com/product/fancy/f2ba7617-2ce9-494c-b8bf-b81173a18b25.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp",
      desc: "Sandalias ligeras para uso diario",
      color: "green",
    },
  ];

  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));
  const productList = qs("#product-list");
  const cartItemsEl = qs("#cart-items");
  const cartTotalEl = qs("#cart-total");
  const cartCountEl = qs("#cart-count");
  const btnClear = qs("#btn-clear-cart");
  const btnCheckout = qs("#btn-checkout");
  const btnViewCart = qs("#btn-view-cart");
  const cartAside = qs("#cart");

  let cart = loadCart();

  function formatPrice(n) {
    return n.toLocaleString("es-CO", { style: "currency", currency: "COP" });
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return console.log(error);
    }
  }
  function renderProducts() {
    productList.innerHTML = "";
    PRODUCTS.forEach((product) => {
      const el = document.createElement("article");
      el.className = "card";
      el.dataset.id = product.id;
      el.innerHTML = `
        <img src="${product.img}" alt="${product.title}">
        <h4>${product.title}</h4>
        <div class="small">${product.desc}</div>
        <div class="price-row">
          <div class="price">${formatPrice(product.price)}</div>
          <div class="card-actions">
            <input type="number" min="1" value="1" class="qty" aria-label="cantidad">
          <button class="btn add-to-cart" style="background-color: ${product.color};" data-id="${product.id}">Agregar</button>
          </div>
        </div>
      `;
      productList.appendChild(el);
    });
    // listeners
    qsa(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = btn.dataset.id;
        const card = btn.closest(".card");
        const qtyInput = card.querySelector(".qty");
        const qty = Math.max(1, parseInt(qtyInput.value || "1", 10));
        addToCart(id, qty);
      });
    });
  }
  function addToCart(id, qty = 1) {
    const product = PRODUCTS.find((x) => x.id === id);
    if (!product) return;
    if (!cart[id]) {
      cart[id] = {
        id: product.id,
        title: product.title,
        price: product.price,
        qty:0,
        img: product.img,
      };
    }
    cart[id].qty += qty;
    saveCart();
    renderCart();
  }

  function removeFromCart(id) {
    delete cart[id];
    saveCart();
    renderCart();
  }

  function updateQty(id, qty) {
    qty = Math.max(0, parseInt(qty || "0", 10));
    if (qty === 0) {
      removeFromCart(id);
      return;
    }
    if (cart[id]) {
      cart[id].qty = qty;
      saveCart();
      renderCart();
    }
  }

  function clearCart() {
    cart = {};
    saveCart();
    renderCart();
  }

  function cartTotals() {
    const items = Object.values(cart);
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    return { count, total };
  }

  function renderCart() {
    const items = Object.values(cart);
    cartItemsEl.innerHTML = "";
    if (items.length === 0) {
      cartItemsEl.innerHTML = '<div class="empty">El carrito está vacío</div>';
    } else {
      items.forEach((item) => {
        const node = document.createElement("div");
        node.className = "cart-item";
        node.innerHTML = `
          <img src="${item.img}" alt="${item.title}">
          <div class="meta">
            <b>${item.title}</b>
            <div class="small">${formatPrice(item.price)} x ${
          item.qty
        } = ${formatPrice(item.price * item.qty)}</div>
          </div>
          <div class="controls">
            <button class="btn btn-decr" data-id="${item.id}">-</button>
            <input type="number" min="1" value="${item.qty}" data-id="${
          item.id
        }" class="cart-qty" style="width:56px;padding:6px;border-radius:6px;border:1px solid #dfe6f2;">
            <button class="btn btn-incr" data-id="${item.id}">+</button>
            <button class="btn secondary btn-remove" data-id="${
              item.id
            }">x</button>
          </div>
        `;
        cartItemsEl.appendChild(node);
      });

      // add listeners for controls
      qsa(".btn-decr").forEach((b) =>
        b.addEventListener("click", () => {
          const id = b.dataset.id;
          updateQty(id, (cart[id].qty || 1) - 1);
        })
      );
      qsa(".btn-incr").forEach((b) =>
        b.addEventListener("click", () => {
          const id = b.dataset.id;
          updateQty(id, (cart[id].qty || 0) + 1);
        })
      );
      qsa(".btn-remove").forEach((b) =>
        b.addEventListener("click", () => {
          removeFromCart(b.dataset.id);
        })
      );
      qsa(".cart-qty").forEach((input) => {
        input.addEventListener("change", (e) => {
          const id = input.dataset.id;
          updateQty(id, input.value);
        });
      });
    }

    const totals = cartTotals();
    cartTotalEl.textContent = formatPrice(totals.total);
    cartCountEl.textContent = totals.count;
  }

  // inicialización
  renderProducts();
  renderCart();

  // botones globales
  btnClear.addEventListener("click", () => {
    if (confirm("¿Vaciar el carrito?")) clearCart();
  });

  btnCheckout.addEventListener("click", () => {
    const totals = cartTotals();
    if (totals.count === 0) {
      alert("El carrito está vacío.");
      return;
    }
    // Simulación de checkout
    alert(
      `Checkout simulado:\nArtículos: ${totals.count}\nTotal: ${formatPrice(
        totals.total
      )}`
    );
    // opcionalmente vaciar carrito después de pagar:
    clearCart();
  });

  btnViewCart.addEventListener("click", () => {
    // en pantallas pequeñas permite alternar visibilidad
    cartAside.scrollIntoView({ behavior: "smooth" });
  });

  // Exponer algunas funciones para depuración
  window._cart = cart;
})();
