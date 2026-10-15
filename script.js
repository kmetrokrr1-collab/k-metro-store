const products=[
{id:"set",name:"Bamboo Utensil Set with Holder",price:299,img:"bamboo-set-1.png"},
{id:"detail",name:"Bamboo Utensils — Full Set View",price:299,img:"bamboo-set-2.png"}
];
let cart=[];
const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const drawer=document.querySelector("#drawer"),shade=document.querySelector("#shade");
function render(){
 const count=cart.reduce((s,i)=>s+i.qty,0);
 document.querySelector("#count").textContent=count;
 document.querySelector("#cart-count").textContent=`(${count})`;
 document.querySelector("#total").textContent=money(cart.reduce((s,i)=>s+i.qty*i.price,0));
 document.querySelector("#items").innerHTML=cart.length?cart.map(i=>`<div class="item"><img src="${i.img}" alt=""><div><h4>${i.name}</h4><small>${money(i.price)} each</small><div class="qty"><button data-qty="${i.id}" data-step="-1">−</button><span>${i.qty}</span><button data-qty="${i.id}" data-step="1">+</button></div></div><b>${money(i.price*i.qty)}</b></div>`).join(""):`<p class="empty">Your cart is empty for now.</p>`;
}
function toast(s){const el=document.querySelector("#toast");el.textContent=s;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2000)}
function open(){drawer.classList.add("open");shade.classList.add("visible");drawer.setAttribute("aria-hidden","false")}
function close(){drawer.classList.remove("open");shade.classList.remove("visible");drawer.setAttribute("aria-hidden","true")}
document.querySelectorAll("[data-product]").forEach(btn=>btn.addEventListener("click",()=>{const p=products.find(p=>p.id===btn.dataset.product),found=cart.find(i=>i.id===p.id);found?found.qty++:cart.push({...p,qty:1});render();toast("Added to your K-METRO cart")}));
document.querySelector("#open-cart").addEventListener("click",open);
document.querySelector("#close-cart").addEventListener("click",close);
shade.addEventListener("click",close);
document.querySelector("#items").addEventListener("click",e=>{const b=e.target.closest("[data-qty]");if(!b)return;const i=cart.find(i=>i.id===b.dataset.qty);i.qty+=Number(b.dataset.step);if(i.qty<1)cart=cart.filter(i=>i.id!==b.dataset.qty);render()});
document.querySelector("#order").addEventListener("click",()=>{if(!cart.length){toast("Please add a product first");return}const lines=cart.map(i=>`${i.name} x ${i.qty} = ${money(i.price*i.qty)}`).join("\n");alert("K-METRO order inquiry demo\n\n"+lines+"\nSubtotal: "+money(cart.reduce((s,i)=>s+i.qty*i.price,0))+"\n\nThis is not a real order. Add your business WhatsApp/contact and a secure payment/checkout solution before launch.")});
document.querySelector("#year").textContent=new Date().getFullYear();render();