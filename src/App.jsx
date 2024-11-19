
import axios from "axios"
import { UserContextProvider } from "./UserContext"
import Routes from "./Routes"

function App() {
  axios.defaults.baseURL = 'http://localhost:3000'
  axios.defaults.withCredentials = true

  // const {username} = useContext(UserContext)
  // console.log(username)

  return (
    <>
      <UserContextProvider>
        {/* <Register/> */}
        <Routes/>
      </UserContextProvider>
    </>
  )
}

export default App
