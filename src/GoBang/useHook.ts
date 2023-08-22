import { useState } from 'react';

const useHook = () => {
 type palyArrType = {
  row:number,
  col:number,
  chess:number
 }[]

  // 记录已下的棋子数据，包含横纵坐标以及棋子的颜色
  const [palyArr, setpalyArr] = useState<palyArrType>([])
  const [chess, setChess] = useState<number|null>(null)

  const [chessArr] = useState(() => {
    let arr = Array(20).fill('');
    arr = arr.map(() => Array(20).fill(''));
    return arr;
  });
  
  // 存储下一个棋子的颜色
  const [chessman,setChessmMan] = useState<string>('首位：黑棋')

  const play =(row:number, col:number)=>{
    if(chessman === '获胜者：黑棋' || chessman === '获胜者：白棋') return
    let newChess = chess === 1 ? 2 : 1;
    let newPalyArr = [...palyArr, { row, col, chess:newChess }]
    if(newChess === 2){
      setChessmMan('下一位：黑棋')
    }else{
      setChessmMan('下一位：白棋')
    }
    setChess(newChess)
    setpalyArr(newPalyArr)
    getWinner(newPalyArr, newChess, chessArr, row, col)
  }


  const getWinner = (palyArr: palyArrType, chess: number, chessArr:palyArrType[], row: number, col: number) =>{
    palyArr.map((item) => {
     return chessArr[item.row][item.col] = { ...item };
    });

    // 分别对 上下，左右，左斜，右斜 方向进行判断是否产生winner
    let colCount = 0

    // 上下
    for (let i = col + 1; i < 20; i++) {
      if (chessArr[row][i].chess !== chess) break;
      colCount++; 
    }
    for (let i = col - 1; i >= 0; i--) {
      if (chessArr[row][i].chess !== chess) break;
      colCount++;
    }
    if (colCount >= 4) {
      chess === 1 ? setChessmMan('获胜者：黑棋') : setChessmMan('获胜者：白棋')
      colCount = 0;
      return;
    }

    // 左右
    let rowCount = 0
    for (let i = row + 1; i < 20; i++) {
      if (chessArr[i][col].chess !== chess) break;
      rowCount++;
    }
    for (let i = row - 1; i >= 0; i--) {
      if (chessArr[i][col].chess !== chess) break;
      rowCount++; 
    }
    if (rowCount >= 4) {
      chess === 1 ? setChessmMan('获胜者：黑棋') : setChessmMan('获胜者：白棋')
      rowCount = 0;
      return;
    }

    // 左斜
    let leftObliqueCount = 0
    for (let i = row + 1, j = col - 1; i < 20 && j >= 0; i++, j--) {
      if (chessArr[i][j].chess !== chess) break;
      leftObliqueCount++;
    }
    for (let i = row - 1, j = col + 1; i >=0 && j < 20; i--, j++) {
      if (chessArr[i][j].chess !== chess) break;
      leftObliqueCount++;
    }
    if (leftObliqueCount >= 4) {
      chess === 1 ? setChessmMan('获胜者：黑棋') : setChessmMan('获胜者：白棋')
      leftObliqueCount = 0;
      return;
    }

    // 右斜
    let rightObliqueCount = 0
    for (let i = row + 1, j = col + 1; i < 20 && j < 20; i++, j++) {
      if (chessArr[i][j].chess !== chess) break;
      rightObliqueCount++;
    }
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (chessArr[i][j].chess !== chess) break;
      rightObliqueCount++;
    }
    if (rightObliqueCount >= 4) {
      chess === 1 ? setChessmMan('获胜者：黑棋') : setChessmMan('获胜者：白棋')
      rightObliqueCount = 0;
      return;
    }
  }

  return {
    palyArr,
    chessman,
    setChessmMan,
    play,
    setpalyArr,
    setChess
  }
}
export default useHook