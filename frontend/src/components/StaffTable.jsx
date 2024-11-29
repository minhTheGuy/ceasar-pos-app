import {
  Card,
  Typography,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Tooltip,
} from "@material-tailwind/react";
import { useState } from "react";
import { IoIosMail } from "react-icons/io";
import { BsInfoCircle } from "react-icons/bs";
import { MdLockPerson } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineLockPerson } from "react-icons/md";
import { MdMailOutline } from "react-icons/md";
import { MdOutlineDateRange } from "react-icons/md";
import { MdOutlineSignalWifiStatusbarNull } from "react-icons/md";
import { MdWorkOutline } from "react-icons/md";
import { IoMdUnlock } from "react-icons/io";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import { api } from "../app/api/api";

const TABLE_HEAD = [
  "Họ và tên",
  "Ngày tạo",
  "Trạng thái",
  "Khóa",
  "Gửi lại mail",
  "Thao tác",
];

const StaffTable = ({ staffs }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const { enqueueSnackbar } = useSnackbar();

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openLockModal, setOpenLockModal] = useState(false);
  const [openUnlockModal, setOpenUnlockModal] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState(null);

  const handleOpenDetailModal = (staff) => {
    setOpenDetailModal(!openDetailModal);
    setSelectedStaff(staff);
  };
  const handleOpenLockModal = (staff) => {
    setSelectedStaff(staff);
    setOpenLockModal(!openLockModal);
  };
  const handleOpenUnlockModal = (staff) => {
    setSelectedStaff(staff);
    setOpenUnlockModal(!openUnlockModal);
  };

  const handleLockAccount = () => {
    api
      .patch(
        `/staffs/${selectedStaff._id}`,
        { is_locked: "True" },
        {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        }
      )
      .then(() => {
        setOpenLockModal(!openLockModal);
        staffs = staffs.map((staff) => {
          if (staff._id === selectedStaff._id) {
            staff.is_locked = "True";
          }
        });
        enqueueSnackbar("Khóa tài khoản thành công", { variant: "success" });
      })
      .catch((err) => {
        console.log(err);
        setOpenLockModal(!openLockModal);
        enqueueSnackbar("Khóa tài khoản thất bại", { variant: "error" });
      });
  };

  const handleUnlockAccount = () => {
    api
      .patch(
        `/staffs/${selectedStaff._id}`,
        { is_locked: "False" },
        {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        }
      )
      .then(() => {
        setOpenUnlockModal(!openUnlockModal);
        staffs = staffs.map((staff) => {
          if (staff._id === selectedStaff._id) {
            staff.is_locked = "False";
          }
        });
        enqueueSnackbar("Mở khóa tài khoản thành công", { variant: "success" });
      })
      .catch((err) => {
        console.log(err);
        setOpenUnlockModal(!openUnlockModal);
        enqueueSnackbar("Mở khóa tài khoản thất bại", { variant: "error" });
      });
  };

  const handleSendEmail = (staff) => {
    console.log(staff);
    api
      .post(
        `/auth/resendEmail`,
        { email: staff.email },
        {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        }
      )
      .then(() => {
        enqueueSnackbar("Gửi mail thành công", { variant: "success" });
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Gửi mail thất bại", { variant: "error" });
      });
  };

  return (
    <Card className="h-full w-full">
      <table className="w-full min-w-max table-auto text-left">
        <thead className="">
          <tr>
            {TABLE_HEAD.map((head) => (
              <th key={head} className="p-4 bg-gray-100">
                <Typography variant="h6" color="black">
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {staffs.map((staff, index) => {
            return (
              <tr key={index} className="hover:bg-slate-50">
                <td className="p-4">
                  <div className="flex items-center gap-x-3">
                    <Avatar
                      src={
                        "http://localhost:8080/uploads/avatars/" + staff.avatar
                      }
                      alt={staff.fullname}
                      size="md"
                      withBorder={true}
                      color="blue"
                      className="border p-1"
                    />
                    <Typography className="font-semibold">
                      {staff.fullname}
                    </Typography>
                  </div>
                </td>
                <td className="p-4">
                  <Typography className="font-semibold">
                    {format(staff.createdAt, "dd-MM-yyyy")}
                  </Typography>
                </td>
                <td className="p-4">
                  <div className="w-max">
                    <Chip
                      size="lg"
                      variant="ghost"
                      value={staff.status}
                      color={staff.status == "Active" ? "green" : "amber"}
                    />
                  </div>
                </td>
                <td className="p-4">
                  <div className="w-max">
                    <Chip
                      size="lg"
                      variant="ghost"
                      value={staff.is_locked}
                      color={staff.is_locked == "True" ? "red" : "cyan"}
                    />
                  </div>
                </td>
                <td className="p-4">
                  <Button
                    className="flex items-center gap-3"
                    size="sm"
                    color="blue"
                    variant="outlined"
                    onClick={() => handleSendEmail(staff)}
                  >
                    <IoIosMail className="text-xl text-blue-500" />
                    Gửi
                  </Button>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-x-5">
                    <Tooltip
                      content="Xem chi tiết"
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                      }}
                    >
                      <button onClick={() => handleOpenDetailModal(staff)}>
                        <BsInfoCircle className="text-2xl text-green-600" />
                      </button>
                    </Tooltip>
                    {staff.is_locked == "False" ? (
                      <Tooltip
                        content="Khóa tài khoản"
                        animate={{
                          mount: { scale: 1, y: 0 },
                          unmount: { scale: 0, y: 25 },
                        }}
                      >
                        <button onClick={() => handleOpenLockModal(staff)}>
                          <MdLockPerson className="text-2xl text-red-600" />
                        </button>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        content="Mở khóa tài khoản"
                        animate={{
                          mount: { scale: 1, y: 0 },
                          unmount: { scale: 0, y: 25 },
                        }}
                      >
                        <button onClick={() => handleOpenUnlockModal(staff)}>
                          <IoMdUnlock className="text-2xl text-blue-600" />
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Dialog
        open={openDetailModal}
        handler={() => setOpenDetailModal(!openDetailModal)}
        size="sm"
      >
        <DialogHeader className="relative m-0 block">
          <Typography variant="h3">Chi tiết nhân viên</Typography>
          <Typography className="mt-1 font-normal text-slate-500">
            Mã nhân viên: {selectedStaff?.id}
          </Typography>
        </DialogHeader>
        <DialogBody>
          <div className="mb-3">
            <div className="flex gap-x-2 items-center">
              <FaRegUser className="text-lg" />
              <Typography variant="h6">Họ và tên</Typography>
            </div>
            <input
              value={selectedStaff?.fullname}
              className="p-2 rounded-md w-full mt-2 border border-gray-200 font-normal text-slate-700"
              disabled
            ></input>
          </div>
          <div className="mb-3">
            <div className="flex gap-x-2 items-center">
              <MdWorkOutline className="text-lg" />
              <Typography variant="h6">Tên đăng nhập</Typography>
            </div>
            <input
              value={selectedStaff?.account.username}
              className="p-2 rounded-md w-full mt-2 border border-gray-200 font-normal text-slate-700"
              disabled
            ></input>
          </div>
          <div className="flex gap-x-6 justify-between mb-3">
            <div className="w-1/2">
              <div className="flex gap-x-2 items-center">
                <MdOutlineSignalWifiStatusbarNull className="text-lg" />
                <Typography variant="h6">Trạng thái</Typography>
              </div>
              <input
                value={selectedStaff?.status}
                className="p-2 rounded-md w-full mt-2 border border-gray-200 font-normal text-slate-700"
                disabled
              ></input>
            </div>
            <div className="w-1/2">
              <div className="flex gap-x-2 items-center">
                <MdOutlineLockPerson className="text-xl" />
                <Typography variant="h6">Khóa</Typography>
              </div>
              <input
                value={selectedStaff?.is_locked}
                className="p-2 rounded-md w-full mt-2 border border-gray-200 font-normal text-slate-700"
                disabled
              ></input>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex gap-x-2 items-center">
              <MdMailOutline className="text-xl" />
              <Typography variant="h6">Địa chỉ email</Typography>
            </div>
            <input
              value={selectedStaff?.email}
              className="p-2 rounded-md w-full mt-2 border border-gray-200 font-normal text-slate-700"
              disabled
            ></input>
          </div>
          <div className="mb-3">
            <div className="flex gap-x-2 items-center">
              <MdOutlineDateRange className="text-xl" />
              <Typography variant="h6">Ngày tạo</Typography>
            </div>
            <input
              value={
                selectedStaff?.createdAt &&
                format(selectedStaff?.createdAt, "dd-MM-yyyy")
              }
              className="p-2 rounded-md w-full mt-2 border border-gray-200 font-normal text-slate-700"
              disabled
            ></input>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            color="blue"
            onClick={() => setOpenDetailModal(!openDetailModal)}
          >
            <span>Đóng</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog
        open={openLockModal}
        handler={() => setOpenLockModal(!openLockModal)}
        size="sm"
      >
        <DialogHeader className="relative m-0 block">
          <Typography variant="h3">Khóa tài khoản</Typography>
        </DialogHeader>
        <DialogBody>
          <p className="font-normal text-slate-500">
            Bạn có chắc chắn muốn khóa tài khoản của nhân viên{" "}
            <span className="font-bold">{selectedStaff?.fullname}</span> này
            không?
          </p>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            onClick={() => setOpenLockModal(!openLockModal)}
            className="mr-1"
          >
            <span>Đóng</span>
          </Button>
          <Button color="red" onClick={handleLockAccount}>
            <span>Đồng ý</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog
        open={openUnlockModal}
        handler={() => setOpenUnlockModal(!openUnlockModal)}
        size="sm"
      >
        <DialogHeader className="relative m-0 block">
          <Typography variant="h3">Mở khóa tài khoản</Typography>
        </DialogHeader>
        <DialogBody>
          <p className="font-normal text-slate-500">
            Bạn có chắc chắn muốn mở khóa tài khoản của nhân viên{" "}
            <span className="font-bold">{selectedStaff?.fullname}</span> này
            không?
          </p>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            onClick={() => setOpenUnlockModal(!openUnlockModal)}
            className="mr-1"
          >
            <span>Đóng</span>
          </Button>
          <Button color="blue" onClick={handleUnlockAccount}>
            <span>Đồng ý</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
};

export default StaffTable;
