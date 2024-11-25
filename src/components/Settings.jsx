import axios from "axios"
import { UserContext } from "../UserContext"
import { useContext, useState } from "react"

function Settings({onClose, setUsername}) {
    const {id} = useContext(UserContext)
    const [newUsername, setNewUsername] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Update username function
    const updateUsername = async () => {
        if (!newUsername.trim()) {
            setError("Username cannot be empty."); // Validate input
            return;
        }
        setLoading(true); // Show loading
        try {
            const res = await axios.put("/update", {
                userId: id,
                newUsername,
            });
            setUsername(res.data.username); // Update username in context
            setSuccess("Username successfully updated."); // Show success message
            setNewUsername(""); // Clear input field
        } catch (err) {
            setError("Failed to update username."); // Show error message
        } finally {
            setLoading(false); // Hide loading
        }
    };

     // Delete account function
    const deleteAccount = async () => {
        setLoading(true); // Show loading
        try {
            await axios.delete(`/delete/${id}`);
            window.location.href = "/signup"; // Redirect after account deletion
        } catch (err) {
            setError("Failed to delete account."); // Show error message
        } finally {
            setLoading(false); // Hide loading
        }
    };

  return (
    <div className="bg-white p-4 rounded shadow-md">
    <h2 className="text-lg font-bold mb-4">Settings</h2>
    {error && <p className="text-red-500">{error}</p>} {/* Display error */}
    {success && <p className="text-green-500">{success}</p>} {/* Display success */}

    {/* Update Username Section */}
    <div className="mb-4">
        <label className="block mb-2">Update Username:</label>
        <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)} // Handle input change
            className="border p-2 w-full rounded"
            disabled={loading} // Disable during loading
        />
        <button
            onClick={updateUsername} // Call updateUsername function
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            disabled={loading} // Disable button during loading
        >
            {loading ? "Updating..." : "Update Username"} {/* Show loading text */}
        </button>
    </div>

    {/* Delete Account Section */}
    <div>
        <button
            onClick={deleteAccount} // Call deleteAccount function
            className="bg-red-500 text-white px-4 py-2 rounded"
            disabled={loading} // Disable button during loading
        >
            {loading ? "Deleting..." : "Delete Account"} {/* Show loading text */}
        </button>
    </div>

    {/* Close Settings Modal */}
    <button onClick={onClose} className="mt-4 text-gray-500 underline">
        Close Settings
    </button>
</div>
    )
}

export default Settings