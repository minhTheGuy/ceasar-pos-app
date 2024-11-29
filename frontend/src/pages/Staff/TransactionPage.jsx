import SidebarStaff from "../../components/SidebarStaff";
import NavbarStaff from "../../components/NavbarStaff";
import { FaBarcode } from "react-icons/fa6";
import { Button, Typography } from "@material-tailwind/react";
import { FaArrowRight } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { api } from "../../app/api/api";
import CircleLoader from "../../components/Spinner/CircleLoader";

const TransactionPage = () => {
  const [loading, setLoading] = useState(true);

  const [cookies, , removeCookie] = useCookies(["jwt"]);
  const [staff, setStaff] = useState({ fullname: "", email: "", username: "" });

  const [searchProductResult, setSearchProductResult] = useState([]);
  const [searchByName, setSearchByName] = useState("");
  const [searchByBarcode, setSearchByBarcode] = useState("");
  const [addedProduct, setAddedProduct] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [active, setActive] = useState(1);
  const [maxPage, setMaxPage] = useState(0);

  const navigate = useNavigate();

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
      }
    }
  }, [cookies.jwt]);

  const dataPerPage = 5;
  const lastIndex = active * dataPerPage;
  const firtIndex = lastIndex - dataPerPage;
  const currentProducts = searchProductResult.slice(firtIndex, lastIndex);

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
      let query = "";
      if (searchByName && searchByBarcode) {
        query = `name=${searchByName}&barcode=${searchByBarcode}`;
      } else if (searchByName) {
        query = `name=${searchByName}`;
      } else if (searchByBarcode) {
        query = `barcode=${searchByBarcode}`;
      }

      api
        .get(`/products?${query}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.jwt}`,
          },
        })
        .then((res) => {
          setSearchProductResult(res.data.data);
          setMaxPage(Math.ceil(res.data.results / dataPerPage));
          setActive(1);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Có lỗi xảy ra khi tìm kiếm sản phẩm!", error);
        });
    }
  }, [searchByName, searchByBarcode, cookies.jwt]);

  const handleAddProduct = (product) => {
    product.quantity = 1;
    product.subTotal = product.retail_price;
    setAddedProduct([product, ...addedProduct]);
  };

  const handleRemoveProduct = (index) => {
    setAddedProduct(addedProduct.filter((product, i) => i !== index));
  };

  const handleIncreaseQuantity = (index) => {
    const updatedProduct = [...addedProduct];
    updatedProduct[index].quantity += 1;
    updatedProduct[index].subTotal =
      updatedProduct[index].quantity * updatedProduct[index].retail_price;
    setAddedProduct(updatedProduct);
  };

  const handleDecreaseQuantity = (index) => {
    if (addedProduct[index].quantity === 1) {
      return;
    }
    const updatedProduct = [...addedProduct];
    updatedProduct[index].quantity -= 1;
    updatedProduct[index].subTotal =
      updatedProduct[index].quantity * updatedProduct[index].retail_price;
    setAddedProduct(updatedProduct);
  };

  const handleNext = () => {
    if (addedProduct.length === 0) {
      enqueueSnackbar("Không có sản phẩm nào trong giỏ hàng", {
        variant: "error",
      });
      return;
    }
    navigate("/staff/confirm-transaction", { state: { addedProduct } });
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
        <NavbarStaff heading="Trang xử lý mua hàng" staff={staff} />
        <div className="flex gap-x-5 mt-11">
          <div className="w-1/2 bg-white rounded-lg shadow-md">
            <div className="flex gap-x-3 items-center p-3">
              <form>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <FaBarcode className="text-slate-400"></FaBarcode>
                  </div>
                  <input
                    type="search"
                    className="block w-full px-3 py-2 ps-10 text-sm border border-gray-300 rounded-lg  focus:ring-blue-500 focus:outline-none focus:ring-1 focus:border-blue-500 "
                    placeholder="Mã barcode.."
                    name="search-barcode"
                    value={searchByBarcode}
                    onChange={(e) => setSearchByBarcode(e.target.value)}
                  />
                </div>
              </form>
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
                    className="block w-full px-3 py-2 ps-10 text-sm border border-gray-300 rounded-lg  focus:ring-blue-500 focus:outline-none focus:ring-1 focus:border-blue-500 "
                    placeholder="Tên sản phẩm.."
                    name="search-name"
                    value={searchByName}
                    onChange={(e) => setSearchByName(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <table className="w-full min-w-max table-auto">
              <thead className="">
                <tr>
                  <th className="p-4 bg-gray-100">
                    <Typography variant="h6" color="black">
                      Barcode
                    </Typography>
                  </th>
                  <th className="p-4 bg-gray-100">
                    <Typography variant="h6" color="black">
                      Tên sản phẩm
                    </Typography>
                  </th>
                  <th className="p-4 bg-gray-100">
                    <Typography variant="h6" color="black">
                      Giá bán lẻ
                    </Typography>
                  </th>
                  <th className="p-4 bg-gray-100">
                    <Typography variant="h6" color="black">
                      Thao tác
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product, index) => {
                  return (
                    <tr key={index} className="hover:bg-slate-50">
                      <input type="hidden" value={product._id} />
                      <td className="p-4 text-center">
                        <Typography className="font-semibold text-orange-600">
                          {product.barcode}
                        </Typography>
                      </td>
                      <td className="p-4 text-center">
                        <Typography className="font-semibold text-blue-700">
                          {product.name}
                        </Typography>
                      </td>
                      <td className="p-4 text-center">
                        <Typography className="font-semibold text-green-500">
                          {product.retail_price}$
                        </Typography>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          className="bg-white hover:bg-green-500 hover:text-white text-green-500 font-semibold py-2 px-4 rounded-md border border-green-500 transition-all"
                          onClick={() => handleAddProduct(product)}
                        >
                          Thêm +
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="w-1/2 bg-white rounded-lg shadow-md">
            <div className="p-3">
              <h3 className="text-xl font-semibold my-3 text-center">
                Sản phẩm được mua
              </h3>
              <hr></hr>
            </div>
            <table className="w-full min-w-max table-auto">
              <thead className="">
                <tr>
                  <th className="p-4">
                    <Typography variant="h6" color="black">
                      Tên sản phẩm
                    </Typography>
                  </th>
                  <th className="p-4">
                    <Typography variant="h6" color="black">
                      Số lượng
                    </Typography>
                  </th>
                  <th className="p-4">
                    <Typography variant="h6" color="black">
                      Đơn giá
                    </Typography>
                  </th>
                  <th className="p-4">
                    <Typography variant="h6" color="black">
                      Tổng tiền
                    </Typography>
                  </th>
                  <th className="p-4">
                    <Typography variant="h6" color="black">
                      Thao tác
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {addedProduct.map((product, index) => {
                  return (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="p-4 text-center">
                        <Typography className="font-semibold text-slate-500">
                          {product.name}
                        </Typography>
                      </td>
                      <td className="p-4 text-center">
                        <Typography className="font-semibold text-slate-500">
                          <button
                            className="text-red-500 text-xl font-bold"
                            onClick={() => handleDecreaseQuantity(index)}
                          >
                            -
                          </button>{" "}
                          {product.quantity}{" "}
                          <button
                            className="text-green-500 text-xl font-bold"
                            onClick={() => handleIncreaseQuantity(index)}
                          >
                            +
                          </button>
                        </Typography>
                      </td>
                      <td className="p-4 text-center">
                        <Typography className="font-semibold text-slate-500">
                          {product.retail_price}
                        </Typography>
                      </td>
                      <td className="p-4 text-center">
                        <Typography className="font-semibold text-slate-500">
                          {product.subTotal}
                        </Typography>
                      </td>
                      <td className="p-4 flex justify-center">
                        <button onClick={() => handleRemoveProduct(index)}>
                          <MdOutlineDelete className="text-2xl text-red-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex mt-11 fixed bottom-4 right-7">
          <Button
            variant="outlined"
            className="flex items-center gap-3"
            color="blue"
            onClick={handleNext}
          >
            Tiếp theo
            <FaArrowRight />
          </Button>
        </div>
        <div className="flex items-center gap-8 fixed bottom-4 left-[18%]">
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

export default TransactionPage;
