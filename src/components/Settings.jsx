import axios from "axios"
import { UserContext } from "../UserContext"
import { useContext, useState } from "react"

function Settings({onClose}) {
    const {id, setId, setUsername} = useContext(UserContext)
    const [newUsername, setNewUsername] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const updateUsername = async() => {
        try {
            const res = await axios.put('/update', {
                userId: id,
                newUsername,
            })
            setUsername(res.data.username);
            setSuccess('Username Successfully Updated');
        } catch (error) {
            setError('Failed to update username')
        }
    }

    const deleteAccount = async() => {
        try {
            await axios.delete(`/delete/${id}`);
            setId(null)
            setUsername(null)
            onClose();
        } catch (error) {
            setError('Failed to delete account')
        }
    }

  return (
    <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">Settings</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <div className="mb-4">
            <label className="block mb-2">Update Username:</label>
            <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="border p-2 w-full rounded"
            />
            <button
                onClick={updateUsername}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
                Update Username
            </button>
        </div>
        <div>
            <button
                onClick={deleteAccount}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Delete Account
            </button>
        </div>
        <button
            onClick={onClose}
            className="mt-4 text-gray-500 underline"
        >
            Close Settings
        </button>
    </div>
    )
}

export default Settings