// client/src/App.jsx
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";

import Home from "./pages/Home.jsx";
import AllProducts from "./pages/AllProducts.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import MyImports from "./pages/MyImports.jsx";
import AddExport from "./pages/AddExport.jsx";
import MyExports from "./pages/MyExports.jsx";
import DashboardHome from "./pages/DashboardHome.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";

import PrivateRoute from "./routes/PrivateRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardHome />
            </PrivateRoute>
          }
        />

        <Route path="/products" element={<AllProducts />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route
          path="/my-imports"
          element={
            <PrivateRoute>
              <MyImports />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-export"
          element={
            <PrivateRoute>
              <AddExport />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-exports"
          element={
            <PrivateRoute>
              <MyExports />
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
