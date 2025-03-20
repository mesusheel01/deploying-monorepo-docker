import { prismaClient } from "db/client";



export default async function Home(){
    const users = await prismaClient.user.findMany();

    return <div>
        {JSON.stringify(users)}
    </div>

}


// export const revalidate = 60 // revalidation in 60 seconds means ssg pages will again genetate in 60 sec
// export const dynamic = 'force-dynamic'
