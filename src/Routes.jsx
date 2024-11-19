import { useContext } from "react"
import RegisterAndLoginForm from "./components/RegisterAndLoginForm"
import { UserContext } from "./UserContext"

function Routes() {
    const {username, id} = useContext(UserContext)

    if(username){
        return 'Welcome ' + username;
    }
  return (
    <RegisterAndLoginForm/>
  )
}

export default Routes