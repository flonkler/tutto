import "./ResultsPage.css"

import { useCallback, useContext, type ReactNode } from "react";
import { GameContext, type TurnType } from "../components/Game";
import { Box } from "../components/Box";
import { Icon } from "../components/Icons";
import { applyTuttoBonus } from "../lib/compute";

export function ResultsPage() {
  const { players, turns, round, currentTurn } = useContext(GameContext)

  function TurnCell(turn: TurnType, previousScore: number) {
    if (turn.baseScore === 0 && !turn.bonusAchieved) return <td className="score-table_turn">+0</td>
    
  }

  const getTurnCellsForPlayer = useCallback((playerId: number) => {
    const cells: ReactNode[] = []
    let cumulativeScore = 0
    const ownTurns = turns.filter(turn => turn.playerId === playerId);
    for (let i = 0; i < round; ++i) {
      if (i >= ownTurns.length) {
        cells.push(<td></td>)
        continue
      }
      const turn = ownTurns[i]
      cumulativeScore += applyTuttoBonus(turn.baseScore, turn.bonusAchieved ? turn.bonus : null)

      const details: {content: string, type: string}[] = []

      if (turn.baseScore > 0) {
        details.push({ content: `+${turn.baseScore}`, type: "positive" })
      }
      if (turn.bonusAchieved) {
        details.push({
          content: (turn.bonus as string).replace("±", "+"),
          type: "positive"
        })
      }
      if (turn.bonus === "Aussetzen") {
        details.push({ content: "Aussetzen", type: "negative" })
      } else if (turn.baseScore === 0 && !turn.bonusAchieved) {
        details.push({ content: "±0", type: "neutral" })
      }

      cells.push(
        <td key={i} className="result-table__row__turn">
          <div className="result-table-cell">
          <span>{cumulativeScore}</span>
          {details.map((detail, index) => (
            <span key={index} className={`result-table-cell__detail result-table-cell__detail--${detail.type}`}>{detail.content}</span>
          ))}
          </div>
        </td>
      )
    }
    return cells
  }, [turns, round])

  return (
    <div>
      <Box onClick={() => {}}><Icon icon="play" />Spieler hinzufügen</Box>
      <div className="results">
        <table>
          <tbody>
          <tr className="result-table__header">
            <th></th>
            {Array(round).fill(null).map((_, i) => <th>{i+1}</th>)}
          </tr>
          {players.map((player, index) => (
            <tr key={index} className={"result-table__row" + (index === currentTurn?.playerId ? " result-table__row--hightlight" : "")}>
              <td className="result-table__row__player">{player}</td>
              {...getTurnCellsForPlayer(index)}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}