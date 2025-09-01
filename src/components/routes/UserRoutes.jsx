import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL;

export const registerUser = async (userData) => {
    const response = await axios.post(`${apiUrl}/register`, { user: userData }, { withCredentials: true});
    return response.data;
}

export const changePassword = async (userData) => {
    try{
        const response = await axios.post(`${apiUrl}/change-password`, { user: userData }, { withCredentials: true });
        return response.data;
    } catch(e) {
        throw e
    }
}