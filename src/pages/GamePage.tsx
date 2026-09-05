import React, { useCallback, useContext, useMemo, type ReactElement } from "react"
import { GameContext, type BonusType } from "../components/Game"

import "./GamePage.css"
import { Dots } from "../components/Dots"
import { Icon } from "../components/Icons"
import { Box } from "../components/Box"
import { Statistics } from "../components/Statistics"
import { PlayerInfoSection } from "../components/PlayerInfoSection"
import { PlayerBonusSection } from "../components/PlayerBonusSection"

export function GamePage() {
  const { currentTurn, remainingDice, addToThrow, removeFromThrow, nextThrow, players, canEndTurn, canThrowAgain, setBonus } = useContext(GameContext)

  /*const currentRank = useMemo(() => {
    const currentScore = players[currentPlayerId].score
    return players.filter(player => player.score > currentScore).length + 1
  }, [players, currentPlayerId])*/

  const diceButtons = useCallback((items: number[]) => {
    if (!currentTurn) return null
    return items.map(value => {
      const triplet = currentTurn.bonus !== "Straße" && value !== 1 && value !== 5
      let disabled = false
      if (currentTurn.bonus === "Aussetzen") {
        // Disable all buttons
        disabled = true;
      } else if (currentTurn.bonus === "Straße") {
        // Disable buttons that have already been added to the attempt
        disabled = currentTurn.throws.find(t => t.indexOf(value) !== -1) !== undefined
      } else {
        // Disable buttons that would exceed the total of 6 dice
        disabled = (triplet ? 3 : 1) > remainingDice
      }
      return (
        <Box disabled={disabled} key={value} onClick={() => addToThrow(value)}>
          <Dots count={value} />
        </Box>
      )
    })
  }, [currentTurn, remainingDice])

  const diceDisplay = useMemo(() => {
    const elements: React.JSX.Element[] = []
    if (!currentTurn) return null
    currentTurn.throws.forEach((_throw, i) => {
      if (elements.length >= 6 - remainingDice) return
      const offset = 6 - elements.length - _throw.length
      _throw.forEach((t, j) => {
        const key = currentTurn.bonus === "Straße" ? t : offset + j
        if (i === 0) elements.push(<Box key={key} color="red" onClick={() => removeFromThrow(j)}><Dots count={t} size="full" /></Box>)
        else elements.push(<Box key={key} disabled onClick={() => {}}><Dots count={t} size="full" /></Box>)
      })
    })
    return elements.sort((a, b) => parseInt(a.key ?? "0") - parseInt(b.key ?? "0"))
  }, [currentTurn, remainingDice])

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

      <section className="throw">
        {diceDisplay}
      </section>

      <section className="inputs">
        <div className="inputs__throw">
          {diceButtons([1, 2, 3])}
          <Box onClick={() => nextThrow()} disabled={!canThrowAgain}>
            <><Icon icon="next-throw" /><span>Nächster Wurf</span></>
          </Box>
          {diceButtons([4, 5, 6])}
          <Box onClick={() => {}} disabled={!canEndTurn}><><Icon icon="stop" /><span>Zug beenden</span></></Box>
        </div>
      </section>
    </>
  )
}