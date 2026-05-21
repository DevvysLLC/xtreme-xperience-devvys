import { makeUseMessageBus } from '../create-message-bus/preact'
import { initMainBus } from './index'

const mainBus = initMainBus()

export const useMainBus = makeUseMessageBus(mainBus)
