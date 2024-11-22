import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Sidebar from './Sidebar';
import Cards from './Cards';
import Product from './Product';
import Company from './Company';
import Customer from './Customer';
import Order from './Order';
import Admin from '../components/Admin';
import Report from './Report';
import Cart from './Cart';
import IconItem from './IconItem';
import { useCart } from './CartContext';
import './pages.css';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';


import { resetLoginState } from '../features/loginSlice';

const Dashboard = () => {
  const { cartItems, clearCart } = useCart();
  const [activeContent, setActiveContent] = useState('dashboard');
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleButtonClick = (content) => {
    setActiveContent(content);
    setCartOpen(false);
  };

  const handleCartClick = () => {
    setCartOpen(true);
  };

  const upperLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const authToken = localStorage.getItem('key');
      if (!authToken && !isLoggingOut) {
        navigate('/', { replace: true });
      }
    };
    
    checkAuth();
  }, [navigate, isLoggingOut]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      Swal.fire({
        title: 'Logging out...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      dispatch(resetLoginState());

      clearCart();
      
      localStorage.clear();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      Swal.close();
      
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
      
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: 'An error occurred during logout. Please try again.',
        confirmButtonColor: '#FF962E'
      });
    }
  }

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  if (isLoggingOut) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Logging out...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <input type="checkbox" id="nav-toggle"/>
      <Sidebar onButtonClick={handleButtonClick} activeContent={activeContent} onLogout={handleLogout}/>
      <div className="main-content mt-5 mt-lg-5 p-3">
        <header className="d-flex justify-content-between">
          <div className="head-left d-flex">
            <label htmlFor="nav-toggle">
              <span className="las la-bars" style={{fontSize: '25px', lineHeight: '1.4'}}></span>
            </label>
            <p className="mx-3 vega">{upperLetter(activeContent)}</p>
          </div>
          <div className="head-right mt-2 mr-5">
            <div style={{ position: 'relative' }}>
              <IconItem 
                itemCount={cartItems.length} 
                onClick={handleCartClick}
              />
              {cartItems.length > 0 && (
                <span className="cart-item-count" style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  background: '#FF962E',
                  borderRadius: '50%',
                  color: '#FFF',
                  padding: '0px 7px',
                  fontSize: '12px',
                }}>
                  {cartItems.length}
                </span>
              )}
            </div>
          </div>
          <FontAwesomeIcon 
          icon={faRightFromBracket}
            onClick={handleLogout} 
            className="btn btn-danger m-2"
            disabled={isLoggingOut}
            style={{ backgroundColor: '#FF962E', fontSize: '10px' }}
          />
            {/* {isLoggingOut ? (
              <>
                <div className="spinner-border spinner-border-sm text-light me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Logging out...
              </>
            ) : (
              'Logout'
            )} */}
        </header>

        {cartOpen ? (
          <Cart cartItems={cartItems} updateCart={updateCart} />
        ) : (
          <>
            {activeContent === 'dashboard' && <Cards updateCart={updateCart}/> }
            {activeContent === 'product management' && <Product updateCart={updateCart}/> }
            {activeContent === 'company management' && <Company updateCart={updateCart}/> }
            {activeContent === 'customer management' && <Customer updateCart={updateCart}/> }
            {activeContent === 'order management' && <Order updateCart={updateCart}/> }
            {activeContent === 'reports' && <Report updateCart={updateCart}/> }
            {activeContent === 'admin settings' && <Admin updateCart={updateCart}/> }
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
