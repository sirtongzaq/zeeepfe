import axios from "axios";

export const createCloudinaryClient = (cloudName: string) => {
  return axios.create({
    baseURL: `https://api.cloudinary.com/v1_1/${cloudName}`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
