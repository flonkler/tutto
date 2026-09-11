import { useContext, useMemo } from "react"
import { GameContext } from "../components/Game"

import "./GamePage.css"
import { Icon } from "../components/Icons"
import { Box } from "../components/Box"
import { PlayerInfoSection } from "../components/PlayerInfoSection"
import { PlayerBonusSection } from "../components/PlayerBonusSection"
import { PlayerThrowSection } from "../components/PlayerThrowSection"
import { PlayerStatisticsSection } from "../components/PlayerStatisticsSection"

export function GamePage() {
  const { currentTurn, players, setBonus, scores } = useContext(GameContext)

  const pointLimitWarning = useMemo<string>(() => {
    const names = players.filter((_, i) => scores[i] > 6000)
    if (names.length === 0) return ""
    if (names.length === 1) return `${names[0]} hat das Limit von 6000 Punkten erreicht.`
    return `${names.length} Spieler haben das Limit von 6000 Punkten erreicht.`
  }, [scores])

  return (
    <>
      {!currentTurn && <p>Start a game</p>}

      {currentTurn && <section className="game-nav">
        <Box onClick={() => setBonus(null)}><Icon icon="undo" /></Box>
        <h1>{players[currentTurn.playerId]}</h1>
        <Box onClick={() => {}} disabled={true}><Icon icon="redo" /></Box>
      </section>}

      {currentTurn && <PlayerInfoSection />}

      {pointLimitWarning !== "" && <section className="game-notification">
        <Box color="yellow">
          <Icon icon="warning" /><span>{pointLimitWarning}</span>
        </Box>
      </section>}

      {!currentTurn?.bonus && <PlayerBonusSection />}

      {currentTurn?.bonus && <>
        <PlayerThrowSection />
        <PlayerStatisticsSection />
      </>}      
    </>
  )
}