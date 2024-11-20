import { useEffect, useState } from "react"



function Chat() {
    const [ws, setWs] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState({})
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000')
        setWs(ws)
        ws.addEventListener('message', handleMessage)
    }, [])

    function showOnlineUsers(usersArray) {
        // console.log(users)

        // const users = new Set();
        // usersArray.forEach(user => {         //does not get rid of dupes
        //     users.add(user)
        // })
        // console.log(users)

        const users = {}
        usersArray.forEach(({userId, username}) => {
            users[userId] = username
        })
        // console.log(users)
        setOnlineUsers(users)
    }

    function handleMessage(e){
        // console.log(e.data)
        // e.data.text().then(message => {
        //     console.log(message)
        // })
        const messageData = JSON.parse(e.data)
        // console.log(messageData)
        if('online' in messageData){
            showOnlineUsers(messageData.online)
        }
    }

  return (
    <div className="flex h-screen">
        <div className="bg-white w-1/3">
            {Object.keys(onlineUsers).map((userId, index) => (
                <div key={index}>
                    {/* map through each users username */}
                    {/* {userId} */}
                    {onlineUsers[userId]}
                </div>
            ))}
        </div>
        <div className="flex flex-col bg-blue-400 w-2/3 p-3">
            <div className="flex-grow">
                messages with selected person
            </div>
            <div className="flex gap-2">
                <input 
                type="text" 
                placeholder="Message" 
                className="bg-white border p-2 flex-grow rounded-sm" />
                <button className="bg-blue-300 p-2 text-white rounded-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}       stroke="currentColor" className="size-5 stroke-1 hover:stroke-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
  )
}

export default Chat