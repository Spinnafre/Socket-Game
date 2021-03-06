export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10,
      pixelsPerFields: 100,
    },
  };
  // Array de funções
  const observers = [];
  
  function start() {
    const frequency = 2000;
    setInterval(addFruits, frequency);
  }
  function setState(newState){
    Object.assign(state,newState)
  }
  // Registra os eventos do socket
  function subscribe(observerFunction){
    observers.push(observerFunction)
  }
  function notifyAll(param) {
    for (const obsFunc of observers) {
      obsFunc(param);
    }
    // console.log(observers);
  }
  function addFruits(comand) {
    const posX = comand ? comand.fruitX : Math.floor(Math.random() * state.screen.width);
    const posY =comand ? comand.fruitY : Math.floor(Math.random() * state.screen.height);
    const Id =comand ? comand.fruitID : Math.floor(Math.random() *  10000000);

    state.fruits[Id] = {
      fruitX: posX,
      fruitY: posY,
    };
    notifyAll({ type: "add-fruit", fruitID: Id, fruitX: posX, fruitY: posY });
  }
  function removeFruit(comand) {
    // deleta do meu estado
    delete state.fruits[comand.fruitID];
    // deleta dos outros clientes
    notifyAll({ type: "remove-fruit", fruitID: comand.fruitID });
  }
  function addPlayer(comand) {
    const posX =
      "playerX" in comand ? comand.playerX : Math.floor(Math.random() * state.screen.width);
    const posY =
      "playerY" in comand ? comand.playerY :  Math.floor(Math.random() * state.screen.height);
    const Id =comand.playerID;

    state.players[Id] = {
      playerX: posX,
      playerY: posY,
      scores:0
    };
    notifyAll({
      type: "add-player",
      playerID: Id,
      playerX: posX,
      playerY: posY,
      scores:0
    });
  }
  function removePlayer(comand) {
    delete state.players[comand.playerID];
    notifyAll({ type: "remove-player", playerID: comand.playerID });
  }
  function movePlayer(comand){
    // Emite o evento para atualizar o gameFront (Estado do Front)
    notifyAll(comand)
    const condMove={
      ArrowUp(player){
        if(player.playerY-1>=0){
          player.playerY=player.playerY-1
        }
      },
      ArrowRight(player){
        if(player.playerX+1<state.screen.width){
          player.playerX=player.playerX+1
        }
        
      },
      ArrowLeft(player){
        if(player.playerX-1>=0){
          player.playerX=player.playerX-1
        }
        
      },
      ArrowDown(player){
        if(player.playerY+1<state.screen.height){
          player.playerY=player.playerY+1
        }

      }
    }
    const player=state.players[comand.playerID]
    const movePlayer=condMove[comand.key]
    // Se o player existir e a tecla pressionada for uma das possíveis
    if(player && movePlayer){
      movePlayer(player)
      checkCollision(comand.playerID)
    }
    

  }
  function checkCollision(playerID){
    const player=state.players[playerID]

    for(const fruitID in state.fruits){
      const fruit=state.fruits[fruitID]
      if(player.playerX===fruit.fruitX && player.playerY===fruit.fruitY){
        player.scores+=1
        removeFruit({fruitID:fruitID})
      }
      
    }
  }
  return {
    state,
    setState,
    subscribe,
    start,
    addPlayer,
    movePlayer,
    removePlayer,
    addFruits,
    removeFruit,
  };
}


