import { API } from "../../backend"
import { cartEmpty } from "../../core/helper/carthelper"


export const signup = (user) => {
    return fetch(`${API}user/`,{
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then((respose) =>{
        return respose.json()
    })
    .catch((err) => console.log(err))
}

export const signin = (user) => {
    const formData = new FormData()

    for (const name in user){
        console.log(user[name])
        formData.append(name, user[name])
    }
//These lines are similar to code written above
    // const { email,password } = user
    // const formData_ = new FormData()
    // formData_.append('email',email)
    // formData_.append('password',password)

    for (var key of formData.keys()){
        console.log("My Key",key)
    }

    return fetch(`${API}user/login/`, {
        method: "POST",
        body: formData,
    })      
    .then((response) => {
        console.log("SUCCESS",response)
        return response.json()
    })
    .catch((err)=>console.log(err))
}

export const authenticate = (data, next) =>{
    if (typeof window !== undefined) {
        localStorage.setItem("jwt",JSON.stringify(data))
        next()
    }
}

export const isAuthenticated = () => {
    if(typeof window == undefined ){
        return false
    }
    if (localStorage.getItem("jwt")) {
        console.log(JSON.parse(localStorage.getItem("jwt")))
        return JSON.parse(localStorage.getItem("jwt"))
        //TODO: compare JWT with database json token
    } else {
        return false
    }
}

export const signout = next =>{
    const userId = isAuthenticated && isAuthenticated().user.id
    console.log('====================================')
    console.log(userId)
    console.log('====================================')
    if(typeof window !== undefined){
        localStorage.removeItem("jwt")
        cartEmpty(()=>{})
        // next()

        return fetch(`${API}user/logout/${userId}`,{
            method: "GET"
        })
        .then((response) => {
            console.log("Signout success")
            next()
        })
        .catch(err => console.log(err))
    }
}