import {useState, createContext, useContext, useEffect} from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        if(localStorage.getItem("user") !== null) {
            setUser(JSON.parse(localStorage.getItem("user")))
        }
    },[])

    const login = (user) => {
        localStorage.setItem("user", JSON.stringify(user))
        setUser(user)
    }

    const logout = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("creds")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}