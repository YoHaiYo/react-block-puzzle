import React, { useState } from "react";

const DragAndDrop = () => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3"]);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (draggedItem === index) return;

    const itemsCopy = [...items];
    const draggedItemContent = itemsCopy[draggedItem];
    itemsCopy.splice(draggedItem, 1);
    itemsCopy.splice(index, 0, draggedItemContent);

    setDraggedItem(index);
    setItems(itemsCopy);
  };

  const handleDrop = (e) => {
    setDraggedItem(null);
  };

  const handleDragEnd = (e) => {
    setDraggedItem(null);
  };

  return (
    <div>
      {items.map((item, index) => (
        <div
          key={index}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e)}
          onDragEnd={(e) => handleDragEnd(e)}
          style={{
            padding: "8px",
            margin: "4px",
            backgroundColor: "lightgrey",
            border: "1px solid black",
            cursor: "move",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default DragAndDrop;
