import express from 'express'
import createGame from './public/game.js'
import path from 'path'


const app = express()
const port=3333
const io=require('socket.io')(port, {
    cors: {
      origin: '*',
    }
  })
const gameServer=createGame()

app.use(express.static('./public'))
app.set('views',path.join(__dirname,'public'))
app.engine('html',require('ejs').renderFile)
// app.set('view engine','html')


app.use('/',(req,res)=>{
    res.render('index.html')
})
gameServer.start()

// Eventos customizados
gameServer.subscribe((comand)=>{
    io.emit(comand.type,comand)
})

io.on('connection',(socket)=>{
    const playerID=socket.id
    gameServer.addPlayer({playerID:playerID})
    
    socket.emit('setup',gameServer.state)

    socket.on('disconnect',()=>{
        console.log(`O jogador ${playerID} saiu`)
        gameServer.removePlayer({playerID:playerID})
    })
    // Recebe o evento do front e atualizado gameServer
    socket.on('move-player',(comand)=>{
        comand.playerID=playerID
        comand.type=comand.type

        gameServer.movePlayer(comand)
    })
    


})

app.listen(8000,()=>{
    console.log(`Rodando em http://localhost:${8000}`)
})