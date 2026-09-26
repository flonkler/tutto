//import { useState } from 'react'
import { useEffect, useMemo, useRef, useState, type DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES, type ReactElement, type ReactNode } from 'react'
import './App.css'
import { NavigationBar } from './components/NavigationBar'
import type { IconType } from './components/Icons'
import { BlankPage } from './pages/BlankPage'
import { GameContextWrapper } from './components/Game'
import { GamePage } from './pages/GamePage'
import { useMediaQuery, useResizeObserver } from './lib/hooks'


export type PageLabel = "table" | "game" | "settings"
export type NavigationItem = {
  icon: IconType,
  label: PageLabel,
  page: ReactNode | null
}
export type LayoutItem = {
  width: number,
  left: number,
  label: PageLabel
}

export default function() {
  const isWide = useMediaQuery("(min-width: 720px)")
  
  const [divider, setDivider] = useState<number>(200)
  
  const [containerSize, containerRef] = useResizeObserver()
  const [layout, setLayout] = useState<LayoutItem[]>([{width: -1, left: 0, label: "game"}])
  
  const tabs: NavigationItem[] = [
    {icon: "table", label: "table", page: null},
    {icon: "play", label: "game", page: <GamePage />},
    {icon: "settings", label: "settings", page: null}   
  ]

  function onOpenPage(label: PageLabel) {
    if (layout.length === 1) {
      setLayout([{width: -1, left: 0, label}])
    } else if (layout.length === 2 && label !== "table") {
      const totalWidth = containerSize?.width ?? 0
      setLayout([
        {width: divider, left: 0, label: "table"},
        {width: totalWidth - divider, left: divider, label: label}
      ])
    }
  }

  useEffect(() => {
    const currentLabel = layout[layout.length - 1].label
    if (!isWide) {
      // single column layout
      setLayout([{width: -1, left: 0, label: currentLabel}])
    } else {
      // two column layout
      setLayout([
        {width: divider, left: 0, label: "table"},
        {width: containerSize.width - divider, left: divider, label: currentLabel}
      ])
    }
  }, [isWide, divider, containerSize])

  return (
    <>
      <NavigationBar tabs={tabs} layout={layout} onOpenPage={onOpenPage}/>
      <div className="container">
        <main className="main" ref={containerRef}>
          <GameContextWrapper>
            {layout.map(({label, width, left}) => <div key={label} className="page" style={{width: width === -1 ? "100%" : width, left}}>
              {tabs.find(item => item.label === label)?.page ?? <BlankPage />}
            </div>)}
          </GameContextWrapper>
        </main>
      </div>
    </>
  )
}
