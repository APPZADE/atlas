import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import clsx from 'clsx';
import { Providers } from './providers';


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

import ClientNavbar from '@/components/ClientNavbar';

// ... (imports)

// ... (metadata)

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={clsx(inter.variable, outfit.variable)}>
            <body className="min-h-screen antialiased">
                <Providers>
                    <ClientNavbar />

                    <div className="md:pl-28 pb-24 md:pb-0">
                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    );
}
