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
      <h2>Erwartungswerte</h2>
      <label>Nächster Wurf</label>
      <span>{statistics.expectedScore}</span>
      <h2>Wahrscheinlichkeiten</h2>
      <label>Tutto</label>
      <Bar progress={statistics.tuttoProbability} />
      <span>{formatPercentage(statistics.tuttoProbability)}</span>
      <label>Nieten</label><Bar progress={statistics.blankProbability} />
      <span>{formatPercentage(statistics.blankProbability)}</span>
    </div>
  )
}