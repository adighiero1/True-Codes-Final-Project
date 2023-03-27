import { createContext, useEffect, useState } from "react";

export const DarkModeContext = createContext(); // creaates the context that components can provide or read.

export const DarkModeContextProvider = ({ children }) => {
  //contex
  //json.parse transforms it into a json boolean that will be used to check the value of darkmode in app.js
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  ); // checking local storage to see if there is darkmode on local storage or not. if there is no darkmode, user is visiting for the first time that is the || false

  const toggle = () => {
    // this function toggles darkmode. if its true it sets to false if false true
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    // if its the first visit we are going to write it to local storage using useEffect hook
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]); //when we run our application we are going to start the use effect and its going to set our local storage. set item will be darkmode and will be our darkmode value and at first will be false. it will depend on our darkmode value and at first it will be false
  return (
    // here we return our provider. wraps our children and we can send any value to our componenets. here we are returning darkmode and the toggle function to use. the {children} is wraped so we can use Darkmdode Providerr in index.js
    <DarkModeContext.Provider value={{ darkMode, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
};
