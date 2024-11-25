

function Card({title, description, image, publishedAt, url}) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg max-w-full">
            {image && (
                <a href={url} target="_blank" rel="noopener noreferrer">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-48 object-cover rounded-md"
                    />
                </a>
            )}
            <div className="mt-4">
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-blue-700 hover:underline h-12 overflow-hidden"
                >
                    {title}
                </a>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {description}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                    Published: {new Date(publishedAt).toLocaleString()}
                </p>
            </div>
    </div>
  )
}

export default Card