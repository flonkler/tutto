import "./PlayerThrowSection.css"

import { useCallback, useContext, useMemo } from "react"
import { GameContext } from "./Game"
import { Box } from "./Box"
import { Dots } from "./Dots"
import { Icon } from "./Icons"

export function PlayerThrowSection() {
  const { currentTurn, remainingDice, addToThrow, removeFromThrow, nextThrow, canThrowAgain, canEndTurn } = useContext(GameContext)

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
    <section className="throw">
      <div className="throw__display">
        {diceDisplay}
      </div>
      <div className="throw__inputs">
        {diceButtons([1, 2, 3])}
        <Box onClick={() => nextThrow()} disabled={!canThrowAgain}>
          <Icon icon="next-throw" /><span>Nächster Wurf</span>
        </Box>
        {diceButtons([4, 5, 6])}
        <Box onClick={() => {}} disabled={!canEndTurn}>
          <Icon icon="stop" /><span>Zug beenden</span>
        </Box>
      </div>
    </section>
  )
}