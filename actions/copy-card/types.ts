import { z } from 'zod';
import { CopyCard } from './shema';
import { ActionState } from '@/lib/create-safe-action';
import { Card } from '@prisma/client';

export type InputType = z.infer<typeof CopyCard>
export type ReturnType = ActionState<InputType, Card>