

export default function render(
  myPlayer,
  screen,
  scoresTable,
  game,
  requestAnimationFrame
) {
  const {screen:{width, height, pixelsPerFields}}=game.state
  const context = screen.getContext("2d");
  context.fillStyle = "#FFFFFF";
  // context.clearRect(0, 0, 25, 25);
  context.clearRect(0, 0, 10,10 )

  for (const fruitID in game.state.fruits) {
    const fruit = game.state.fruits[fruitID];
    context.fillStyle = "#009933";
    context.fillRect(fruit.fruitX, fruit.fruitY, 1, 1);
  }

  for (const playerID in game.state.players) {
    const player = game.state.players[playerID];
    context.fillStyle = "red";
    context.fillRect(player.playerX, player.playerY, 1, 1);
  }
  //  Diferenciar o meu player
  const player = game.state.players[myPlayer];
  if (player) {
    // context.fillStyle = "#EC6143";
    context.fillStyle = colorScoresFace(player.scores);
    context.fillRect(player.playerX, player.playerY, 1, 1);
   
    
  }
  renderTableScores(scoresTable, game, myPlayer);
  // indico qual a função que irá executar e o próprio browser define o tempo
    // Não determina um tempo específico, faz o repaint (redesenho) somente 
    // quando o conteúdo for trabalhado/definido

    //Não fica preso ao tempo definido (setInterval,setTimeOut)
    // Se ele terminar a tarefa, demorando ou não, irá redesenhar a figura
  requestAnimationFrame(() => {
    render(myPlayer, screen,scoresTable, game, requestAnimationFrame);
  });
}
function colorScoresFace(scores){
  scores*=10
  let r=scores>240?240:scores
  let g=scores>219?219:scores
  let b=scores>60?60:scores
  return `rgb(${r},${g},${b})`
}
function renderTableScores(scoresTable, game, myPlayer) {
  const maxPlayer = 10;
  const players=[]

  for(const playerID in game.state.players){
    const player=game.state.players[playerID]
    players.push({
      player:playerID,
      x:player.playerX,
      y:player.playerY,
      scores:player.scores
    })
  }
  
  const organizedList=players.sort((first,second)=>{
    if(first.scores<second.scores){
      return 1
    }
    if(first.scores>second.scores){
      return -1
    }
    return 0
  })
  const top10Scores=organizedList.slice(0,maxPlayer)
  
  const tableHeader = `
  <tr class='header'>
    <th>JOGADORES (${organizedList.length})</th>
    <th>PONTUAÇÃO</th>
  </tr>
  `;

  let renderize=top10Scores.reduce((header,next)=>{
    return header+`
      <tr ${next.player === myPlayer ? 'class="current-player"' : ''}>
          <td>${next.player === myPlayer?'EU':next.player}</td>
          <td>${next.scores}</td>
      </tr>
    `

  },tableHeader)


  scoresTable.innerHTML=renderize
}
