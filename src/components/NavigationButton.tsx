import { Icon, type IconType } from "./Icons"

export interface NavigationButtonProps {
  title: string
  icon: IconType
  isActive?: Boolean
  onClick?: () => void
}
export function NavigationButton({ title, icon, isActive, onClick }: NavigationButtonProps) {
  return (
    <div onClick={onClick}>
      <Icon icon={icon} />
      <span>{title}</span>
    </div>
  )
}