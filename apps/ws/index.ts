import { prismaClient } from "db/client";


Bun.serve({
    port:8001,
    fetch(req,server){
        if(server.upgrade(req)){
            return;
        }
        return new Response("Upgrade failed!", {status:"500"})
    },
    websocket:{
        message(websocket, message){
            prismaClient.user.create({
                data:{
                    username:Math.random().toString(),
                    password:Math.random().toString()
                }
            })
            WebSocket.
        }
    }
})
