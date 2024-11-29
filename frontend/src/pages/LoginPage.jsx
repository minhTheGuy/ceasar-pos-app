import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useLoginMutation } from "../features/auth/authApiSlice";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import ThreeDotsLoader from "../components/Spinner/ThreeDotsLoader";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";

const LoginPage = () => {
  const [cookies, ,] = useCookies(["jwt"]);
  const [searchParams] = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [openLoginViaEmailModal, setOpenLoginViaEmailModal] = useState(false);
  const [openLockedAccountModal, setOpenLockedAccountModal] = useState(false);
  const [openTokenExpiredModal, setOpenTokenExpiredModal] = useState(false);

  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { enqueueSnackbar } = useSnackbar();

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);

  const handleOpenLoginViaEmailModal = () => {
    setOpenLoginViaEmailModal((cur) => !cur);
  };

  const handleOpenLockedAccountModal = () => {
    setOpenLockedAccountModal((cur) => !cur);
  };

  const handleOpenTokenExpiredModal = () => {
    setOpenTokenExpiredModal((cur) => !cur);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loginToken = searchParams.get("token")
      ? searchParams.get("token")
      : "null";
    try {
      const { token } = await login({
        loginToken,
        username,
        password,
      }).unwrap();
      setUsername("");
      setPassword("");

      localStorage.setItem("token", token);

      const role = jwtDecode(token).role;

      if (role === "admin") {
        navigate(`/admin/home`);
      } else if (role === "staff") {
        navigate(`/staff/home`);
      }
    } catch (error) {
      if (error.data.message === "Incorrect username or password") {
        enqueueSnackbar("Tên đăng nhập hoặc mật khẩu không đúng", {
          variant: "error",
        });
      } else if (error.data.message === "Login token is wrong") {
        handleOpenLoginViaEmailModal();
      } else if (error.data.message === "Account is locked") {
        handleOpenLockedAccountModal();
      } else if (error.data.message === "Request failed with status code 401") {
        enqueueSnackbar("Tên đăng nhập hoặc mật khẩu không đúng", {
          variant: "error",
        });
      } else if (error.data.message === "Login token is expired") {
        handleOpenTokenExpiredModal();
      } else {
        enqueueSnackbar("Đăng nhập thất bại", { variant: "error" });
      }
    }
  };

  if (cookies.jwt) {
    const role = jwtDecode(cookies.jwt).role;

    if (role === "admin") return <Navigate to={`/admin/home`} />;
    if (role === "staff") return <Navigate to={`/staff/home`} />;
  }

  if (isLoading) return <ThreeDotsLoader />;

  return (
    <div
      className="min-w-screen min-h-screen p-12 bg-center bg-cover"
      style={{ backgroundImage: `url('./src/assets/login-bg.jpg')` }}
    >
      <div className="sm:w-[490px] sm:h-[590px] mx-auto rounded-lg p-7 bg-white shadow-2xl shadow-yellow-800">
        <div className="flex flex-row items-center justify-center sm:mb-10 gap-x-5">
          <div>
            <img
              src="./src/assets/logo-vector.png"
              alt="logo"
              className="w-[80px] h-[80px] mx-auto"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#004AAD]">
              Caesar POS System
            </h1>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-10">
          Trang đăng nhập
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-10 relative">
            <input
              className="py-3 px-4 w-full rounded-lg bg-[#E2E2E2] focus:border-[#004AAD] focus:outline-none border-2"
              type="text"
              name="username"
              value={username}
              onChange={handleUserInput}
              placeholder="Tên đăng nhập"
              autoComplete="off"
              required
            />
            <FaUser className="absolute top-1/2 right-3 w-[30px] h-[30px] text-[#A6A6A6] -translate-y-1/2" />
          </div>
          <div className="mb-10 relative">
            <input
              className="py-3 px-4 w-full rounded-lg bg-[#E2E2E2] focus:border-[#004AAD] focus:outline-none border-2"
              type="password"
              name="password"
              onChange={handlePwdInput}
              value={password}
              placeholder="Mật khẩu"
              required
            />
            <FaLock className="absolute top-1/2 right-3 w-[30px] h-[30px] text-[#A6A6A6] -translate-y-1/2" />
          </div>
          <button className="w-full bg-[#004AAD] text-[#FFD166] font-bold p-3 rounded-full hover:bg-[#FFD166] hover:text-[#004AAD] transition-colors">
            Đăng nhập
          </button>
          <div className="text-center mt-3">
            <a href="/" className="font-bold text-[#004AAD]">
              Quên mật khẩu?
            </a>
          </div>
          <span className="text-xs text-[#A6A6A6] mt-16 block">
            Copyright &#169; 2024 | Powered by We Bare Bears Team{" "}
          </span>
        </form>
      </div>
      <Dialog
        open={openLoginViaEmailModal}
        handler={handleOpenLoginViaEmailModal}
        size="sm"
      >
        <DialogHeader>Xác thực tài khoản</DialogHeader>
        <DialogBody>
          <Typography
            className="font-normal text-slate-500"
            variant="paragraph"
          >
            Vui lòng đăng nhập thông qua liên kết được gửi đến email để xác thực
            tài khoản.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="blue"
            className="focus:outline-none"
          >
            <a onClick={handleOpenLoginViaEmailModal}>Thoát</a>
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog
        open={openLockedAccountModal}
        handler={handleOpenLockedAccountModal}
        size="sm"
      >
        <DialogHeader>Khóa tài khoản</DialogHeader>
        <DialogBody>
          <Typography
            className="font-normal text-slate-500"
            variant="paragraph"
          >
            Tài khoản của bạn đã bị khóa vui lòng liên hệ với quản trị viên.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="blue"
            className="focus:outline-none"
            onClick={handleOpenLockedAccountModal}
          >
            Thoát
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog
        open={openTokenExpiredModal}
        handler={handleOpenTokenExpiredModal}
        size="sm"
      >
        <DialogHeader>Khóa tài khoản</DialogHeader>
        <DialogBody>
          <Typography
            className="font-normal text-slate-500"
            variant="paragraph"
          >
            Liên kết mà bạn truy cập đã hết hạn, vui lòng liên hệ quản trị viên.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="blue"
            className="focus:outline-none"
            onClick={handleOpenTokenExpiredModal}
          >
            Thoát
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default LoginPage;
