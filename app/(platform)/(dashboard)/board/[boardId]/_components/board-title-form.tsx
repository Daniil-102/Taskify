'use client'

import { updateBoard } from '@/actions/update-board'
import { FormInput } from '@/components/form/form-input'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-action'
import { Board } from '@prisma/client'
import { ElementRef, useRef, useState } from 'react'
import { toast } from 'sonner'

interface BoardTitleFormProps {
    data: Board
}

export const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(data.title)
    const formRef = useRef<ElementRef<'form'>>(null)
    const inputRef = useRef<ElementRef<'input'>>(null)

    const { execute } = useAction(updateBoard, {
        onSuccess: (data) => {
            if (data.title !== title) {
                toast.success(`Board "${data.title}" updated!`)
                setTitle(data.title)
            }
            disableEditing()
        },
        onError: (e) => {
            toast.error(e)
        }
    })

    const enableEditing = () => {
        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.select()
        })
    }
    const disableEditing = () => {
        setIsEditing(false)
    }

    const onSibmit = (formData: FormData) => {
        const title = formData.get('title') as string
        execute({
            title,
            id: data.id
        })
    }
    const onBlur = () => {
        formRef.current?.requestSubmit()
    }

    if (isEditing) {
        return (
            <form ref={formRef} action={onSibmit} className='flex items-center gap-x-2'>
                <FormInput ref={inputRef} id='title' onBlur={onBlur} defaultValue={title}
                    className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-transparent border-none"
                />
            </form>
        )
    }

    return (
        <Button variant='transparent'
            onClick={enableEditing}
            className='font-bold text-lg h-auto w-auto p-1 px-2'
        >
            {title}
        </Button>
    )
}
