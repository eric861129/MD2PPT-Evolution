/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';

interface DragHandleProps {
  id: string;
  className?: string;
}

export const DragHandle: React.FC<DragHandleProps> = ({ id, className = "" }) => {
  const { attributes, listeners, setNodeRef } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing p-1.5 bg-white/90 dark:bg-stone-800/90 rounded shadow-sm border border-stone-200 dark:border-stone-700 hover:bg-orange-50 dark:hover:bg-orange-950 hover:text-orange-600 transition-colors z-30 ${className}`}
      title="拖拽以重新排列投影片"
    >
      <GripVertical size={16} />
    </div>
  );
};
