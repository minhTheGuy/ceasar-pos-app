import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Home from "../pages/Admin/Home";
import HomeStaff from "../pages/Staff/HomeStaff";
import Profile from "../pages/Admin/Profile";
import ProfileStaff from "../pages/Staff/ProfileStaff";
import ChangePassword from "../pages/Admin/ChangePassword";
import ChangePasswordStaff from "../pages/Staff/ChangePasswordStaff";
import StaffManagementPage from "../pages/Admin/StaffManagementPage";
import ProductManagementPage from "../pages/Admin/ProductManagementPage";
import ProductMPageStaff from "../pages/Staff/ProductMPageStaff";
import CustomersPage from "../pages/Admin/CustomersPage";
import CustomersPageStaff from "../pages/Staff/CustomerPageStaff";
import TransactionPage from "../pages/Staff/TransactionPage";
import ConfirmTransaction from "../pages/Staff/ConfirmTransaction";
import InvoicePage from "../pages/Staff/InvoicePage";
import PurchaseHistory from "../pages/Admin/PurchaseHistory";
import PurchaseHistoryStaff from "../pages/Staff/PurchaseHistoryStaff";
import AnalysPage from "../pages/Admin/AnalysPage";
import AnalysPageStaff from "../pages/Staff/AnalysPageStaff";
import NotFoundPage from "../pages/NotFoundPage";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/admin">
        <Route path="home" element={<Home />} />
        <Route path="staffs" element={<StaffManagementPage />} />
        <Route path="products" element={<ProductManagementPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route
          path="purchase-history/:customerId"
          element={<PurchaseHistory />}
        />
        <Route path="profile" element={<Profile />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="analys" element={<AnalysPage />} />
      </Route>

      <Route path="/staff">
        <Route path="home" element={<HomeStaff />} />
        <Route path="transaction" element={<TransactionPage />} />
        <Route path="confirm-transaction" element={<ConfirmTransaction />} />
        <Route path="invoice" element={<InvoicePage />} />
        <Route path="products" element={<ProductMPageStaff />} />
        <Route path="customers" element={<CustomersPageStaff />} />
        <Route path="purchase-history" element={<PurchaseHistoryStaff />} />
        <Route
          path="purchase-history/:customerId"
          element={<PurchaseHistoryStaff />}
        />
        <Route path="profile" element={<ProfileStaff />} />
        <Route path="change-password" element={<ChangePasswordStaff />} />
        <Route path="analys" element={<AnalysPageStaff />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Routers;
