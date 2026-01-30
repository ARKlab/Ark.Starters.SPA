import { useEffect } from "react"

function UseMenuCloseListener(options: { close: () => void; selector: string }) {
  useEffect(() => {
    function listener(e: MouseEvent) {
      if ((e.target as HTMLElement | null)?.closest(options.selector)) return
      options.close()
    }

    document.body.addEventListener("click", listener)
    return () => {
      document.body.removeEventListener("click", listener)
    }
  }, [options])
}

export default UseMenuCloseListener
