import { BsInfoCircle } from "react-icons/bs";
import {
  Card,
  Typography,
  Tooltip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useState } from "react";
import { format } from "date-fns";

const TABLE_HEAD1 = [
  "Mã đơn",
  "Tổng tiền",
  "Tiền khách đưa",
  "Tiền thừa",
  "Ngày mua",
  "Số lượng",
  "Thao tác",
];

const TABLE_HEAD2 = ["Tên sản phẩm", "Số lượng", "Đơn giá", "Tổng tiền"];

const PurchaseHistoryTable = ({ orders }) => {
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenDetailModal = (order) => {
    setSelectedOrder(order);
    setOpenDetailModal(!openDetailModal);
  };

  return (
    <Card className="h-full w-full">
      <table className="w-full min-w-max table-auto">
        <thead className="">
          <tr>
            {TABLE_HEAD1.map((head) => (
              <th key={head} className="p-4 bg-gray-100">
                <Typography variant="h6" color="black">
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => {
            return (
              <tr key={index} className="hover:bg-slate-50">
                <td className="p-4 text-center">
                  <Typography className="font-semibold text-orange-500">
                    {order._id}
                  </Typography>
                </td>
                <td className="p-4 text-center">
                  <Typography className="font-semibold text-slate-600">
                    {order.totalAmount}
                  </Typography>
                </td>
                <td className="p-4 text-center">
                  <Typography className="font-semibold text-slate-600">
                    {order.receivedAmount}
                  </Typography>
                </td>
                <td className="p-4 text-center">
                  <Typography className="font-semibold text-slate-600">
                    {order.change}
                  </Typography>
                </td>
                <td className="p-4 text-center">
                  <Typography className="font-semibold text-slate-600">
                    {format(order.createdAt, "dd-MM-yyyy")}
                  </Typography>
                </td>
                <td className="p-4 text-center">
                  <Typography className="font-semibold text-slate-600">
                    {order.items.length}
                  </Typography>
                </td>
                <td className="p-4 flex justify-center">
                  <Tooltip
                    content="Xem chi tiết"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                  >
                    <button onClick={() => handleOpenDetailModal(order)}>
                      <BsInfoCircle className="text-2xl text-blue-500" />
                    </button>
                  </Tooltip>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Dialog
        open={openDetailModal}
        handler={() => setOpenDetailModal(!openDetailModal)}
        size="md"
      >
        <DialogHeader className="relative m-0 block">
          <Typography variant="h3">Thông tin hóa đơn</Typography>
          <Typography className="mt-1 font-normal text-slate-500">
            Mã hóa đơn: {selectedOrder?._id}
          </Typography>
        </DialogHeader>
        <DialogBody>
          <table className="w-full min-w-max table-auto">
            <thead>
              <tr>
                {TABLE_HEAD2.map((head) => (
                  <th key={head} className="p-4">
                    <Typography variant="h6" color="black">
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedOrder?.items.map((item, index) => {
                return (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-2 py-4 text-center">
                      <Typography className="font-semibold text-slate-500">
                        {item.name}
                      </Typography>
                    </td>
                    <td className="px-2 py-4 text-center">
                      <Typography className="font-semibold text-slate-500">
                        {item.quantity}
                      </Typography>
                    </td>
                    <td className="px-2 py-4 text-center">
                      <Typography className="font-semibold text-slate-500">
                        {item.retail_price}
                      </Typography>
                    </td>
                    <td className="px-2 py-4 text-center">
                      <Typography className="font-semibold text-slate-500">
                        {item.subTotal}
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
    </Card>
  );
};

export default PurchaseHistoryTable;
