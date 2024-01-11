import { z } from 'zod';
import { UpdateListOrder } from './shema';
import { ActionState } from '@/lib/create-safe-action';
import { List } from '@prisma/client';

export type InputType = z.infer<typeof UpdateListOrder>
export type ReturnType = ActionState<InputType, List[]>