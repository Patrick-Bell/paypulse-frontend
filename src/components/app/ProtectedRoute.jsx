import { useAuth } from "../context/AuthContext"
import { useState, useEffect } from 'react'
import { Navigate } from "react-router"

const ProtectedRoute = ({ requiredRole }) => {

    const { user, isAuthenticated, checkAuth } = useAuth()

    const verifyUser = async () => {
        try {
            await checkAuth()
        } catch (error) {
            console.error("Error checking authentication:", error)
        }
    }

    useEffect(() => {
        verifyUser()
    }, [])

    const authenticated = isAuthenticated && user && user.role === requiredRole

    if (!authenticated) {
        console.log('User is not authenticated');
        return <Navigate to="/" />;
      }
    
      if (requiredRole && userRole !== requiredRole) {
        console.log('User does not have the required role');
        return <Navigate to="/" />;
      }
    
      return children;

}

export default ProtectedRoute