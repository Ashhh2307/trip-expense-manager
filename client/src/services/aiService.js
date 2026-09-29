import api from './api';

export const parseExpenseMessage = async ({ message, autoCreate = false, trip = '' }) => {
  const response = await api.post('/ai/parse-expense', {
    message,
    autoCreate,
    trip,
  });
  return response.data;
};
