import { useContext, useEffect, useRef, useState } from "react"
import Avatar from "./Avatar.jsx"
import Logo from "./Logo.jsx"
import {UserContext} from '../UserContext.jsx'
import {uniqBy} from 'lodash' 
import axios from "axios"



function Chat() {
    const [ws, setWs] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState({})
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState([])
    const {id, username} = useContext(UserContext)

    //create a reference for the message box to auto scroll to the bottom when a new message appears
    const messageRef = useRef()

    //closes the server everytime we make changes to it 
    //we want to try to reconnect whenever we close
    //create a function that connects to the websocket
    useEffect(() => {
        connectToWebSocket();
    }, [])

    function connectToWebSocket () {
        const ws = new WebSocket('ws://localhost:3000')
        setWs(ws)

        ws.addEventListener('message', handleMessage)
        // ws.addEventListener('close', () => console.log('closed'))
        ws.addEventListener('close', () => connectToWebSocket())

    }

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
        console.log({e, messageData})
        if('online' in messageData){
            showOnlineUsers(messageData.online)
        } else if ('text' in messageData){
            // console.log({messageData})
            //destructre the message data
            // setMessages(previous => ([...previous, {sender: id, recipient: selectedUserId, text: messageData.text}]))
            setMessages(previous => ([...previous, {...messageData}]))
        }
    }

    function sendMessage(e) {
        e.preventDefault()

        //test 
        console.log('Sending message')
        ws.send(JSON.stringify({
                recipient: selectedUserId,
                text: newMessage
        }))
        //clear the state then add to the messages array
        setNewMessage('')
        setMessages(previous => ([...previous, {
            sender: id,
            recipient: selectedUserId,
            text: newMessage,
            _id: Date.now(),
            }]))
    }

    useEffect(() => {
        //add the message ref after we send the message
        const div = messageRef.current;
        console.dir(div)
        if(div){
            div.scrollIntoView({behavior: 'smooth', block: 'end'})
        }
    }, [messages])

    //grab all of the existing messages with the selected user from the db
    useEffect(() => {
        if(selectedUserId){
            axios.get('/messages/' + selectedUserId)
                .then(res => {
                    console.log(res.data)
                    setMessages(res.data)
                })
        }
    }, [selectedUserId])

    // create this function inline
    // function selectContact(userId){
    //     setSelectedUserId(userId)
    // }

    //onlineUsers is not an array
    // const onlineUsersExcludingUs = onlineUsers.filter(user => user.username !=== username )
    const onlineUsersExcludingUs = {...onlineUsers}
    delete onlineUsersExcludingUs[id]


    //issue rendering rest of messages**
    // const messagesWithoutDupes = Array.from(
    //     messages.reduce((map, message) => {
    //         if (!map.has(message._id)) {
    //             map.set(message._id, message);
    //         }
    //         return map;
    //     }, new Map()).values()
    // );

    /**
     * not receiving messages after the first one 
     * lodash has a unique 
     */
    // console.log("Original Message", messages)

    // const filteredMessages = messages.filter(message => 
    //     (message.sender === selectedUserId && message.recipient === id) || 
    //     (message.sender === id && message.recipient === selectedUserId)
    // );
    // console.log("filteredMessages",filteredMessages)
    
    // const messagesWithoutDupes = Array.from(
    //     filteredMessages.reduce((map, message) => {
    //         if (!map.has(message._id)) {
    //             map.set(message._id, message);
    //         }
    //         return map;
    //     }, new Map()).values()
    // );
    // console.log(messagesWithoutDupes)
    /**
     * This method is like _.union except that it accepts iteratee which is invoked for each element of each arrays to generate the criterion by which uniqueness is computed. Result values are chosen from the first array in which the value occurs. The iteratee is invoked with one argument:
     */
    const messagesWithoutDupes = uniqBy(messages, '_id')

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
                        <Avatar username={onlineUsers[userId]}  userId={userId} online={true}/>
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
                {!!selectedUserId && (
                    <div className="relative h-full">
                        <div className="overflow-y-scroll absolute top-0 right-0 bottom-2 left-0">
                        {messagesWithoutDupes.map(message => (
                            <div key={message._id} className={'' + (message.sender === id?'text-right':'text-left')}>
                                <div className={"inline-block p-2 my-2 rounded-md text-sm " + (message.sender === id ? 'bg-blue-500 text-white': 'bg-slate-800 text-white')}> 
                                    {/**Test to see if my id corresponds on different screens */}
                                    {message.text}<br/>
                                    sender: {message.sender}<br />
                                    myId: {id}
                                </div>
                            </div>
                        ))}
                        <div ref={messageRef}></div>
                        </div>
                    </div>
                )}
            </div>
            {/**Hide the form if no user is selected  */}
            {!!selectedUserId && (
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