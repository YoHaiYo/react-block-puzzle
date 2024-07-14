import React, { useState, useEffect } from "react";
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
  const [selectedBlock, setSelectedBlock] = useState(null); // 선택된 테트리스 블록
  const [highlightedCells, setHighlightedCells] = useState([]); // 호버할 때 드롭 위치 표시

  // 다양한 모양의 테트리스 블록 정의
  const tetrisBlocks = [
    {
      shape: [[1, 1, 1, 1]], // 직선 모양
      color: "#FFBF00",
      hotkey: "Q",
    },
    {
      shape: [
        [1, 1],
        [1, 1],
      ], // 정사각형 모양
      color: "#00BFFF",
      hotkey: "W",
    },
    {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
      ], // L 모양
      color: "#32CD32",
      hotkey: "E",
    },
    {
      shape: [
        [0, 1, 1],
        [1, 1, 0],
      ], // 반대 L 모양
      color: "#FF1493",
      hotkey: "R",
    },
    {
      shape: [
        [1, 1, 1],
        [0, 1, 0],
      ], // T 모양
      color: "#FF4500",
      hotkey: "A",
    },
    {
      shape: [
        [1, 1],
        [0, 1],
        [0, 1],
      ], // 번개 모양
      color: "#9400D3",
      hotkey: "S",
    },
    {
      shape: [
        [0, 1],
        [1, 1],
        [1, 0],
      ], // 반대 번개 모양
      color: "#FFD700",
      hotkey: "D",
    },
  ];

  // 테트리스 블록을 선택하는 함수
  const handleBlockSelect = (block) => {
    setSelectedBlock(block);
  };

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (event) => {
      const selected = tetrisBlocks.find(
        (block) => block.hotkey === event.key.toUpperCase()
      );
      if (selected) {
        setSelectedBlock(selected);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 격자 셀에 호버할 때 호버 위치 표시하는 함수
  const handleCellHover = (event, targetRow, targetCol) => {
    event.preventDefault();

    if (selectedBlock) {
      const blockShape = selectedBlock.shape;

      // 계산된 드롭 위치를 highlightCells에 저장
      const newHighlightedCells = [];
      blockShape.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          if (value === 1) {
            const newRow = targetRow + rowIndex;
            const newCol = targetCol + colIndex;
            if (
              newRow >= 0 &&
              newRow < grid.length &&
              newCol >= 0 &&
              newCol < grid[0].length
            ) {
              newHighlightedCells.push([newRow, newCol]);
            }
          }
        });
      });

      setHighlightedCells(newHighlightedCells);
    }
  };

  // 격자 셀에 테트리스 블록을 드롭하는 함수
  const handleCellDrop = (event, targetRow, targetCol) => {
    event.preventDefault();

    if (selectedBlock) {
      const blockShape = selectedBlock.shape;

      // 드롭 가능한 위치인지 확인하고 처리
      let canPlace = true;
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
              newGrid[newRow][newCol] = Math.max(
                0,
                newGrid[newRow][newCol] - 1
              );
            }
          });
        });
        setGrid(newGrid);
      }
    }

    setSelectedBlock(null); // 선택 취소
    setHighlightedCells([]); // 호버 표시 초기화
  };

  // 숫자에 따라 색상을 계산하는 함수
  const getColorByNumber = (number) => {
    // 회색부터 빨강색까지의 색상 계산
    const red = Math.round((10 - number) * 25.5); // 255 / 10 = 25.5
    return `rgb(${red}, 100, 100)`; // 고정된 값으로 green과 blue를 정의합니다.
  };

  return (
    <div className="App">
      <h1>리액트 블록퍼즐</h1>
      <div className="grid-container">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((col, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="cell"
                style={{ backgroundColor: getColorByNumber(col) }}
                onMouseEnter={(event) =>
                  handleCellHover(event, rowIndex, colIndex)
                }
                onMouseLeave={() => setHighlightedCells([])} // 호버 나갈 때 표시 초기화
                onClick={(event) => handleCellDrop(event, rowIndex, colIndex)}
              >
                {col}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="tetris-blocks">
        {/* 다양한 테트리스 블록 선택 가능 */}

        {tetrisBlocks.map((block, index) => (
          <div
            key={index}
            className={`tetris-block ${
              selectedBlock === block ? "selected" : ""
            }`} // 선택된 블록에만 selected 클래스 추가
            onClick={() => handleBlockSelect(block)} // 테트리스 블록 선택
          >
            <h2>{block.hotkey}</h2>
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
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* 선택된 테트리스 블록의 테두리 색상을 표시하기 위한 스타일 */}
      <style>
        {selectedBlock &&
          `
          .tetris-block.selected {
            border: 2px solid red; /* 선택된 테트리스 블록에 빨간 테두리 추가 */
          }
        `}
        {/* 호버 시 드롭 위치 표시를 위한 스타일 */}
        {highlightedCells.map(
          ([row, col]) => `
          .row:nth-child(${row + 1}) .cell:nth-child(${col + 1}) {
            box-shadow: 0 0 0 3px #4872f4 inset;
            background-color: rgba(0, 0, 255, 0.2) !important;
          }
        `
        )}
      </style>
    </div>
  );
};

export default App;
