import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import Home from "../pages/user/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import BookDetails from "../pages/BookDetails";
import Orders from "../pages/user/Orders";
import Profile from "../pages/UserSpace";
import AdminLayout from "../Layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import UserLayout from "../Layouts/UserLayout";
import Users from "../pages/admin/Users";
import UserBooks from "../pages/admin/UserBooks";
import Authors from "../pages/admin/Authors";
import Genres from "../pages/admin/Genres";
import AuthorBooks from "../pages/admin/AuthorBooks";
import GenreBooks from "../pages/admin/GenreBooks";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/books/:id" element={<BookDetails />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="users" element={<Users />} />
          <Route path="authors" element={<Authors />} />
          <Route path="genres" element={<Genres />} />
          <Route path="users/:id" element={<UserBooks />} />
          <Route path="books/:id" element={<BookDetails />} />
          <Route path="authors/:author_id" element={<AuthorBooks />} />
          <Route path="genres/:genre_id" element={<GenreBooks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
