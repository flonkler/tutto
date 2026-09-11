import React, { useCallback, useContext, useMemo, type ReactElement } from "react"
import { GameContext, type BonusType } from "../components/Game"

import "./GamePage.css"
import { Dots } from "../components/Dots"
import { Icon } from "../components/Icons"
import { Box } from "../components/Box"
import { Statistics } from "../components/Statistics"
import { PlayerInfoSection } from "../components/PlayerInfoSection"
import { PlayerBonusSection } from "../components/PlayerBonusSection"
import { PlayerThrowSection } from "../components/PlayerThrowSection"
import { PlayerStatisticsSection } from "../components/PlayerStatisticsSection"

export function GamePage() {
  const { currentTurn, players, setBonus } = useContext(GameContext)

  /*const currentRank = useMemo(() => {
    const currentScore = players[currentPlayerId].score
    return players.filter(player => player.score > currentScore).length + 1
  }, [players, currentPlayerId])*/

  return (
    <>
      {!currentTurn && <p>Start a game</p>}

      {currentTurn && <section className="game-nav">
        <Box onClick={() => setBonus(null)}><Icon icon="undo" /></Box>
        <h1>{players[currentTurn.playerId]}</h1>
        <Box onClick={() => {}} disabled={true}><Icon icon="redo" /></Box>
      </section>}

      {currentTurn && <PlayerInfoSection />}

      {!currentTurn?.bonus && <PlayerBonusSection />}

      {currentTurn?.bonus && <PlayerThrowSection />}

      <PlayerStatisticsSection />
    </>
  )
}