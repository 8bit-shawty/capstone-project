import { useContext } from "react"
import RegisterAndLoginForm from "./components/RegisterAndLoginForm"
import { UserContext } from "./UserContext"
// import Chat from "./components/Chat.jsx"
import Dashboard from './components/Dashboard.jsx'


function Routes() {
    const {username, id} = useContext(UserContext)

    if(username && id){
        return <Dashboard/>
    }
  return (
    <RegisterAndLoginForm/>
  )
}

export default Routes