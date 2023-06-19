import {useState} from 'react'
import conf from "../conf.json"
import { useAuth } from '../components/Auth'
import { Navigate, useNavigate } from 'react-router-dom'

const Login = () => {
    const [error, setError] = useState(false)
    const [username, setUsername] = useState("")
    const [pass, setPass] = useState("")

    const auth = useAuth()
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()
        setError(false)

        if(username.length === 0 || pass.length === 0){
            setError(true)
        } else {
            fetch(conf.url + `/user/${username}`, {
                mode: "cors",
                headers: {
                    "Authorization": `Basic ${btoa(username + ":" + pass)}`
                }
            })
            .then(res => {
                if(!res.ok) {
                    setError(true)
                }
                return res.json()
            })
            .then(data => {
                auth.login(data.data)
                localStorage.setItem("creds", JSON.stringify(`Basic ${btoa(username + ":" + pass)}`))
                navigate("/")
            })
            .catch(err => console.log(err))
        }
    }

    return (
        <div className='h-screen flex flex-col justify-center items-center'>
            {auth.user?
                <Navigate to="/"/>
                :
                <div className='rounded-xl shadow-xl bg-slate-600 w-[25%] h-fit flex flex-col items-center p-8 gap-5'>
                    <h1 className='text-5xl text-white'>Login</h1>
                    <form className='flex flex-col gap-3 w-3/4'>
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className='h-10 rounded-lg p-2'/>
                        <input type="password" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} className='h-10 rounded-lg p-2'/>
                    </form>
                    <button className='rounded-lg p-2 bg-slate-300 text-xl' onClick={handleLogin}>Login</button>
                    {error? <p className='text-red-600 text-md'>Invalid username or password, try again.</p> : null}
                    <p className='text-white text-lg'>Or <a href="/register" className='text-blue-400 underline'>Sign Up</a></p>
                </div>
            }
        </div>
    )
}

export default Login