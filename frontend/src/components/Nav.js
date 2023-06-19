import { useNavigate } from "react-router-dom"
import {useAuth } from "./Auth"

const Nav = () => {
    const auth = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        auth.logout()
        navigate("/login")
    }

    return (
    <nav className='flex justify-end text-white p-5'>
        {
            !auth.user?
                null
                :
                <div className='flex gap-10 items-center'>
                    <div className='flex flex-col'>
                        <p className="text-xl">Welcome, {auth.user.username}</p>
                    </div>
                    
                    <button onClick={handleLogout} className='shadow-xl rounded-lg bg-slate-500 p-2'>Log Out</button>
                </div>
        }
    </nav>
    )
}

export default Nav