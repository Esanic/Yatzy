module.exports = (io) => {

    io.on('connection', socket => {

        console.log('new connection'); 
        
		socket.on('disconnect', () => console.log('disconnected'));
        
        socket.on('participants', (data) => {
            socket.broadcast.emit('participants', data);
        })

        // socket.on('test', (data) => {
        //     console.log(data);
        //     socket.broadcast.emit('test', data);
        // })
		
	})

}