import { useContext } from "react"
import Register from "./components/Register"
import { UserContext } from "./UserContext"

function Routes() {
    const {username, id} = useContext(UserContext)

    if(username){
        return 'Welcome ' + username;
    }
  return (
    <Register/>
  )
}

export default Routes