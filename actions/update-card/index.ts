'use server'

import { auth } from '@clerk/nextjs'
import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { CreateSafeAction } from '@/lib/create-safe-action'
import { UpdateCard } from './shema'
import { ACTION, ENTITY_TYPE } from '@prisma/client'
import { createAuditLog } from '@/lib/create-audit-log'

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            error: 'Unauthorized'
        }
    }

    const { id, boardId, ...values } = data
    let card

    try {
        card = await db.card.update({
            where: {
                id, list: {
                    board: {
                        orgId
                    }
                }
            },
            data: {
                ...values
            }
        })

        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.UPDATE
        })
    } catch (e) {
        return {
            error: 'Failed to update'
        }
    }

    revalidatePath(`/board/${boardId}`)
    return { data: card }
}

export const updateCard = CreateSafeAction(UpdateCard, handler)