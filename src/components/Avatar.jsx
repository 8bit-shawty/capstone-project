

function Avatar({username, userId}) {
    const colors = [
        'bg-rose-500',
        "bg-fuchsia-500",
        "bg-purple-500",
        'bg-cyan-500',
        "bg-amber-500",
        'bg-neutral-500',
        'bg-lime-500',
        'bg-teal-500'
    ]

    const getColorIndex = (id) => {
        let hash = 0;
        for(let i = 0; i < id.length; i++){
            hash = id.charCodeAt(i) + ((hash << 5 ) - hash)
        }
        return Math.abs(hash) % colors.length
    }

    const userColor = colors[getColorIndex(userId)]

  return (
    <div className={`w-10 h-10 ${userColor} rounded-full flex items-center`}>
        <div className="text-center w-full">
            {username[0]}
        </div>
    </div>
  )
}

export default Avatar