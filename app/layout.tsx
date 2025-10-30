import './globals.css';
import { Toaster } from 'react-hot-toast';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />
          <main className="content">{children}{modal}</main>
          <Footer />
          <Toaster position="top-center" />
        </TanStackProvider>
      </body>
    </html>
  );
}

