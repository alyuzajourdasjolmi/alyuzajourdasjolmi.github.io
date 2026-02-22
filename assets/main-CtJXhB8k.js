import{s as d}from"./supabaseClient-CPmqgG4O.js";const w=[{title:"HIJRAH TOKO",subtitle:"Warung ATK dan frozen food terlengkap untuk kebutuhan harian Anda.",image:"hero-image-v3.png"}],l=document.querySelector(".mobile-toggle"),c=document.querySelector(".nav-links");l&&(l.addEventListener("click",()=>{c.classList.toggle("active");const e=l.querySelector("i");c.classList.contains("active")?(e.classList.remove("fa-bars"),e.classList.add("fa-times")):(e.classList.remove("fa-times"),e.classList.add("fa-bars"))}),document.addEventListener("click",e=>{c&&!c.contains(e.target)&&!l.contains(e.target)&&c.classList.contains("active")&&(c.classList.remove("active"),l.querySelector("i").classList.remove("fa-times"),l.querySelector("i").classList.add("fa-bars"))}));window.addEventListener("scroll",()=>{const e=document.querySelector(".navbar");e&&(window.scrollY>50?(e.style.padding="10px 0",e.style.boxShadow="0 2px 10px rgba(0,0,0,0.3)"):(e.style.padding="20px 0",e.style.boxShadow="none"))});function E(e){const t=document.getElementById("carousel-container"),r=document.getElementById("carousel-dots");!t||!r||(t.innerHTML=e.map((a,n)=>`
        <div class="slide ${n===0?"active":""}">
            <img src="${a.image}" alt="${a.title}" onerror="this.src='hero-image-v3.png'">
            <div class="slide-content">
                <h1>${a.title}</h1>
                <p>${a.subtitle}</p>
                <a href="#products" class="btn-primary">Lihat Produk</a>
            </div>
        </div>
    `).join(""),r.innerHTML=e.map((a,n)=>`
        <div class="dot ${n===0?"active":""}" data-index="${n}"></div>
    `).join(""),q())}function y(e){console.info(e),E(w)}function q(){const e=Array.from(document.querySelectorAll(".slide")),t=Array.from(document.querySelectorAll(".dot")),r=document.querySelector(".carousel-btn.prev"),a=document.querySelector(".carousel-btn.next"),n=document.querySelector(".hero-carousel");if(!e.length)return;let o=0,f=null;const v=s=>{e.forEach((m,h)=>m.classList.toggle("active",h===s)),t.forEach((m,h)=>m.classList.toggle("active",h===s)),o=s},k=()=>{const s=(o+1)%e.length;v(s)},$=()=>{const s=(o-1+e.length)%e.length;v(s)},L=()=>{f&&(clearInterval(f),f=null)},u=()=>{e.length<=1||(L(),f=setInterval(k,5e3))};r&&(r.style.display=e.length>1?"flex":"none",r.onclick=()=>{$(),u()}),a&&(a.style.display=e.length>1?"flex":"none",a.onclick=()=>{k(),u()}),t.forEach((s,m)=>{s.onclick=()=>{v(m),u()}}),n&&(n.onmouseenter=L,n.onmouseleave=u),v(0),u()}function b(e){const t=document.getElementById("events-container");t&&(t.innerHTML=`<p style="text-align:center; color:#888;">${e}</p>`)}async function x(){if(!d){console.warn("Carousel memakai fallback: Supabase tidak terhubung."),y("Carousel menampilkan tampilan default karena koneksi database belum aktif.");return}try{const{data:e,error:t}=await d.from("carousel").select("*");if(t)throw t;if(!e||e.length===0){y("Belum ada data carousel di database, menampilkan tampilan default.");return}E(e)}catch(e){console.error("Error loading carousel:",e),y("Gagal memuat carousel dari database, menampilkan tampilan default.")}}async function C(){if(!d){console.warn("Event memakai fallback: Supabase tidak terhubung."),b("Event sementara tidak tersedia. Pastikan aplikasi berjalan lewat Vite atau deployment sudah benar.");return}try{const{data:e,error:t}=await d.from("events").select("*").order("title",{ascending:!0});if(t)throw t;if(!e||e.length===0){b("Belum ada event terbaru.");return}const r=document.getElementById("events-container");if(!r)return;r.innerHTML=e.map(a=>`
            <div class="event-card">
                <div class="event-date">
                    <span class="day">${String(a.event_day).padStart(2,"0")}</span>
                    <span class="month">${a.event_month}</span>
                </div>
                <div class="event-details">
                    <h3>${a.title}</h3>
                    <p>${a.description}</p>
                </div>
            </div>
        `).join("")}catch(e){console.error("Error loading events:",e),b("Gagal memuat event. Coba lagi dalam beberapa saat.")}}const i=document.getElementById("modal-container"),g=document.getElementById("modal-body"),S=document.querySelector(".close-modal"),A=document.querySelectorAll(".product-card");A.forEach(e=>{e.addEventListener("click",async()=>{const t=e.querySelector("h3").innerText;if(p(t,[],!0),!d){p(t,[],!1,"Produk belum tersedia karena koneksi database belum aktif.");return}try{const{data:r,error:a}=await d.from("products").select("*").order("name",{ascending:!0});if(a){console.error("Error fetching products:",a),g&&(g.innerHTML="<p>Error loading products.</p>");return}const n=(r||[]).filter(o=>o.category===t);p(t,n)}catch(r){console.error("Error fetching products:",r),p(t,[],!1,"Gagal memuat produk. Coba lagi beberapa saat.")}})});function p(e,t,r=!1,a="Belum ada produk di kategori ini."){let n=`<h2 class="modal-title">${e}</h2>`;r?n+="<p>Loading products...</p>":t.length===0?n+=`<p>${a}</p>`:(n+='<div class="modal-product-grid">',t.forEach(o=>{n+=`
                <div class="modal-product-card">
                    <div class="modal-product-img">
                        <img src="${o.image}" alt="${o.name}" onerror="this.src='prod-stationery.png'">
                    </div>
                    <div class="modal-product-details">
                        <div class="modal-product-name">${o.name}</div>
                        <div class="modal-product-price">${o.price}</div>
                    </div>
                </div>
            `}),n+="</div>"),g&&(g.innerHTML=n),i&&i.classList.add("active")}S&&S.addEventListener("click",()=>{i.classList.remove("active")});i&&i.addEventListener("click",e=>{e.target===i&&i.classList.remove("active")});document.addEventListener("DOMContentLoaded",()=>{x(),C()});
