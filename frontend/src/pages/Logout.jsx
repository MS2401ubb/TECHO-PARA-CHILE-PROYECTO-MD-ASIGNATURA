import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logout as logoutRequest } from '../services/auth.service'

function Logout() {
	const { token, logout } = useAuth()

	useEffect(() => {
		logoutRequest(token)
		logout()
	}, [token, logout])

	return <Navigate to="/login" replace />
}

export default Logout
