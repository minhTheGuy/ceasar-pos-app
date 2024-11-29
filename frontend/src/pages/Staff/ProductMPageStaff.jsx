import SidebarStaff from "../../components/SidebarStaff";
import NavbarStaff from "../../components/NavbarStaff";
import { Button } from "@material-tailwind/react";
import { IoFilter } from "react-icons/io5";
import ProductTableStaff from "../../components/ProductTableStaff";
import { useState, useEffect } from "react";
import { FaBarcode } from "react-icons/fa6";
import { IconButton, Typography } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import { api } from "../../app/api/api";
import CircleLoader from "../../components/Spinner/CircleLoader";

const ProductMPageStaff = () => {
  const [loading, setLoading] = useState(true);

  const [cookies, , removeCookie] = useCookies(["jwt"]);
  const [staff, setStaff] = useState({ fullname: "", email: "", username: "" });

  const [products, setProducts] = useState([]);
  const [active, setActive] = useState(1);
  const [maxPage, setMaxPage] = useState(0);

  const [searchName, setSearchName] = useState("");
  const [searchBarcode, setSearchBarcode] = useState("");

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
          .get("/products", {
            headers: {
              Authorization: `Bearer ${cookies.jwt}`,
            },
          })
          .then((res) => {
            setProducts(res.data.data);
            setMaxPage(Math.ceil(res.data.results / dataPerPage));
            setLoading(false);
          });
      }
    }
  }, [cookies.jwt]);

  useEffect(() => {
    if (cookies.jwt) {
      api
        .get(`/products?name=${searchName}&barcode=${searchBarcode}`, {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        })
        .then((res) => {
          setProducts(res.data.data);
          setMaxPage(Math.ceil(res.data.results / dataPerPage));
          setActive(1);
        });
    }
  }, [searchName, searchBarcode, cookies.jwt]);

  const dataPerPage = 5;
  const lastIndex = active * dataPerPage;
  const firtIndex = lastIndex - dataPerPage;
  const currentProducts = products.slice(firtIndex, lastIndex);

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

  const handleSearchBarcodeChange = (e) => {
    setSearchBarcode(e.target.value);
  };

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
        <NavbarStaff heading="Quản lý sản phẩm" staff={staff} />
        <div className="mt-11">
          <h1 className="text-2xl font-semibold">Danh sách</h1>
        </div>
        <div className="w-full bg-white rounded-xl mt-7 border border-slate-200">
          <div className="flex justify-between items-center p-5">
            <div className="flex gap-x-3">
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
                    className="block w-full p-3 ps-10 text-sm border border-gray-300 rounded-lg  focus:ring-blue-500 focus:outline-none focus:ring-1 focus:border-blue-500"
                    placeholder="Tìm sản phẩm.."
                    value={searchName}
                    onChange={handleSearchNameChange}
                  />
                </div>
              </form>
              <form>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <FaBarcode className="text-slate-400"></FaBarcode>
                  </div>
                  <input
                    type="search"
                    className="block w-full p-3 ps-10 text-sm border border-gray-300 rounded-lg  focus:ring-blue-500 focus:outline-none focus:ring-1 focus:border-blue-500"
                    placeholder="Mã barcode.."
                    value={searchBarcode}
                    onChange={handleSearchBarcodeChange}
                  />
                </div>
              </form>
            </div>
            <div>
              <Button variant="text" size="sm">
                <IoFilter className="text-lg"></IoFilter>
              </Button>
            </div>
          </div>
          <ProductTableStaff products={currentProducts} />
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
            disabled={active === 10}
          >
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ProductMPageStaff;
