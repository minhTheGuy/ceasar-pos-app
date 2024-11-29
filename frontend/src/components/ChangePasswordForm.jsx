import ChangeBG from "../../public/assets/cp.jpg";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { jwtDecode } from "jwt-decode";
import { api } from "../app/api/api";

const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, , removeCookie] = useCookies(["jwt"]);

  const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

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
      });
  };

  return (
    <div className="px-11 mt-11">
      <div className="flex items-center justify-between">
        <div className="w-1/2">
          <h1 className="text-2xl text-black font-semibold">
            Thay đổi mật khẩu
          </h1>
          <div className="my-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Mật khẩu cũ
            </label>
            <input
              type="password"
              id="old-password"
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              value={oldPassword}
              onChange={handleOldPasswordChange}
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="new-password"
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            <span className="text-sm text-gray-400">
              Mật khẩu cần ít nhất 6 kí tự
            </span>
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              id="confirm-new-password"
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={handleChangePassword}
          >
            Đổi mật khẩu
          </button>
        </div>
        <div className="w-1/2 ml-20">
          <img src={ChangeBG} className="mix-blend-multiply"></img>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
