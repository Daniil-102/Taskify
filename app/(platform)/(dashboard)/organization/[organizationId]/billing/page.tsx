import { checkSubscription } from '@/lib/subscription'
import { Info } from '../_components/info'
import { Separator } from '@/components/ui/separator'
import { SubscriptionButton } from './_components/SubscriptionButton'


const BillingPage = async () => {
    const isPro = await checkSubscription()

    return (
        <div className='w-full'>
            <Info isPro={isPro} />
            <Separator className='mt-3 mb-8' />
            <SubscriptionButton isPro={isPro} />
        </div>
    )
}

export default BillingPage

