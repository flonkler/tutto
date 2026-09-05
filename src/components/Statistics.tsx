import "./Statistics.css"

import { useContext } from "react"
import { GameContext } from "./Game"
import { Bar } from "./Bar"

export function Statistics() {
  const { statistics } = useContext(GameContext)

  function formatPercentage(value: number) {
    return value.toLocaleString(undefined, {style: "percent", maximumSignificantDigits: 3})
  }

  return (
    <div className="statistics">
      <label>Nächster Wurf</label>
      <span>{statistics.expectedScore}</span>

      <label>Tutto</label>
      <Bar progress={statistics.tuttoProbability} />
      <span>{formatPercentage(statistics.tuttoProbability)}</span>
      <label>Nieten</label><Bar progress={statistics.blankProbability} />
      <span>{formatPercentage(statistics.blankProbability)}</span>
    </div>
  )
}