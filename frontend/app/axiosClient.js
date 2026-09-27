import axios from "axios";
import { API_BASE_URL } from "./lib/config";

const axiosClient = async (
  path,
  data,
  accessToken = null,
  type = "POST",
  isFormData = false,
) => {
  const endpoint = `${API_BASE_URL}/${path}`;

  const config = {
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
    withCredentials: false,
  };

  try {
    let res;

    if (type === "POST") {
      res = await axios.post(endpoint, data, config);
    } else if (type === "GET") {
      res = await axios.get(endpoint, config);
    } else if (type === "PUT") {
      res = await axios.put(endpoint, data, config);
    } else if (type === "DELETE") {
      res = await axios.delete(endpoint, data, config);
    } else if (type === "PATCH") {
      res = await axios.patch(endpoint, data, config);
    }

    return res.data;
  } catch (err) {
    console.error(`${type} request failed to ${path}`, err.response?.data);
    throw err;
  }
};

export default axiosClient;
