const io = require("socket.io")(4000 , {
    cors:{
        origin:"https://instagram-clone-q39b.onrender.com"
    }
})


//Direct

let users = []

const addUser = (data , socket)=>{
    const isAlready = users.find(item=> item.username === data.username)
    if (!isAlready) {
        data.room = socket.id
        socket.join(data.room)
        users.push(data)  
    }

}

const deleteUser = (id)=>{
    users = users.filter(user=> user.room !== id)
}

const findRoom = (data)=>{
    return users.find(item=> item.username === data.username)
}

io.on("connection" , (socket)=>{

    socket.on("join_room" , (data)=>{
        addUser(data,socket)
        io.emit("get_users" , users)
    }) 
    socket.on("send_msg" , data=>{
        const room = findRoom(data)
        socket.to(room?.room).emit("recieve_msg" , {msg:data?.msg , sender:data.sender })
    })

    socket.on("disconnect" , ()=>{
        deleteUser(socket.id)
    })
})
