import "./Bar.css"

export interface BarProps {
  progress: number
}
export function Bar({ progress }: BarProps) {
  return (
    <div className="bar">
      <div className="bar__progress" style={{width: `${progress * 100}%`}}></div>
    </div>
  )
}