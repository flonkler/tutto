import { useCallback, useEffect,  useRef } from "react";
import { Icon } from "./Icons"
import "./NavigationBar.css"

import type { NavigationItem, LayoutItem, PageLabel } from "../App"

export interface NavigationBarProps {
  tabs: NavigationItem[]
  layout: LayoutItem[]
  onOpenPage: (label: PageLabel) => void
}
export function NavigationBar({ tabs, layout, onOpenPage }: NavigationBarProps) {
  const gap = 2

  const tabRefs = useRef<any[]>(Array(tabs.length).fill(null))
  const updateTabRef = useCallback((ref: any, index: number) => {
    tabRefs.current[index] = ref
    updateTabPositions()
  }, []);

  function updateTabPositions() {
    let currentOffset = 0
    tabRefs.current.forEach((tab, index) => {
      if (layout.length === 2 && index > 0) currentOffset = Math.max(layout[1].left, currentOffset)
      if (tabRefs.current[index]) tabRefs.current[index].style = `left: ${currentOffset}px`;
      if (tab) currentOffset += (tab?.getBoundingClientRect()?.width ?? -gap) + gap
    })
  }
  useEffect(updateTabPositions, [tabs, layout])

  return (
    <header className="nav">
      <div className="container">
        <div className="nav__container">
        {tabs.map((tab, index) => (
          <button key={tab.label} ref={ref => updateTabRef(ref, index)}
            onClick={() => onOpenPage(tab.label)}
            className={"nav-tab" + (layout.find(({label}) => label === tab.label) ? " nav-tab--selected" : "")}>
              <Icon icon={tab.icon} />
              {tab.label}
          </button>
        ))}
      </div>
      </div>
    </header>
  )
}