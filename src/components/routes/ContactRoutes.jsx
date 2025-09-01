import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const createContact = async (contactData) => {
    const response = await axios.post(`${apiUrl}/contacts`, { contact: contactData }, { withCredentials: true});
    return response.data;
};

export const getContacts = async () => {
    const response = await axios.get(`${apiUrl}/contacts`, { withCredentials: true});
    return response.data;
}

export const deleteContact = async (id) => {
    const response = await axios.delete(`${apiUrl}/contacts/${id}`, { withCredentials: true});
    return response.data
}

export const addContactToBook = async (id) => {
    window.open(`${apiUrl}/download-contact/${id}`, "_blank");
  };
  