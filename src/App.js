import React, { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./App.css";

const SortableItem = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="rectangle">
      {id}
    </div>
  );
};

const factorial = (n) => {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

const computeCantorExpansion = (permutation) => {
  const n = permutation.length;
  let cantor = 0;

  for (let i = 0; i < n; i++) {
    let count = 0;
    for (let j = i + 1; j < n; j++) {
      if (permutation[j] < permutation[i]) {
        count++;
      }
    }
    cantor += count * factorial(n - i - 1);
  }

  return cantor + 1;
};

const App = () => {
  const [rectangles, setRectangles] = useState([1]);
  const [cantorExpansion, setCantorExpansion] = useState(0);

  const handleInputChange = (e) => {
    const value = Math.min(15, Math.max(1, parseInt(e.target.value, 10) || 0));
    const newRectangles = Array.from({ length: value }, (_, i) => i + 1);
    setRectangles(newRectangles);
    setCantorExpansion(computeCantorExpansion(newRectangles));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setRectangles((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        setCantorExpansion(computeCantorExpansion(newItems));
        return newItems;
      });
    }
  };

  return (
    <div className="App">
      <h1>Draggable Rectangles</h1>
      <label>
        Enter the number of rectangles (1-15):
        <input
          type="number"
          min="1"
          max="15"
          defaultValue={1}
          onChange={handleInputChange}
        />
      </label>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={rectangles} strategy={horizontalListSortingStrategy}>
          <div className="rectangle-container">
            {rectangles.map((rectangle) => (
              <SortableItem key={rectangle} id={rectangle} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="cantor-expansion">
        <h2>Cantor Expansion: {cantorExpansion}</h2>
      </div>
    </div>
  );
};

export default App;
