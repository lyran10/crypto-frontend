import axios from "axios"

// functions to check the token

export const tokenFromDataBase = async (id) => {
  return await axios.post("/token",{id : id},{withCredentials:true})
}

export const checkTokenExpired = async(data) => {
return await axios.get("/expires",{
      headers : {Authorization: `Bearer ${data}`},
      withCredentials:true
     })
}

export const renewToken = async() => {
return await axios.get("/reftoken",{withCredentials:true})
}

export const deleteFromDataBase = async(id) => {
  return await axios.delete("/deltoken", {
    data: { id: id, data: null },
  })
}