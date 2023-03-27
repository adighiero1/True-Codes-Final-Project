import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    //use state hook to login
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null); //
  //function that will handle the change
  const handleChange = (e) => {
    //returns previus inputs. if we change only one value others will stay the same for example if you change password only password will be changed.
    //e.target.name refers to the name that is set in the input fields bellow
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }; // the target names equal the target values when you type

  const handleClick = async (e) => {
    //function that triggers request
    e.preventDefault(); //to prevent refreshing the page

    try {
      //making the register request using axios
      await axios.post("http://localhost:8800/api/auth/register", inputs); //seinding inputs and url for the request. if everything ok we go to login page
    } catch (err) {
      //catching an error
      setErr(err.response.data); //if there is something wrong we are setting error here
    }
  };

  console.log(err);

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Instabook.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          {/* registering using useeffect hook */}
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            {err && err}
            {/*showing error here */}
            <button onClick={handleClick}>Register</button>
            {/*handle click will be triggerd. when you click you are making register request */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
