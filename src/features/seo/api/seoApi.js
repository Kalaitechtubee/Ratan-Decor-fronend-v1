import axios from '../../../services/axios';

export const getSeoByPageName = async (pageName) => {
  const { data } = await axios.get(`/seo/page/${pageName}`);
  return data;
};


