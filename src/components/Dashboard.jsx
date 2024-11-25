import { useState, useEffect } from "react"
import axios from "axios"
import Chat from "./Chat.jsx"

function Dashboard() {
    const [news, setNews] = useState([])
    const [showChat, setShowChat] = useState(false)

    //Fetch news from the API
    useEffect(() => {
        async function fetchNews() {
            try {
                const response = await axios.get("http://localhost:3000/api/news")
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
                <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">News Dashboard</h1>
                    <button
                        className="p-2 bg-blue-700 rounded text-white"
                        onClick={() => setShowChat((prev) => !prev)}
                    >
                        ☰ {/* Hamburger icon */}
                    </button>
                </header>

                {/* Main Content */}
                <div className="flex flex-grow">
                    {/* News Section */}
                    <div className={`flex-grow p-4 ${showChat ? "hidden md:block" : ""}`}>
                        <h2 className="text-2xl font-bold mb-4">Top Headlines</h2>
                        <div className="space-y-4">
                            {news.length === 0 ? (
                                <p>Loading news...</p>
                            ) : (
                                news.map((article) => (
                                    <div
                                        key={article.uuid}
                                        className="p-4 bg-white shadow rounded-lg"
                                    >
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-700 font-bold text-lg"
                                        >
                                            {article.title}
                                        </a>
                                        <p className="text-sm text-gray-600">
                                            {article.description}
                                        </p>
                                        <span className="text-xs text-gray-400">
                                            Source: {article.source}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Section (Collapsible) */}
                    {showChat && (
                        <div className="w-full md:w-1/3 bg-gray-100 border-l border-gray-300">
                            <Chat />
                        </div>
                    )}
                </div>
            </div>
  )
}

export default Dashboard