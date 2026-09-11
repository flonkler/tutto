import type { ReactNode } from "react";

import "./Box.css"

interface BoxProps {
  className?: string
  color?: "default" | "red" | "blue" | "yellow"
  children?: ReactNode
  disabled?: boolean
  onClick?: () => void
}
export function Box({ children, onClick, disabled = false, color = "default", className = "" }: BoxProps) {
  if (onClick) {
    return (
      <button className={`box box--${color} ${className}`} onClick={onClick} disabled={disabled}>
        <div className="box__content">
          {children}
        </div>
      </button>
    )
  } else {
    return (
      <div className={`box box--${color} ${className}`}>
        <div className="box__content">{children}</div>
      </div>
    )
  }
}