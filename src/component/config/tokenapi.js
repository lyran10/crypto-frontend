import axios from "axios"

// functions to check the token

export const tokenFromDataBase = async (id) => {
  return await axios.post(`${process.env.REACT_APP_URL}/token`,{id : id},{withCredentials:true})
}

export const checkTokenExpired = async(data) => {
return await axios.get(`${process.env.REACT_APP_URL}/expires`,{
      headers : {Authorization: `Bearer ${data}`},
      withCredentials:true
     })
}

export const renewToken = async() => {
return await axios.get(`${process.env.REACT_APP_URL}/reftoken`,{withCredentials:true})
}

export const deleteFromDataBase = async(id) => {
  return await axios.delete(`${process.env.REACT_APP_URL}/deltoken`, {
    data: { id: id, data: null },
  })
}