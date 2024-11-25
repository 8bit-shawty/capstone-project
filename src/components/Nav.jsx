import { useContext } from "react"
import Logo from "./Logo.jsx"
import { UserContext } from "../UserContext.jsx"
import { useNavigate } from "react-router-dom"

function Nav({setShowChat, setShowSettings, logout}) {
    const {username} = useContext(UserContext)
    const navigate = useNavigate();

    const handleLogout = () => {
        logout()
            .then(() => navigate('/login'))
            .catch((error) => console.error("Error during logout:", error.message));
    }
    
    return (
    <>
        {/* Header */}
        <header className="bg-blue-500 text-white p-2 flex justify-between items-center">
            <Logo />

            {/* Display the username if logged in */}
            {username && (
                <span className="text-white">{username}</span>
            )}

            <div className="flex items-center space-x-4">
                {/* Hamburger Icon */}
                <button
                    className="p-2 bg-blue-700 rounded text-white"
                    onClick={() => setShowChat((prev) => !prev)}
                >
                    ☰ {/* Hamburger icon */}
                </button>

                {/* Settings Button */}
                <button
                    className="p-2 bg-blue-700 rounded text-white"
                    onClick={() => setShowSettings(true)}
                >
                    Settings
                </button>

                {/* Logout Button */}
                <button
                    className="p-2 bg-red-700 rounded text-white"
                    onClick={handleLogout}  // Call logout here
                >
                    Logout
                </button>
            </div>
        </header>
    </>
  )
}

export default Nav