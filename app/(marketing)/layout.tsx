import type { Metadata } from 'next'
import { Navbar } from './_components/navbar'
import { Footer } from './_components/footer'

export const metadata: Metadata = {
    icons: [{
        url: '/logo.svg',
        href: '/logo.svg'
    }]
}

export default function MarketLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='h-full bg-slate-100'>
            <Navbar />
            <main className='pt-40 pb-20 bg-slate-100'>
                {children}
            </main>
            <Footer />
        </div>
    )
}
