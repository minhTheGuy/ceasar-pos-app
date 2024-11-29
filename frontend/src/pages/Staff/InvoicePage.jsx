import SidebarStaff from "../../components/SidebarStaff";
import NavbarStaff from "../../components/NavbarStaff";
import Logo from "../../assets/logo-vector.png";
import { Typography } from "@material-tailwind/react";
import { Navigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { IoIosPrint } from "react-icons/io";
import { GrTransaction } from "react-icons/gr";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "../../app/api/api";

const InvoicePage = () => {
  const [cookies, , removeCookie] = useCookies(["jwt"]);
  const [staff, setStaff] = useState({ fullname: "", email: "", username: "" });

  const location = useLocation();

  const {
    staffFullname,
    addedProduct,
    totalAmount,
    receivedAmount,
    change,
    phone,
    customerInfo,
  } = location.state || {};

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
          const { data } = res.data;
          setStaff(data);
        })
        .catch((error) => {
          console.error("Có lỗi xảy ra khi lấy thông tin nhân viên!", error);
        });
    }
  }, [cookies.jwt]);

  const Print = () => {
    let printContents = document.getElementById("printablediv").innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
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
        <NavbarStaff heading="Xuất hóa đơn" staff={staff} />
        <div
          className="mx-auto bg-white rounded-lg w-1/2 p-5 mt-11 border-slate-200 border shadow-md"
          id="printablediv"
        >
          <div className="flex items-center justify-center gap-x-5">
            <div>
              <img src={Logo} alt="logo" className="w-[80px] h-[80px]" />
            </div>
            <h1 className="text-2xl font-bold text-dark-purple">
              Caesar POS Website
            </h1>
          </div>
          <div className="flex justify-between mt-11">
            <div className="flex gap-x-3">
              <p className="font-semibold">Nhân viên:</p>
              <Typography className="font-normal">{staffFullname}</Typography>
            </div>
            <div className="flex gap-x-3">
              <p className="font-semibold">Ngày:</p>
              <Typography className="font-normal">
                {format(new Date(), "dd-MM-yy")}
              </Typography>
            </div>
          </div>
          <hr className="mb-5 mt-3 border-slate-300"></hr>
          <h1 className="text-2xl font-semibold mb-5 text-dark-purple">
            Thông tin khách hàng
          </h1>
          <div className="flex justify-between my-3">
            <h3 className="font-semibold">Họ và tên</h3>
            <Typography className="font-normal">
              {customerInfo.fullname}
            </Typography>
          </div>
          <div className="flex justify-between my-3">
            <h3 className="font-semibold">Số điện thoại</h3>
            <Typography className="font-normal">{phone}</Typography>
          </div>
          <div className="flex justify-between my-3">
            <h3 className="font-semibold">Địa chỉ</h3>
            <Typography className="font-normal">
              {customerInfo.address}
            </Typography>
          </div>
          <hr className="mb-5 mt-3 border-slate-300"></hr>
          <h1 className="text-2xl font-semibold mb-5 text-dark-purple">
            Danh sách sản phẩm
          </h1>
          <table className="w-full min-w-max table-auto">
            <thead>
              <tr>
                <th k className="p-4">
                  <Typography variant="h6" color="black">
                    Tên sản phẩm
                  </Typography>
                </th>
                <th k className="p-4">
                  <Typography variant="h6" color="black">
                    Số lượng
                  </Typography>
                </th>
                <th k className="p-4">
                  <Typography variant="h6" color="black">
                    Đơn giá
                  </Typography>
                </th>
                <th k className="p-4">
                  <Typography variant="h6" color="black">
                    Tổng tiền
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {addedProduct.map((product, index) => {
                return (
                  <tr key={index}>
                    <td className="p-4 text-center">
                      <Typography className="font-semibold text-slate-500">
                        {product.name}
                      </Typography>
                    </td>
                    <td className="p-4 text-center">
                      <Typography className="font-semibold text-slate-500">
                        {product.quantity}
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
                  </tr>
                );
              })}
            </tbody>
          </table>
          <hr className="mb-5 mt-3 border-slate-300"></hr>
          <div className="mr-11">
            <div className="flex">
              <h3 className="text-end w-5/6 font-semibold">
                Tổng tiền hóa đơn:
              </h3>
              <Typography className="font-normal w-1/6 text-end">
                {totalAmount}
              </Typography>
            </div>
            <div className="flex">
              <h3 className="text-end w-5/6 font-semibold">Tiền nhận được:</h3>
              <Typography className="font-normal w-1/6 text-end">
                {receivedAmount}
              </Typography>
            </div>
            <div className="flex">
              <h3 className="text-end w-5/6 font-semibold">Tiền thừa:</h3>
              <Typography className="font-normal w-1/6 text-end">
                {change}
              </Typography>
            </div>
          </div>
          <hr className="mb-5 mt-3 border-slate-300"></hr>
          <h3 className="text-center text-slate-500 font-medium">
            Trân trọng cảm ơn quý khách đã mua hàng tại Ceasar POS Website
          </h3>
        </div>
        <div className="flex justify-center gap-x-3 mt-5">
          <Link to={"/staff/transaction"}>
            <button className="rounded-md bg-blue-600 py-3 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:bg-blue-700 mt-2">
              <div className="flex gap-x-3 items-center">
                {" "}
                <GrTransaction className="text-lg"></GrTransaction> Giao dịch
                mới
              </div>
            </button>
          </Link>
          <button
            className="rounded-md bg-green-600 py-3 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:bg-green-700 mt-2"
            onClick={Print}
          >
            <div className="flex gap-x-3 items-center">
              {" "}
              <IoIosPrint className="text-lg"></IoIosPrint> In hóa đơn
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
