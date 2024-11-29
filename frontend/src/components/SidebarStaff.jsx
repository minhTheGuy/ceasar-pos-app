import { useState } from "react";
import { FaTachometerAlt } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { PiDevicesFill } from "react-icons/pi";
import { FaChartLine } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import Control from "../assets/control.png";
import YellowLogo from "../assets/logo-yellow-bg.png";
import { Link } from "react-router-dom";
import { GrTransaction } from "react-icons/gr";
import { useCookies } from "react-cookie";
import { api } from "../app/api/api";

const SidebarStaff = () => {
  const [open, setOpen] = useState(true);
  const [, , removeCookie] = useCookies(["jwt"]);

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
    <div
      className={` ${
        open ? "w-60" : "w-20 "
      } bg-dark-purple min-h-screen p-5 pt-8 relative duration-300 `}
    >
      <img
        src={Control}
        className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
             border-2 rounded-full  ${!open && "rotate-180"}`}
        onClick={() => setOpen(!open)}
      />
      <Link to={"/staff/home"}>
        <div className="flex gap-x-4 items-center">
          <img
            src={YellowLogo}
            className={`cursor-pointer duration-500 ${
              open && "rotate-[360deg]"
            }  w-[40px] h-[40px]`}
          />
          <h1
            className={`text-yellow-300 origin-left font-medium text-xl duration-300 ${
              !open && "scale-0"
            }`}
          >
            CaesarPOS
          </h1>
        </div>
      </Link>
      <ul className="pt-12">
        <Link to={"/staff/home"}>
          <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-5">
            <span className="text-2xl text-white">
              <FaTachometerAlt></FaTachometerAlt>
            </span>
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              Dashboard
            </span>
          </li>
        </Link>
        <Link to={"/staff/profile"}>
          <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-5">
            <span className="text-2xl text-white">
              <FaRegCircleUser></FaRegCircleUser>
            </span>
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              Profile
            </span>
          </li>
        </Link>
        <Link to={"/staff/transaction"}>
          <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-12">
            <span className="text-2xl text-white">
              <GrTransaction></GrTransaction>
            </span>
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              Transaction
            </span>
          </li>
        </Link>
        <Link to={"/staff/products"}>
          <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-5">
            <span className="text-2xl text-white">
              <PiDevicesFill></PiDevicesFill>
            </span>
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              Products
            </span>
          </li>
        </Link>
        <Link to={"/staff/customers"}>
          <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-5">
            <span className="text-2xl text-white">
              <FaUsers></FaUsers>
            </span>
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              Customers
            </span>
          </li>
        </Link>
        <Link to={"/staff/analys"}>
          <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-5">
            <span className="text-2xl text-white">
              <FaChartLine></FaChartLine>
            </span>
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              Analys
            </span>
          </li>
        </Link>
        <a onClick={handleLogout}>
          <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-12">
            <span className="text-2xl text-white">
              <FiLogOut></FiLogOut>
            </span>
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              Log Out
            </span>
          </li>
        </a>
      </ul>
    </div>
  );
};

export default SidebarStaff;
