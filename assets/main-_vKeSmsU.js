import{s as l}from"./supabaseClient-Cyd6nR2Z.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";const i=document.querySelector(".mobile-toggle"),c=document.querySelector(".nav-links");i&&(i.addEventListener("click",()=>{c.classList.toggle("active");const e=i.querySelector("i");c.classList.contains("active")?(e.classList.remove("fa-bars"),e.classList.add("fa-times")):(e.classList.remove("fa-times"),e.classList.add("fa-bars"))}),document.addEventListener("click",e=>{c&&!c.contains(e.target)&&!i.contains(e.target)&&c.classList.contains("active")&&(c.classList.remove("active"),i.querySelector("i").classList.remove("fa-times"),i.querySelector("i").classList.add("fa-bars"))}));window.addEventListener("scroll",()=>{const e=document.querySelector(".navbar");e&&(window.scrollY>50?(e.style.padding="10px 0",e.style.boxShadow="0 2px 10px rgba(0,0,0,0.3)"):(e.style.padding="20px 0",e.style.boxShadow="none"))});async function v(){if(!l){console.warn("Carousel gagal dimuat: Supabase tidak terhubung.");return}try{const{data:e,error:a}=await l.from("carousel").select("*");if(a)throw a;const r=document.getElementById("carousel-container"),t=document.getElementById("carousel-dots");if(!r||!e||e.length===0)return;r.innerHTML=e.map((n,s)=>`
            <div class="slide ${s===0?"active":""}">
                <img src="${n.image}" alt="${n.title}" onerror="this.src='hero-image-v3.png'">
                <div class="slide-content">
                    <h1>${n.title}</h1>
                    <p>${n.subtitle}</p>
                    <a href="#products" class="btn-primary">Lihat Produk</a>
                </div>
            </div>
        `).join(""),t.innerHTML=e.map((n,s)=>`
            <div class="dot ${s===0?"active":""}" data-index="${s}"></div>
        `).join(""),initCarouselLogic()}catch(e){console.error("Error loading carousel:",e)}}async function p(){if(!l){console.warn("Event gagal dimuat: Supabase tidak terhubung.");return}try{const{data:e,error:a}=await l.from("events").select("*").order("title",{ascending:!0});if(a)throw a;const r=document.getElementById("events-container");if(!r)return;if(!e||e.length===0){r.innerHTML='<p style="text-align:center; color:#888;">Belum ada event terbaru.</p>';return}r.innerHTML=e.map(t=>`
            <div class="event-card">
                <div class="event-date">
                    <span class="day">${String(t.event_day).padStart(2,"0")}</span>
                    <span class="month">${t.event_month}</span>
                </div>
                <div class="event-details">
                    <h3>${t.title}</h3>
                    <p>${t.description}</p>
                </div>
            </div>
        `).join("")}catch(e){console.error("Error loading events:",e);const a=document.getElementById("events-container");a&&(a.innerHTML='<p style="text-align:center; color:#888;">Gagal memuat event.</p>')}}const o=document.getElementById("modal-container"),d=document.getElementById("modal-body"),u=document.querySelector(".close-modal"),g=document.querySelectorAll(".product-card");g.forEach(e=>{e.addEventListener("click",async()=>{const a=e.querySelector("h3").innerText;m(a,[],!0);try{const{data:r,error:t}=await l.from("products").select("*").order("name",{ascending:!0});if(t){console.error("Error fetching products:",t),d&&(d.innerHTML="<p>Error loading products.</p>");return}const n=(r||[]).filter(s=>s.category===a);m(a,n)}catch(r){console.error("Error fetching products:",r),d&&(d.innerHTML="<p>Error loading products.</p>")}})});function m(e,a,r=!1){let t=`<h2 class="modal-title">${e}</h2>`;r?t+="<p>Loading products...</p>":a.length===0?t+="<p>Belum ada produk di kategori ini.</p>":(t+='<div class="modal-product-grid">',a.forEach(n=>{t+=`
                <div class="modal-product-card">
                    <div class="modal-product-img">
                        <img src="${n.image}" alt="${n.name}" onerror="this.src='prod-stationery.png'">
                    </div>
                    <div class="modal-product-details">
                        <div class="modal-product-name">${n.name}</div>
                        <div class="modal-product-price">${n.price}</div>
                    </div>
                </div>
            `}),t+="</div>"),d&&(d.innerHTML=t),o&&o.classList.add("active")}u&&u.addEventListener("click",()=>{o.classList.remove("active")});o&&o.addEventListener("click",e=>{e.target===o&&o.classList.remove("active")});document.addEventListener("DOMContentLoaded",()=>{v(),p()});
