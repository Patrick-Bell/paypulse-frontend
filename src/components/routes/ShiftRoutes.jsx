import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL;

export const createShift = async (shiftData) => {
    const response = await axios.post(`${apiUrl}/shifts`, { shift: shiftData }, { withCredentials: true})
    return response.data
}

export const getShifts = async () => {
    const response = await axios.get(`${apiUrl}/shifts`, { withCredentials: true})
    return response.data
}

export const getCurrentMonthShifts = async () => {
    const response = await axios.get(`${apiUrl}/month-shifts`, { withCredentials: true})
    return response.data
}

export const getPreviousMonthShifts = async () => {
    const response = await axios.get(`${apiUrl}/previous-month-shifts`, { withCredentials: true})
    return response.data
}

export const getShiftById = async (id) => {
    const response = await axios.get(`${apiUrl}/shifts/${id}`, { withCredentials: true})
    return response.data
}

export const deleteShift = async (id) => {
    const response = await axios.delete(`${apiUrl}/shifts/${id}`, { withCredentials: true})
    return response.data
}

export const editShift = async (id, shiftData) => {
    const response = await axios.put(`${apiUrl}/shifts/${id}`, { shift: shiftData }, { withCredentials: true})
    return response.data
}

export const getWeeklyShifts = async () => {
    const response = await axios.get(`${apiUrl}/get-week-shifts`, { withCredentials: true})
    console.log(response.data)
    return response.data
}

export const getShiftsByDate = async (goal_date, period) => {
    const response = await axios.get(`${apiUrl}/shifts-by-date`, {
      params: {
        goal_date,
        period,
      },
      withCredentials: true, // this must be inside the same object
    });
    return response.data;
  };
  
  