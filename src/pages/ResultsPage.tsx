import { useContext } from "react";
import { GameContext } from "../components/Game";

export function ResultsPage() {
  const { players } = useContext(GameContext)

  return (
    <div>
      {players}
    </div>
  )
}