import type { ReactElement } from "react";

import "./Box.css"

interface BoxProps {
  color?: "default" | "red" | "blue"
  children?: ReactElement
  disabled?: boolean
  onClick?: () => void
}
export function Box({ children, onClick, disabled = false, color = "default" }: BoxProps) {
  if (onClick) {
    return (
      <button className={`box box--${color}`} onClick={onClick} disabled={disabled}>
        <div className="box__content">
          {children}
        </div>
      </button>
    )
  } else {
    return (
      <div className={`box box--${color}`}>
        <div className="box__content">{children}</div>
      </div>
    )
  }
}