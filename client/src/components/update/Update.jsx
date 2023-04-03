import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    email: user.email,
    password: user.password,
    name: user.name,
    city: user.city,
    website: user.website,
  });

  const upload = async (file) => {
    console.log(file);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users", user);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();

    //TODO: find a better way to get image URL

    let coverUrl;
    let profileUrl;
    coverUrl = cover ? await upload(cover) : user.coverPic;
    profileUrl = profile ? await upload(profile) : user.profilePic;

    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
    setCover(null);
    setProfile(null);
  }; // Add closing bracket here

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : "/upload/" + user.coverPic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => setCover(e.target.files[0])}
            />
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : "/upload/" + user.profilePic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>
          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="text"
            value={texts.password}
            name="password"
            onChange={handleChange}
          />
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <label>Country / City</label>
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
          />
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={texts.website}
            onChange={handleChange}
          />
          <button onClick={handleClick}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};
export default Update;

// import { useState } from "react";
// import { makeRequest } from "../../axios";
// import "./update.scss";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// //using setOpenUpdate from profile page and user from profile page
// const Update = ({ setOpenUpdate, user }) => {
//   const [cover, setCover] = useState(null); //use state for cover picture
//   const [profile, setProfile] = useState(null); //use state for profile pic
//   const [texts, setTexts] = useState({
//     //use state to set the files using this we are going to update set text
//     email: user.email,
//     password: user.password,
//     name: user.name,
//     city: user.city,
//     website: user.website,
//   });

//   const upload = async (file) => {
//     //this is the upload function that lets you upload new profile and background picture. this file will either be the profile picture or cover picture
//     console.log(file);
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       const res = await makeRequest.post("/upload", formData);
//       return res.data;
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleChange = (e) => {
//     setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const queryClient = useQueryClient(); //creating query client to perform mutation

//   const mutation = useMutation(
//     (user) => {
//       //sending user information. users endpoint
//       return makeRequest.put("/users", user); //we will use jwt to only update the logged in profile page
//     },
//     {
//       onSuccess: () => {
//         //if succesful we are going to refetch the data
//         // Invalidate and refetch
//         queryClient.invalidateQueries(["user"]);
//       },
//     }
//   );

//   const handleClick = async (e) => {
//     e.preventDefault();

//     //creating new url and setting them to undefined to use later
//     let coverUrl = user.coverPic;
//     let profileUrl = user.profilePic;
//     //if there is a coverfile we are going to update it
//     //basically if it has file, we are going to update it and return new url
//     //if there is no new file we are going to keep old one
//     if (cover) {
//       coverUrl = await upload(cover);
//     }
//     if (profile) {
//       profileUrl = await upload(profile);
//     }
//     mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
//     setOpenUpdate(false); //we close the component
//     setCover(null);
//     setProfile(null);
//   };

//   return (
//     <div className="update">
//       <div className="wrapper">
//         <h1>Update Your Profile</h1>
//         <form>
//           {/*creating form that will hold all the fields that we can update*/}
//           <div className="files">
//             <label htmlFor="cover">
//               <span>Cover Picture</span>
//               <div className="imgContainer">
//                 <img
//                   src={
//                     cover
//                       ? URL.createObjectURL(cover)
//                       : "/upload/" + user.coverPic
//                   }
//                   alt=""
//                 />
//                 <CloudUploadIcon className="icon" />
//               </div>
//             </label>
//             <input
//               type="file"
//               id="cover"
//               style={{ display: "none" }} /*changing the file */
//               onChange={(e) => setCover(e.target.files[0])}
//             />
//             <label htmlFor="profile">
//               <span>Profile Picture</span>
//               <div className="imgContainer">
//                 <img
//                   src={
//                     profile
//                       ? URL.createObjectURL(profile)
//                       : "/upload/" + user.profilePic
//                   }
//                   alt=""
//                 />
//                 <CloudUploadIcon className="icon" />
//               </div>
//             </label>
//             <input
//               type="file"
//               id="profile"
//               style={{ display: "none" }}
//               onChange={(e) => setProfile(e.target.files[0])}
//             />
//           </div>
//           <label>Email</label>
//           <input
//             type="text"
//             value={texts.email}
//             name="email"
//             onChange={handleChange}
//           />
//           <label>Password</label>
//           <input
//             type="text"
//             value={texts.password}
//             name="password"
//             onChange={handleChange}
//           />
//           <label>Name</label>
//           <input
//             type="text"
//             value={texts.name}
//             name="name"
//             onChange={handleChange}
//           />
//           <label>Country / City</label>
//           <input
//             type="text"
//             name="city"
//             value={texts.city}
//             onChange={handleChange}
//           />
//           <label>Website</label>
//           <input
//             type="text"
//             name="website"
//             value={texts.website}
//             onChange={handleChange}
//           />
//           {/*update button that will update any changes  */}
//           <button onClick={handleClick}>Update</button>
//         </form>
//         {/*when you click on this button setOPenupdate will be false */}
//         <button className="close" onClick={() => setOpenUpdate(false)}>
//           close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Update;
