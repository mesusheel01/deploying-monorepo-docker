import { prismaClient } from "db/client";


Bun.serve({
    port:8001,
    fetch(req,server){
        if(server.upgrade(req)){
            return;
        }
        //@ts-ignore
        return new Response("Upgrade failed!", {status:"500"})
    },
    websocket:{
        //@ts-ignore
        message(ws, message){
            prismaClient.user.create({
                data:{
                    username:Math.random().toString(),
                    password:Math.random().toString()
                }
            })
            ws.send(message)
        },
    },
})
