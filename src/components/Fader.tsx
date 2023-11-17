import React from 'react'

import { useIsFirstRender, Constants } from '../utils'

import './Fader.scss'

export function Fader({
  active,
  onAnimationEnd = () => {},
  children,
}: React.PropsWithChildren<{
  active: boolean
  onAnimationEnd?: (active: boolean) => void
}>): JSX.Element {
  const faderRef = React.useRef<HTMLDivElement>(null)
  const isFirstRender = useIsFirstRender()

  React.useEffect(() => {
    if (!faderRef.current) return
    if (isFirstRender) {
      faderRef.current.style.pointerEvents = active ? 'auto' : 'none'
      faderRef.current.style.opacity = active ? '1' : '0'
      return
    }

    let timeoutHandle: number | null = null
    let animationFrameHandle: number | null = null
    let startingTime: number | null = null

    if (active) {
      faderRef.current.style.pointerEvents = 'auto'

      if (
        faderRef.current.style.opacity === '1' ||
        faderRef.current.style.opacity === ''
      )
        return

      const fadeIn: FrameRequestCallback = (time: DOMHighResTimeStamp) => {
        if (!faderRef.current) return
        if (startingTime === null) startingTime = time

        const elapsedTime = time - startingTime

        /**
         * FIXME: Set opacity based on starting opacity in case Fader is rerendered during,
         *        this can occur when changing languages during fade animation for example
         */

        const opacity = Math.min(1, elapsedTime / Constants.ANIMATION_LENGTH)
        faderRef.current.style.opacity = `${opacity}`

        if (opacity !== 1) animationFrameHandle = requestAnimationFrame(fadeIn)
        else onAnimationEnd(active)
      }

      timeoutHandle = setTimeout(
        () => requestAnimationFrame(fadeIn),
        Constants.ANIMATION_LENGTH
      )
    } else {
      faderRef.current.style.pointerEvents = 'none'

      if (faderRef.current.style.opacity === '0') return

      const fadeOut: FrameRequestCallback = (time: DOMHighResTimeStamp) => {
        if (!faderRef.current) return
        if (startingTime === null) startingTime = time

        const elapsedTime = time - startingTime

        const opacity = Math.max(
          0,
          1 - elapsedTime / Constants.ANIMATION_LENGTH
        )
        faderRef.current.style.opacity = `${opacity}`

        if (opacity !== 0) animationFrameHandle = requestAnimationFrame(fadeOut)
        else onAnimationEnd(active)
      }

      animationFrameHandle = requestAnimationFrame(fadeOut)
    }

    return () => {
      if (timeoutHandle !== null) clearTimeout(timeoutHandle)
      if (animationFrameHandle !== null)
        cancelAnimationFrame(animationFrameHandle)
    }
  }, [active, isFirstRender, onAnimationEnd])

  return (
    <div className="fader" ref={faderRef}>
      {children}
    </div>
  )
}
