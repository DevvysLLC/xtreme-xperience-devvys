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
  size: string | null
  width: string | null
  height: string | null
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
  const [size, setSize] = useState<string | null>(null)
  const [width, setWidth] = useState<string | null>(null)
  const [height, setHeight] = useState<string | null>(null)

  const openFormDialog = useCallback((formHandle: string) => {
    const [pureHandle = '', queryString] = formHandle.split('?')
    setHandle(pureHandle || null)

    if (queryString) {
      const params = new URLSearchParams(queryString)
      setSize(params.get('size'))
      setWidth(params.get('width'))
      setHeight(params.get('height'))
    } else {
      setSize(null)
      setWidth(null)
      setHeight(null)
    }

    setIsOpen(true)
  }, [])

  const closeFormDialog = useCallback(() => {
    setIsOpen(false)
    setHandle(null)
    setSize(null)
    setWidth(null)
    setHeight(null)
  }, [])

  const value: FormDialogContextType = {
    isOpen,
    handle,
    size,
    width,
    height,
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
