import {
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
} from "@material-tailwind/react";
import { FaRegUserCircle, FaFingerprint, FaSignOutAlt } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { api } from "../app/api/api";

const Navbar = ({ staff, heading }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);

  const handleLogout = () => {
    api
      .post("/auth/logout", {})
      .then((res) => {
        localStorage.removeItem("token");
        removeCookie("jwt");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold ">{heading}</h1>
      <div className="flex items-center gap-4">
        <Typography variant="h6">{staff.account?.username}</Typography>
        <Menu placement="bottom-end">
          <MenuHandler>
            <Avatar
              variant="circular"
              alt="avatar"
              withBorder={true}
              color="blue"
              className="cursor-pointer"
              src={
                staff.avatar
                  ? "https://caesarpos-api.vercel.app/uploads/avatars/" +
                    staff.avatar
                  : ""
              }
            />
          </MenuHandler>
          <MenuList>
            <MenuItem className="cursor-default">
              <Typography variant="h6">{staff.fullname}</Typography>
              <Typography
                variant="small"
                color="gray"
                className="text-slate-500 font-normal"
              >
                {staff.email}
              </Typography>
            </MenuItem>
            <hr className="my-2 border-blue-gray-50" />
            <MenuItem className="flex items-center gap-3 mb-2 hover:bg-gray-200">
              <FaRegUserCircle className="text-xl" />
              <Link to={"/admin/profile"}>
                <Typography variant="small" className="font-medium">
                  Thông tin tài khoản
                </Typography>
              </Link>
            </MenuItem>
            <MenuItem className="flex items-center gap-3 mb-2 hover:bg-gray-200">
              <FaFingerprint className="text-xl" />
              <Link to={"/admin/change-password"}>
                <Typography variant="small" className="font-medium">
                  Đổi mật khẩu
                </Typography>
              </Link>
            </MenuItem>
            <MenuItem className="flex items-center gap-3 mb-2 hover:bg-gray-200">
              <MdSettings className="text-xl" />
              <Typography variant="small" className="font-medium">
                Cài đặt
              </Typography>
            </MenuItem>
            <hr className="my-2 border-blue-gray-50" />
            <a onClick={handleLogout} className="hover:outline-none">
              <MenuItem className="flex items-center gap-3 hover:bg-gray-200">
                <FaSignOutAlt className="text-xl text-red-600" />
                <Typography
                  variant="small"
                  className="font-medium text-red-600"
                >
                  Đăng xuất
                </Typography>
              </MenuItem>
            </a>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
