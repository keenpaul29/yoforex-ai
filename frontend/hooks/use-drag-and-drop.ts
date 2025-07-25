import { useState, useRef, useEffect, useCallback, RefObject } from 'react';

interface DragEventHandlers<T = HTMLElement> {
  ref: RefObject<T>;
  onDragStart?: (e: React.DragEvent) => void;
  onDrag?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragEnter?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

interface UseDragAndDropOptions<T = HTMLElement> extends Omit<DragEventHandlers<T>, 'ref'> {
  /**
   * The data to be transferred during the drag operation
   */
  data?: any;
  
  /**
   * The type of drag operation
   * @default 'move'
   */
  effect?: 'move' | 'copy' | 'link' | 'none';
  
  /**
   * Whether the element is draggable
   * @default true
   */
  disabled?: boolean;
  
  /**
   * The type of data being dragged
   */
  type?: string;
  
  /**
   * Callback when the drag operation starts
   */
  onDragStartWithData?: (data: any, e: React.DragEvent) => void;
  
  /**
   * Callback when the drag operation ends
   */
  onDragEndWithData?: (data: any, e: React.DragEvent) => void;
  
  /**
   * Callback when an item is dropped
   */
  onDropWithData?: (data: any, e: React.DragEvent) => void;
}

interface UseDragAndDropReturn<T> {
  /**
   * Whether the element is currently being dragged
   */
  isDragging: boolean;
  
  /**
   * Whether the element is currently being dragged over
   */
  isOver: boolean;
  
  /**
   * Props to spread onto the draggable element
   */
  dragProps: {
    ref: RefObject<T>;
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDrag: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
  };
  
  /**
   * Props to spread onto the drop target element
   */
  dropProps: {
    ref: RefObject<T>;
    onDragEnter: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
  
  /**
   * Combined props for elements that are both draggable and drop targets
   */
  dragDropProps: {
    ref: RefObject<T>;
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDrag: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
}

/**
 * Custom hook to handle drag and drop operations
 * @param options Configuration options for the drag and drop behavior
 * @returns An object with drag and drop props and state
 */
export function useDragAndDrop<T extends HTMLElement = HTMLElement>(
  options: UseDragAndDropOptions<T> = {}
): UseDragAndDropReturn<T> {
  const {
    data,
    effect = 'move',
    disabled = false,
    type = 'text/plain',
    onDragStart,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragStartWithData,
    onDragEndWithData,
    onDropWithData,
  } = options;
  
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const ref = useRef<T>(null);
  const dragCounter = useRef(0);
  const dragData = useRef<any>(null);
  
  // Handle drag start
  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    // Set the drag effect
    e.dataTransfer.effectAllowed = effect;
    
    // Set the data being dragged
    if (data !== undefined) {
      dragData.current = data;
      e.dataTransfer.setData('application/json', JSON.stringify(data));
    }
    
    // Set custom data if type is provided
    if (type) {
      e.dataTransfer.setData(type, type);
    }
    
    setIsDragging(true);
    onDragStart?.(e);
    onDragStartWithData?.(data, e);
    
    // Set a custom drag image if the ref is available
    if (ref.current) {
      // Clone the node to use as drag image
      const dragImage = ref.current.cloneNode(true) as HTMLElement;
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-9999px';
      dragImage.style.opacity = '0.8';
      dragImage.style.pointerEvents = 'none';
      document.body.appendChild(dragImage);
      
      // Calculate the offset to center the drag image on the cursor
      const rect = ref.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      // Set the drag image
      e.dataTransfer.setDragImage(dragImage, offsetX, offsetY);
      
      // Clean up the drag image after a short delay
      setTimeout(() => {
        if (document.body.contains(dragImage)) {
          document.body.removeChild(dragImage);
        }
      }, 0);
    }
  }, [data, disabled, effect, onDragStart, onDragStartWithData, type]);
  
  // Handle drag
  const handleDrag = useCallback((e: React.DragEvent) => {
    onDrag?.(e);
  }, [onDrag]);
  
