import { useState } from "react"


function Register() {
    const [username, setUsername] =useState('')
    const [password, setPassword] =useState('')
  return (
  <>
    <div className="bg-blue-400 h-screen flex items-center">
        <form className="w-64 mx-auto">
            <input type="text" placeholder="username" className="w-full rounded-sm p-2 mb-2 block border"/>
            <input type="text" placeholder="password" className="w-full rounded-sm p-2 mb-2 block border"/>
            <button className="bg-blue-200 block text-white w-full rounded-sm p-2">Register</button>
        </form>
    </div>
  </>
  )
}

export default Register