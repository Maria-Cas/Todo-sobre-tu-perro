(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(e){if(e.ep)return;e.ep=!0;const r=n(e);fetch(e.href,r)}})();console.log("Iniciando carga de razas.js");const t={"retriever-labrador":"labrador","shepherd-german":"german","retriever-golden":"golden",bulldog:"bulldog",poodle:"poodle",beagle:"beagle",husky:"husky",rottweiler:"rottweiler",boxer:"boxer",chihuahua:"chihuahua",doberman:"doberman",corgi:"corgi"};console.log("razasMapping cargado:",t);const c={labrador:{nombre:"Labrador Retriever",origen:"Canadá",descripcion:"El Labrador Retriever es una de las razas más populares del mundo. Son perros amigables, activos y excelentes con los niños.",infoOrigen:"Originalmente criados para ayudar a los pescadores, estos perros son excelentes nadadores y tienen un pelaje resistente al agua.",esperanzaVida:"10-12 años"},german:{nombre:"Pastor Alemán",origen:"Alemania",descripcion:"El Pastor Alemán es conocido por su inteligencia, lealtad y capacidad de trabajo. Son excelentes perros de servicio y familia.",infoOrigen:"Desarrollados originalmente como perros pastores, hoy en día son utilizados en múltiples roles, incluyendo policía y rescate.",esperanzaVida:"9-13 años"},golden:{nombre:"Golden Retriever",origen:"Escocia",descripcion:"El Golden Retriever es conocido por su personalidad amigable y su hermoso pelaje dorado. Son excelentes perros de familia.",infoOrigen:"Fueron criados originalmente para la recuperación de presas en la caza, especialmente en el agua.",esperanzaVida:"10-12 años"},bulldog:{nombre:"Bulldog Inglés",origen:"Inglaterra",descripcion:"El Bulldog es un perro tranquilo y amigable, conocido por su apariencia distintiva y su naturaleza dócil.",infoOrigen:"Originalmente criados para la lucha con toros, hoy en día son perros de compañía pacíficos y cariñosos.",esperanzaVida:"8-10 años"},poodle:{nombre:"Caniche",origen:"Francia",descripcion:"El Caniche es una de las razas más inteligentes. Son activos, elegantes y vienen en diferentes tamaños.",infoOrigen:"Aunque se asocian con la elegancia francesa, originalmente fueron perros de caza de agua.",esperanzaVida:"12-15 años"},beagle:{nombre:"Beagle",origen:"Inglaterra",descripcion:"Los Beagles son perros alegres y curiosos, conocidos por su excelente sentido del olfato y su naturaleza amigable.",infoOrigen:"Fueron criados para la caza de conejos y otras presas pequeñas en jauría.",esperanzaVida:"12-15 años"},husky:{nombre:"Husky Siberiano",origen:"Siberia",descripcion:"El Husky Siberiano es un perro de trabajo resistente, conocido por su pelaje denso y su personalidad amigable.",infoOrigen:"Desarrollados por el pueblo Chukchi para el trineo y la compañía en el frío clima siberiano.",esperanzaVida:"12-14 años"},rottweiler:{nombre:"Rottweiler",origen:"Alemania",descripcion:"El Rottweiler es un perro fuerte y leal, excelente como guardián y compañero de familia.",infoOrigen:"Originalmente utilizados para arrear ganado y tirar de carretas de carniceros en la ciudad de Rottweil.",esperanzaVida:"8-10 años"},boxer:{nombre:"Boxer",origen:"Alemania",descripcion:"El Boxer es un perro juguetón y energético, excelente con los niños y muy protector con su familia.",infoOrigen:"Descendiente del extinto Bullenbeisser, fue desarrollado en Alemania a finales del siglo XIX.",esperanzaVida:"10-12 años"},chihuahua:{nombre:"Chihuahua",origen:"México",descripcion:"El Chihuahua es el perro más pequeño del mundo, conocido por su personalidad valiente y su lealtad.",infoOrigen:"Originario del estado de Chihuahua, México, tiene una historia que se remonta a los perros precolombinos.",esperanzaVida:"12-20 años"},doberman:{nombre:"Doberman",origen:"Alemania",descripcion:"El Doberman es un perro elegante y atlético, conocido por su inteligencia y lealtad.",infoOrigen:"Creado por Karl Friedrich Louis Dobermann, quien buscaba un perro de protección personal.",esperanzaVida:"10-13 años"},corgi:{nombre:"Corgi Galés de Pembroke",origen:"Gales",descripcion:"El Corgi es un perro pequeño pero robusto, conocido por su personalidad alegre y su inteligencia.",infoOrigen:"Originalmente criado para pastorear ganado en Gales, es famoso por ser la raza favorita de la Reina Isabel II.",esperanzaVida:"12-14 años"}};console.log("infoRazas cargado:",c);console.log("razasMapping loaded:",t);console.log("infoRazas loaded:",c);const d=a=>{console.log("Buscando info para raza:",a),console.log("razasMapping[raza]:",t[a]);const o=c[t[a]]||c[a];return console.log("Info encontrada:",o),o||{nombre:a.split("-").map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(" "),origen:"Origen desconocido",descripcion:"Información no disponible para esta raza",infoOrigen:"No tenemos información detallada sobre el origen de esta raza",esperanzaVida:"No disponible"}},u="https://dog.ceo/api";async function l(a){try{const o=await fetch(`${u}${a}`);if(!o.ok)throw new Error(`HTTP error! status: ${o.status}`);return await o.json()}catch(o){throw console.error("Error fetching data:",o),o}}async function m(){try{const{message:a}=await l("/breeds/image/random");document.querySelector("#app").innerHTML=`
      <div class="header">
        <h1>🐕 Todo sobre tu perro</h1>
      </div>
      <div class="contenedor">
        <nav>
          <a href="#/" class="nav-link">Inicio</a> |
          <a href="#/razas" class="nav-link">Lista de Razas</a>
        </nav>
        <div class="pagina-inicio">
          <div class="hero-section">
            <div class="hero-content">
              <h1>Descubre el Mundo de los Perros</h1>
              <p>Explora diferentes razas y aprende todo sobre estos maravillosos compañeros</p>
              <a href="#/razas" class="boton-principal">Ver Razas</a>
            </div>
            <div class="hero-imagen">
              <img src="${a}" alt="Perro aleatorio" class="imagen-hero"
                   onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
            </div>
          </div>
        </div>
      </div>
    `,document.querySelectorAll(".nav-link, .boton-principal").forEach(o=>{o.addEventListener("click",n=>{n.preventDefault(),window.location.hash=o.getAttribute("href")})})}catch(a){console.error("Error rendering home:",a),p()}}async function h(){try{const{message:a}=await l("/breeds/list/all");console.log("Razas obtenidas:",a);const o=Object.keys(a).map(async e=>{try{const{message:r}=await l(`/breed/${e}/images/random`),i=d(e);return console.log("Info de raza:",e,i),{nombre:i.nombre,imagen:r,raza:e}}catch(r){return console.error("Error loading breed:",e,r),{nombre:d(e).nombre,imagen:"https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg",raza:e}}}),n=await Promise.all(o);console.log("Razas con imágenes:",n);const s=n.map(({nombre:e,imagen:r,raza:i})=>`
          <a href="#/raza/${i}" class="tarjeta">
            <img src="${r}" alt="${e}" class="imagen" 
                 onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
            <div class="contenido">
              <h3>${e}</h3>
            </div>
          </a>
        `).join("");document.querySelector("#app").innerHTML=`
      <div class="header">
        <h1>🐕 Todo sobre tu perro</h1>
      </div>
      <div class="contenedor">
        <nav>
          <a href="#/" class="nav-link">Inicio</a> |
          <a href="#/razas" class="nav-link">Lista de Razas</a>
        </nav>
        <div class="cuadricula">
          ${s}
        </div>
      </div>
    `,document.querySelectorAll(".nav-link, .tarjeta").forEach(e=>{e.addEventListener("click",r=>{r.preventDefault(),window.location.hash=e.getAttribute("href")})})}catch(a){console.error("Error rendering breeds:",a),p()}}async function f(a){try{const{message:o}=await l(`/breed/${a}/images`),n=d(a),s=o[0]||"https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg",e=o.slice(1,4).filter(r=>r);document.querySelector("#app").innerHTML=`
      <div class="header">
        <h1>🐕 Todo sobre tu perro</h1>
      </div>
      <div class="contenedor">
        <nav>
          <a href="#/" class="nav-link">Inicio</a> |
          <a href="#/razas" class="nav-link">Lista de Razas</a>
        </nav>
        <div class="detalle-raza">
          <h1>${n.nombre}</h1>
          <div class="info-principal">
            <div class="imagen-contenedor">
              <img src="${s}" alt="${n.nombre}" class="imagen-principal"
                   onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
            </div>
            <div class="info-contenido">
              <div class="info-item">
                <h3>Origen:</h3>
                <p>${n.origen}</p>
              </div>
              <div class="info-item">
                <h3>Descripción:</h3>
                <p>${n.descripcion}</p>
              </div>
              <div class="info-item">
                <h3>Historia:</h3>
                <p>${n.infoOrigen}</p>
              </div>
              <div class="info-item">
                <h3>Esperanza de vida:</h3>
                <p>${n.esperanzaVida}</p>
              </div>
            </div>
          </div>
          ${e.length>0?`
            <h2>Más fotos</h2>
            <div class="galeria-imagenes">
              ${e.map(r=>`
                <div class="imagen-contenedor">
                  <img src="${r}" alt="${n.nombre}" class="imagen-galeria"
                       onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
                </div>
              `).join("")}
            </div>
          `:""}
        </div>
      </div>
    `,document.querySelectorAll(".nav-link").forEach(r=>{r.addEventListener("click",i=>{i.preventDefault(),window.location.hash=r.getAttribute("href")})})}catch(o){console.error("Error rendering breed details:",o),p()}}function p(){document.querySelector("#app").innerHTML=`
    <div class="error">
      <h2>¡Ups! Algo salió mal</h2>
      <p>No pudimos cargar la información. Por favor, intenta de nuevo más tarde.</p>
      <a href="#/" class="boton-principal">Volver al inicio</a>
    </div>
  `,document.querySelector(".boton-principal").addEventListener("click",a=>{a.preventDefault(),window.location.hash="#/"})}function g(){const a=window.location.hash||"#/";if(a==="#/")m();else if(a==="#/razas")h();else if(a.startsWith("#/raza/")){const o=a.split("/")[2];f(o)}}window.addEventListener("hashchange",g);g();
