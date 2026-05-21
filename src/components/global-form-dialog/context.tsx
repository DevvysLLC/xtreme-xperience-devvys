'use client'

import {
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useContext,
  useState
} from 'react'

type FormDialogContextType = {
  isOpen: boolean
  handle: string | null
  openFormDialog: (handle: string) => void
  closeFormDialog: () => void
}

const FormDialogContext = createContext<FormDialogContextType | undefined>(
  undefined
)

type Props = {
  children: ReactNode
}

export const FormDialogProvider: FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [handle, setHandle] = useState<string | null>(null)

  const openFormDialog = useCallback((formHandle: string) => {
    setHandle(formHandle)
    setIsOpen(true)
  }, [])

  const closeFormDialog = useCallback(() => {
    setIsOpen(false)
    setHandle(null)
  }, [])

  const value: FormDialogContextType = {
    isOpen,
    handle,
    openFormDialog,
    closeFormDialog
  }

  return (
    <FormDialogContext.Provider value={value}>
      {children}
    </FormDialogContext.Provider>
  )
}

export const useFormDialog = () => {
  const context = useContext(FormDialogContext)
  if (context === undefined) {
    throw new Error('useFormDialog must be used within a FormDialogProvider')
  }
  return context
}
