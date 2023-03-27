import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const [inputs, setInputs] = useState({
    //usestate for login
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null); //usestate for error

  const navigate = useNavigate(); //use navigate hook to go to another page

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext); //using the authentication context using login function

  const handleLogin = async (e) => {
    //
    e.preventDefault();
    try {
      await login(inputs); //we await this function and send our inputs
      navigate("/"); //using the use navigate hook to go to the home page
    } catch (err) {
      //if there is something wrong we send the error data
      setErr(err.response.data);
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Hello World.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            {/*wrappping button around this link so when you click button it takes you to that specific page*/}
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            {/*handles the login. matches the username and password sent above from backend.*/}
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            {err && err}
            <button onClick={handleLogin}>Login</button>
            {/*handle login function */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
