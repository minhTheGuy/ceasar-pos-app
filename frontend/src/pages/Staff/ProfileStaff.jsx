import SidebarStaff from "../../components/SidebarStaff";
import NavbarStaff from "../../components/NavbarStaff";
import ProfileForm from "../../components/ProfileForm";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import { api } from "../../app/api/api";
import CircleLoader from "../../components/Spinner/CircleLoader";

const ProfileStaff = () => {
  const [loading, setLoading] = useState(true);

  const [cookies, , removeCookie] = useCookies(["jwt"]);
  const [staff, setStaff] = useState({});

  useEffect(() => {
    if (cookies.jwt) {
      const id = jwtDecode(cookies.jwt).id;
      api
        .get(`/staffs/${id}`, {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        })
        .then((res) => {
          setStaff(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [cookies.jwt]);

  if (!cookies.jwt) {
    console.log("You are not authenticated");
    return <Navigate to="/" />;
  } else if (cookies.jwt) {
    if (jwtDecode(cookies.jwt).role !== "staff") {
      console.log("You are not authorized to access this resource");
      removeCookie("jwt");
      return <Navigate to="/" />;
    }
  }

  return (
    <div className="flex">
      <SidebarStaff></SidebarStaff>
      <div className="flex-1 p-7 bg-slate-100">
        {loading && <CircleLoader></CircleLoader>}
        <NavbarStaff heading="Thông tin cá nhân" staff={staff}></NavbarStaff>
        <ProfileForm
          avatar="./src/assets/user-avatar.png"
          userInfo={staff}
        ></ProfileForm>
      </div>
    </div>
  );
};

export default ProfileStaff;
