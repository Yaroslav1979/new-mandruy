import axios  from "../utils/axios";

export const getPlacesList = () => {
    return axios.get('/places')
}

export const getPlaceById = (id) => {    
    return axios.get(`/places/${id}`)
}