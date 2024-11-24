// import React from 'react'
import Avatar from "./Avatar.jsx"

function User({id, username, selected, onClick, online}) {
  return (
    <div 
        key={id} 
        onClick={() => onClick(id)}
        className={`border-b border-gray-300 flex items-center gap-1 cursor-pointer ` + (selected ? 'bg-gray-300' : '')}>
            {selected && (
                <div className="w-1 bg-blue-600 h-12"></div>
            )}
            <div className="flex gap-2 pl-4 py-2 items-center">
                {/* map through each users username */}
                {/* {userId} */}
                <Avatar username={username}  userId={id} online={online}/>
                <span className="text-gray-800 font-medium">{username}</span>
            </div>
    </div>
)
}

export default User