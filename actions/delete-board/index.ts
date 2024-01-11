'use server'

import { auth } from '@clerk/nextjs'
import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { CreateSafeAction } from '@/lib/create-safe-action'
import { DeleteBoard } from './shema'
import { redirect } from 'next/navigation'
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'
import { decreaseAvailableCount } from '@/lib/org-limit'
import { checkSubscription } from '@/lib/subscription'

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            error: 'Unauthorized'
        }
    }

    const isPro = await checkSubscription()

    const { id } = data
    let board

    try {
        board = await db.board.delete({ where: { id, orgId } })

        if (!isPro) {
            await decreaseAvailableCount()
        }

        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.DELETE
        })
    } catch (e) {
        return {
            error: 'Failed to delete'
        }
    }

    revalidatePath(`/organization/${orgId}`)
    redirect(`/organization/${orgId}`)
}

export const deleteBoard = CreateSafeAction(DeleteBoard, handler)