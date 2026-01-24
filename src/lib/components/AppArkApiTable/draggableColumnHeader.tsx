import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Header, Table as ReactTable } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"

export const DraggableColumnHeader = <T,>(props: { header: Header<T, unknown>; table: ReactTable<T> }) => {
  const { header } = props
  const { column } = header

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
  })

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <span ref={setNodeRef} style={style}>
      <button {...attributes} {...listeners} style={{ cursor: "grab", border: "none", background: "none", padding: 0 }}>
        🟰
      </button>
      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
    </span>
  )
}
