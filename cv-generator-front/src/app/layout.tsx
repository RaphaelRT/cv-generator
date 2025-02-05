import '@/global.css';
import Link from 'next/link';
import ReduxProvider from '@/store/Provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className='flex w-screen min-h-screen flex-col'>
        <ReduxProvider>
          <header className="bg-gray-800 text-white py-4">
            <nav className="container mx-auto flex justify-between">
              <ul className="flex space-x-4">
                <li>
                  <Link href="/" className="hover:underline">
                    Acceuil
                  </Link>
                </li>
                <li>
                  <Link href="/offers" className="hover:underline">
                    Historique des offres
                  </Link>
                </li>
              </ul>
            </nav>
            
          </header>
          <div className='flex w-screen min-h-[90vh] justify-center items-center'>
            {children}
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
