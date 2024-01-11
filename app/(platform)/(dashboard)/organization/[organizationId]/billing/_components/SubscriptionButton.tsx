'use client'
import { stripeRedirect } from '@/actions/stripe-redirect'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-action'
import { useProModal } from '@/hooks/use-pro-modal'
import { toast } from 'sonner'

interface SubscriptionButtonProps {
    isPro: boolean
}
export const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
    const proModal = useProModal()

    const { execute, loading } = useAction(stripeRedirect, {
        onSuccess: data => {
            window.location.href = data
        },
        onError: e => {
            toast.error(e)
        }
    })

    const onClick = () => {
        if (isPro) {
            execute({})
        } else {
            proModal.onOpen()
        }
    }
    return (
        <Button onClick={onClick} variant='primary' disabled={loading}>
            {isPro ? 'Manage subscription' : 'Upgrade to pro'}
        </Button>
    )
}
