import {useState, createContext, useContext, useEffect} from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { auth0Config } from '../auth0-config'

const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const { 
        loginWithRedirect, 
        logout, 
        isAuthenticated, 
        getAccessTokenSilently, 
        user: auth0User,
        isLoading,
        error
    } = useAuth0()

    useEffect(() => {
        const getToken = async () => {
            if (isAuthenticated && auth0User) {
                try {
                    const token = await getAccessTokenSilently({
                        authorizationParams: {
                            audience: auth0Config.audience,
                            scope: "openid profile email"
                        }
                    })
                    localStorage.setItem("token", token)
                    setUser({
                        username: auth0User.nickname || auth0User.email,
                        email: auth0User.email
                    })
                } catch (error) {
                    console.error("Error getting access token:", error)
                }
            }
        }
        getToken()
    }, [isAuthenticated, auth0User, getAccessTokenSilently])

    const login = () => {
        loginWithRedirect({
            authorizationParams: {
                audience: auth0Config.audience,
                scope: "openid profile email"
            }
        })
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        setUser(null)
        logout({ 
            logoutParams: {
                returnTo: window.location.origin
            }
        })
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <AuthContext.Provider value={{user, login, logout: handleLogout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}