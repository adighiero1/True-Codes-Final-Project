import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "./style.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const { currentUser } = useContext(AuthContext); //using current user context that will specify who is logged

  const { darkMode } = useContext(DarkModeContext); //using usecontext react hook. specifiying that we will use the darkmode context

  const queryClient = new QueryClient(); //creating query client. from tanstack query and passing it in return statement

  const Layout = () => {
    // function that controls the layout of the application. using outlet which separates common components that will always be displayed from the outlet componenets such as homepage and profile
    return (
      //wrapping our app with query client provider so we can use it
      <QueryClientProvider client={queryClient}>
        {/*how you pass it */}
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          {/*theme class applies the darkmode lightmode from style.scss ? checks which mode it is on. above it writes dark or light depending on which value it currently holds*/}
          <Navbar />
          <div style={{ display: "flex" }}>
            {/* using display flex to set the left right and cener components correctly, excluding navbar */}
            <LeftBar />
            <div style={{ flex: 6 }}>
              {/*flex 6 makes it the biggest*/}
              <Outlet />
            </div>
            <RightBar />
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  const ProtectedRoute = ({ children }) => {
    //function to redirect if you are not logged in. taking child componenents here. you can pass here any page or any layout. it is our protected layout, our homepage and profile page
    if (!currentUser) {
      return <Navigate to="/login" />; //using react router dom to navigate back if not logged in
    }

    return children; //if you are logged(if there is current user) in just return the children components.
  };

  const router = createBrowserRouter([
    // creaating routes using Browser router
    //the children paths are the outlets we are using.
    //in this app the children outlets are home and profile
    {
      path: "/",
      element: (
        <ProtectedRoute>
          {/*wrapping our layout with ProtectedRoute function from the top to protect the page from being viewed if not logged in. anything wrapped inside ProtectedRoute will be checked by that function */}
          <Layout />
          {/*incorporatgint the layout function we wrote at the top  */}
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  //router provider provides all the routes. we are passing the router created at the top that contains all our routes
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
