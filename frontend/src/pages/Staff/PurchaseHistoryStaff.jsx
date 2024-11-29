import SidebarStaff from "../../components/SidebarStaff";
import NavbarStaff from "../../components/NavbarStaff";
import PurchaseHistoryTable from "../../components/PurchaseHistoryTable";
import {
  useParams,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { api } from "../../app/api/api";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { IconButton, Typography } from "@material-tailwind/react";
import CircleLoader from "../../components/Spinner/CircleLoader";
import { IoCaretBackCircleOutline } from "react-icons/io5";

const PurchaseHistoryStaff = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [cookies, , removeCookie] = useCookies(["jwt"]);
  const [staff, setStaff] = useState({ fullname: "", email: "", username: "" });

  const [orders, setOrders] = useState([]);
  const { customerId } = useParams();
  const location = useLocation();
  const { name, phone, address } = location.state || {};

  const [active, setActive] = useState(1);
  const [maxPage, setMaxPage] = useState(0);

  const dataPerPage = 4;
  const lastIndex = active * dataPerPage;
  const firtIndex = lastIndex - dataPerPage;
  const currentOrders = orders.slice(firtIndex, lastIndex);

  const next = () => {
    if (active === maxPage) return;
    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;
    setActive(active - 1);
  };

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
          })
          .catch((error) => {
            console.error("Có lỗi xảy ra khi lấy thông tin nhân viên!", error);
          });

        api
          .get(`/customers/${customerId}/orders`, {
            headers: {
              Authorization: `Bearer ${cookies.jwt}`,
            },
          })
          .then((res) => {
            setOrders(res.data.data);
            setMaxPage(Math.ceil(res.data.data.length / dataPerPage));
            setLoading(false);
          })
          .catch((error) => {
            console.error("Có lỗi xảy ra khi lấy dữ liệu đơn hàng!", error);
          });
      }
    }
  }, [customerId, cookies.jwt]);

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
        <NavbarStaff heading="Đơn hàng đã mua" staff={staff}></NavbarStaff>
        <div className="my-7 text-slate-700">
          <div className="flex gap-x-3 items-center mb-3">
            <span className="font-semibold text-black">Họ và tên:</span>
            <span className="font-semibold">{name}</span>
          </div>
          <div className="flex gap-x-3 items-center mb-3">
            <span className="font-semibold text-black">Số điện thoại:</span>
            <span className="font-semibold">{phone}</span>
          </div>
          <div className="flex gap-x-3 items-center">
            <span className="font-semibold text-black">Địa chỉ:</span>
            <span className="font-semibold">{address}</span>
          </div>
        </div>
        <div className="w-full bg-white rounded-xl mt-7 border border-slate-200">
          <div className="flex items-center justify-center gap-x-3">
            <IoCaretBackCircleOutline
              className="text-4xl cursor-pointer text-blue-600"
              onClick={() => navigate("/staff/customers")}
            />
            <h3 className="text-2xl font-semibold my-6">Lịch sử mua hàng</h3>
          </div>
          <PurchaseHistoryTable orders={currentOrders}></PurchaseHistoryTable>
        </div>
        <div className="flex items-center gap-8 fixed bottom-4 left-[50%]">
          <IconButton
            size="sm"
            onClick={prev}
            disabled={active === 1}
            className="bg-blue-600"
          >
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
          </IconButton>
          <Typography color="gray" className="font-normal">
            Page <strong className="text-gray-900">{active}</strong> of{" "}
            <strong className="text-gray-900">{maxPage}</strong>
          </Typography>
          <IconButton
            size="sm"
            className="bg-blue-600"
            onClick={next}
            disabled={active === maxPage}
          >
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistoryStaff;
