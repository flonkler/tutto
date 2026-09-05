interface DotsProps {
  count: number
  size?: "small" | "medium" | "large"
}
export function Dots({ count, size = "medium" }: DotsProps) {
  const radius = 4
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32" className={`dots--${size}`}>
      {count % 2 === 1 && <circle r={radius} cx="16" cy="16"></circle>}
      {count > 1 && <g><circle r={radius} cx="4" cy="4"></circle><circle r={radius} cx="28" cy="28"></circle></g>}
      {count > 3 && <g><circle r={radius} cx="28" cy="4"></circle><circle r={radius} cx="4" cy="28"></circle></g>}
      {count === 6 && <g><circle r={radius} cx="4" cy="16"></circle><circle r={radius} cx="28" cy="16"></circle></g>}
    </svg>

  )
}