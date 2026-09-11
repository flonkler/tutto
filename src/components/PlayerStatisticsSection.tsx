import { useState } from "react";
import { Box } from "./Box"
import "./PlayerStatisticsSection.css"
import { Icon } from "./Icons";

export function PlayerStatisticsSection() {
  const [expanded, setExpanded] = useState<Boolean>(false);
  return (
    <section className={`player-stats ${expanded ? "player-stats--expanded" : ""}`}>
      <Box color="yellow">
        <div className="player-stats__header">
          {!expanded && <button onClick={() => setExpanded(true)}>Statistiken anzeigen</button>}
          {expanded && <>
            <button><Icon icon="info" /></button>
            <h2>Statistiken</h2>
            <button onClick={() => setExpanded(false)}><Icon icon="close" /></button>
          </>}
        </div>
      </Box>
    </section>
  )
  
}