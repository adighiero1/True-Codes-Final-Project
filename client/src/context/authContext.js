import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(); //creating authenitcation context using create context hook

export const AuthContextProvider = ({ children }) => {
  //same logic as darkmode we have a current user and set current user
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  ); //save the current user item in local storage. checks if there is a user in local storage. we take the string generaeted bellow from the use effect and parse it back into an object using JSON.parse

  const login = async (inputs) => {
    // instead of toggle function from darkmode we create login function
    const res = await axios.post(
      //taking inputs from the login page
      "http://localhost:8800/api/auth/login",
      inputs,
      {
        withCredentials: true, //since we are working with cookies you may encounter problems
      }
    );

    setCurrentUser(res.data); //current users is the response.data. backend server sends the user information and also the cookie
  };

  useEffect(() => {
    //whenever we change our user we write it into local storage using use effect hook
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]); //sincce this time our user will not be true or false but an object that has user information. json stringify transforms it into string because we CANT store an object in local data
  return (
    // we are returning current user and login in the authcontext provider to use inside our application. do this in the index.
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
