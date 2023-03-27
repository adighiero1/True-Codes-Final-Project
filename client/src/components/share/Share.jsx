import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
const Share = () => {
  const [file, setFile] = useState(null); //state hook for file
  const [desc, setDesc] = useState(""); //state hook for desc

  const upload = async () => {
    //upload function to upload the picture
    try {
      const formData = new FormData(); /// we have to create form data because we can't send this file directly to our api
      formData.append("file", file); //passing file into this data
      const res = await makeRequest.post("/upload", formData); //making request
      return res.data; //if everything is ok we are going to return our url
    } catch (err) {
      //if error
      console.log(err);
    }
  };

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient(); //creating mutation. wrapped from app.js

  const mutation = useMutation(
    //using this mutation we are going to make our API request here. this is the fetching function
    (newPost) => {
      return makeRequest.post("/posts", newPost); //using axios endpoint is posts and we are going to send new post(desc and image)
    },
    {
      onSuccess: () => {
        //if succesful we are going to refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  //we are goint to send our file and description using react query
  const handleClick = async (e) => {
    //we are going to use mutation on the handle click
    e.preventDefault();
    let imgUrl = ""; //creating img url
    if (file) imgUrl = await upload(); //using upload function from above. if there is file just update this img url and thats going to be our upload function
    mutation.mutate({ desc, img: imgUrl }); //passing the data from new post
    setDesc(""); //after adding new we are resting values so picture and desc is blank
    setFile(null);
  };
  {
    /*we update this input we update description*/
  }
  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={"/upload/" + currentUser.profilePic} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`} //when we update input we update description
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && ( //if there is a file show it here. this creates a fake url that allows us to show our image here
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])} //set our file and only one image
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            {/*function to share */}
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
