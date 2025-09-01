import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const createGoal = async (goalData) => {
    const response = await axios.post(`${apiUrl}/goals`, { goal: goalData }, { withCredentials: true});
    return response.data;
};

export const getGoals = async () => {
    const response = await axios.get(`${apiUrl}/goals`, { withCredentials: true});
    return response.data;
}

export const deleteGoal = async (id) => {
    const response = await axios.delete(`${apiUrl}/goals/${id}`, { withCredentials: true});
    return response.data;
}