import axios from "axios"

// functions to check the token

export const tokenFromDataBase = (id) => {
  return axios.post("http://localhost:4000/token",{id},{withCredentials:true})
}

export const checkTokenExpired = (data) => {
return axios.get("http://localhost:4000/expires",{
      headers : {Authorization: `Bearer ${data}`},
      withCredentials:true
     })
}

export const renewToken = () => {
return axios.get("http://localhost:4000/reftoken",{withCredentials:true})
}

export const deleteFromDataBase = (id) => {
  return axios.delete("http://localhost:4000/deltoken", {
    data: { id: id, data: null },
  })
}