import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const createPayslip = async (goalData) => {
    const response = await axios.post(`${apiUrl}/build-payslip`, { withCredentials: true});
    return response.data;
};

export const getPayslips = async () => {
    const response = await axios.get(`${apiUrl}/payslips`, { withCredentials: true});
    return response.data;
}

export const getMonthShifts = async (id) => {
    const response = await axios.get(`${apiUrl}/payslip-shifts/${id}`, { withCredentials: true});
    return response.data;
}

export const getYearPaySlips = async (id) => {
    const response = await axios.get(`${apiUrl}/get-year-payslips/${id}`, { withCredentials: true});
    return response.data;
}