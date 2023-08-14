import { createPortal } from "react-dom"

type TMenuProps = {
  open: boolean
  anchor: HTMLElement
  children: React.ReactNode
}

export function Menu({
  open,
  anchor,
  children
}: TMenuProps) {
  if (open) {
    return (
      <>
        {open && createPortal(
          <div>
            children
          </div>,
          document.body
        )}
      </>
    )
  }
  return <></>
}
