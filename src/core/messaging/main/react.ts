import { makeUseMessageBus } from '../create-message-bus/react'
import { initMainBus } from './index'

const mainBus = initMainBus()

export const useMainBus = makeUseMessageBus(mainBus)
