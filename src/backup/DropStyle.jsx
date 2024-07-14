import React, { useState } from "react";
import "./App.css";

const App = () => {
  // 초기 격자 상태 설정
  const initialGrid = [
    [10, 10, 10, 10],
    [10, 10, 10, 10],
    [10, 10, 10, 10],
    [10, 10, 10, 10],
  ];

  const [grid, setGrid] = useState(initialGrid);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [draggedBlock, setDraggedBlock] = useState(null); // 현재 드래그 중인 블록

  // 다양한 모양의 테트리스 블록 정의
  const tetrisBlocks = [
    {
      shape: [[1, 1, 1, 1]], // 직선 모양
      color: "#FFBF00",
    },
    {
      shape: [
        [1, 1],
        [1, 1],
      ], // 정사각형 모양
      color: "#00BFFF",
    },
    {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
      ], // L 모양
      color: "#32CD32",
    },
    {
      shape: [
        [0, 1, 1],
        [1, 1, 0],
      ], // 반대 L 모양
      color: "#FF1493",
    },
    {
      shape: [
        [1, 1, 1],
        [0, 1, 0],
      ], // T 모양
      color: "#FF4500",
    },
    {
      shape: [
        [1, 1],
        [0, 1],
        [0, 1],
      ], // 번개 모양
      color: "#9400D3",
    },
    {
      shape: [
        [0, 1],
        [1, 1],
        [1, 0],
      ], // 반대 번개 모양
      color: "#FFD700",
    },
  ];

  // 드래그 시작할 때 호출되는 함수
  const handleDragStart = (event, block) => {
    event.dataTransfer.setData("block", JSON.stringify(block.shape));
    setDraggedBlock(block); // 현재 드래그 중인 블록 설정
  };

  // 드롭할 때 호출되는 함수
  const handleDrop = (event, targetRow, targetCol) => {
    event.preventDefault();
    const blockShape = JSON.parse(event.dataTransfer.getData("block"));

    // 계산된 깎일 부분을 highlightCells에 저장
    let canPlace = true;
    const newHighlightedCells = [];
    blockShape.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 1) {
          const newRow = targetRow + rowIndex;
          const newCol = targetCol + colIndex;
          if (
            newRow < 0 ||
            newRow >= grid.length ||
            newCol < 0 ||
            newCol >= grid[0].length ||
            grid[newRow][newCol] === 0
          ) {
            canPlace = false;
          } else {
            newHighlightedCells.push([newRow, newCol]);
          }
        }
      });
    });

    if (canPlace) {
      const newGrid = [...grid];
      blockShape.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          if (value === 1) {
            const newRow = targetRow + rowIndex;
            const newCol = targetCol + colIndex;
            newGrid[newRow][newCol] = Math.max(0, newGrid[newRow][newCol] - 1);
          }
        });
      });
      setGrid(newGrid);
    }

    // 하이라이트된 셀 업데이트
    setHighlightedCells(newHighlightedCells);
    setDraggedBlock(null); // 드래그 종료 상태로 설정
  };

  // 드래그 오버할 때 호출되는 함수
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // 숫자에 따라 색상을 계산하는 함수
  const getColorByNumber = (number) => {
    // 회색부터 빨강색까지의 색상 계산
    const red = Math.round((10 - number) * 25.5); // 255 / 10 = 25.5
    return `rgb(${red}, 100, 100)`; // 고정된 값으로 green과 blue를 정의합니다.
  };

  return (
    <div className="App">
      <h1>리액트 테트리스 격자</h1>
      <div className="grid-container">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((col, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="cell"
                style={{ backgroundColor: getColorByNumber(col) }}
                onDragOver={(event) => handleDragOver(event)}
                onDrop={(event) => handleDrop(event, rowIndex, colIndex)}
                onMouseEnter={() => setHighlightedCells([[rowIndex, colIndex]])}
                onMouseLeave={() => setHighlightedCells([])}
              >
                {col}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="tetris-blocks">
        {/* 다양한 테트리스 블록 드래그 대상 */}
        {tetrisBlocks.map((block, index) => (
          <div
            key={index}
            className={`tetris-block ${
              draggedBlock === block ? "dragging" : ""
            }`} // 드래그 중인 블록에만 dragging 클래스 추가
            draggable
            onDragStart={(event) => handleDragStart(event, block)}
          >
            {block.shape.map((row, rowIndex) => (
              <div key={rowIndex} className="block-row">
                {row.map((value, colIndex) => (
                  <div
                    key={colIndex}
                    className={`block-cell ${value === 1 ? "filled" : ""}`}
                    style={{
                      backgroundColor:
                        value === 1 ? block.color : "transparent",
                    }}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* 하이라이트된 셀을 표시하기 위한 스타일 */}
      <style>
        {highlightedCells
          .map(
            ([row, col]) => `
          .row:nth-child(${row + 1}) .cell:nth-child(${col + 1}) {
            border: 2px solid #FF0000; /* 빨간색 테두리로 표시 */
            box-sizing: border-box; /* 테두리가 셀 내부에 포함되도록 설정 */
          }
        `
          )
          .join("")}
      </style>
    </div>
  );
};

export default App;
