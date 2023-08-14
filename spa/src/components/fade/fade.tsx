'use client'

import { useEffect, useState } from 'react'
import './animations.css'
import classNames from 'classnames'

type TFadeProps = React.HTMLAttributes<'div'> & {
  show: boolean
  children: React.ReactNode
}

export function Fade({
  className,
  show,
  children
}: TFadeProps) {
  const [render, setRender] = useState(show)

  useEffect(() => {
    if (show) {
      setRender(true)
    }
  }, [show])

  const onAnimationEnd = () => {
    if (!show) {
      setRender(false)
    }
  }

  const classes = classNames('transition-all', className)

  return (
    <>
      {render && (
        <div
          className={classes}
          style={{
            animationName: show ? 'fadeIn' : 'fadeOut',
            animationDuration: '0.3s',
            animationFillMode: 'forwards'
          }}
          onAnimationEnd={onAnimationEnd}
        >
          {children}
        </div>
      )}
    </>
  )
}
