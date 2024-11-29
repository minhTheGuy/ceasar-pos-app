import { LuUsers } from "react-icons/lu";
import { TbDeviceIpadCheck } from "react-icons/tb";
import { TbDevicesDollar } from "react-icons/tb";
import { GrMoney } from "react-icons/gr";

const DashboardBoxStaff = ({ customers, bills, income, products }) => {
  return (
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">
      <div className="rounded-md p-5 flex shadow-lg shadow-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-gray-400 cursor-pointer bg-white">
        <LuUsers className="text-6xl text-blue-700 w-1/3" />
        <div className="w-2/3">
          <h1 className="text-dark-purple text-3xl font-bold">{customers}</h1>
          <h4 className="text-[#33343D] mb-3 font-semibold">
            Số lượng khách hàng
          </h4>
        </div>
      </div>
      <div className="rounded-md p-5 flex shadow-lg shadow-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-gray-400 cursor-pointer bg-white">
        <TbDeviceIpadCheck className="text-6xl text-orange-500 text-right w-1/3" />
        <div className="w-2/3">
          <h1 className="text-dark-purple text-3xl font-bold">{bills}</h1>
          <h4 className="text-[#33343D] mb-3 font-semibold">Tổng đơn hàng</h4>
        </div>
      </div>
      <div className="rounded-md p-5 flex shadow-lg shadow-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-gray-400 cursor-pointer bg-white">
        <GrMoney className="text-6xl text-green-700 text-right w-1/3" />
        <div className="w-2/3">
          <h1 className="text-dark-purple text-3xl font-bold">{income}</h1>
          <h4 className="text-[#33343D] mb-3 font-semibold">Tổng doanh thu</h4>
        </div>
      </div>
      <div className="rounded-md p-5 flex shadow-lg shadow-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-gray-400 cursor-pointer bg-white">
        <TbDevicesDollar className="text-6xl text-purple-700 text-right w-1/3" />
        <div className="w-2/3">
          <h1 className="text-dark-purple text-3xl font-bold">{products}</h1>
          <h4 className="text-[#33343D] mb-3 font-semibold">Sản phẩm bán ra</h4>
        </div>
      </div>
    </div>
  );
};

export default DashboardBoxStaff;
