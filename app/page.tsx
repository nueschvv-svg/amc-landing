import {
  ArrowDown,
  ArrowUpRight,
  MoveUpRight,
  MessageCircle,
  MapPin,
  Plus,
} from 'lucide-react';
import { Header, Motion, PlaceViews } from './ui';
import { WHATSAPP } from './project';

function Photo({
  name,
  alt,
  caption,
  className = '',
}: {
  name: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={`photo ${className}`}>
      <div className="photo-frame">
        <img
          src={`/images/${name}.webp`}
          srcSet={`/images/${name}-small.webp 768w, /images/${name}.webp 1536w`}
          sizes="(max-width: 700px) 100vw, 65vw"
          width="1536"
          height="1024"
          alt={alt}
          loading="lazy"
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="kicker">{children}</p>;
}
function Link({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      className="line-link"
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      <ArrowUpRight size={19} aria-hidden="true" />
    </a>
  );
}
function Ref({ n }: { n: number }) {
  return (
    <a className="ref" href="#fuentes" aria-label={`Ver fuente ${n}`}>
      [{n}]
    </a>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <Motion />
      <main id="contenido">
        <section className="cover" id="inicio" aria-labelledby="cover-title">
          <div className="cover-image" data-parallax>
            <img
              src="/images/editorial-ruta.webp"
              alt="Escena editorial generada con IA: dos motoviajeros contemplan un paisaje serrano junto a la ruta"
              width="1536"
              height="1024"
              fetchPriority="high"
            />
          </div>
          <div className="cover-shade" />
          <div className="cover-top">
            <span>VILLA CIUDAD DE AMÉRICA, CÓRDOBA</span>
            <span>ROAD · MACHINE · SHELTER · COMMUNITY</span>
          </div>
          <div className="cover-title">
            <p className="kicker">AMERICA MOTOR COMPANY</p>
            <h1 id="cover-title">
              <span>CULTURA</span>
              <span>
                DE RUTA<span className="title-dot">.</span>
              </span>
            </h1>
          </div>
          <div className="cover-bottom">
            <p>
              Un lugar para bajar de la moto.
              <br />Y sentir que llegaste.
            </p>
            <a
              className="round-link"
              href="#espiritu"
              aria-label="Entrá en AMC"
            >
              <span>ENTRÁ EN AMC</span>
              <span className="circle">
                <ArrowDown aria-hidden="true" />
              </span>
            </a>
          </div>
          <p className="cover-credit">
            CULTURA DE RUTA · IMAGEN EDITORIAL GENERADA CON IA
          </p>
        </section>
        <nav className="experience-nav" aria-label="Descubrí AMC">
          <a href="#refugios">
            QUEDARSE <ArrowUpRight aria-hidden="true" />
          </a>
          <a href="#mesa">
            COMER <ArrowUpRight aria-hidden="true" />
          </a>
          <a href="#encuentro">
            ENCONTRARSE <ArrowUpRight aria-hidden="true" />
          </a>
          <a href="#servicios">
            SEGUIR VIAJE <ArrowUpRight aria-hidden="true" />
          </a>
        </nav>
        <section className="manifesto section" id="espiritu">
          <div className="manifesto-top">
            <Kicker>NO ES SOLO EL DESTINO.</Kicker>
            <span className="edition">ES LO QUE PASA EN EL CAMINO.</span>
          </div>
          <h2 data-reveal>
            BUENAS RUTAS.
            <br />
            BUENA COMIDA.
            <br />
            <span className="serif">Buena compañía.</span>
          </h2>
          <div className="manifesto-bottom">
            <div className="mini-photo">
              <img
                src="/images/predio.webp"
                width="768"
                height="512"
                alt="Fotografía aportada de la casa, el garage y el arbolado del predio"
                loading="lazy"
              />
              <span>
                DONDE TODO EMPIEZA. <Ref n={9} />
              </span>
            </div>
            <div>
              <p className="large-copy">
                Estamos creando una base para motoviajeros en las sierras de
                Córdoba.
              </p>
              <p>
                Un café después de las curvas. Un lugar para el casco. Una mesa
                compartida y un refugio donde la moto también tenga su espacio.
              </p>
              <p>
                Sabemos lo que necesitás cuando bajás de la moto. Porque también
                viajamos. <Ref n={3} />
              </p>
              <Link href="#el-lugar">Conocé dónde empieza todo</Link>
            </div>
          </div>
        </section>
        <section
          className="experience-index"
          aria-labelledby="experience-title"
        >
          <div className="section index-heading">
            <Kicker>EL UNIVERSO AMC</Kicker>
            <h2 id="experience-title" data-reveal>
              HACÉ UNA PARADA.
              <br />
              <span className="serif">Encontrá tu lugar.</span>
            </h2>
            <p>
              Así imaginamos la vida en AMC.
              <br />
              Espacios proyectados para compartir el viaje.
            </p>
          </div>
          <div className="experience-grid">
            {[
              {
                image: 'editorial-descanso',
                title: 'TU REFUGIO',
                label: '01 / DESCANSO',
                link: '#refugios',
                alt: 'Imagen editorial IA: casco, guantes y equipaje en una pausa del viaje',
              },
              {
                image: 'editorial-mesa',
                title: 'LA MESA',
                label: '02 / GASTRONOMÍA',
                link: '#mesa',
                alt: 'Imagen editorial IA: dos cafés sobre una mesa de madera',
              },
              {
                image: 'editorial-oficio',
                title: 'TU MOTO',
                label: '03 / SERVICIOS',
                link: '#servicios',
                alt: 'Imagen editorial IA: manos ajustando el espejo de una moto',
              },
            ].map((item) => (
              <a className="experience-tile" href={item.link} key={item.title}>
                <img
                  src={`/images/${item.image}.webp`}
                  width="1024"
                  height="1536"
                  alt={item.alt}
                  loading="lazy"
                />
                <div>
                  <span>{item.label}</span>
                  <h3>{item.title}</h3>
                  <span className="tile-circle">
                    <ArrowUpRight aria-hidden="true" />
                  </span>
                </div>
                <small>IMAGEN EDITORIAL · GENERADA CON IA</small>
              </a>
            ))}
          </div>
        </section>
        <section className="stay section" id="refugios">
          <div className="stay-heading">
            <Kicker>QUEDARSE / DIEZ REFUGIOS PROYECTADOS</Kicker>
            <h2 data-reveal>
              VOS DESCANSÁS.
              <br />
              <span className="serif">Ella, al lado.</span>
            </h2>
            <p>
              La idea es simple: terminar el día entre árboles, con tu moto bajo
              techo y tus cosas a mano. Un espacio pensado por quienes también
              viajan. <Ref n={4} />
            </p>
          </div>
          <Photo
            name="refugio"
            alt="Refugio negro con un espacio independiente y techado para guardar la moto"
            caption="REFUGIO / VISUALIZACIÓN CONCEPTUAL · PDF, P. 6"
            className="stay-main"
          />
          <div className="stay-details">
            <span className="big-number">01—10</span>
            <div>
              <Kicker>REFUGIO, NO CAMA DE PASO.</Kicker>
              <p>
                Habitación y box de moto diferenciados, con conexión visual.
                Lugar para el casco, las botas, la campera y las alforjas.
                Cerraduras digitales previstas.
              </p>
              <Link href={WHATSAPP} external>
                Consultanos sobre los refugios
              </Link>
              <p className="fine">
                Unidades en proyecto. Distribución y dimensiones finales por
                definir.
              </p>
            </div>
          </div>
        </section>
        <section className="dining section" id="mesa">
          <div className="dining-top">
            <Kicker>COMER / COCINA DE RUTA</Kicker>
            <h2 data-reveal>
              SOBREMESAS
              <br />
              SIN <span className="serif">apuro.</span>
            </h2>
          </div>
          <div className="dining-grid">
            <Photo
              name="llegada"
              alt="Visualización del café de AMC, con viajeros en la barra"
              caption="LA LLEGADA / VISUALIZACIÓN CONCEPTUAL · PDF, P. 4"
            />
            <div className="dining-story">
              <p className="large-copy">
                Hay viajes que se recuerdan por una mesa.
              </p>
              <p>
                El proyecto propone transformar la casa existente en bodegón,
                recepción y bar. Parrilla, platos de ruta y regionales: comida
                para una parada corta o una charla larga. <Ref n={5} />
              </p>
              <div className="menu-note">
                <span>EN LA MESA QUE IMAGINAMOS</span>
                <p>
                  Parrilla & asador
                  <br />
                  Platos & sándwiches de ruta
                  <br />
                  Café & sobremesa
                  <br />
                  Sabores de Córdoba
                </p>
              </div>
              <Photo
                name="cafe"
                alt="Referencia conceptual de un café con madera e iluminación cálida"
                caption="REFERENCIA DE AMBIENTE · IMAGEN APORTADA"
              />
            </div>
          </div>
        </section>
        <section className="fire" id="encuentro">
          <div className="fire-image" data-parallax>
            <img
              src="/images/fogon.webp"
              width="1536"
              height="1024"
              alt="Visualización de un fogón compartido entre los refugios proyectados"
              loading="lazy"
            />
          </div>
          <div className="fire-shade" />
          <div className="fire-copy">
            <Kicker>ENCONTRARSE / CUANDO CAE EL SOL</Kicker>
            <h2 data-reveal>
              EL FUEGO
              <br />
              NO PIDE <span className="serif">DNI.</span>
            </h2>
            <p>
              Música baja. Historias de ruta.
              <br />
              Un lugar en la ronda, si tenés ganas.
            </p>
            <p className="fire-small">
              Queremos una comunidad donde compartir y descansar sean igual de
              importantes. También hay espacio para estar por tu cuenta.{' '}
              <Ref n={6} />
            </p>
          </div>
          <span className="fire-caption">
            EL FOGÓN PROYECTADO · VISUALIZACIÓN CONCEPTUAL
          </span>
        </section>
        <section className="service section" id="servicios">
          <div className="service-heading">
            <Kicker>SEGUIR VIAJE / EL OFICIO DE CUIDAR</Kicker>
            <h2 data-reveal>
              LISTOS PARA
              <br />
              <span className="serif">lo que sigue.</span>
            </h2>
          </div>
          <div className="service-body">
            <Photo
              name="taller"
              alt="Render conceptual de lavado y atención de una moto en AMC"
              caption="SERVICIOS / VISUALIZACIÓN CONCEPTUAL · PDF, P. 8"
            />
            <div className="service-list">
              <article>
                <span>01</span>
                <div>
                  <h3>TALLER DE MOTOS</h3>
                  <p>
                    El garage existente será la base del taller, integrado a la
                    casa. Buscamos un socio que lo alquile y opere. Alcance,
                    equipamiento y horarios por definir.
                  </p>
                </div>
              </article>
              <article>
                <span>02</span>
                <div>
                  <h3>LAVADO CON FICHAS</h3>
                  <p>
                    Un lavadero central proyectado para motos, con fichas de
                    pago. Ubicación e instalaciones dentro del circuito de
                    servicio, por resolver.
                  </p>
                </div>
              </article>
              <article>
                <span>03</span>
                <div>
                  <h3>LO SIMPLE, BIEN PENSADO</h3>
                  <p>
                    Estacionar, dejar el casco, cargar el celular, lavarse las
                    manos. Necesidades del viaje que guían el diseño de AMC.{' '}
                    <Ref n={7} />
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>
        <section className="market section" id="locales">
          <div className="market-heading">
            <Kicker>EN EL FRENTE / CINCO LOCALES PROYECTADOS</Kicker>
            <h2 data-reveal>
              LA PARADA
              <br />
              TIENE <span className="serif">vida.</span>
            </h2>
            <p>
              Motos, un café, un helado, lo que hace falta y algo de Córdoba
              para llevar. Cinco rubros previstos alrededor de la misma cultura
              de ruta. <Ref n={8} />
            </p>
          </div>
          <Photo
            name="locales"
            alt="Frente comercial conceptual con cinco locales previstos"
            caption="FRENTE COMERCIAL / VISUALIZACIÓN CONCEPTUAL · PDF, P. 10"
          />
          <ol className="shop-list">
            {[
              'Moto Adventure',
              'Heladería',
              'Café',
              'Farmacia',
              'Regionales',
            ].map((name, i) => (
              <li key={name}>
                <span>0{i + 1}</span>
                {name}
              </li>
            ))}
          </ol>
          <p className="fine">
            Rubros previstos, sin operadores ni habilitaciones confirmados. La
            arquitectura de esta referencia sigue en desarrollo.
          </p>
        </section>
        <section className="origin section" id="el-lugar">
          <div className="origin-heading">
            <div>
              <Kicker>NUESTRO PRIMER DESTINO</Kicker>
              <h2 data-reveal>
                AMÉRICA.
                <br />
                <span className="serif">Desde el origen.</span>
              </h2>
            </div>
            <div>
              <MapPin size={22} strokeWidth={1.5} aria-hidden="true" />
              <p>
                Villa Ciudad de América
                <br />
                Ruta 5 · Córdoba · Argentina
              </p>
            </div>
          </div>
          <PlaceViews />
          <div className="origin-bottom">
            <p className="large-copy">
              El nombre viene de acá.
              <br />
              La mirada va más lejos.
            </p>
            <div>
              <p>
                Partimos de terreno propio, una casa y un garage existentes. El
                arbolado, las escalinatas y el desnivel definen cómo queremos
                habitar este lugar. <Ref n={9} />
              </p>
              <p>
                Casa y taller unidos, con la terraza integrada. Los refugios, al
                fondo, entre los árboles. Una implantación en desarrollo que
                necesita proyecto medido y validación técnica.
              </p>
            </div>
          </div>
        </section>
        <section className="construction section">
          <Photo
            name="material-alpanel"
            alt="Visualización conceptual de revestimiento negro con nervaduras verticales, basada en el panel Alpanel aportado"
            caption="ALPANEL / VISUALIZACIÓN IA BASADA EN EL PANEL APORTADO"
          />
          <div>
            <Kicker>CONSTRUIR CON IDENTIDAD</Kicker>
            <h2 data-reveal>
              NEGRO.
              <br />
              METAL.
              <br />
              <span className="serif">Calidez.</span>
            </h2>
            <p>
              Paneles Alpanel negros y grafito, vidrio y estructura metálica.
              Madera como acento y piedra en el paisaje. Un lenguaje industrial
              que deje entrar la luz y el entorno.
            </p>
            <p>
              La ficha del proveedor describe aluminio H26 y núcleo de
              poliuretano. Aplicaciones, espesores y estructura se definirán en
              el proyecto ejecutivo. <Ref n={10} />
            </p>
            <Link href="https://alpanel.com.ar/ficha-tecnica/" external>
              Explorá el sistema Alpanel
            </Link>
            <a
              className="small-link"
              href="/images/alpanel-referencia.webp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver panel de referencia{' '}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </section>
        <section className="about section" id="nosotros">
          <div className="about-image">
            <img
              src="/images/indumentaria.webp"
              width="1536"
              height="1024"
              alt="Visualización de prendas AMC como expresión de identidad"
              loading="lazy"
            />
            <small>EXPLORACIÓN DE MARCA · PDF, P. 12</small>
          </div>
          <div className="about-copy">
            <Kicker>DE MOTOCICLISTAS, PARA MOTOCICLISTAS.</Kicker>
            <h2 data-reveal>
              EL LUGAR AL QUE
              <br />
              NOS GUSTARÍA
              <br />
              <span className="serif">llegar.</span>
            </h2>
            <p>
              Somos Enjinia Construcciones y nos apasionan las motos.
              Construimos y viajamos. AMC nace de esas dos formas de entender el
              mundo. <Ref n={11} />
            </p>
            <Link href="https://grupoenjinia.com/" external>
              Conocé Enjinia
            </Link>
          </div>
        </section>
        <section className="next-chapter section" id="ser-parte">
          <Kicker>LA RUTA SIGUE</Kicker>
          <div>
            <h2 data-reveal>
              ESTO RECIÉN
              <br />
              <span className="serif">empieza.</span>
            </h2>
            <div>
              <p>
                Estamos desarrollando AMC. Si te interesa el proyecto, querés
                conocer más o imaginás ser parte de lo que viene, conversemos.
              </p>
              <Link href={WHATSAPP} external>
                Hablemos por WhatsApp
              </Link>
              <span className="status">
                <i /> PROYECTO EN DESARROLLO · SIN FECHA DE APERTURA
              </span>
            </div>
          </div>
          <details className="development">
            <summary>
              Desarrollar y operar AMC <Plus size={20} aria-hidden="true" />
            </summary>
            <div>
              <p>
                Buscamos socios para desarrollar y operar el proyecto. El rol
                más definido es el del socio que alquila y opera el taller. Para
                las demás actividades, los aportes, responsabilidades y acuerdos
                están por estructurar.
              </p>
              <p>
                El programa combina estadías, gastronomía, comercio y servicios.
                La próxima etapa requiere validar proyecto técnico, presupuesto
                y operación. No hay rentas, retornos ni participaciones
                definidos.
              </p>
              <p>
                Queremos que AMC pueda convertirse en una marca replicable, con
                una bienvenida reconocible en otros destinos. Es una visión a
                desarrollar, no una red operativa. <Ref n={12} />
              </p>
            </div>
          </details>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-top">
          <a href="#inicio" aria-label="AMC, volver al inicio">
            <span className="footer-name">AMERICA<br />MOTOR COMPANY</span>
          </a>
          <p>
            ROAD · MACHINE
            <br />
            SHELTER · COMMUNITY
          </p>
          <a className="back-top" href="#inicio" aria-label="Volver al inicio">
            <MoveUpRight size={30} aria-hidden="true" />
          </a>
        </div>
        <div className="footer-bottom">
          <span>VILLA CIUDAD DE AMÉRICA · CÓRDOBA</span>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            CONTACTO <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <span>UN PROYECTO DE ENJINIA CONSTRUCCIONES</span>
        </div>
        <details className="source-details" id="fuentes">
          <summary>
            Fuentes y estado del proyecto <Plus size={16} aria-hidden="true" />
          </summary>
          <div>
            <p>
              Revisamos el PDF AMERICA_Motor_Company_WhatsApp.pdf completo (14
              páginas), las 22 imágenes de WhatsApp y el documento consolidado
              de 29 apartados. Las visualizaciones son conceptuales; no muestran
              obras terminadas ni operadores contratados. La portada y las tres imágenes del universo AMC son escenas editoriales generadas con IA; no documentan el predio, instalaciones reales ni personas del equipo.
            </p>
            <ol>
              <li>Fogón: PDF p. 9. Marca y ubicación: p. 1.</li>
              <li>
                Indumentaria: PDF p. 12, exploración de marca, no catálogo
                disponible.
              </li>
              <li>Concepto: PDF pp. 2 y 4; consolidado §§1, 2 y 10.</li>
              <li>
                Diez refugios y equipamiento: PDF p. 6; consolidado §§12–13.
              </li>
              <li>Casa y carta proyectada: PDF pp. 5 y 11; consolidado §9.</li>
              <li>Convivencia y fogón: PDF p. 9; consolidado §§15 y 18.</li>
              <li>Taller y lavado: PDF p. 8; consolidado §§10, 11 y 14.</li>
              <li>Cinco locales: PDF p. 10; consolidado §8.</li>
              <li>
                Estado actual: consolidado §§4–7 y fotografías WhatsApp
                10.54.14.jpeg y 10.54.13 (1).jpeg. Terreno propio es una
                declaración del promotor, no una verificación registral.
              </li>
              <li>
                Materiales: PDF p. 7; corrección visual IA basada en IMG_7285.PNG aportada por el usuario; consolidado §§19–21 y ficha técnica de
                Alpanel. La dirección vigente prioriza paneles negros y menos
                piedra; algunos renders corresponden a exploraciones anteriores.
              </li>
              <li>
                Enjinia: presentación institucional aportada en consolidado §2.
              </li>
              <li>Socios y visión: PDF p. 13; consolidado §§3 y 27.</li>
            </ol>
            <p>
              Mensura, implantación, proyecto ejecutivo, presupuestos, demanda y
              acuerdos siguen pendientes de validación. No hay cifras
              financieras ni fechas de apertura confirmadas. Los archivos
              aportados se utilizan para este encargo y no se presentan como
              recursos de licencia abierta.
            </p>
          </div>
        </details>
      </footer>
      <a
        className="whatsapp-float"
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Consultar sobre AMC por WhatsApp"
      >
        <MessageCircle size={22} strokeWidth={1.5} aria-hidden="true" />
        <span>HABLEMOS</span>
      </a>
    </>
  );
}
