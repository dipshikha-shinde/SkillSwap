import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./landing_page/home/Navbar";
import Footer from "./landing_page/home/Footer";

function App() {
  const location = useLocation();
  const isCallPage = location.pathname.startsWith("/call/");

  return (
    <>
      {!isCallPage && <Navbar />}
      <Outlet />
      {!isCallPage && <Footer />}
    </>
  );
}

export default App;
