import type { Metadata } from 'next';
import '@fontsource-variable/oswald/index.css';
import './globals.css';
export const metadata: Metadata = {
  icons: { icon: '/images/logo.webp' },
  title: 'AMC — America Motor Company | Cultura de ruta',
  description:
    'Proyecto de parador para motoviajeros en Villa Ciudad de América, Córdoba. Gastronomía, refugios y servicios sobre Ruta 5. Conocé el universo AMC.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'AMC — Cultura de ruta',
    description:
      'Un lugar pensado para quienes viajan en moto. Proyecto en desarrollo sobre Ruta 5, Córdoba.',
    type: 'website',
    locale: 'es_AR',
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
