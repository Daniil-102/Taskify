'use server'
import { auth } from '@clerk/nextjs'
import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { CreateSafeAction } from '@/lib/create-safe-action'
import { CreateBoard } from './schema'
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'
import { hasAvailableCount, incrementAvailableCount } from '@/lib/org-limit'
import { checkSubscription } from '@/lib/subscription'

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            error: 'Unauthorized'
        }
    }

    const { title, image } = data

    const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] = image.split('|')

    if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
        return {
            error: "Missing fields. Failed to create board."
        }
    }

    const canCreate = await hasAvailableCount()
    const isPro = await checkSubscription()

    if (!canCreate && !isPro) {
        return {
            error: 'You have reached your limit of free boards. Please uprade to create more.'
        }
    }

    let board

    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageUserName,
                imageLinkHTML
            }
        })
        if (!isPro) {
            await incrementAvailableCount()
        }


        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE
        })

    } catch (e) {
        return {
            error: 'Failed to create'
        }
    }
    revalidatePath(`/board/${board.id}`)

    return { data: board }
}

export const createBoard = CreateSafeAction(CreateBoard, handler)