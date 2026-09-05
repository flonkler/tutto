import { useCallback, useContext, useMemo, type ReactElement } from "react"
import { GameContext, type ModeType } from "../components/Game"

import "./GamePage.css"
import { Dots } from "../components/Dots"
import { Icon } from "../components/Icons"
import { Box } from "../components/Box"
import { Statistics } from "../components/Statistics"

export function GamePage() {
  const { mode, changeMode, previousThrow, currentThrow, addToThrow, removeFromThrow, nextThrow, score } = useContext(GameContext)

  /*const currentRank = useMemo(() => {
    const currentScore = players[currentPlayerId].score
    return players.filter(player => player.score > currentScore).length + 1
  }, [players, currentPlayerId])*/

  const diceButtons = useCallback((items: number[]) => {
    return items.map((dots) => {
      const triplet = mode !== "Straße" && mode !== "Aussetzen" && dots !== 1 && dots !== 5
      let disabled = false
      if (mode === "Aussetzen") {
        // Disable all buttons
        disabled = true;
      } else if (mode === "Straße") {
        // Disable buttons that have already been added to the attempt
        disabled = [...currentThrow, ...previousThrow].find(value => value === dots) !== undefined
      } else {
        // Disable buttons that would exceed the total of 6 dice
        disabled = 6 - currentThrow.length - previousThrow.length < (triplet ? 3 : 1)
      }
      return (
        <Box disabled={disabled} key={dots} onClick={() => addToThrow(dots)}>
          <Dots count={dots} />
        </Box>
      )
    })
  }, [mode, previousThrow, currentThrow])

  const diceDisplay = useMemo(() => {
    const elements = []
    if (mode === "Straße") {
      for (let value = 1; value <= 6; ++value) { 
        if (previousThrow.indexOf(value) !== -1) {
          elements.push(<button key={value - 1} className="dice-box" disabled><Dots count={value} size="full" /></button>)
          continue;
        }
        const idx = currentThrow.indexOf(value)
        if (idx !== -1) {
          elements.push(<button key={value - 1} className="dice-box dice-box--red" onClick={() => removeFromThrow(idx)}><Dots count={value} size="full" /></button>)
        }
      }
    } else {
      const offset = previousThrow.length
      elements.push(...previousThrow.map((value, i) => <Box key={i} disabled={true} onClick={() => {}}><Dots count={value} size="full" /></Box>))
      elements.push(...currentThrow.map((value, i) => <Box key={offset + i} color="red" onClick={() => removeFromThrow(i)}><Dots count={value} size="full" /></Box>))
    }
    return elements
  }, [currentThrow, previousThrow, mode])

  const modeText = useMemo(() => {
    if (mode === "Aussetzen") return "⛔"
    if (mode === "Feuerwerk") return "🎉"
    if (mode === "Kleeblatt") return "🍀"
    return mode
  }, [mode])

  return (
    <>
      <div className="game-nav">
        <Box onClick={() => {}}><Icon icon="undo" /></Box>
        <h1>Michelangelo</h1>
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
            <div className="attempt-info__item">
              <label>Wurf</label>
              <span>2</span>
            </div>
            <div className="attempt-info__item attempt-info__item--large">
              <label>Punkte</label>
              <span className="">{score}</span>
            </div>
            <div className="attempt-info__item">
              <label>Bonus</label>
              <span>{modeText}</span>
            </div>
          </div>
        </Box>
      </section>

      <section className="throw">
        {diceDisplay}
      </section>

      <section className="inputs">
        
        <div className="inputs__throw">
          {diceButtons([1, 2, 3])}
          <button className="dice-box" onClick={() => nextThrow()} disabled={currentThrow.length === 0}><Icon icon="next-throw" /><span>Nächster Wurf</span></button>
          {diceButtons([4, 5, 6])}
          <button className="dice-box"><Icon icon="stop" /><span>Zug beenden</span></button>
        </div>
      </section>

      <section>
        <Statistics />
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