import { useContext, useState } from "react"
import axios from 'axios'
import { UserContext } from "../UserContext.jsx"


function RegisterAndLoginForm() {
    
    const [username, setUsername] =useState('')
    const [password, setPassword] =useState('')
    const [isloginOrRegister, setIsLoginOrRegister] = useState('register')

    const{setUsername:setLoggedInUsername, setId} = useContext(UserContext)

    async function handleSubmit(e){
        e.preventDefault()
        
        //have different urls based on if the user has an account or not
        const url = isloginOrRegister === 'register' ? 'register' : 'login';
        
        const {data} = await axios.post(url, {username, password})
        setLoggedInUsername(username)
        setId(data.id)
    }
  return (
  <>
    <div className="bg-blue-400 h-screen flex items-center">
        <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
            <input 
            value={username} 
            onChange={e => setUsername(e.target.value)}
            type="text" 
            placeholder="username" 
            className="w-full rounded-sm p-2 mb-2 block border"/>
            <input 
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password" 
            placeholder="password" 
            className="w-full rounded-sm p-2 mb-2 block border"/>
            <button className="bg-blue-200 block text-white w-full rounded-sm p-2">
                {isloginOrRegister === 'register' ? 'Register' : 'Login'}
            </button>
            <div className="text-center mt-2">
                {isloginOrRegister === 'register' && (
                    <div>
                        Already have an account? 
                        <button onClick={() => {setIsLoginOrRegister('login')}}>
                            Login Here!
                        </button>
                    </div>
                )}
                {isloginOrRegister === 'login' && (
                    <div>
                    Dont have an account? 
                    <button onClick={() => {setIsLoginOrRegister('register')}}>
                        Sign up!
                    </button>
                </div>
                )}
            </div>
        </form>
    </div>
  </>
  )
}

export default RegisterAndLoginForm