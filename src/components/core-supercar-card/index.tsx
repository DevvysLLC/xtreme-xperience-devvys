import type { FC } from 'react'
import type { SupercarBaseFragment } from '../../core/dato/fragments/supercar-base.typegen'
import { SupercarCardPackage } from './card-package'
import { SupercarCardSimple, type SupercarCardSimpleData } from './card-simple'
import { SupercarCardStats } from './card-stats'
import type { CardBackgroundColor, CardType } from './io'

type CoreSupercarCardBaseProps = {
  className?: string
  backgroundColor?: CardBackgroundColor
  addLinks?: boolean
}

export type CoreSupercarCardProps =
  | (CoreSupercarCardBaseProps & {
      data: SupercarCardSimpleData
      type?: 'simple'
    })
  | (CoreSupercarCardBaseProps & {
      data: SupercarBaseFragment
      type: Exclude<CardType, 'simple'>
    })

export const CoreSupercarCard: FC<CoreSupercarCardProps> = (props) => {
  if (!props.data.model) {
    return null
  }

  const className = props.className ?? ''
  const backgroundColor = props.backgroundColor ?? 'white'
  const addLinks = props.addLinks ?? true

  if (props.type === 'stats') {
    return (
      <SupercarCardStats
        data={props.data}
        className={className}
        backgroundColor={backgroundColor}
        addLinks={addLinks}
      />
    )
  }

  if (props.type === 'package') {
    return (
      <SupercarCardPackage
        data={props.data}
        className={className}
        backgroundColor={backgroundColor}
        addLinks={addLinks}
      />
    )
  }

  return (
    <SupercarCardSimple
      data={props.data}
      className={className}
      backgroundColor={backgroundColor}
      addLinks={addLinks}
    />
  )
}
