import { useAuth } from "../context/AuthContext"
import { useState, useEffect } from 'react'
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ requiredRole, children }) => {
  const { user, isAuthenticated, checkAuth } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await checkAuth()  // e.g. restore user from token/localStorage
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setLoading(false)
      }
    }
    verifyUser()
  }, [])

  if (loading) {
    return <p>Loading...</p> // or a spinner
  }

  if (!isAuthenticated || !user) {
    console.log("User is not authenticated")
    return <Navigate to="/" />
  }

  if (requiredRole && user.role !== requiredRole) {
    console.log("User does not have the required role")
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
