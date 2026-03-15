import './globals.css';

export const metadata = {
  title: 'BarnaPulse | El Latido de Barcelona',
  description: 'Mapa colaborativo en tiempo real de eventos, cultura y vida en Barcelona.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-900 text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}
