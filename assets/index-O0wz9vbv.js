(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function n(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(e){if(e.ep)return;e.ep=!0;const o=n(e);fetch(e.href,o)}})();const g={"retriever-labrador":"labrador","shepherd-german":"german","retriever-golden":"golden",bulldog:"bulldog",poodle:"poodle",beagle:"beagle",husky:"husky",rottweiler:"rottweiler",boxer:"boxer",chihuahua:"chihuahua",doberman:"doberman",corgi:"corgi"},d={labrador:{nombre:"Labrador Retriever",origen:"Canadá",descripcion:"El Labrador Retriever es una de las razas más populares del mundo. Son perros amigables, activos y excelentes con los niños.",infoOrigen:"Originalmente criados para ayudar a los pescadores, estos perros son excelentes nadadores y tienen un pelaje resistente al agua.",esperanzaVida:"10-12 años"},german:{nombre:"Pastor Alemán",origen:"Alemania",descripcion:"El Pastor Alemán es conocido por su inteligencia, lealtad y capacidad de trabajo. Son excelentes perros de servicio y familia.",infoOrigen:"Desarrollados originalmente como perros pastores, hoy en día son utilizados en múltiples roles, incluyendo policía y rescate.",esperanzaVida:"9-13 años"},golden:{nombre:"Golden Retriever",origen:"Escocia",descripcion:"El Golden Retriever es conocido por su personalidad amigable y su hermoso pelaje dorado. Son excelentes perros de familia.",infoOrigen:"Fueron criados originalmente para la recuperación de presas en la caza, especialmente en el agua.",esperanzaVida:"10-12 años"},bulldog:{nombre:"Bulldog Inglés",origen:"Inglaterra",descripcion:"El Bulldog es un perro tranquilo y amigable, conocido por su apariencia distintiva y su naturaleza dócil.",infoOrigen:"Originalmente criados para la lucha con toros, hoy en día son perros de compañía pacíficos y cariñosos.",esperanzaVida:"8-10 años"},poodle:{nombre:"Caniche",origen:"Francia",descripcion:"El Caniche es una de las razas más inteligentes. Son activos, elegantes y vienen en diferentes tamaños.",infoOrigen:"Aunque se asocian con la elegancia francesa, originalmente fueron perros de caza de agua.",esperanzaVida:"12-15 años"},beagle:{nombre:"Beagle",origen:"Inglaterra",descripcion:"Los Beagles son perros alegres y curiosos, conocidos por su excelente sentido del olfato y su naturaleza amigable.",infoOrigen:"Fueron criados para la caza de conejos y otras presas pequeñas en jauría.",esperanzaVida:"12-15 años"},husky:{nombre:"Husky Siberiano",origen:"Siberia",descripcion:"El Husky Siberiano es un perro de trabajo resistente, conocido por su pelaje denso y su personalidad amigable.",infoOrigen:"Desarrollados por el pueblo Chukchi para el trineo y la compañía en el frío clima siberiano.",esperanzaVida:"12-14 años"},rottweiler:{nombre:"Rottweiler",origen:"Alemania",descripcion:"El Rottweiler es un perro fuerte y leal, excelente como guardián y compañero de familia.",infoOrigen:"Originalmente utilizados para arrear ganado y tirar de carretas de carniceros en la ciudad de Rottweil.",esperanzaVida:"8-10 años"},boxer:{nombre:"Boxer",origen:"Alemania",descripcion:"El Boxer es un perro juguetón y energético, excelente con los niños y muy protector con su familia.",infoOrigen:"Descendiente del extinto Bullenbeisser, fue desarrollado en Alemania a finales del siglo XIX.",esperanzaVida:"10-12 años"},chihuahua:{nombre:"Chihuahua",origen:"México",descripcion:"El Chihuahua es el perro más pequeño del mundo, conocido por su personalidad valiente y su lealtad.",infoOrigen:"Originario del estado de Chihuahua, México, tiene una historia que se remonta a los perros precolombinos.",esperanzaVida:"12-20 años"},doberman:{nombre:"Doberman",origen:"Alemania",descripcion:"El Doberman es un perro elegante y atlético, conocido por su inteligencia y lealtad.",infoOrigen:"Creado por Karl Friedrich Louis Dobermann, quien buscaba un perro de protección personal.",esperanzaVida:"10-13 años"},corgi:{nombre:"Welsh Corgi",origen:"Gales",descripcion:"El Corgi es un perro pequeño pero robusto, conocido por su personalidad alegre y su inteligencia.",infoOrigen:"Originalmente criado para pastorear ganado en Gales, es famoso por ser la raza favorita de la Reina Isabel II.",esperanzaVida:"12-14 años"}},c=r=>{const a=d[g[r]]||d[r];return a||{nombre:r.split("-").map(i=>i.charAt(0).toUpperCase()+i.slice(1)).join(" "),origen:"Origen desconocido",descripcion:"Información no disponible para esta raza",infoOrigen:"No tenemos información detallada sobre el origen de esta raza",esperanzaVida:"No disponible"}},u="https://dog.ceo/api";async function t(r){try{const a=await fetch(`${u}${r}`);if(!a.ok)throw new Error(`HTTP error! status: ${a.status}`);return await a.json()}catch(a){throw console.error("Error:",a),a}}async function m(){try{const{message:r}=await t("/breeds/image/random");document.querySelector("#app").innerHTML=`
      <div class="header">
        <h1>🐕 Todo sobre tu perro</h1>
      </div>
      <div class="contenedor">
        <nav>
          <a href="#/" onclick="return false;">Inicio</a> |
          <a href="#/razas" onclick="return false;">Lista de Razas</a>
        </nav>
        <div class="pagina-inicio">
          <div class="hero-section">
            <div class="hero-content">
              <h1>Descubre el Mundo de los Perros</h1>
              <p>Explora diferentes razas y aprende todo sobre estos maravillosos compañeros</p>
              <a href="#/razas" class="boton-principal" onclick="return false;">Ver Razas</a>
            </div>
            <div class="hero-imagen">
              <img src="${r}" alt="Perro aleatorio" class="imagen-hero"
                   onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
            </div>
          </div>
        </div>
      </div>
    `}catch(r){console.error("Error rendering home:",r),l()}}async function h(){try{const{message:r}=await t("/breeds/list/all"),a=Object.keys(r).map(async e=>{try{const{message:o}=await t(`/breed/${e}/images/random`);return{nombre:c(e).nombre,imagen:o,raza:e}}catch{return{nombre:c(e).nombre,imagen:"https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg",raza:e}}}),i=(await Promise.all(a)).map(({nombre:e,imagen:o,raza:s})=>`
          <a href="#/raza/${s}" class="tarjeta" onclick="return false;">
            <img src="${o}" alt="${e}" class="imagen" 
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
          <a href="#/" onclick="return false;">Inicio</a> |
          <a href="#/razas" onclick="return false;">Lista de Razas</a>
        </nav>
        <div class="cuadricula">
          ${i}
        </div>
      </div>
    `}catch(r){console.error("Error rendering breeds:",r),l()}}async function f(r){try{const{message:a}=await t(`/breed/${r}/images`),n=c(r),i=a[0]||"https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg",e=a.slice(1,4).filter(o=>o);document.querySelector("#app").innerHTML=`
      <div class="header">
        <h1>🐕 Todo sobre tu perro</h1>
      </div>
      <div class="contenedor">
        <nav>
          <a href="#/" onclick="return false;">Inicio</a> |
          <a href="#/razas" onclick="return false;">Lista de Razas</a>
        </nav>
        <div class="detalle-raza">
          <h1>${n.nombre}</h1>
          <div class="info-principal">
            <div class="imagen-contenedor">
              <img src="${i}" alt="${n.nombre}" class="imagen-principal"
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
              ${e.map(o=>`
                <div class="imagen-contenedor">
                  <img src="${o}" alt="${n.nombre}" class="imagen-galeria"
                       onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
                </div>
              `).join("")}
            </div>
          `:""}
        </div>
      </div>
    `}catch(a){console.error("Error rendering breed details:",a),l()}}function l(){document.querySelector("#app").innerHTML=`
    <div class="error">
      <h2>¡Ups! Algo salió mal</h2>
      <p>No pudimos cargar la información. Por favor, intenta de nuevo más tarde.</p>
      <a href="#/" class="boton-principal">Volver al inicio</a>
    </div>
  `}function p(){const r=window.location.hash||"#/";if(r==="#/")m();else if(r==="#/razas")h();else if(r.startsWith("#/raza/")){const a=r.split("/")[2];f(a)}}window.addEventListener("hashchange",p);p();
