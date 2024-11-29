import { Card, Typography, Tooltip } from "@material-tailwind/react";
import { BsInfoCircle } from "react-icons/bs";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useState } from "react";
import { CgSmartphoneChip } from "react-icons/cg";
import { FaBarcode } from "react-icons/fa6";
import { FaSackDollar } from "react-icons/fa6";
import { IoMdPricetags } from "react-icons/io";
import { BiCategory } from "react-icons/bi";
import { MdOutlineDevices } from "react-icons/md";
import { format } from "date-fns";

const TABLE_HEAD = [
  "Barcode",
  "Tên sản phẩm",
  "Giá bán lẻ",
  "Loại sản phẩm",
  "Ngày tạo",
  "Thao tác",
];

const ProductTableStaff = ({ products }) => {
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenDetailModal = (product) => {
    setSelectedProduct(product);
    setOpenDetailModal(!openDetailModal);
  };

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
          {products.map((product, index) => {
            return (
              <tr key={index} className="hover:bg-slate-50">
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
                  <Typography className="font-semibold text-pink-500">
                    {product.category}
                  </Typography>
                </td>
                <td className="p-4 text-center">
                  <Typography className="font-semibold text-slate-500">
                    {format(product.createdAt, "dd-MM-yyyy")}
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
                    <button onClick={() => handleOpenDetailModal(product)}>
                      <BsInfoCircle className="text-2xl text-green-600" />
                    </button>
                  </Tooltip>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Dialog open={openDetailModal} handler={handleOpenDetailModal} size="sm">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h3">Thông tin sản phẩm</Typography>
          <Typography className="mt-1 font-normal text-slate-500">
            Mã sản phẩm: {selectedProduct?.barcode}
          </Typography>
        </DialogHeader>
        <DialogBody>
          <div className="mb-6">
            <div className="flex gap-x-2 items-center">
              <MdOutlineDevices className="text-lg" />
              <Typography variant="h6">Tên sản phẩm</Typography>
            </div>
            <input
              className="p-2 rounded-md w-full mt-2 border border-gray-200 font-normal focus:border-blue-500 focus:outline-none text-slate-700"
              value={selectedProduct?.name}
              disabled
            ></input>
          </div>
          <div className="mb-3 flex gap-x-5">
            <div className="w-full">
              <div className="flex gap-x-2 items-center">
                <CgSmartphoneChip className="text-xl" />
                <Typography variant="h6">Tên thương hiệu</Typography>
              </div>
              <input
                className="p-2 rounded-md w-full mt-2 border border-gray-200 font-normal focus:border-blue-500 focus:outline-none text-slate-700"
                value={selectedProduct?.brand}
                disabled
              ></input>
            </div>
            <div className="w-full">
              <div className="flex gap-x-2 items-center">
                <BiCategory className="text-xl" />
                <Typography variant="h6">Loại sản phẩm</Typography>
              </div>
              <input
                className="p-2 rounded-md w-full mt-2 border border-gray-200 font-normal focus:border-blue-500 focus:outline-none text-slate-700"
                value={selectedProduct?.category}
                disabled
              ></input>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex gap-x-2 items-center">
              <FaBarcode className="text-xl" />
              <Typography variant="h6">Mã barcode</Typography>
            </div>
            <input
              className="p-2 rounded-md w-full mt-2 border border-gray-200 font-normal focus:border-blue-500 focus:outline-none text-slate-700"
              value={selectedProduct?.barcode}
              disabled
            ></input>
          </div>
          <div className="mb-3">
            <div className="flex gap-x-2 items-center">
              <FaSackDollar className="text-xl" />
              <Typography variant="h6">Giá nhập</Typography>
            </div>
            <input
              className="p-2 rounded-md w-full mt-2 border border-gray-200 font-normal focus:border-blue-500 focus:outline-none text-slate-700"
              value={selectedProduct?.import_price}
              disabled
            ></input>
          </div>
          <div className="mb-3">
            <div className="flex gap-x-2 items-center">
              <IoMdPricetags className="text-xl" />
              <Typography variant="h6">Giá bán lẻ</Typography>
            </div>
            <input
              className="p-2 rounded-md w-full mt-2 border border-gray-200 font-normal focus:border-blue-500 focus:outline-none text-slate-700"
              value={selectedProduct?.retail_price}
              disabled
            ></input>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button color="blue" onClick={handleOpenDetailModal}>
            <span>Đóng</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
};

export default ProductTableStaff;
