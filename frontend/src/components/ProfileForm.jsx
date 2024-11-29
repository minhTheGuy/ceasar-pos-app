import {
  Avatar,
  Typography,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Card,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { GrUpdate } from "react-icons/gr";
import { PiNumpad } from "react-icons/pi";
import ProfileBG from "../../public/assets/profile-bg.jpg";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { api } from "../app/api/api";
import { useState } from "react";

const ProfileForm = ({ userInfo }) => {
  const [cookies, , removeCookie] = useCookies(["jwt"]);
  const { enqueueSnackbar } = useSnackbar();

  const [openCPModal, setOpenCPModal] = useState(false);
  const [openCAModal, setOpenCAModal] = useState(false);
  const [openAvatar, setOpenAvatar] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [url, setUrl] = useState("");

  const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleOpenCPModal = () => setOpenCPModal((cur) => !cur);
  const handleOpenCAModal = () => setOpenCAModal((cur) => !cur);
  const handleOpenAvatar = (url) => {
    setUrl(url);
    setOpenAvatar((cur) => !cur);
  };

  const handleChangePassword = () => {
    const token = cookies.jwt;
    const id = jwtDecode(token).id;
    api
      .patch(
        `/auth/updatePassword/${id}`,
        {
          oldPassword,
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
        removeCookie("jwt");
      })
      .catch((err) => {
        enqueueSnackbar("Đổi mật khẩu thất bại", { variant: "error" });
        handleOpenCPModal();
      });
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleUploadAvatar = () => {
    const token = cookies.jwt;
    const id = jwtDecode(token).id;

    let formData = new FormData();
    formData.append("avatar", avatar);

    api
      .patch(`/staffs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        enqueueSnackbar("Cập nhật ảnh đại diện thành công", {
          variant: "success",
        });
        window.location.reload();
        handleOpenCAModal();
      })
      .catch((err) => {
        enqueueSnackbar("Cập nhật ảnh đại diện thất bại", { variant: "error" });
        handleOpenCAModal();
      });
  };
  return (
    <div className="px-11 mx-auto mt-11 flex items-center">
      <div className="w-1/2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Avatar
              src={
                userInfo.avatar
                  ? "https://caesarpos-api.vercel.app/uploads/avatars/" +
                    userInfo.avatar
                  : ""
              }
              alt="avatar"
              size="xl"
              withBorder={true}
              className="p-1 cursor-pointer shadow-xl hover:shadow-2xl"
              color="blue"
              onClick={() =>
                handleOpenAvatar(
                  "https://caesarpos-api.vercel.app/uploads/avatars/" +
                    userInfo.avatar
                )
              }
            />
            <div className="ml-5">
              <h1 className="text-2xl font-semibold">
                {userInfo.account?.username}
              </h1>
              <p className="text-gray-500">{userInfo.email}</p>
            </div>
          </div>
          <Button
            variant="gradient"
            className="flex items-center gap-3"
            color="blue"
            onClick={handleOpenCAModal}
          >
            <GrUpdate className="text-lg" />
            Đổi ảnh mới
          </Button>
        </div>
        <form className="mt-9 ">
          <div className="mb-5">
            <Typography variant="h6">Tên đăng nhập</Typography>
            <input
              type="text"
              className="p-3 w-full rounded-lg bg-slate-200 focus:border-[#004AAD] focus:outline-none border-2 mt-2"
              value={userInfo.account?.username}
              disabled
            />
          </div>
          <div className="mb-5">
            <Typography variant="h6">Họ và tên</Typography>
            <input
              type="text"
              className="p-3 w-full rounded-lg bg-slate-200 focus:border-[#004AAD] focus:outline-none border-2 mt-2"
              value={userInfo.fullname}
              disabled
            />
          </div>
          <div className="mb-5">
            <Typography variant="h6">Địa chỉ email</Typography>
            <input
              type="text"
              className="p-3 w-full rounded-lg bg-slate-200 focus:border-[#004AAD] focus:outline-none border-2 mt-2"
              value={userInfo.email}
              disabled
            />
          </div>
          <div className="flex justify-center mt-14">
            <Button
              variant="gradient"
              className="flex items-center gap-3"
              onClick={handleOpenCPModal}
            >
              <PiNumpad className="text-lg" />
              Đổi mật khẩu
            </Button>
            <Dialog
              size="sm"
              open={openCPModal}
              handler={handleOpenCPModal}
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
                    Mật khẩu cũ
                  </Typography>
                  <input
                    type="password"
                    className="border border-slate-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
                    name="oldPassword"
                    onChange={handleOldPasswordChange}
                  ></input>
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
            <Dialog
              size="sm"
              open={openCAModal}
              handler={handleOpenCAModal}
              className="bg-transparent shadow-none"
            >
              <Card className="mx-auto w-full max-w-[28rem]">
                <CardBody className="flex flex-col gap-4">
                  <Typography variant="h4" color="blue-gray">
                    Cập nhật ảnh đại diện
                  </Typography>
                  <Typography
                    className="font-normal text-slate-400"
                    variant="paragraph"
                  >
                    Ảnh phải thuộc định dạng JPG, PNG.
                  </Typography>
                  <Typography className="" variant="h6">
                    Tải ảnh lên
                  </Typography>
                  <input
                    type="file"
                    className="font-semibold file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                    onChange={handleFileChange}
                  ></input>
                </CardBody>
                <CardFooter className="pt-0">
                  <Button
                    variant="gradient"
                    onClick={handleUploadAvatar}
                    fullWidth
                  >
                    Lưu ảnh đại diện
                  </Button>
                </CardFooter>
              </Card>
            </Dialog>
            <Dialog size="md" open={openAvatar} handler={handleOpenAvatar}>
              <DialogBody>
                <img
                  alt="nature"
                  className="h-[30rem] w-full rounded-lg object-cover object-center"
                  src={url}
                />
              </DialogBody>
              <DialogFooter className="justify-between">
                <div className="flex items-center gap-16">
                  <div>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      Họ và tên
                    </Typography>
                    <Typography color="blue-gray" className="font-medium">
                      {userInfo.fullname}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      Email
                    </Typography>
                    <Typography color="blue-gray" className="font-medium">
                      {userInfo.email}
                    </Typography>
                  </div>
                </div>
                <Button onClick={() => setOpenAvatar((cur) => !cur)}>
                  Đóng
                </Button>
              </DialogFooter>
            </Dialog>
          </div>
        </form>
      </div>
      <div className="w-1/2 ml-20">
        <img src={ProfileBG} className="mix-blend-multiply w-full"></img>
      </div>
    </div>
  );
};

export default ProfileForm;