  // Handle drag end
  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setIsDragging(false);
    onDragEnd?.(e);
    onDragEndWithData?.(dragData.current, e);
    dragData.current = null;
  }, [onDragEnd, onDragEndWithData]);
  
  // Handle drag enter
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setIsOver(true);
    }
    
    onDragEnter?.(e);
  }, [onDragEnter]);
  
  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Set the drop effect
    e.dataTransfer.dropEffect = effect;
    
    onDragOver?.(e);
  }, [effect, onDragOver]);
  
  // Handle drag leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsOver(false);
    }
    
    onDragLeave?.(e);
  }, [onDragLeave]);
  
  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset the drag counter and state
    dragCounter.current = 0;
    setIsOver(false);
    
    // Get the dropped data
    let droppedData;
    try {
      const jsonData = e.dataTransfer.getData('application/json');
      droppedData = jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
    
    // Call the drop handlers
    onDrop?.(e);
    onDropWithData?.(droppedData || dragData.current, e);
    
    // Reset the drag data
    dragData.current = null;
  }, [onDrop, onDropWithData]);
  
  // Clean up event listeners when unmounting
  useEffect(() => {
    return () => {
      dragCounter.current = 0;
      setIsDragging(false);
      setIsOver(false);
    };
  }, []);
  
  // Return the drag and drop props and state
  return {
    isDragging,
    isOver,
    dragProps: {
      ref,
      draggable: !disabled,
      onDragStart: handleDragStart,
      onDrag: handleDrag,
      onDragEnd: handleDragEnd,
    },
    dropProps: {
      ref,
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
    dragDropProps: {
      ref,
      draggable: !disabled,
      onDragStart: handleDragStart,
      onDrag: handleDrag,
      onDragEnd: handleDragEnd,
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
  };
}

/**
 * Custom hook to create a draggable element
 * @param options Configuration options for the draggable element
 * @returns An object with drag props and state
 */
export function useDraggable<T extends HTMLElement = HTMLElement>(
  options: Omit<UseDragAndDropOptions<T>, 'onDragEnter' | 'onDragOver' | 'onDragLeave' | 'onDrop'>
) {
  const { dragProps, isDragging } = useDragAndDrop<T>(options);
  return { ...dragProps, isDragging };
}

/**
 * Custom hook to create a drop target
 * @param options Configuration options for the drop target
 * @returns An object with drop props and state
 */
export function useDroppable<T extends HTMLElement = HTMLElement>(
  options: Omit<UseDragAndDropOptions<T>, 'onDragStart' | 'onDrag' | 'onDragEnd'>
) {
  const { dropProps, isOver } = useDragAndDrop<T>(options);
  return { ...dropProps, isOver };
}

// Example usage:
/*
// Basic drag and drop
function DraggableItem({ data }) {
  const { dragProps, isDragging } = useDraggable({
    data,
    effect: 'move',
    onDragStart: () => console.log('Drag started'),
    onDragEnd: () => console.log('Drag ended'),
  });
  
  return (
    <div
      {...dragProps}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        padding: '10px',
        border: '1px solid #ccc',
        margin: '5px 0',
      }}
    >
      Drag me!
    </div>
  );
}

function DropZone() {
  const [items, setItems] = useState([]);
  
  const { dropProps, isOver } = useDroppable({
    onDrop: (data) => {
      if (data) {
        setItems(prev => [...prev, data]);
      }
    },
  });
  
  return (
    <div
      {...dropProps}
      style={{
        minHeight: '200px',
        border: `2px dashed ${isOver ? '#4CAF50' : '#ccc'}`,
        padding: '20px',
        backgroundColor: isOver ? '#f0fff0' : '#f9f9f9',
      }}
    >
      {items.length > 0 ? (
        <div>
          <p>Dropped items:</p>
          <ul>
            {items.map((item, index) => (
              <li key={index}>{JSON.stringify(item)}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Drop items here</p>
      )}
    </div>
  );
}
*/
