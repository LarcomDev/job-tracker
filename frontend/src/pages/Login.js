import { useAuth } from '../components/Auth'
import { Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Login = () => {
    const auth = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (auth.user) {
            navigate('/')
        }
    }, [auth.user, navigate])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-white text-center mb-8">Login</h1>
                
                <button 
                    onClick={auth.login}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                        <path d="M12 4c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 14c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z"/>
                    </svg>
                    Login with Auth0
                </button>
            </div>
        </div>
    )
}

export default Login