'use server'

import { auth } from '@clerk/nextjs'
import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { CreateSafeAction } from '@/lib/create-safe-action'
import { DeleteList } from './shema'
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            error: 'Unauthorized'
        }
    }

    const { id, boardId } = data
    let list

    try {
        list = await db.list.delete({ where: { id, boardId, board: { orgId } } })

        await createAuditLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.DELETE
        })
    } catch (e) {
        return {
            error: 'Failed to delete'
        }
    }

    revalidatePath(`/board/${boardId}`)
    return { data: list }
}

export const deleteList = CreateSafeAction(DeleteList, handler)