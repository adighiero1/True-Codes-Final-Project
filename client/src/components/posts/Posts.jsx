import Post from "../post/Post"; // importing post
import "./posts.scss";
import { useQuery } from "@tanstack/react-query"; //library to fetch and catch data
import { makeRequest } from "../../axios"; //importing axios request function
//adding userId here we are sending it as a query to the backend server to postjs in controler
const Posts = ({ userId }) => {
  // usequery to fetch posts. query name is posts
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts?userId=" + userId).then((res) => {
      //imported axios function
      return res.data; //returns the data
    })
  );
  console.log(data);
  return (
    <div className="posts">
      {error //if there is an error
        ? "Something went wrong!"
        : isLoading //if its loading
        ? "loading"
        : // If its not loading, we are maping through these posts and for each item create a post div. everything else about posts is done in the Post.js.
          //using post compoment here and passing the post into it. since we are using map we have to give a key which will be the post.id
          data.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
