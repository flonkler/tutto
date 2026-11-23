import "./ResultsPage.css"

import { useCallback, useContext, useMemo, type ReactNode } from "react";
import { GameContext } from "../components/Game";
import { Box } from "../components/Box";
import { Icon } from "../components/Icons";
import { applyTuttoBonus } from "../lib/compute";

export function ResultsPage() {
  const { players, turns, round, currentTurn } = useContext(GameContext)

  function scrollToEnd(ref: Element | null) {
    if (ref !== null) ref.scrollIntoView({ behavior: "smooth", block: "end" })
  }

  const tableBodyRow = useCallback((playerId: number) => {
    const cells: ReactNode[] = []
    let cumulativeScore = 0
    const ownTurns = turns.filter(turn => turn.playerId === playerId);
    for (let i = 0; i < round; ++i) {
      if (i >= ownTurns.length) {
        cells.push(<label>-</label>)
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
        <>
          <label data-highlight={cumulativeScore >= 6000}>{cumulativeScore}</label>
          {details.map((detail, index) => (
            <span key={index} data-type={detail.type}>{detail.content}</span>
          ))}          
        </>
      )
    }

    return cells.map((cell, index) => (
      <td key={index} className="result-table__row__cell result-table__row__cell--turn">
        <div>
          {cell}
        </div>
      </td>
    ))
  }, [turns, round])

  const tableHeader = useMemo<ReactNode[]>(() => {
    return Array(round).fill(null).map((_, index) => (
      <th key={index} ref={index === round - 1 ? scrollToEnd : undefined}>{index+1}</th>
    ))
  }, [round])

  return (
    <div>
      <div className="result-buttons">
        <Box onClick={() => {}}><Icon icon="edit" />Spieler bearbeiten</Box>
        <Box onClick={() => {}} color="red"><Icon icon="new" />Neues Spiel</Box>
      </div>
      
      <p></p>
      <div className="result-table-wrapper">
        <table className="result-table">
          <tbody>
          <tr className="result-table__row">
            <th>Runde</th>
            {...tableHeader}
          </tr>
          {players.map((player, index) => (
            <tr key={index} className="result-table__row" data-highlight={index === currentTurn?.playerId}>
              <td className="result-table__row__player">{player}</td>
              {...tableBodyRow(index)}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}