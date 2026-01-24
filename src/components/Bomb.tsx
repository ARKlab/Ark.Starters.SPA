import type { JSX } from "react"

const Bomb = (): JSX.Element => {
  throw new Error("💥 CABOOM 💥")
}

export default Bomb
