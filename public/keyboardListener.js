export default function keyboardListener(document){
    const state={
        player:null,
        observers:[]
    }
    function subscribe(comand){
        state.observers.push(comand)
    }
    function setIdPlayer(comand){
        state.player=comand
    }

    function nofifyAll(comand){
        for(const func of state.observers){
            func(comand)
        }
    }
    document.addEventListener('keydown',handleMove)
    function handleMove(e){
        const key=e.key
        const action={
            type:'move-player',
            playerID:state.player,
            key
        }
        nofifyAll(action)
    }
    return{
        subscribe,
        setIdPlayer,
    }
}