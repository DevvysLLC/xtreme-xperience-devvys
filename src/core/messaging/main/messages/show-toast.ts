export const SHOW_TOAST_MESSAGE_NAME = 'toast:show'

export type ToastType = 'success' | 'error' | 'info'

export type ShowToastDetails = {
  message: string
  type?: ToastType
  duration?: number
}

export type ShowToast = {
  name: typeof SHOW_TOAST_MESSAGE_NAME
  details: ShowToastDetails
}
