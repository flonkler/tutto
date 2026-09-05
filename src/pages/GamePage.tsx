import React, { useCallback, useContext, useMemo, type ReactElement } from "react"
import { GameContext, type BonusType } from "../components/Game"

import "./GamePage.css"
import { Dots } from "../components/Dots"
import { Icon } from "../components/Icons"
import { Box } from "../components/Box"
import { Statistics } from "../components/Statistics"

export function GamePage() {
  const { currentTurn, currentScore, remainingDice, addToThrow, removeFromThrow, nextThrow, players, canEndTurn, canThrowAgain, setBonus } = useContext(GameContext)

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

  const bonusLabel = useMemo<string>(() => {
    if (!currentTurn?.bonus) return ""
    if (currentTurn.bonus === "Aussetzen") return "⛔"
    if (currentTurn.bonus === "Feuerwerk") return "🎉"
    if (currentTurn.bonus === "Kleeblatt") return "🍀"
    return currentTurn.bonus
  }, [currentTurn])

  return (
    <>
      <div className="game-nav">
        <Box onClick={() => {}}><Icon icon="undo" /></Box>
        <h1>{currentTurn !== null ? players[currentTurn.playerId] : "tmp"}</h1>
        <Box onClick={() => {}} disabled={true}><Icon icon="redo" /></Box>
      </div>
      
      <section>
        <Box color="blue">
          <div className="attempt-info">
            <div className="attempt-info__item">
              <label>Runde</label>
              <span>10</span>
            </div>
            <div className="attempt-info__item">
              <label>Gesamt</label>
              <span>5000</span>
            </div>
            <div className="attempt-info__item">
              <label>Platz</label>
              <span>5</span>
            </div>
            {currentTurn?.bonus && <>
              <div className="attempt-info__item">
                <label>Wurf</label>
                <span>{currentTurn?.throws.length ?? 0}</span>
              </div>
              <div className="attempt-info__item attempt-info__item--large">
                <label>Punkte</label>
                <span className="">{currentScore}</span>
              </div>
              <div className="attempt-info__item">
                <label>Bonus</label>
                <span>{bonusLabel}</span>
              </div>
            </>}           
          </div>
        </Box>
      </section>

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
  /*
  <div className="dice-box" style={{marginBottom: "12px"}}>
          <select value={mode} onChange={e => changeMode(e.target.value as ModeType)}>
            {["+200", "+300", "+400", "+500", "+600", "x2", "±1000", "Straße", "Feuerwerk", "Kleeblatt", "Aussetzen"].map((value, index) => (
              <option key={index} value={value}>{value}</option>
            ))}
          </select>
        </div>*/
}