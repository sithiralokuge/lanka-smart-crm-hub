import { API_BASE_URL } from './api';

export const sendDataDeletionEmail = async (customerId: string, email: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customer/data-deletion-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId, email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send data deletion email');
    }

    return true;
  } catch (error) {
    console.error('Error sending data deletion email:', error);
    throw error;
  }
};

export const deleteCustomerData = async (customerId: string, token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customer/${customerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete customer data');
    }

    return true;
  } catch (error) {
    console.error('Error deleting customer data:', error);
    throw error;
  }
};
