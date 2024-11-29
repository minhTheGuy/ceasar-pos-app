import SidebarStaff from "../../components/SidebarStaff";
import NavbarStaff from "../../components/NavbarStaff";
import DashboardBoxStaff from "../../components/DashboardBoxStaff";
import ChartStaff from "../../components/ChartStaff";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import { jwtDecode } from "jwt-decode";
import { api } from "../../app/api/api";
import CircleLoader from "../../components/Spinner/CircleLoader";

const HomeStaff = () => {
  const [loading, setLoading] = useState(true);

  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const [staff, setStaff] = useState({});

  const [totalProductByMonth, setTotalProductByMonth] = useState([]);
  const [months, setMonths] = useState([]);
  const [overallStatistics, setOverallStatistics] = useState({
    totalCustomers: 0,
    totalStaff: 0,
    totalOrders: 0,
    totalAmount: 0,
    totalProductsSold: 0,
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const [openCPModal, setOpenCPModal] = useState(false);

  useEffect(() => {
    if (cookies.jwt) {
      if (jwtDecode(cookies.jwt).never_login) {
        handleOpenCPModal();
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

        Promise.all([
          api.get("/orders/total-product-last-12-months", {
            headers: {
              Authorization: `Bearer ${cookies.jwt}`,
            },
          }),
          api.get("/orders/overall-statistics", {
            headers: {
              Authorization: `Bearer ${cookies.jwt}`,
            },
          }),
        ])
          .then(([totalProductRes, overallStatisticsRes]) => {
            setTotalProductByMonth(totalProductRes.data.totalProductByMonth);
            setMonths(totalProductRes.data.months);
            setOverallStatistics(overallStatisticsRes.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Có lỗi xảy ra khi lấy dữ liệu thống kê!", error);
          });
      }
    }
  }, [cookies.jwt]);

  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleOpenCPModal = () => setOpenCPModal((cur) => !cur);
  const handleChangePassword = () => {
    const token = cookies.jwt;
    const id = jwtDecode(token).id;

    api
      .patch(
        `/auth/updatePassword/${id}`,
        {
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        enqueueSnackbar("Đổi mật khẩu thành công", { variant: "success" });
        const { token } = res.data;
        setCookie("jwt", token, { path: "/" });
        handleOpenCPModal();
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Đổi mật khẩu thất bại", { variant: "error" });
      });
  };

  if (localStorage.getItem("token")) {
    if (!cookies.jwt) {
      setCookie("jwt", localStorage.getItem("token"));
    }
  }

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
        <NavbarStaff heading="Hi, Welcome back 👋" staff={staff} />
        <DashboardBoxStaff
          customers={overallStatistics.totalCustomers}
          bills={overallStatistics.totalOrders}
          income={overallStatistics.totalAmount}
          products={overallStatistics.totalProductsSold}
        />
        <div className="mt-6">
          <div className="flex items-center gap-x-3 justify-end text-slate-500 cursor-pointer mb-3">
            <Link to={"/staff/analys"}>
              {" "}
              <p className="text-sm font-semibold">Đi tới trang thống kê</p>
            </Link>
            <Link to={"/staff/analys"}>
              <FaArrowRightLong />
            </Link>
          </div>

          <ChartStaff
            totalProductByMonth={totalProductByMonth}
            months={months}
          />
        </div>
        <Dialog
          size="sm"
          open={openCPModal}
          className="bg-transparent shadow-none"
        >
          <Card className="mx-auto w-full max-w-[28rem]">
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" color="blue-gray">
                Đổi mật khẩu mới
              </Typography>
              <Typography
                className="font-normal text-slate-400"
                variant="paragraph"
              >
                Mật khẩu cần ít nhất 6 kí tự.
              </Typography>
              <Typography className="" variant="h6">
                Mật khẩu mới
              </Typography>
              <input
                type="password"
                className="border border-slate-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
                name="newPassword"
                onChange={handleNewPasswordChange}
              ></input>
              <Typography className="" variant="h6">
                Nhập lại mật khẩu mới
              </Typography>
              <input
                type="password"
                className="border border-slate-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
                name="confirmPassword"
                onChange={handleConfirmPasswordChange}
              ></input>
            </CardBody>
            <CardFooter className="pt-0">
              <Button
                variant="gradient"
                onClick={handleChangePassword}
                fullWidth
              >
                Đổi mật khẩu
              </Button>
            </CardFooter>
          </Card>
        </Dialog>
      </div>
    </div>
  );
};

export default HomeStaff;
