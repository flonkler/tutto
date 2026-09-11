import "./PlayerBonusSection.css"

import { useContext } from "react";
import { Box } from "./Box";
import { GameContext, type BonusType } from "./Game";

export function PlayerBonusSection() {
  const { setBonus, endTurn } = useContext(GameContext)
  return (
    <section className="bonus">
      <span>Wähle den aufgedeckten Bonus aus.</span>
      <div className="bonus__grid">
        {["+200", "+300", "+400", "+500", "+600", "x2", "±1000", "Straße", "Feuerwerk", "Kleeblatt"].map((value, index) => (
          <Box key={index} onClick={() => setBonus(value as BonusType)}>{value}</Box>
        ))}
        <Box onClick={() => endTurn()} color="red">Aussetzen</Box>
      </div>      
    </section>
  )
}