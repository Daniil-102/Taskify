import { startCase } from 'lodash'
import { Orgcontrol } from './_components/org-control'
import { auth } from '@clerk/nextjs'

export async function generateMetadata() {
    const { orgSlug } = auth()
    return {
        title: startCase(orgSlug || 'organization')
    }
}


export default function OrganizationIdLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='w-full'>
            <Orgcontrol />
            {children}
        </div>
    )
}
