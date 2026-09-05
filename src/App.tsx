//import { useState } from 'react'
import { useMemo, useState, type ReactNode } from 'react'
import './App.css'
import { NavigationButton } from './components/NavigationButton'
import type { IconType } from './components/Icons'
import { BlankPage } from './pages/BlankPage'
import { GameContextWrapper } from './components/Game'
import { GamePage } from './pages/GamePage'

type NavigationItemType = {
  icon: IconType,
  title: string,
  page: ReactNode
}
const navigationItems: {[key: string]: NavigationItemType} = {
  "table": { icon: "table", title: "Tabelle", page: null },
  "game": { icon: "play", title: "Spielen", page: <GamePage /> },
  "settings": { icon: "settings", title: "Einstellungen", page: null }
}

export default function() {
  const [page, setPage] = useState<string>("game")
  
  const currentPageNode = useMemo<ReactNode>(() => {
    return navigationItems[page]?.page ?? <BlankPage />
  }, [page])

  return (
    <>
      <header className="nav">
        {Object.entries(navigationItems).map(([key, tab]) => (
          <NavigationButton key={key} title={tab.title} icon={tab.icon as IconType} isActive={page === key} onClick={() => setPage(key)} />
        ))}
      </header>
      <main className="main">
        <GameContextWrapper>
          {currentPageNode}
        </GameContextWrapper>
      </main>
    </>
  )
}
