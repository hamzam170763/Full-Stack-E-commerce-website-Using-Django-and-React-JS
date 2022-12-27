import React from 'react'
import { useState } from 'react'
import Base from "../core/Base"
import { Link, Redirect } from 'react-router-dom'
import { authenticate, isAuthenticated, signin } from '../auth/helper'



const Signin=()=> {

    const [values, setValues] = useState({
        name:"",
        email:"",
        password:"",
        error:"",
        success:false,
        loading:false,
        didRedirect:false
    })

    const {name, email, password, error, success, loading, didRedirect } = values

    const handleChange = (name) => (event) =>{
        setValues({...values,
          error:false,
          [name]: event.target.value})
      }

      
    const onSubmit = (event) => {
      event.preventDefault()
      setValues({...values, error:false, loading:true})
      signin({email, password})
      .then((data) =>{
        console.log("DATA",data)
        if (data.token){
          // let sessionToken = data.token
          authenticate(data, ()=>{
            console.log("SESSION TOKEN ADDED")
            setValues({
              ...values,
              didRedirect: true
            })
          })
          // if (didRedirect == true){
          //   performRedirect()
          // }
        } else {
          setValues({
            ...values,
            loading:false
          })
        }

      })
      .catch( e => console.log(e))
    }

    const performRedirect=(didRedirect)=>{
      if (isAuthenticated() && didRedirect) {
        console.log("REDIRECTED")
        return <Redirect to="/" />
      }
    }

    const loadingMessage = () =>{
      return(
        loading && (
          <div className="alert alert-info">
            <h2>Loading....</h2>
          </div>
        )
      )
    }

    const successMessage = () =>{
        return (
          <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
              <div className='alert alert-success'
              style={{ display: success ? "": "none" }}
              >
                New Acount Created Successfully.Please <Link to="/signin" >login now.</Link>
              </div>
            </div>
          </div>
        )
      }
    
    const errorMessage = () =>{
        return (
          <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
              <div className='alert alert-danger'
              style={{ display: error ? "": "none" }}
              >
                Check all fields again.
              </div>
            </div>
          </div>
        )
      }
    
    const signInForm = () =>{
        return(
          <div className='row'>
            <div className='col-md-6 offset-sm-3 text-left'>
              <form>
                <div className="form-group">
                  <label className="text-light">Email</label>
                  <input 
                    className='form-control' 
                    type="text" 
                    value={email} 
                    onChange={handleChange("email")}
                    />
                </div>
                <div className="form-group">
                  <label className="text-light">Password</label>
                  <input 
                    className='form-control' 
                    type="password" 
                    value={password} 
                    onChange={handleChange("password")}
                    />
                </div>
                <button 
                  onClick={onSubmit}// () are not used here because we dont want to run this method directly but only when onClick event triggers.
                  className="btn btn-success btn-block">
                  Submit
                </button>
              </form>
            </div>
          </div>
        )
      }
    
  return (
    <Base title='Welcome to Signin Page' description='A Tshirt Store'>
    {loadingMessage()}
    {signInForm()}
    <p className='text-center'>
        {JSON.stringify(values)}
    </p>
    {/* <button 
    className='btn btn-info btn-block'
    onClick={performRedirect} >Redirect</button> */}
    {performRedirect(didRedirect)}
    </Base>
  )
}

export default Signin