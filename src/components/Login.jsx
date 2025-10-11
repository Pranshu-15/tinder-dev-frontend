import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
   const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState("")
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleLogin = async () => {
    try{
      const res = await axios.post(BASE_URL + "/login",
       {
       emailId,
       password,
     },
     {withCredentials:true})
     dispatch(addUser(res?.data?.data))
     return navigate("/")
    }catch(err){
      setError(err?.response?.data)
    }
  }
  const handleSignUp = async () => {
    const res = await axios.post(BASE_URL + "/signup", 
      {
        firstName,
        lastName,
        emailId,
        password
      },{withCredentials: true})
      dispatch(addUser(res?.data?.data))
      return navigate("/profile")
  }
  return (
    <>
<div className="hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <div className="text-center lg:text-left">
      <h1 className="text-5xl font-bold">{isLoggedIn?  "Sign Up now!" : "Login now!"}</h1>
      <p className="py-6">
        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
        quasi. In deleniti eaque aut repudiandae et a id nisi.
      </p>
    </div>
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <fieldset className="fieldset">
         {isLoggedIn && 
         <>
         <label className="label">First Name</label>
          <input 
          type="text" 
          className="input" 
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
           />
          <label className="label">Last Name</label>
          <input 
          type="text" 
          className="input" 
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
           />
           </>}
          <label className="label">Email</label>
          <input 
          type="email" 
          className="input" 
          placeholder="Email"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
           />
          <label className="label">Password</label>
          <input 
          type="password" 
          className="input" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}  
          minLength="8"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
          />
          {error &&<p>{error}</p>}
          <div><a className="link link-hover flex justify-center "onClick={() => setIsLoggedIn((value) => !value)}>{isLoggedIn? "Already a user? Login" : "New User? Sign Up"}</a></div>
          <button className="btn btn-neutral mt-4"onClick={isLoggedIn? handleSignUp :  handleLogin }>{isLoggedIn? "Sign Up": "Login"}</button>
        </fieldset>
      </div>
    </div>
  </div>
</div>
    </>
  )
}

export default Login
