import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { FaSearch } from "react-icons/fa";
import AnalystTable from "../../components/AnalysTable";
import { TbDeviceIpadCheck } from "react-icons/tb";
import { TbDevicesDollar } from "react-icons/tb";
import { GrMoney } from "react-icons/gr";
import { format, set } from "date-fns";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { api } from "../../app/api/api";
import { IconButton, Typography } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import CircleLoader from "../../components/Spinner/CircleLoader";

const AnalysPage = () => {
  const [loading, setLoading] = useState(true);

  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const [admin, setAdmin] = useState({});
  const [value, setValue] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalAmountOrders, setTotalAmountOrders] = useState(0);
  const [totalQuantityOrders, setTotalQuantityOrders] = useState(0);

  const [active, setActive] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [totalLength, setTotalLength] = useState(0);

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
    if (totalLength == 0) return;
    setMaxPage(Math.ceil(totalLength / dataPerPage));
  }, [totalLength]);

  useEffect(() => {
    setTotalLength(orders.length);
  }, [orders]);

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
          })
          .catch((err) => {
            console.log(err);
          });
      };

      handleLoadInfo(id);
    }
  }, [cookies.jwt]);

  useEffect(() => {
    if (cookies.jwt) {
      api
        .get("/orders/statistics", {
          params: {
            startDate: value.startDate,
            endDate: value.endDate,
          },
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        })
        .then((res) => {
          if (res.data.orders.length == 0) {
            setLoading(false);
            setOrders([]);
            setTotalOrders(0);
            setTotalAmountOrders(0);
            setTotalQuantityOrders(0);
            setTotalLength(0);
            setMaxPage(1);
            setActive(1);
            return;
          }
          setOrders(res.data.orders);
          setTotalOrders(res.data.totalOrders);
          setTotalAmountOrders(res.data.totalAmountOrders);
          setTotalQuantityOrders(res.data.totalQuantityOrders);
          setTotalLength(res.data.orders.length);
          setMaxPage(Math.ceil(res.data.orders.length / dataPerPage));
          setActive(1);
        })
        .catch((error) => {
          console.error("Có lỗi xảy ra khi lấy dữ liệu thống kê!", error);
        });
    }
  }, [value, cookies.jwt]);

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
      <Sidebar />
      <div className="flex-1 p-7 bg-slate-100">
        {loading && <CircleLoader />}
        <Navbar heading="Trang phân tích và thống kê" staff={admin} />
        <div className="flex mt-7 mb-11 items-center gap-x-10">
          <div className="flex w-1/3 flex-col gap-y-3">
            <div className="flex gap-x-3 items-center">
              <h3 className="font-semibold text-xl text-center">
                Chọn thời điểm
              </h3>
              <button className="bg-white px-3 py-2 hover:bg-blue-500 hover:text-white text-blue-500 font-semibold rounded-lg border border-blue-500 transition-all">
                <FaSearch />
              </button>
            </div>
            <Datepicker
              displayFormat="DD/MM/YYYY"
              primaryColor={"sky"}
              value={value}
              onChange={(newValue) => setValue(newValue)}
              inputClassName="w-full border border-slate-400 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-0 font-normal placeholder:text-slate-500 text-dark px-3 py-2"
            />
          </div>
          <div className="w-2/3">
            <div className="flex gap-x-7 justify-end">
              <div className="rounded-md p-5 bg-gradient-to-r from-yellow-200 to-yellow-300 flex shadow-lg shadow-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-gray-400 cursor-pointer w-1/3">
                <div className="w-2/3">
                  <h4 className="text-[#33343D] mb-1 font-semibold">
                    Tổng đơn hàng
                  </h4>
                  <h1 className="text-dark-purple text-3xl font-bold">
                    {totalOrders}
                  </h1>
                </div>
                <TbDeviceIpadCheck className="text-6xl text-dark-purple ml-5 text-right w-1/3" />
              </div>
              <div className="rounded-md p-5 bg-gradient-to-r from-green-300 to-emerald-400 flex shadow-lg shadow-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-gray-400 cursor-pointer w-1/3">
                <div className="w-2/3">
                  <h4 className="text-[#33343D] mb-1 font-semibold">
                    Tổng doanh thu
                  </h4>
                  <h1 className="text-dark-purple text-2xl font-bold">
                    {totalAmountOrders}
                  </h1>
                </div>
                <GrMoney className="text-6xl text-dark-purple ml-5 text-right w-1/3" />
              </div>
              <div className="rounded-md p-5 bg-gradient-to-r from-pink-200 to-pink-300 flex shadow-lg shadow-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-gray-400 cursor-pointer w-1/3">
                <div className="w-2/3">
                  <h4 className="text-[#33343D] mb-1 font-semibold">
                    Sản phẩm bán ra
                  </h4>
                  <h1 className="text-dark-purple text-2xl font-bold">
                    {totalQuantityOrders}
                  </h1>
                </div>
                <TbDevicesDollar className="text-6xl text-dark-purple ml-5 text-right w-1/3" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-white rounded-xl border border-slate-200">
          <h3 className="text-center text-2xl font-semibold my-5">
            Danh sách hóa đơn
          </h3>
          <AnalystTable orders={currentOrders} />
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

export default AnalysPage;
