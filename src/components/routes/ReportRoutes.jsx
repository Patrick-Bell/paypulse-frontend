import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const createReport = async (reportData) => {
    const response = await axios.post(`${apiUrl}/reports`, { report: reportData }, { withCredentials: true});
    return response.data;
};

export const getReports = async () => {
    const response = await axios.get(`${apiUrl}/reports`, { withCredentials: true});
    console.log(response.data)
    return response.data;
}

  