import { Toaster } from "react-hot-toast";

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./landing_page/home/HomePage.jsx";
import ExploreSkills from "./landing_page/ExploreSkills/ExploreSkills.jsx";
import Login from "./landing_page/Login/Login.jsx";
import SignUp from "./landing_page/SignUp/SignUp.jsx";
import Dashboard from "./dashboard/Dashboard.jsx";
import EditProfile from "./dashboard/EditProfile.jsx";
import Requests from "./dashboard/Requests.jsx";
import Chats from "./dashboard/Chats.jsx";
import Sessions from "./dashboard/Sessions.jsx";
import PublicProfile from "./pages/Publicprofile.jsx";
import ProtectedRoute from "./components/ProtectRoute.jsx";
import PublicOnlyRoute from "./components/publicOnlyRoute.jsx";
import ForgotPassword from "./landing_page/Login/ForgotPassword.jsx";
import Community from "./dashboard/Community.jsx";
import Notifications from "./dashboard/Notifications.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "exploreSkills", element: <ExploreSkills /> },
      {
        path: "login",
        element: (
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicOnlyRoute>
            <SignUp />
          </PublicOnlyRoute>
        ),
      },
      { path: "profile/:id", element: <Publicprofile /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "community",
        element: (
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-profile",
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "requests",
        element: (
          <ProtectedRoute>
            <Requests />
          </ProtectedRoute>
        ),
      },
      {
        path: "chats",
        element: (
          <ProtectedRoute>
            <Chats />
          </ProtectedRoute>
        ),
      },
      {
        path: "sessions",
        element: (
          <ProtectedRoute>
            <Sessions />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
    <Toaster position="top-right" reverseOrder={false} />
  </>
);
