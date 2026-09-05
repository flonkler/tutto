import { useCallback, useContext, useMemo, type ReactElement } from "react"
import { GameContext, type ModeType } from "../components/Game"

import "./GamePage.css"
import { Dots } from "../components/Dots"
import { Icon } from "../components/Icons"

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
        <button disabled={disabled} key={dots} className="dice-box inputs__throw__item" onClick={() => addToThrow(dots)}>
          <Dots count={dots} />
        </button>
      )
    })
  }, [mode, previousThrow, currentThrow])

  const diceDisplay = useMemo(() => {
    const elements: ReactElement[] = []
    if (mode === "Straße") {
      let disabledBefore = false
      for (let i = 0; i < 6; ++i) {
        let disabledAfter = false;
        if (previousThrow.indexOf(i + 1) !== -1) {
          disabledAfter = true;
          elements.push(<button key={i} className="dice-box" disabled ><Dots count={i + 1} size="large" /></button>)
        } else {
          let index = currentThrow.indexOf(i + 1)
          if (index !== -1) elements.push(<button key={i} className="dice-box" onClick={() => removeFromThrow(index)}><Dots count={i + 1} size="large" /></button>)
          else elements.push(<div key={elements.length} className="dice-placeholder"></div>)
        }
        if (i > 0 && disabledBefore !== disabledAfter) elements.splice(elements.length - 1, 0, <div key={i+10} className="throw__spacer"></div>) 
        disabledBefore = disabledAfter
      }
    } else {
      elements.push(...previousThrow.map((value, i) => <button key={i} className="dice-box" disabled ><Dots count={value} size="large" /></button>))
      elements.push(...currentThrow.map((value, i) => <button key={10 + i} className="dice-box" onClick={() => removeFromThrow(i)}><Dots count={value} size="large" /></button>))
      while (elements.length < 6) elements.push(<div key={elements.length} className="dice-placeholder"></div>)
      if (previousThrow.length > 0) elements.splice(previousThrow.length, 0, <div className="throw__spacer"></div>)
    }
    return elements
  }, [currentThrow, previousThrow, mode])

  return (
    <>
      <section className="player-info">
        <div className="player-info__name">{/*players[currentPlayerId].name*/}</div>
        <div className="player-info__score">
          {score}
        </div>
      </section>

      <section className="attempt-info">
        <span className="attempt-info__score">{/*currentAttemptScore*/}</span>
        <span className="attempt-info__counter">{/*attempt.throw*/}</span>

        <div className="input-box">
          <Icon icon="play" />
        </div>
      </section>

      <div className="dice-box">
        <select value={mode} onChange={e => changeMode(e.target.value as ModeType)}>
          {["+200", "+300", "+400", "+500", "+600", "x2", "±1000", "Straße", "Feuerwerk", "Kleeblatt", "Aussetzen"].map((value, index) => (
            <option key={index} value={value}>{value}</option>
          ))}
        </select>
      </div>

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
    </>
  )
}