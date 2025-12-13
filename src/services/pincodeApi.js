import axios from 'axios';

export const fetchPincodeData = async (pincode) => {
  try {
    const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch pincode data');
  }
};