'use client'

import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { FormInput } from './form-input'
import { FormSubmit } from './form-button'
import { useAction } from '@/hooks/use-action'
import { createBoard } from '@/actions/create-board'
import { toast } from 'sonner'
import { FormPicker } from './form-picker'
import { ElementRef, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useProModal } from '@/hooks/use-pro-modal'

interface FormPopoverProps {
    children: React.ReactNode
    side?: "left" | "top" | "bottom" | "right"
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
}

export const FormPopover = ({ children, side = 'bottom', align, sideOffset = 0 }: FormPopoverProps) => {
    const router = useRouter()
    const proModal = useProModal()
    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            toast.success('Board created!')
            closeRef.current?.click()
            router.push(`/board/${data.id}`)
        },
        onError: (e) => {
            toast.error(e)
            closeRef.current?.click()
            proModal.onOpen()
        }
    })

    const closeRef = useRef<ElementRef<'button'>>(null)


    const onSubmit = (formData: FormData) => {
        const title = formData.get('title') as string
        const image = formData.get('image') as string
        execute({ title, image })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent align={align} className='w-80 pt-3' side={side} sideOffset={sideOffset}>
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Create board
                </div>
                <PopoverClose ref={closeRef} asChild>
                    <Button variant='ghost' className='h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600' >
                        <X className='h-4 w-4' />
                    </Button>
                </PopoverClose>
                <form action={onSubmit}>
                    <div className="space-y-4">
                        <FormPicker id='image' errors={fieldErrors} />
                        <FormInput errors={fieldErrors} id='title' label='Board title' />
                        <FormSubmit className='w-full' >
                            Create
                        </FormSubmit>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    )
}
