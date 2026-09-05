import "./PlayerInfoSection.css"

import { useContext, useMemo } from "react"
import { Box } from "./Box"
import { GameContext } from "./Game"

export function PlayerInfoSection() {
  const { round, currentTurn, currentScore } = useContext(GameContext)
  
  const bonusLabel = useMemo<string>(() => {
    if (!currentTurn?.bonus) return ""
    if (currentTurn.bonus === "Aussetzen") return "⛔"
    if (currentTurn.bonus === "Feuerwerk") return "🎉"
    if (currentTurn.bonus === "Kleeblatt") return "🍀"
    return currentTurn.bonus
  }, [currentTurn])
  
  return (
    <section className="player-info">
      <Box color="blue">
        <div className="attempt-info">
          <div className="attempt-info__item">
            <label>Runde</label>
            <span>{round}</span>
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
              <span>{currentTurn.throws.length}</span>
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
  )
}