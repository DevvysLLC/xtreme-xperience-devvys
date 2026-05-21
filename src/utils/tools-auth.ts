import { cookies } from 'next/headers'

export const isToolsAuthenticated = async (): Promise<boolean> => {
  const cookieStore = await cookies()
  const toolsCookie = cookieStore.get('tools_session')
  return toolsCookie?.value === 'authenticated'
}
