import { useContext, useMemo } from "react";
import { Box } from "./Box"
import "./PlayerStatisticsSection.css"
import { Icon } from "./Icons";
import { GameContext, type StatsType } from "./Game";
import { computeStats } from "../lib/compute";

export function PlayerStatisticsSection() {
  const { currentTurn, currentScore, remainingDice, expandStats, collapseStats, statsExpanded } = useContext(GameContext)

  const statistics = useMemo<StatsType>(() => {
    // TODO: Compute stats
    return computeStats(currentScore, remainingDice, currentTurn?.bonus ?? "Aussetzen")
  }, [currentTurn, currentScore, remainingDice])

  function formatPercentage(value: number) {
    return value.toLocaleString(undefined, {style: "percent", maximumSignificantDigits: 3})
  }

  function formatNumber(value: number) {
    return value.toLocaleString(undefined, {maximumFractionDigits: 1, useGrouping: false})
  }

  return (
    <section className="player-stats">
      <Box>
        <div className="player-stats__container">
          <div className="player-stats__container__header">
            {!statsExpanded && <button onClick={() => expandStats()}>Statistiken anzeigen</button>}
            {statsExpanded && <>
              <button><Icon icon="info" /></button>
              <h2>Statistiken</h2>
              <button onClick={() => collapseStats()}><Icon icon="close" /></button>
            </>}
          </div>
          {statsExpanded && <div className="player-stats__container__content">
            <label>Erwartungswert</label>
            <span>{formatNumber(statistics.expectedScore)}</span>
            <label>Tutto-Wahrscheinlichkeit</label>
            <span>{formatPercentage(statistics.tuttoProbability)}</span>
            <label>Nieten-Wahrscheinlichkeit</label>
            <span>{formatPercentage(statistics.blankProbability)}</span>  
          </div>}
        </div>
      </Box>
    </section>
  )
}
