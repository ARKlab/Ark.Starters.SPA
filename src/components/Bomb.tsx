import type { JSX } from "react"

export const Bomb = (): JSX.Element => {
  throw new Error('💥 CABOOM 💥')
}
