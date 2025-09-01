import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const createPayment = async () => {
    const response = await axios.post(`${apiUrl}/payment`, { withCredentials: true});
    return response.data;
};
