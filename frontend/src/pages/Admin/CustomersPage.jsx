import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Button, Typography, IconButton } from "@material-tailwind/react";
import { IoFilter } from "react-icons/io5";
import CustomerTable from "../../components/CustomerTable";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { api } from "../../app/api/api";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import CircleLoader from "../../components/Spinner/CircleLoader";

const CustomersPage = () => {
  const [loading, setLoading] = useState(true);

  const [customers, setCustomers] = useState([]);

  const [cookies, , removeCookie] = useCookies(["jwt"]);
  const [admin, setAdmin] = useState({ fullname: "", email: "", username: "" });

  const [searchName, setSearchName] = useState("");
  const [active, setActive] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [totalLength, setTotalLength] = useState(0);

  const dataPerPage = 5;
  const lastIndex = active * dataPerPage;
  const firtIndex = lastIndex - dataPerPage;
  const currentCustomers = customers.slice(firtIndex, lastIndex);

  const next = () => {
    if (active === maxPage) return;
    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;
    setActive(active - 1);
  };

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
  };

  useEffect(() => {
    setMaxPage(Math.ceil(totalLength / dataPerPage));
  }, [totalLength]);

  useEffect(() => {
    setTotalLength(customers.length);
  }, [customers]);

  useEffect(() => {
    if (cookies.jwt) {
      api
        .get(`/customers?fullname=${searchName}`, {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        })
        .then((res) => {
          setCustomers(res.data.data);
          setActive(1);
        });
    }
  }, [searchName, cookies.jwt]);

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

      api
        .get("/customers", {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        })
        .then((res) => {
          setCustomers(res.data.data);
          setTotalLength(res.data.data.length);
          setMaxPage(Math.ceil(res.data.data.length / dataPerPage));
          setLoading(false);
        });
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
      <Sidebar />
      <div className="flex-1 p-7 bg-slate-100">
        {loading && <CircleLoader />}
        <Navbar heading="Quản lý khách hàng" staff={admin} />
        <h1 className="text-2xl font-semibold mt-11">Danh sách</h1>
        <div className="w-full bg-white rounded-xl mt-7 border border-slate-200">
          <div className="flex justify-between items-center p-5">
            <form>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-slate-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  className="block w-full p-3 ps-10 text-sm border border-gray-300 rounded-lg  focus:ring-blue-500 focus:outline-none focus:ring-1 focus:border-blue-500 "
                  placeholder="Tìm khách hàng.."
                  required
                  value={searchName}
                  onChange={handleSearchNameChange}
                />
              </div>
            </form>
            <div>
              <Button variant="text" size="sm">
                <IoFilter className="text-lg"></IoFilter>
              </Button>
            </div>
          </div>
          <CustomerTable customers={currentCustomers} />
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

export default CustomersPage;
