const products = [
{ id: “set”, name: “Bamboo Utensil Set with Holder”, price: 299, img: “bamboo-set-1.png” },
{ id: “detail”, name: “Bamboo Utensils — Full Set View”, price: 299, img: “bamboo-set-2.png” }
];

let cart = [];
const money = n => new Intl.NumberFormat(“en-IN”, {
style: “currency”,
currency: “INR”,
maximumFractionDigits: 0
}).format(n);

const drawer = document.querySelector(”#drawer”);
const shade = document.querySelector(”#shade”);
const orderModal = document.querySelector(”#order-modal”);

function render() {
const count = cart.reduce((s, i) => s + i.qty, 0);
document.querySelector(”#count”).textContent = count;
document.querySelector(”#cart-count”).textContent = (${count});
document.querySelector(”#total”).textContent =
money(cart.reduce((s, i) => s + i.qty * i.price, 0));

document.querySelector(”#items”).innerHTML = cart.length
? cart.map(i =>  <div class="item"> <img src="${i.img}" alt=""> <div> <h4>${i.name}</h4> <small>${money(i.price)} each</small> <div class="qty"> <button data-qty="${i.id}" data-step="-1">−</button> <span>${i.qty}</span> <button data-qty="${i.id}" data-step="1">+</button> </div> </div> <b>${money(i.price * i.qty)}</b> </div>).join(””)
: <p class="empty">Your cart is empty for now.</p>;
}

function toast(message) {
const el = document.querySelector(”#toast”);
el.textContent = message;
el.classList.add(“show”);
setTimeout(() => el.classList.remove(“show”), 2000);
}

function openCart() {
drawer.classList.add(“open”);
shade.classList.add(“visible”);
drawer.setAttribute(“aria-hidden”, “false”);
}

function closeCart() {
drawer.classList.remove(“open”);
shade.classList.remove(“visible”);
drawer.setAttribute(“aria-hidden”, “true”);
}

document.querySelectorAll(”[data-product]”).forEach(btn => {
btn.addEventListener(“click”, () => {
const product = products.find(p => p.id === btn.dataset.product);
if (!product) return;
const found = cart.find(i => i.id === product.id);
if (found) found.qty++;
else cart.push({ …product, qty: 1 });
render();
toast(“Added to your K-METRO cart”);
});
});

document.querySelector(”#open-cart”).addEventListener(“click”, openCart);
document.querySelector(”#close-cart”).addEventListener(“click”, closeCart);
shade.addEventListener(“click”, closeCart);

document.querySelector(”#items”).addEventListener(“click”, e => {
const btn = e.target.closest(”[data-qty]”);
if (!btn) return;
const item = cart.find(i => i.id === btn.dataset.qty);
if (!item) return;
item.qty += Number(btn.dataset.step);
if (item.qty < 1) cart = cart.filter(i => i.id !== btn.dataset.qty);
render();
});

function cartSummary() {
return cart.map(i =>
${i.name} x ${i.qty} = ${money(i.price * i.qty)}
).join(”\n”) +
\nSubtotal: ${money(cart.reduce((s, i) => s + i.qty * i.price, 0))};
}

function showOrder() {
if (!cart.length) {
toast(“Please add a product first”);
return;
}
document.querySelector(”#order-summary”).textContent = cartSummary();
document.querySelector(”#form-summary”).value = cartSummary();
orderModal.classList.add(“visible”);
orderModal.setAttribute(“aria-hidden”, “false”);
}

function hideOrder() {
orderModal.classList.remove(“visible”);
orderModal.setAttribute(“aria-hidden”, “true”);
}

document.querySelector(”#order”).addEventListener(“click”, showOrder);
document.querySelector(”#close-order”).addEventListener(“click”, hideOrder);
orderModal.addEventListener(“click”, e => {
if (e.target === orderModal) hideOrder();
});

document.querySelector(”#pay-upi”).addEventListener(“click”, () => {
if (!cart.length) {
toast(“Please add a product first”);
return;
}
const amount = cart.reduce((s, i) => s + i.qty * i.price, 0);
const uri = upi://pay?pa=Q224901121%40ybl&pn=K-METRO&am=${amount}&cu=INR&tn=${encodeURIComponent("K-METRO bamboo utensils order")};
window.location.href = uri;
});

document.querySelector(”#order-form”).addEventListener(“submit”, () => {
document.querySelector(”#form-summary”).value =
cartSummary() + “\nPayment choice: “ +
document.querySelector(”#payment-method”).value;
});

document.querySelector(”#year”).textContent = new Date().getFullYear();
render();
