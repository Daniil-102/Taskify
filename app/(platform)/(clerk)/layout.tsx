import type { Metadata } from 'next'



export default function ClerckLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='h-full flex items-center justify-center'>
            {children}
        </div>
    )
}
