import { useContext, useEffect, useRef, useState } from "react"
// import Avatar from "./Avatar.jsx"
import User from "./User.jsx"
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
    const {id, username, setId, setUsername} = useContext(UserContext)
    const [offlineUsers, setOfflineUsers] = useState({})

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
            if(messageData.sender === selectedUserId){
                setMessages(previous => ([...previous, {...messageData}]))
            }
            // console.log({messageData})
            //destructre the message data
            // setMessages(previous => ([...previous, {sender: id, recipient: selectedUserId, text: messageData.text}]))
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

    useEffect(() => {
        axios.get('/users')
            .then(res => {
                const offlineUsersArray = res.data
                    //Exclude our own id so we do not pop up 
                    .filter(user => user._id !== id)
                    //Exclude users whos ids are not inside onlineUsers
                    .filter(user => !Object.keys(onlineUsers).includes(user._id))
                // console.log(offlineUsers)
                const offlineUsers = {}
                offlineUsersArray.forEach(user => {
                    offlineUsers[user._id] = user
                })
                // console.log({offlineUsers, offlineUsersArray})
                setOfflineUsers(offlineUsers)
            })
    }, [onlineUsers])

    // create this function inline
    // function selectContact(userId){
    //     setSelectedUserId(userId)
    // }

    //onlineUsers is not an array
    // const onlineUsersExcludingUs = onlineUsers.filter(user => user.username !=== username )
    const onlineUsersExcludingUs = {...onlineUsers}
    delete onlineUsersExcludingUs[id]

    //Logout function
    //reset the cookie to empty
    //also set the id username to null
    function logout() {
        axios.post('/logout')
            .then(() => {
                setWs(null)
                setId(null);
                setUsername(null);
            })
    }


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
        <div className="bg-white w-1/3 flex flex-col">
            <div className="flex-grow">
                <Logo/>
                {/* {username} we have our context now we do not want to display ourselves in the users list*/} 
                {Object.keys(onlineUsersExcludingUs).map(userId => (
                    //might need to adjust the key to userId
                    <User 
                    key={userId}
                    id={userId}
                    username={onlineUsersExcludingUs[userId]}
                    selected={userId === selectedUserId}
                    onClick={() => setSelectedUserId(userId)}
                    online={true}
                    />
                ))}
                {Object.keys(offlineUsers).map(userId => (
                    //might need to adjust the key to userId
                    <User 
                    key={userId}
                    id={userId}
                    username={offlineUsers[userId].username}
                    selected={userId === selectedUserId}
                    onClick={() => setSelectedUserId(userId)}
                    online={false}
                    />
                ))}
            </div>
            <div className="flex justify-around mb-2">
                <div className="border-solid">
                    <button className="ring ring-blue-300 md:ring-blue-500 bg-slate-200 rounded px-6 cursor-pointer text-white">Settings</button>
                </div>
                <div>
                    <button 
                    onClick={logout} 
                    className="border bg-blue-500 rounded px-6 cursor-pointer text-white">
                        Logout
                    </button>
                </div>
            </div>
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