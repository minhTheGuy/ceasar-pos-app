import SidebarStaff from "../../components/SidebarStaff";
import NavbarStaff from "../../components/NavbarStaff";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { api } from "../../app/api/api";
import CircleLoader from "../../components/Spinner/CircleLoader";

const ChangePasswordStaff = () => {
  const [loading, setLoading] = useState(true);

  const [cookies, , removeCookie] = useCookies(["jwt"]);
  const [staff, setStaff] = useState({ fullname: "", email: "", username: "" });

  useEffect(() => {
    if (cookies.jwt) {
      if (jwtDecode(cookies.jwt).never_login) {
        // handleOpenCPModal();
      } else {
        const id = jwtDecode(cookies.jwt).id;
        api
          .get(`/staffs/${id}`, {
            headers: {
              Authorization: `Bearer ${cookies.jwt}`,
            },
          })
          .then((res) => {
            const { data } = res.data;
            setStaff(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Có lỗi xảy ra khi lấy thông tin nhân viên!", error);
          });
      }
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
      <SidebarStaff />
      <div className="flex-1 p-7 bg-slate-100">
        {loading && <CircleLoader />}
        <NavbarStaff heading="Tài khoản" staff={staff} />
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordStaff;
