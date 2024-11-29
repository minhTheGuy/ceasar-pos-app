import { Typography } from "@material-tailwind/react";

const TABLE_HEAD = ["Barcode", "Tên sản phẩm", "Giá bán lẻ", "Thao tác"];

const ProductSearchTransaction = ({ TABLE_ROWS }) => {
  return (
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
        {TABLE_ROWS.map(({ barcode, name, retail_price, category }, index) => {
          return (
            <tr key={index} className="hover:bg-slate-50">
              <td className="p-4 text-center">
                <Typography className="font-semibold text-orange-600">
                  {barcode}
                </Typography>
              </td>
              <td className="p-4 text-center">
                <Typography className="font-semibold text-blue-700">
                  {name}
                </Typography>
              </td>
              <td className="p-4 text-center">
                <Typography className="font-semibold text-green-500">
                  {retail_price}$
                </Typography>
              </td>
              <td className="p-4 text-center">
                <button className="bg-white hover:bg-green-500 hover:text-white text-green-500 font-semibold py-2 px-4 rounded-md border border-green-500 transition-all">
                  Thêm +
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ProductSearchTransaction;
