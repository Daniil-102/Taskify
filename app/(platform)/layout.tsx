import { ModalProvider } from '@/components/providers/modal-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { ClerkProvider } from '@clerk/nextjs'
import { Metadata } from 'next'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
    icons: [{
        url: '/logo.svg',
        href: '/logo.svg'
    }]
}

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <QueryProvider>
                <Toaster />
                <ModalProvider />
                {children}
            </QueryProvider>
        </ClerkProvider>
    )
}
