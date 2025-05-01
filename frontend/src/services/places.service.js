
const API_BASE_URL = "http://localhost:3000/api";

// Отримання місця за id
export const getPlaceById = async (_id) => {
try {
    if (!_id) throw new Error("ID місця не передано");
    const response = await fetch(`${API_BASE_URL}/places/${_id}`);

    if (!response.ok) {
      throw new Error(`Помилка запиту: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("❌ Помилка при запиті місця за id:", error);
    throw error;
  }
};

import axios  from "../utils/axios";

export const getPlacesList = () => {
    return axios.get('/places')
}


// import axios from "axios";

// const API_BASE_URL = "http://localhost:3000/api";

// export const getPlaceById = async (id) => {
//   return await axios.get(`${API_BASE_URL}/places/${id}`);
// };




// export const getPlaceById = (id) => {    
//     return axios.get(`/places/${id}`)
// }