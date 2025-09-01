import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const getExpenses = async () => {
    const response = await axios.get(`${apiUrl}/expenses`, { withCredentials: true});
    return response.data;
};
