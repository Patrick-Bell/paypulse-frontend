import { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate()
    
   const login = async (formData) => {
        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { user: formData }, { withCredentials: true });
            console.log(response?.data, response?.data?.user)
            setUser(response?.data?.user)
            setIsAuthenticated(true);
            navigate('/dashboard')
        }catch(e){
            console.log(e)
            throw e
        }
   }

   const updateUser = async (id, formData) => {
    try{
        const response = await axios.patch(`${import.meta.env.VITE_API_URL}/users/${id}`, { user: formData }, { withCredentials: true });
        setUser(response.data);
    }catch(e){
        console.log(e)
    }
   }

   useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/current-user`,
          { withCredentials: true } // <-- sends session cookie
        );
        setUser(response.data);
      } catch (err) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

   const checkAuth = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/current-user`, { withCredentials: true });
      if (response?.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
        setIsAuthenticated(false);
    }
  };

   const logout = async () => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/logout`, { withCredentials: true });
        setUser(null);
        setIsAuthenticated(false);
        navigate('/');
        toast.success('Logged out successfully', {
            description: 'You have been logged out.',
        });
    }catch(e){
        console.log(e)
    }
   }
    
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser, setUser, checkAuth }}>
        {children}
        </AuthContext.Provider>
    );
    }

    export const useAuth = () => {
        return useContext(AuthContext);
    };
    