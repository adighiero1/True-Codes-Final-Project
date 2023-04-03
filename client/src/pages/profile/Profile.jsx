import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false); //usestate to update profile
  const { currentUser } = useContext(AuthContext); //grabbing current user from auth context to be able to display correct data

  //use location hook to get user id from the URL. using javascript split method and splitting where there are slashes and grabbing the third split
  const userId = parseInt(useLocation().pathname.split("/")[2]); //parsing needed to check the user id because it was not coinciding with the type

  //query to fetch the user. endpoint is users.find and passing user id
  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );
  //query to fetch relationship data
  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      //passing userId which from relationships is followeduserId
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
        return res.data; //we return the data here
      })
  );

  const queryClient = useQueryClient(); //creating query client

  const mutation = useMutation(
    //mutation. if we are following this user we are going to delete our follow if we are not following we are going to add new relationship of following
    (following) => {
      if (following)
        //if it includes our user id its going to be true else false
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId }); //else we are not following its going to be teh post method
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    //function that checks if you are following the user or not when you are in another users profile page. from relationship.js
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            {/*setting upload file to be displayed as cover picture */}
            <img src={"/upload/" + data.profilePic} alt="" className="cover" />
            <img
              src={"/upload/" + data.coverPic}
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{data.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.website}</span>
                  </div>
                </div>
                {rIsLoading ? (
                  "loading" //if user id is current user id then we return an update  button, if not we return following or follo button depending on if the user if followed or not
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  //when we click on this button we are going to open up. on updatejs we have closing button
                  <button onClick={handleFollow}>
                    {/*following functionality. if it includes the relationship data we queried before, if it includes our userId you can either follow or not follow */}
                    {relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            {/*to show your posts */}
            <Posts userId={userId} />
          </div>
        </>
      )}
      {/*this condition shows the update component. to close it we set update inside this update model */}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
      {/* button should pull up form but does not*/}
    </div>
  );
};

export default Profile;
