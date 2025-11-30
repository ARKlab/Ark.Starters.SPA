import type { Column, ColumnOrderState, Header, Table as ReactTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const reorderColumn = (draggedColumnId: string, targetColumnId: string, columnOrder: string[]): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0],
  );
  return [...columnOrder];
};
export const DraggableColumnHeader = <T,>(props: { header: Header<T, unknown>; table: ReactTable<T> }) => {
  const { header, table } = props;
  const { getState, setColumnOrder } = table;
  const { columnOrder } = getState();
  const { column } = header;

  const dropRef = useRef<HTMLSpanElement>(null);
  const previewRef = useRef<HTMLSpanElement>(null);
  const dragRef = useRef<HTMLButtonElement>(null);

  const [, dropConnector] = useDrop({
    accept: "column",
    drop: (draggedColumn: Column<T>) => {
      const newColumnOrder = reorderColumn(draggedColumn.id, column.id, columnOrder);
      setColumnOrder(newColumnOrder);
    },
  });

  const [{ isDragging }, dragConnector, previewConnector] = useDrag({
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: "column",
  });

  useEffect(() => {
    if (dropRef.current) dropConnector(dropRef);
    if (previewRef.current) previewConnector(previewRef);
    if (dragRef.current) dragConnector(dragRef);
  }, [dropConnector, previewConnector, dragConnector]);

  return (
    <span ref={dropRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <span ref={previewRef}>
        <button ref={dragRef}>🟰</button>
        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
      </span>
    </span>
  );
};
