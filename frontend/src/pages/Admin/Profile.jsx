import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import ProfileForm from "../../components/ProfileForm";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { api } from "../../app/api/api";
import CircleLoader from "../../components/Spinner/CircleLoader";

const Profile = () => {
  const [loading, setLoading] = useState(true);

  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const [admin, setAdmin] = useState({});

  useEffect(() => {
    if (cookies.jwt) {
      const id = jwtDecode(cookies.jwt).id;

      const handleLoadInfo = (id) => {
        api
          .get(`/staffs/${id}`, {
            headers: {
              Authorization: `Bearer ${cookies.jwt}`,
            },
          })
          .then((res) => {
            const { data } = res.data;
            setAdmin(data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      };

      handleLoadInfo(id);
    }
  }, [cookies.jwt]);

  if (!cookies.jwt) {
    console.log("You are not authenticated");
    return <Navigate to="/" />;
  } else if (cookies.jwt) {
    if (jwtDecode(cookies.jwt).role !== "admin") {
      console.log("You are not authorized to access this resource");
      removeCookie("jwt");
      return <Navigate to="/" />;
    }
  }

  return (
    <div className="flex">
      <Sidebar></Sidebar>
      <div className="flex-1 p-7 bg-slate-100">
        {loading && <CircleLoader />}
        <Navbar heading="Thông tin cá nhân" staff={admin}></Navbar>
        <ProfileForm userInfo={admin}></ProfileForm>
      </div>
    </div>
  );
};

export default Profile;
