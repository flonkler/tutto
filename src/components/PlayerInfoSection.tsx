import "./PlayerInfoSection.css"

import { useContext } from "react"
import { Box } from "./Box"
import { GameContext } from "./Game"

export function PlayerInfoSection() {
  const { round, currentTurn, currentScore, currentRank, currentTotal } = useContext(GameContext)
  
  return (
    <section className="player-info">
      <Box color="blue">
        <div className="player-info__grid">
          <div className="player-info__grid__item">
            <label>Runde</label>
            <span>{round}</span>
          </div>
          <div className="player-info__grid__item">
            <label>Gesamt</label>
            <span>{currentTotal}</span>
          </div>
          <div className="player-info__grid__item">
            <label>Platz</label>
            <span>{currentRank}</span>
          </div>
          {currentTurn?.bonus && <>
            <div className="player-info__grid__item">
              <label>Wurf</label>
              <span>{currentTurn.throws.length}</span>
            </div>
            <div className="player-info__grid__item">
              <label>Punkte</label>
              <span>{currentScore}</span>
            </div>
            <div className="player-info__grid__item">
              <label>Bonus</label>
              <span className={currentTurn.bonus.length > 6 ? "small" : undefined}>{currentTurn.bonus}</span>
            </div>
          </>}
        </div>
      </Box>
    </section>
  )
}