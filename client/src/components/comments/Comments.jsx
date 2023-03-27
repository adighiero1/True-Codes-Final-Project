import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
//to fetch comments according to post id we will use react query to fetch data
const Comments = ({ postId }) => {
  const [desc, setDesc] = useState(""); //description use state
  const { currentUser } = useContext(AuthContext); //using auth context to set the current user and use the current user object data bellow

  // react query. we use comments endpoint and as query postiD will be our post id
  const { isLoading, error, data } = useQuery(["comments"], () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data; //this data will be used bellow
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    //take new comment from user and our endpoint will be comment. after this process we are going to refrsh our comments
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId }); //we are going to send our description and post
    setDesc(""); //setting empty string back
  };

  return (
    <div className="comments">
      <div className="write">
        {/*here is where you write the comment and pull up the users profile picture next to the coment*/}
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc} /*when we change input we are going to change state*/
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading //if its loading write loading
        ? "loading" //if not show me data
        : data.map((comment) => (
            <div className="comment">
              <img src={"/upload/" + comment.profilePic} alt="" />
              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="date">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
