import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ScrollToTop from "./ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Detail from "./pages/Detail";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import { fetchCarts } from "./features/cartSlice";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchCarts(user.id));
    }
  }, [dispatch, user]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />

        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/contact" element={<Contact />} />

        <Route element={<ProtectedRoute isAuthenticated={user} />}>
          <Route path="/cart/:id" element={<Cart />} />
          <Route path="/success" element={<CheckoutSuccess />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
