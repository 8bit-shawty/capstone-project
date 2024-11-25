import { useState, useEffect } from "react"
import axios from "axios"
import Chat from "./Chat.jsx"
import Card from "./Card.jsx"
import Logo from "./Logo.jsx"

function Dashboard() {
    const [news, setNews] = useState([])
    const [showChat, setShowChat] = useState(false)

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
    return (
        <div className="h-screen flex flex-col">
        {/* Header */}
        <header className="bg-blue-500 text-white p-2 flex justify-between items-center">
            <h1 className="text-xl font-bold">
                <Logo/>
            </h1>
            <button
                className="p-2 bg-blue-700 rounded text-white"
                onClick={() => setShowChat((prev) => !prev)}
            >
                ☰ {/* Hamburger icon */}
            </button>
        </header>

        {/* Main Content */}
        <div className="flex-grow p-4">
            {showChat ? (
                <Chat />
            ) : (
                <>
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
                </>
            )}
        </div>
    </div>
  )
}

export default Dashboard