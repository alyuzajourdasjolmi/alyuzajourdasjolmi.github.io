import{s as m}from"./supabaseClient-Q9RsP7pu.js";const c=document.querySelector(".mobile-toggle"),d=document.querySelector(".nav-links");c&&(c.addEventListener("click",()=>{d.classList.toggle("active");const e=c.querySelector("i");d.classList.contains("active")?(e.classList.remove("fa-bars"),e.classList.add("fa-times")):(e.classList.remove("fa-times"),e.classList.add("fa-bars"))}),document.addEventListener("click",e=>{d&&!d.contains(e.target)&&!c.contains(e.target)&&d.classList.contains("active")&&(d.classList.remove("active"),c.querySelector("i").classList.remove("fa-times"),c.querySelector("i").classList.add("fa-bars"))}));window.addEventListener("scroll",()=>{const e=document.querySelector(".navbar");e&&(window.scrollY>50?(e.style.padding="10px 0",e.style.boxShadow="0 2px 10px rgba(0,0,0,0.3)"):(e.style.padding="20px 0",e.style.boxShadow="none"))});async function S(){const{data:e,error:r}=await m.from("carousel").select("*");if(r){console.error("Error loading carousel:",r);return}const o=document.getElementById("carousel-container"),n=document.getElementById("carousel-dots");!o||!e||e.length===0||(o.innerHTML=e.map((t,s)=>`
        <div class="slide ${s===0?"active":""}">
            <img src="${t.image}" alt="${t.title}" onerror="this.src='hero-image-v3.png'">
            <div class="slide-content">
                <h1>${t.title}</h1>
                <p>${t.subtitle}</p>
                <a href="#products" class="btn-primary">Lihat Produk</a>
            </div>
        </div>
    `).join(""),n.innerHTML=e.map((t,s)=>`
        <div class="dot ${s===0?"active":""}" data-index="${s}"></div>
    `).join(""),b())}function b(){const e=document.querySelectorAll(".slide"),r=document.querySelectorAll(".dot"),o=document.querySelector(".next"),n=document.querySelector(".prev");let t=0;const s=e.length;let p;function h(){r.forEach(i=>i.classList.remove("active")),r[t]&&r[t].classList.add("active")}function u(i){e[t].classList.remove("active"),t=(i+s)%s,e[t].classList.add("active"),h()}function f(){u(t+1)}function E(){u(t-1)}o&&o.addEventListener("click",()=>{f(),v()}),n&&n.addEventListener("click",()=>{E(),v()}),r.forEach(i=>{i.addEventListener("click",()=>{u(parseInt(i.getAttribute("data-index"))),v()})});function g(){p=setInterval(f,5e3)}function v(){clearInterval(p),g()}g()}async function $(){const{data:e,error:r}=await m.from("events").select("*").order("title",{ascending:!0});if(r){console.error("Error loading events:",r);return}const o=document.getElementById("events-container");if(o){if(!e||e.length===0){o.innerHTML='<p style="text-align:center; color:#888;">Belum ada event terbaru.</p>';return}o.innerHTML=e.map(n=>`
        <div class="event-card">
            <div class="event-date">
                <span class="day">${String(n.event_day).padStart(2,"0")}</span>
                <span class="month">${n.event_month}</span>
            </div>
            <div class="event-details">
                <h3>${n.title}</h3>
                <p>${n.description}</p>
            </div>
        </div>
    `).join("")}}const a=document.getElementById("modal-container"),l=document.getElementById("modal-body"),L=document.querySelector(".close-modal"),k=document.querySelectorAll(".product-card");k.forEach(e=>{e.addEventListener("click",async()=>{const r=e.querySelector("h3").innerText;y(r,[],!0);try{const{data:o,error:n}=await m.from("products").select("*").order("name",{ascending:!0});if(n){console.error("Error fetching products:",n),l&&(l.innerHTML="<p>Error loading products.</p>");return}const t=(o||[]).filter(s=>s.category===r);y(r,t)}catch(o){console.error("Error fetching products:",o),l&&(l.innerHTML="<p>Error loading products.</p>")}})});function y(e,r,o=!1){let n=`<h2 class="modal-title">${e}</h2>`;o?n+="<p>Loading products...</p>":r.length===0?n+="<p>Belum ada produk di kategori ini.</p>":(n+='<div class="modal-product-grid">',r.forEach(t=>{n+=`
                <div class="modal-product-card">
                    <div class="modal-product-img">
                        <img src="${t.image}" alt="${t.name}" onerror="this.src='prod-stationery.png'">
                    </div>
                    <div class="modal-product-details">
                        <div class="modal-product-name">${t.name}</div>
                        <div class="modal-product-price">${t.price}</div>
                    </div>
                </div>
            `}),n+="</div>"),l&&(l.innerHTML=n),a&&a.classList.add("active")}L&&L.addEventListener("click",()=>{a.classList.remove("active")});a&&a.addEventListener("click",e=>{e.target===a&&a.classList.remove("active")});document.addEventListener("DOMContentLoaded",()=>{S(),$()});
