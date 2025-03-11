(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function n(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(e){if(e.ep)return;e.ep=!0;const r=n(e);fetch(e.href,r)}})();const p="https://dog.ceo/api",u="https://api.thedogapi.com/v1/breeds",m="live_YOUR_API_KEY";let t=null;const h={"retriever-labrador":"labrador","shepherd-german":"german","retriever-golden":"golden",bulldog:"bulldog",poodle:"poodle",beagle:"beagle",husky:"husky",rottweiler:"rottweiler",boxer:"boxer",chihuahua:"chihuahua",doberman:"doberman",corgi:"corgi"},f={labrador:{nombre:"Labrador Retriever",origen:"Canadá",descripcion:"El Labrador Retriever es una de las razas más populares del mundo. Son perros amigables, activos y excelentes con los niños.",infoOrigen:"Originalmente criados para ayudar a los pescadores, estos perros son excelentes nadadores y tienen un pelaje resistente al agua.",esperanzaVida:"10-12 años"},german:{nombre:"Pastor Alemán",origen:"Alemania",descripcion:"El Pastor Alemán es conocido por su inteligencia, lealtad y capacidad de trabajo. Son excelentes perros de servicio y familia.",infoOrigen:"Desarrollados originalmente como perros pastores, hoy en día son utilizados en múltiples roles, incluyendo policía y rescate.",esperanzaVida:"9-13 años"},golden:{nombre:"Golden Retriever",origen:"Escocia",descripcion:"El Golden Retriever es conocido por su personalidad amigable y su hermoso pelaje dorado. Son excelentes perros de familia.",infoOrigen:"Fueron criados originalmente para la recuperación de presas en la caza, especialmente en el agua.",esperanzaVida:"10-12 años"},bulldog:{nombre:"Bulldog Inglés",origen:"Inglaterra",descripcion:"El Bulldog es un perro tranquilo y amigable, conocido por su apariencia distintiva y su naturaleza dócil.",infoOrigen:"Originalmente criados para la lucha con toros, hoy en día son perros de compañía pacíficos y cariñosos.",esperanzaVida:"8-10 años"},poodle:{nombre:"Caniche",origen:"Francia",descripcion:"El Caniche es una de las razas más inteligentes. Son activos, elegantes y vienen en diferentes tamaños.",infoOrigen:"Aunque se asocian con la elegancia francesa, originalmente fueron perros de caza de agua.",esperanzaVida:"12-15 años"},beagle:{nombre:"Beagle",origen:"Inglaterra",descripcion:"Los Beagles son perros alegres y curiosos, conocidos por su excelente sentido del olfato y su naturaleza amigable.",infoOrigen:"Fueron criados para la caza de conejos y otras presas pequeñas en jauría.",esperanzaVida:"12-15 años"},husky:{nombre:"Husky Siberiano",origen:"Siberia",descripcion:"El Husky Siberiano es un perro de trabajo resistente, conocido por su pelaje denso y su personalidad amigable.",infoOrigen:"Desarrollados por el pueblo Chukchi para el trineo y la compañía en el frío clima siberiano.",esperanzaVida:"12-14 años"},rottweiler:{nombre:"Rottweiler",origen:"Alemania",descripcion:"El Rottweiler es un perro fuerte y leal, excelente como guardián y compañero de familia.",infoOrigen:"Originalmente utilizados para arrear ganado y tirar de carretas de carniceros en la ciudad de Rottweil.",esperanzaVida:"8-10 años"},boxer:{nombre:"Boxer",origen:"Alemania",descripcion:"El Boxer es un perro juguetón y energético, excelente con los niños y muy protector con su familia.",infoOrigen:"Descendiente del extinto Bullenbeisser, fue desarrollado en Alemania a finales del siglo XIX.",esperanzaVida:"10-12 años"},chihuahua:{nombre:"Chihuahua",origen:"México",descripcion:"El Chihuahua es el perro más pequeño del mundo, conocido por su personalidad valiente y su lealtad.",infoOrigen:"Originario del estado de Chihuahua, México, tiene una historia que se remonta a los perros precolombinos.",esperanzaVida:"12-20 años"},doberman:{nombre:"Doberman",origen:"Alemania",descripcion:"El Doberman es un perro elegante y atlético, conocido por su inteligencia y lealtad.",infoOrigen:"Creado por Karl Friedrich Louis Dobermann, quien buscaba un perro de protección personal.",esperanzaVida:"10-13 años"},corgi:{nombre:"Corgi Galés de Pembroke",origen:"Gales",descripcion:"El Corgi es un perro pequeño pero robusto, conocido por su personalidad alegre y su inteligencia.",infoOrigen:"Originalmente criado para pastorear ganado en Gales, es famoso por ser la raza favorita de la Reina Isabel II.",esperanzaVida:"12-14 años"}};async function b(){if(t)return t;try{console.log("Obteniendo razas de la API...");const o=await fetch(u,{headers:{"x-api-key":m}});if(!o.ok)throw new Error("Error al obtener razas");return t=(await o.json()).reduce((n,i)=>{const e=i.name.toLowerCase().replace(/ /g,"-");return n[e]={nombre:i.name,origen:i.origin||"Origen desconocido",descripcion:i.temperament||"Información no disponible",infoOrigen:i.bred_for||"No hay información detallada sobre el origen",esperanzaVida:i.life_span||"No disponible"},n},{}),console.log("Razas obtenidas:",t),t}catch(o){return console.error("Error obteniendo razas de la API:",o),f}}async function l(o){console.log("Buscando info para raza:",o);const a=await b(),n=a[h[o]]||a[o];return console.log("Info encontrada:",n),n||{nombre:o.split("-").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" "),origen:"Origen desconocido",descripcion:"Información no disponible para esta raza",infoOrigen:"No tenemos información detallada sobre el origen de esta raza",esperanzaVida:"No disponible"}}async function c(o){try{console.log("Fetching:",p+o);const a=await fetch(`${p}${o}`);if(!a.ok)throw new Error(`HTTP error! status: ${a.status}`);const n=await a.json();return console.log("Response:",n),n}catch(a){throw console.error("Error fetching data:",a),a}}async function v(){try{const{message:o}=await c("/breeds/image/random");document.querySelector("#app").innerHTML=`
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
              <img src="${o}" alt="Perro aleatorio" class="imagen-hero"
                   onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
            </div>
          </div>
        </div>
      </div>
    `}catch(o){console.error("Error rendering home:",o),d()}}async function y(){try{console.log("Iniciando renderBreeds");const{message:o}=await c("/breeds/list/all");console.log("Razas obtenidas:",o);const a=Object.keys(o).map(async e=>{try{console.log("Procesando raza:",e);const{message:r}=await c(`/breed/${e}/images/random`),s=await l(e);return console.log("Info obtenida para",e,":",s),{nombre:s.nombre,imagen:r,raza:e}}catch(r){return console.error("Error procesando raza:",e,r),{nombre:(await l(e)).nombre,imagen:"https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg",raza:e}}}),n=await Promise.all(a);console.log("Razas procesadas:",n);const i=n.map(({nombre:e,imagen:r,raza:s})=>`
          <a href="#/raza/${s}" class="tarjeta">
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
          ${i}
        </div>
      </div>
    `}catch(o){console.error("Error rendering breeds:",o),d()}}async function z(o){try{console.log("Renderizando detalles de:",o);const a=await l(o),{message:n}=await c(`/breed/${o}/images`),i=n.slice(0,4);document.querySelector("#app").innerHTML=`
      <div class="header">
        <h1>🐕 Todo sobre tu perro</h1>
      </div>
      <div class="contenedor">
        <nav>
          <a href="#/" class="nav-link">Inicio</a> |
          <a href="#/razas" class="nav-link">Lista de Razas</a>
        </nav>
        <div class="detalle-raza">
          <h1>${a.nombre}</h1>
          <div class="info-container">
            <div class="galeria-imagenes">
              ${i.map(e=>`
                <img src="${e}" alt="${a.nombre}" class="imagen-detalle"
                     onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">`).join("")}
            </div>
            <div class="info-detalle">
              <div class="info-item">
                <h3>Origen</h3>
                <p>${a.origen}</p>
              </div>
              <div class="info-item">
                <h3>Descripción</h3>
                <p>${a.descripcion}</p>
              </div>
              <div class="info-item">
                <h3>Historia</h3>
                <p>${a.infoOrigen}</p>
              </div>
              <div class="info-item">
                <h3>Esperanza de Vida</h3>
                <p>${a.esperanzaVida}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}catch(a){console.error("Error rendering breed details:",a),d()}}function d(){document.querySelector("#app").innerHTML=`
    <div class="error-container">
      <h1>¡Ups! Algo salió mal</h1>
      <p>Lo sentimos, ha ocurrido un error. Por favor, intenta nuevamente.</p>
      <a href="#/" class="boton-principal">Volver al inicio</a>
    </div>
  `}function g(){console.log("Manejando ruta:",window.location.hash);const o=window.location.hash||"#/";if(o==="#/")v();else if(o==="#/razas")y();else if(o.startsWith("#/raza/")){const a=o.split("/")[2];z(a)}}window.addEventListener("hashchange",g);g();
