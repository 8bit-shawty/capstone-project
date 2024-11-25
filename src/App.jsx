
import axios from "axios"
import { UserContextProvider } from "./UserContext"
import Routes from "./Routes"
import { BrowserRouter } from "react-router-dom"

function App() {
  axios.defaults.baseURL = 'http://localhost:3000'
  axios.defaults.withCredentials = true

  // const {username} = useContext(UserContext)
  // console.log(username)

  return (
    <>
    <BrowserRouter>
      <UserContextProvider>
        {/* <Register/> */}
        <Routes/>
      </UserContextProvider>
    </BrowserRouter>
    </>
  )
}

export default App
