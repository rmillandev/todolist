/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react"
import PropTypes from 'prop-types'

const MY_AUTH_APP = 'MY_AUTH_APP'
const MY_AUTH_APP_DATA = {}

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem(MY_AUTH_APP) ?? false)
    const [saveData, setSaveData] = useState(JSON.parse(localStorage.getItem(MY_AUTH_APP_DATA))) 

    const login = useCallback((responseData) => {
        localStorage.setItem(MY_AUTH_APP, true)
        localStorage.setItem(MY_AUTH_APP_DATA, JSON.stringify(responseData?.body))
        setSaveData(responseData?.body)
        setIsAuthenticated(true)
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem(MY_AUTH_APP)
        localStorage.removeItem(MY_AUTH_APP_DATA)
        setIsAuthenticated(false)
        setSaveData({})
    }, [])

    const value = useMemo(() => ({
        login,
        logout,
        isAuthenticated,
        saveData
    }), [login, logout, isAuthenticated, saveData])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthContextProvider.propTypes = {
    children: PropTypes.object
}

export function useAuthContext() {
    return useContext(AuthContext)
}