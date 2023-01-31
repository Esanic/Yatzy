let participants = [];
let counter = 0;
let room = 'game-'+counter;

module.exports = (io) => {
    const rooms = io.of("/game").adapter.rooms;
    const sids = io.of("/game").adapter.sids;
    // let room = 'game-'+counter

    io.on('connection', socket => {
        console.log('new connection', socket.id); 
        socket.emit('userID', socket.id)

		socket.on('disconnect', () => {
            let index = participants.findIndex(x => x.sid == socket.id);
            if(index != -1){
                participants.splice(index, 1);
            }
            console.log(socket.id + ' disconnected');
        });
        
        //Join Room
        socket.on('joinRoom', (name) => {
            if(participants.length <= 4){
                participants.push({name: name, sid: socket.id});
                socket.join(room);
                socket.emit('roomName', room);
                
                if(participants.length == 4){
                    io.to(room).emit('fullGame', true);
                    io.to(room).emit('players', participants);
                }
            }
            if(participants.length > 4){
                
                room = 'game-'+(counter+1);
                socket.join(room);
                participants = []
                participants.push(name);
                console.log(room);
            }

            console.log(participants);
            console.log(io.sockets.adapter.rooms.get(room))
        })
        
        //Dice Hit
        socket.on('diceHit', (dice, room) => {
            io.to(room).emit('getDice', dice);
        })

        //Dice Movement
        socket.on('diceMove', (objWithDiceArrays, room) => {
            io.to(room).emit('getDiceMovement', objWithDiceArrays);
        })

        //Next player
        socket.on('nextPlayer',(scoreRowName, dice, room) => {
            socket.broadcast.to(room).emit('getNextPlayer', {scoreRowName, dice})
        })
	})

}