'use client'

import {
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useContext,
  useState
} from 'react'

export type DialogTranslations = {
  title: string
  description: string
  confirmButton: string
  cancelButton: string
}

export type ShowDialogOptions = {
  translations: DialogTranslations
  onConfirm: () => Promise<void> | void
  onCancel?: () => void
}

type DialogContextType = {
  isOpen: boolean
  translations: DialogTranslations | null
  showDialog: (options: ShowDialogOptions) => void
  handleConfirm: () => Promise<void>
  handleCancel: () => void
}

const defaultTranslations: DialogTranslations = {
  title: '',
  description: '',
  confirmButton: '',
  cancelButton: ''
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

type Props = {
  children: ReactNode
}

export const DialogProvider: FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [translations, setTranslations] = useState<DialogTranslations | null>(
    null
  )
  const [pendingAction, setPendingAction] = useState<ShowDialogOptions | null>(
    null
  )

  const showDialog = useCallback((options: ShowDialogOptions) => {
    setTranslations(options.translations)
    setPendingAction(options)
    setIsOpen(true)
  }, [])

  const handleConfirm = useCallback(async () => {
    if (!pendingAction) {
      return
    }

    const { onConfirm } = pendingAction

    // Close dialog first - keep translations so globalDialog can send close message
    setIsOpen(false)
    setPendingAction(null)

    // Call the confirm callback
    await onConfirm()
  }, [pendingAction])

  const handleCancel = useCallback(() => {
    if (!pendingAction) {
      return
    }

    const { onCancel } = pendingAction

    // Close dialog - keep translations so globalDialog can send close message
    setIsOpen(false)
    setPendingAction(null)

    // Call cancel callback if provided
    if (onCancel) {
      onCancel()
    }
  }, [pendingAction])

  const value: DialogContextType = {
    isOpen,
    translations: translations ?? defaultTranslations,
    showDialog,
    handleConfirm,
    handleCancel
  }

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  )
}

export const useDialog = () => {
  const context = useContext(DialogContext)
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider')
  }
  return context
}
