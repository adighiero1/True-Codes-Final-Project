import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  //taking in post prop
  const [commentOpen, setCommentOpen] = useState(false); //use state hook when a comment is open. at the begging is false because it is not clicked
  const [menuOpen, setMenuOpen] = useState(false); //use state for delete menu

  const { currentUser } = useContext(AuthContext); //current user from authcontext api

  const { isLoading, error, data } = useQuery(["likes", post.id], () =>
    //making request. endpoint is likes passing the post id here
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data; //return data if everything is good
    })
  );
  console.log(data);
  const queryClient = useQueryClient(); //creating query client to make queries

  //the mutation makes it so if its liked, we are going to delete the like since its already liked

  const mutation = useMutation(
    // mutation to make queries using axios
    (liked) => {
      //post.id comes from the const post
      if (liked) return makeRequest.delete("/likes?postId=" + post.id); // if its liked we are going to add the like into our db. if its not we make another request. the delete method and send our post id
      return makeRequest.post("/likes", { postId: post.id }); //for delete we are passing this as a query. when it comes to the post we are sending the postId inside this object, its request and body and inside the body we are sending the post
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        //after mutation it will refresh our likes
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );
  const deleteMutation = useMutation(
    (postId) => {
      //we are going to return axios delete for the route posts and pass it the postid to delete
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        //if succesfull tis going to affect our posts
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleLike = () => {
    //we will use mutation so we can see result immediatly
    mutation.mutate(data.includes(currentUser.id)); //calling mutation. this value will be true or false so we can take the value
  };

  const handleDelete = () => {
    //calling the delete mutation here and pass it the postid to delete
    deleteMutation.mutate(post.id);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/" + post.profilePic} alt="" />
            <div className="details">
              <Link // when we click on this link we will go to profile page
                to={`/profile/${post.userId}`} // when you click on the post it might be from different user so it takes you to that users profile
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          {/*when we click here we open up delet menu*/}
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {/*if menu is open  we are going to show a button. when we click on this button we are going to create mutation*/}
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          {/*destination crated by multer in share.js*/}
          <img src={"/upload/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading" // condition. if data includes our userId from current user from auth context. if its not loading show this data
            ) : //red if liked black if not liked
            data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike} //functoin to make like red
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {/*using array length to display how many likes */}
            {data?.length} Likes
          </div>
          {/* when you click see coments you set the commentOpen as true and you can see the comments with the !*/}
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
        {/* condition when its true it shows comment when comment is open it shows the coments */}
      </div>
    </div>
  );
};

export default Post;
