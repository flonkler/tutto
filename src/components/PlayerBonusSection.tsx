import "./PlayerBonusSection.css"

import { useContext } from "react";
import { Box } from "./Box";
import { GameContext, type BonusType } from "./Game";

export function PlayerBonusSection() {
  const { setBonus } = useContext(GameContext)
  return (
    <section className="bonus">
      {["+200", "+300", "+400", "+500", "+600", "x2", "±1000", "Straße", "Feuerwerk", "Kleeblatt", "Aussetzen"].map((value, index) => (
        <Box key={index} onClick={() => setBonus(value as BonusType)}>{value}</Box>
      ))}
    </section>
  )
}