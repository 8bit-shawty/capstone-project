import { useContext, useEffect, useState } from "react"
import Avatar from "./Avatar.jsx"
import Logo from "./Logo.jsx"
import {UserContext} from '../UserContext.jsx'



function Chat() {
    const [ws, setWs] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState({})
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [newMessage, setNewMessage] = useState('')
    const {id, username} = useContext(UserContext)

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

    function sendMessage(e) {
        e.preventDefault()

        //test 
        console.log('Sending message')
        ws.send(JSON.stringify({
            message: {
                recipient: selectedUserId,
                text: newMessage
            }
        }))
    }

    // create this function inline
    // function selectContact(userId){
    //     setSelectedUserId(userId)
    // }

    //onlineUsers is not an array
    // const onlineUsersExcludingUs = onlineUsers.filter(user => user.username !=== username )
    const onlineUsersExcludingUs = {...onlineUsers}
    delete onlineUsersExcludingUs[id]

  return (
    <div className="flex h-screen">
        <div className="bg-white w-1/3">
            <Logo/>
            {/* {username} we have our context now we do not want to display ourselves in the users list*/} 
            {Object.keys(onlineUsersExcludingUs).map((userId, index) => (
                //might need to adjust the key to userId
                <div key={index} 
                onClick={() => setSelectedUserId(userId)}
                className={`border-b border-gray-300 flex items-center gap-1 cursor-pointer ` + (userId === selectedUserId ? 'bg-gray-300' : '')}
                >
                    {userId === selectedUserId && (
                        <div className="w-1 bg-blue-600 h-12"></div>
                    )}
                    <div className="flex gap-2 pl-4 py-2 items-center">
                        {/* map through each users username */}
                        {/* {userId} */}
                        <Avatar username={onlineUsers[userId]}  userId={userId}/>
                        <span className="text-gray-800 font-medium">{onlineUsers[userId]}</span>
                    </div>
                </div>
            ))}
        </div>
        <div className="flex flex-col bg-blue-400 w-2/3 p-3">
            <div className="flex-grow">
                {!selectedUserId && (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-gray-700">
                            No Selected Person..
                        </div>
                    </div>
                )}
            </div>
            {/**Hide the form if no user is selected  */}
            {selectedUserId && (
                <form className="flex gap-2" onSubmit={sendMessage}>
                    <input 
                    type="text" 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Message" 
                    className="bg-white border p-2 flex-grow rounded-sm" />
                    <button type="submit" className="bg-blue-300 p-2 text-white rounded-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}       stroke="currentColor" className="size-5 stroke-1 hover:stroke-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </button>
                </form>
            )}
        </div>
    </div>
)
}

export default Chat