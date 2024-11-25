import { useState, useEffect } from "react"
import axios from "axios"
import Chat from "./Chat.jsx"
import Card from "./Card.jsx"
// import Logo from "./Logo.jsx"
import Nav from "./Nav.jsx"
import Settings from "./Settings.jsx"

function Dashboard() {
    const [news, setNews] = useState([])
    const [showChat, setShowChat] = useState(false)
    const [showSettings, setShowSettings] = useState(false);
    const [ws, setWs] = useState(null);  // WebSocket state
    const [id, setId] = useState(null);  // User ID state
    const [username, setUsername] = useState(null);  // Username state

    //Fetch news from the API
    useEffect(() => {
        async function fetchNews() {
            try {
                const response = await axios.get("http://localhost:3000/api/news")
                console.log("Fetched news data:", response.data); // Debug the API response
                setNews(response.data.data)
            } catch (error) {
                console.error("Error Fetching news:", error)
            }
        }
        fetchNews()
    }, [])

    // Fetch the profile data on component mount to set the username
    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await axios.get("http://localhost:3000/profile", {
                    withCredentials: true // Make sure cookies are sent with the request
                });
                setUsername(response.data.username); // Set the username from the response
                setId(response.data.userId)
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        }
        fetchUserProfile();
    }, []); // Empty dependency array to fetch data only once when the component mounts
    

        //Logout function
    //reset the cookie to empty
    //also set the id username to null
    // Logout function
    function logout() {
        // Post the logout request to the server
        axios.post('/logout', {}, { withCredentials: true })
            .then(() => {
                // Clear user-related state
                
                setId(null);
                setUsername(null);
                window.location.href = '/login';
                
                // Optionally redirect or reset UI
                // For example, you can redirect to a login page or show a login button
                // window.location.href = '/login'; // Optional: Redirect to login page
            })
            .catch(error => {
                console.error("Error during logout:", error);
                // Optionally, show an error message to the user
            });
    }
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Nav 
                username={username}
                setShowChat={setShowChat} 
                setShowSettings={setShowSettings} 
                logout={logout}
            />

            {/* Main Content */}
            <div className="flex-grow overflow-auto">
                {showChat ? (
                    <Chat />
                ) : (
                    <div className="p-4">
                        <h2 className="text-2xl font-bold mb-4">Top Headlines</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {news.length === 0 ? (
                                <p>Loading news...</p>
                            ) : (
                                news.slice(0, 10).map((article) => (
                                    <Card
                                        key={article.uuid}
                                        title={article.title}
                                        image={article.image_url}
                                        description={article.description}
                                        publishedAt={article.published_at}
                                        url={article.url}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Settings Modal Overlay */}
            {showSettings && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <Settings onClose={() => setShowSettings(false)} setUsername={setUsername}/>
                </div>
            )}
        </div>
  )
}

export default Dashboard