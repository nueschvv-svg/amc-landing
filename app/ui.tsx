'use client';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WHATSAPP } from './project';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function close(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return (
    <>
      <div className="topline">
        <span>UN NUEVO PUNTO DE ENCUENTRO EN RUTA 5.</span>
        <span>PROYECTO EN DESARROLLO</span>
      </div>
      <header className="header">
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label={open ? 'Cerrar menú' : 'Explorar AMC'}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
          <span>{open ? 'CERRAR' : 'EXPLORAR'}</span>
        </button>
        <a
          className="brand"
          href="#inicio"
          aria-label="AMC, inicio"
          onClick={() => setOpen(false)}
        >
          <img
            src="/images/logo.webp"
            width="639"
            height="198"
            alt="America Motor Company"
          />
        </a>
        <a
          className="header-contact"
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
        >
          HABLEMOS <ArrowUpRight size={18} aria-hidden="true" />
        </a>
        <nav
          id="main-nav"
          className={open ? 'navigation open' : 'navigation'}
          aria-label="Principal"
          inert={!open}
        >
          <div className="nav-heading">
            BIENVENIDO A AMC <ArrowDownRight size={26} />
          </div>
          {[
            ['El espíritu', '#espiritu'],
            ['Los refugios', '#refugios'],
            ['La mesa', '#mesa'],
            ['El encuentro', '#encuentro'],
            ['Tu moto', '#servicios'],
            ['El lugar', '#el-lugar'],
            ['Ser parte', '#ser-parte'],
          ].map(([title, href], i) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              <span>0{i + 1}</span>
              {title}
              <ArrowUpRight size={26} aria-hidden="true" />
            </a>
          ))}
          <p>
            VILLA CIUDAD DE AMÉRICA
            <br />
            CÓRDOBA, ARGENTINA
          </p>
        </nav>
      </header>
    </>
  );
}
export function Motion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.cover-title h1 > span', {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'all',
      });
      gsap.from('.cover-bottom', {
        opacity: 0,
        y: 12,
        duration: 0.7,
        delay: 0.35,
        clearProps: 'all',
      });
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 25,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: { trigger: el, start: 'top 95%', once: true },
        });
      });
      if (window.innerWidth > 800) {
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -3 },
            {
              yPercent: 3,
              ease: 'none',
              scrollTrigger: {
                trigger: el.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            },
          );
        });
      }
    });
    return () => mm.revert();
  }, []);
  return null;
}
export function PlaceViews() {
  return (
    <Tabs defaultValue="actual" className="place-tabs">
      <TabsList className="place-tabs-list" aria-label="Vistas del lugar">
        <TabsTrigger value="actual">EL LUGAR HOY</TabsTrigger>
        <TabsTrigger value="vision">LA VISIÓN</TabsTrigger>
      </TabsList>
      <TabsContent value="actual">
        <figure>
          <img
            src="/images/predio-amplio.webp"
            alt="Fotografía actual aportada del garage, la casa elevada y los árboles del predio"
            width="1280"
            height="720"
            loading="lazy"
          />
          <figcaption>
            <strong>FOTOGRAFÍA DEL PREDIO</strong>
            <span>
              Casa y garage existentes · Imagen aportada, 10.54.14.jpeg
            </span>
          </figcaption>
        </figure>
      </TabsContent>
      <TabsContent value="vision">
        <figure>
          <img
            src="/images/casona.webp"
            alt="Visualización conceptual de restauración de la casona entre árboles, con terraza sobre el garage"
            width="1536"
            height="1024"
            loading="lazy"
          />
          <figcaption>
            <strong>VISUALIZACIÓN CONCEPTUAL</strong>
            <span>
              Restauración propuesta · PDF, p. 5 · Implantación por verificar
            </span>
          </figcaption>
        </figure>
      </TabsContent>
    </Tabs>
  );
}
