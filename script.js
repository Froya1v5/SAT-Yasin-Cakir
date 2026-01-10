// ================================
// Gelişim Copy Center - Script
// ================================

const PHONE = "905465903345"; // ← kendi numaranı yaz (90 ile, boşluk yok)

// Navbar (mobil aç/kapat)
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}

// WhatsApp helper
function openWhatsApp(message) {
  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

// Üst ana WhatsApp butonu
const mainBtn = document.getElementById("whatsappBtn");
if (mainBtn) {
  mainBtn.addEventListener("click", () => {
    const msg =
      "Merhaba Gelişim Copy Center! 👋\n" +
      "Sipariş vermek istiyorum.\n\n" +
      "• Hizmet:\n" +
      "• Sayfa/Adet:\n" +
      "• Renk: (S/B - Renkli)\n" +
      "• Kağıt: (A4 / A3)\n" +
      "• Not:\n\n" +
      "Dosyayı (PDF/fotoğraf) birazdan göndereceğim.";
    openWhatsApp(msg);
  });
}

// Hizmet kartının tamamı tıklanınca
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("click", () => {
    const service = card.getAttribute("data-service") || "Hizmet";
    const msg =
      "Merhaba Gelişim Copy Center! 👋\n" +
      "Hizmet üzerinden sipariş vermek istiyorum.\n\n" +
      `Hizmet: ${service}\n` +
      "• Sayfa/Adet:\n" +
      "• Renk: (S/B - Renkli)\n" +
      "• Kağıt: (A4 / A3)\n" +
      "• Not:\n\n" +
      "Dosyayı (PDF/fotoğraf) birazdan göndereceğim.";
    openWhatsApp(msg);
  });
});

// Kart içi “Hızlı Sipariş” butonu
document.querySelectorAll(".mini-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // Sepete ekle butonları da mini-btn, ayrıştıracağız
    if (btn.classList.contains("add-btn")) return;

    e.stopPropagation();
    const service = btn.getAttribute("data-service") || "Hizmet";
    const msg =
      "Merhaba Gelişim Copy Center! 👋\n" +
      "Hızlı sipariş vermek istiyorum.\n\n" +
      `Hizmet: ${service}\n` +
      "• Sayfa/Adet:\n" +
      "• Renk: (S/B - Renkli)\n" +
      "• Kağıt: (A4 / A3)\n" +
      "• Not:\n\n" +
      "Dosyayı (PDF/fotoğraf) birazdan göndereceğim.";
    openWhatsApp(msg);
  });
});

// Fiyatla Sipariş
document.querySelectorAll(".price-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    const service = btn.getAttribute("data-service") || "Hizmet";
    const price = btn.getAttribute("data-price") || "";

    const msg =
      "Merhaba Gelişim Copy Center! 👋\n" +
      "Fiyat listesinden sipariş vermek istiyorum.\n\n" +
      `Hizmet: ${service}\n` +
      `Fiyat: ${price}\n` +
      "• Adet / Sayfa:\n" +
      "• Renk: (S/B - Renkli)\n" +
      "• Kağıt: (A4 / A3)\n" +
      "• Not:\n\n" +
      "Dosyayı (PDF/fotoğraf) birazdan göndereceğim.";

    openWhatsApp(msg);
  });
});

// ================================
// Mini Sepet (LocalStorage)
// ================================
const cartModal = document.getElementById("cartModal");
const cartItemsEl = document.getElementById("cartItems");
const openCartBtn = document.getElementById("navCartBtn");
const closeCartBtn = document.getElementById("closeCart");
const clearCartBtn = document.getElementById("clearCart");
const sendCartBtn = document.getElementById("sendCart");

function loadCart() {
  try { return JSON.parse(localStorage.getItem("gcc_cart") || "[]"); }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem("gcc_cart", JSON.stringify(cart));
}
function addToCart(name, price) {
  const cart = loadCart();
  const existing = cart.find(i => i.name === name && i.price === price);
  if (existing) existing.qty += 1;
  else cart.push({ name, price, qty: 1 });
  saveCart(cart);
  renderCart();
}
function updateQty(index, delta) {
  const cart = loadCart();
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}
function clearCart() {
  saveCart([]);
  renderCart();
}

function renderCart() {
  if (!cartItemsEl) return;
  const cart = loadCart();
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<div class="small" style="opacity:.85;">Sepet boş.</div>`;
    return;
    }

  cart.forEach((item, idx) => {
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <div>
        <b>${item.name}</b>
        <div class="small">${item.price || ""}</div>
      </div>
      <div class="qty">
        <button type="button" data-act="dec" data-i="${idx}">-</button>
        <span>${item.qty}</span>
        <button type="button" data-act="inc" data-i="${idx}">+</button>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  cartItemsEl.querySelectorAll("button[data-act]").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.getAttribute("data-i"));
      const act = btn.getAttribute("data-act");
      updateQty(i, act === "inc" ? 1 : -1);
    });
  });
}

function openCart() {
  if (!cartModal) return;
  cartModal.classList.add("show");
  cartModal.setAttribute("aria-hidden", "false");
  renderCart();
}
function closeCart() {
  if (!cartModal) return;
  cartModal.classList.remove("show");
  cartModal.setAttribute("aria-hidden", "true");
}

if (openCartBtn) openCartBtn.addEventListener("click", openCart);
if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
if (cartModal) {
  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) closeCart();
  });
}
if (clearCartBtn) clearCartBtn.addEventListener("click", clearCart);

document.querySelectorAll(".add-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const name = btn.getAttribute("data-item") || "Ürün/Hizmet";
    const price = btn.getAttribute("data-price") || "";
    addToCart(name, price);
    openCart();
  });
});

if (sendCartBtn) {
  sendCartBtn.addEventListener("click", () => {
    const cart = loadCart();
    if (cart.length === 0) return;

    const lines = cart.map(i => `- ${i.name} (${i.qty}) ${i.price ? " | " + i.price : ""}`).join("\n");
    const msg =
      "Merhaba Gelişim Copy Center! 👋\n" +
      "Sepet üzerinden sipariş vermek istiyorum:\n\n" +
      lines +
      "\n\n• Not:\n" +
      "• Dosya (PDF/fotoğraf) birazdan göndereceğim.";

    openWhatsApp(msg);
  });
}

// İlk çizim
renderCart();
