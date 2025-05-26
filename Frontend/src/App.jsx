import { Routes, Route, useLocation,matchPath} from "react-router-dom";
import SubcategoryPage from "./Pages/SubcategoryPage";
import HomePage from "./Pages/HomePage";
import Product from "./Pages/Product";
import Navbar from "./Components/Navbar";
import AdminPage from "./Pages/AdminPage";
import WishlistPage from "./Pages/WishlistPage";
import { WishlistProvider } from "./context/Wishlist";
import Registration from './Pages/RegistrationPage';
import Login from './Pages/LoginPage';
import AdminLogin from './Pages/AdminLogin';
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import Footer from "./Components/Footer";
import AboutUs from "./Components/AboutUs";
import ContactUs from "./Components/ContactUs";
import FAQs from "./Pages/Faq";
import PaymentPage from "./Pages/PaymentPage";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";


function App() {
  const location = useLocation();
  const showNavbar =
  location.pathname === "/" ||
  matchPath("/subcategory/:categoryId",location.pathname) ||
  matchPath("/product/:subcategoryId",location.pathname);

  const showFooter =
  location.pathname === "/" ||
  matchPath("/subcategory/:categoryId",location.pathname) ||
  matchPath("/product/:subcategoryId",location.pathname) ||
  matchPath("/product/by-id/:id",location.pathname) ||
  matchPath("/about",location.pathname) ||
  matchPath("/Contact",location.pathname) ||
  matchPath("/faqs",location.pathname) ||
  matchPath("/wishlist",location.pathname);
  
  return (
    <>  
    <Toaster />
    <WishlistProvider>
    <CartProvider>
    {showNavbar && <Navbar/> }
    <Routes>
      <Route path='/login' element={<Login/>} />
      <Route path='/registration' element={<Registration />} />
      <Route path='/adminlogin' element={<AdminLogin/>} />
      <Route path='/resetpassword' element={<ResetPassword/>} />
      <Route path='/forgotpassword' element={<ForgotPassword/>} />
      <Route path="/" element={<HomePage/>} />
      <Route path="/subcategory/:categoryId" element={<SubcategoryPage />} />
      <Route path="/product/:subcategoryId" element={<Product />} />
      <Route path="/Admin" element={<AdminPage/>}/>
      <Route path="/wishlist" element={<WishlistPage/>}/>
      <Route path="/about" element={<AboutUs/>}/>
      <Route path="/Contact" element={<ContactUs/>}/>
      <Route path="/faqs" element={<FAQs/>}/>
      <Route path="/payment" element={<PaymentPage/>}/>
      <Route path="/product/by-id/:id" element={<Product/>}/>
    </Routes>
    {showFooter && <Footer/>}
    </CartProvider>
    </WishlistProvider>
    </>
  );
}

export default App;
