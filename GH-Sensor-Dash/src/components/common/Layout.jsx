import React from "react";
import TopNavbar from "./TopNavbar";
import Background from "../../assets/images/bg-img-blue.jpg";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10">
        <TopNavbar />
      </div>

      <div
        className="flex-1 p-4 min-h-screen"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${Background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
