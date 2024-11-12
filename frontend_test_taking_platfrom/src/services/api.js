import axiosInstance from '../utils/axiosInstance';
import apiUrl from '../utils/apiUrls';

// Login function
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post(apiUrl.LOGIN, credentials);
  return response.data;
};

//Register function
export const registerUser = async (userData) => {
  const response = await axiosInstance.post(apiUrl.REGISTER, userData);
  return response.data;
};

export const logoutUser = async (token) => {
  const response = await axiosInstance.post(apiUrl.LOGOUT, token);
  return response.data;
};



