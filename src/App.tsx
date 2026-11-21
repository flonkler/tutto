//import { useState } from 'react'
import './App.css'
import { GameContextWrapper } from './components/Game'
import { GamePage } from './pages/GamePage'
import { Layout, type LayoutPage } from './components/Layout'
import { ResultsPage } from './pages/ResultsPage'


export default function() {
  const pages: LayoutPage[] = [
    {icon: "table", label: "table", content: <ResultsPage />, group: 0},
    {icon: "play", label: "game", content: <GamePage />, group: 1},
    {icon: "settings", label: "settings", group: 1} 
  ]

  return (
    <GameContextWrapper>
      <Layout pages={pages} />
    </GameContextWrapper>
  )
  // <NavigationBar tabs={tabs} layout={layout} onOpenPage={onOpenPage}/>
  //     <div className="container">
  //       <main className="main" ref={containerRef} onMouseMove={(e) => console.log(e)}>
  //         <GameContextWrapper>
  //           {content}
  //         </GameContextWrapper>
  //       </main>
  //     </div>
}
