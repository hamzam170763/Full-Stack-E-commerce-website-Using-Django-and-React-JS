import React, {useState} from 'react'
import Base from '../core/Base'
import {Link} from "react-router-dom"
import {signup} from "../auth/helper"

const Signup=()=> {

  const [values, setValues] = useState({
    name:"",
    email:"",
    password:"",
    error:"",
    success:false
  })
  // destructuring the box here
  const { name,email,password,error,success } = values
  
  const handleChange = (name) => (event) =>{
    setValues({...values,
      error:false,
      [name]: event.target.value})
  }

  const onSubmit = (event) =>{
    event.preventDefault()
    setValues({...values, error:false})
    signup({name, email, password})
    .then(data =>{
      console.log("DATA",data)
      if(data.email === email){
        setValues({
          ...values,
          name:"",
          email:"",
          password:"",
          error:false,
          success:true
        })
      } else {
        setValues({
          ...values,
          error:true,
          success:false
        })
      }
    })
    .catch(err => console.log(err))
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

  const signUpForm = () =>{
    return(
      <div className='row'>
        <div className='col-md-6 offset-sm-3 text-left'>
          <form>
            <div className="form-group">
              <label className="text-light">Name</label>
              <input 
                className='form-control'
                type="text" 
                value={name}
                onChange={handleChange("name")}
                // placeholder='Enter your name here'
                />
            </div>
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
    <Base title = "Sign Up Page" description="A signup for User">
        {successMessage()}
        {errorMessage()}
        {signUpForm()}
        <p className='text-white text-center'>
          {JSON.stringify(values)}
        </p>

    </Base>
  )
}

export default Signup