import { Card, Typography, Tooltip } from "@material-tailwind/react";
import { RiBillLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const TABLE_HEAD = [
  "Họ và tên",
  "Địa chỉ",
  "Số điện thoại",
  "Ngày tạo",
  "Thao tác",
];

const CustomerTable = ({ customers }) => {
  return (
    <Card className="h-full w-full">
      <table className="w-full min-w-max table-auto">
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
          {customers.map((customer, index) => {
            return (
              <tr key={index} className="hover:bg-slate-50">
                <td className="p-4 text-center">
                  <Typography className="font-semibold text-blue-700">
                    {customer.fullname}
                  </Typography>
                </td>
                <td className="p-4 text-center">
                  <Typography className="font-semibold text-slate-600">
                    {customer.address}
                  </Typography>
                </td>
                <td className="p-4 text-center">
                  <Typography className="font-semibold text-slate-600">
                    {customer.phone}
                  </Typography>
                </td>
                <td className="p-4 text-center">
                  <Typography className="font-semibold text-slate-600">
                    {format(customer.createdAt, "dd-MM-yyyy")}
                  </Typography>
                </td>
                <td className="p-4 flex justify-center">
                  <Tooltip
                    content="Lịch sử mua hàng"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                  >
                    <Link
                      to={`/admin/purchase-history/${customer._id}`}
                      state={{
                        name: customer.fullname,
                        phone: customer.phone,
                        address: customer.address,
                      }}
                    >
                      <RiBillLine className="text-2xl text-orange-500" />
                    </Link>
                  </Tooltip>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
};

export default CustomerTable;
