'use client'

import { type FC, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { BookingSupercarFragment } from '../../../../core/dato/fragments/booking-config.typegen'
import styles from './style.module.scss'

export type ComparedCarItem = {
  supercar: BookingSupercarFragment
  seatTypeId: number
  drivePrice: number | null
  standardValue: number | null
  savings: number | null
  coveragePrice: number
  power: string
  laps: number | string
  transmission: string
}

type Props = {
  isOpen: boolean
  comparedCars: ComparedCarItem[]
  onClose: () => void
  onSelectCar: (seatTypeId: number) => void
}

export const CompareCarsModal: FC<Props> = ({
  isOpen,
  comparedCars,
  onClose,
  onSelectCar
}) => {
  useEffect(() => {
    if (!isOpen) {
      return
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modal__head}>
          <h2 id="compare-modal-title" className={styles.modal__title}>
            FIND YOUR SUPERCAR
          </h2>
          <button
            type="button"
            className={styles.modal__close}
            aria-label="Close dialog"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={styles.modal__body}>
          <div className={styles.modal__tableWrapper}>
            <table className={styles.modal__table}>
              <thead>
                <tr>
                  <th scope="col">Car</th>
                  {comparedCars.map((item) => {
                    const supercar = item.supercar.supercar
                    const make = supercar.model?.make ?? ''
                    const model = supercar.model?.model ?? supercar.model?.title ?? ''
                    const imgUrl =
                      item.supercar.thumbnailOverride?.image?.url ??
                      supercar.model?.thumbnail?.image?.url ??
                      '/images/fallback.png'

                    return (
                      <th key={item.seatTypeId} scope="col">
                        <div className={styles.modal__carHeader}>
                          <img
                            src={imgUrl}
                            alt={`${make} ${model}`}
                            className={styles.modal__carImage}
                          />
                          <div className={styles.modal__carName}>
                            {make && <span>{make}</span>}
                            <strong>{model}</strong>
                          </div>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Drive price from</th>
                  {comparedCars.map((item) => (
                    <td key={item.seatTypeId} className={styles.modal__cell}>
                      {item.drivePrice != null ? `$${item.drivePrice}` : '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Highest standard value</th>
                  {comparedCars.map((item) => (
                    <td key={item.seatTypeId} className={styles.modal__cell}>
                      {item.standardValue != null ? `$${item.standardValue}` : '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Save up to</th>
                  {comparedCars.map((item) => (
                    <td key={item.seatTypeId} className={styles.modal__cell}>
                      {item.savings != null && item.savings > 0
                        ? `$${item.savings}`
                        : '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Coverage from</th>
                  {comparedCars.map((item) => (
                    <td key={item.seatTypeId} className={styles.modal__cell}>
                      ${item.coveragePrice}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Power</th>
                  {comparedCars.map((item) => (
                    <td key={item.seatTypeId} className={styles.modal__cell}>
                      {item.power}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Laps</th>
                  {comparedCars.map((item) => (
                    <td key={item.seatTypeId} className={styles.modal__cell}>
                      {item.laps}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Transmission</th>
                  {comparedCars.map((item) => (
                    <td key={item.seatTypeId} className={styles.modal__cell}>
                      {item.transmission}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Next</th>
                  {comparedCars.map((item) => (
                    <td key={item.seatTypeId} className={styles.modal__cell}>
                      <button
                        type="button"
                        className={styles.modal__selectBtn}
                        onClick={() => {
                          onSelectCar(item.seatTypeId)
                          onClose()
                        }}
                      >
                        SELECT
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <p className={styles.modal__footerNote}>
            Starting prices are for early sessions on your selected day. Savings
            compare with each car&apos;s highest standard Thursday–Sunday price.
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}
