import axios from 'axios';
import type { Credentials, GreenApiNotification } from '../types';

const BASE_URL = import.meta.env.DEV
  ? '/green-api'
  : 'https://api.green-api.com';


export const sendMessage = async (
  credentials: Credentials,
  chatId: string,
  message: string
) => {
  const { idInstance, apiTokenInstance } = credentials;
  const url = `${BASE_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

  const response = await axios.post(url, {
    chatId,
    message,
  });

  return response.data;
};

export const receiveNotification = async (
  credentials: Credentials
): Promise<GreenApiNotification | null> => {
  const { idInstance, apiTokenInstance } = credentials;
  const url = `${BASE_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`;

  const response = await axios.get(url, {
    params: { receiveTimeout: 5 },
  });

  return response.data;
};

export const deleteNotification = async (
  credentials: Credentials,
  receiptId: number
) => {
  const { idInstance, apiTokenInstance } = credentials;
  const url = `${BASE_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;

  const response = await axios.delete(url);
  return response.data; // { result: true }
};


export const getStateInstance = async (credentials: Credentials) => {
  const { idInstance, apiTokenInstance } = credentials;
  const url = `${BASE_URL}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`;

  const response = await axios.get(url);
  return response.data;
};