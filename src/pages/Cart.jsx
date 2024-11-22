import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createInvoice, getInvoiceData, getLandMark, getCountries } from '../features/commerceSlice';
import Invoice from './support/Invoice';
import Swal from 'sweetalert2';
import { useCart } from './CartContext'


const Cart = () => {
  const { clearCart } = useCart();
  const dispatch = useDispatch();
  let token = localStorage.getItem("key");
  const { data, success, error, spinItem, products, delivery_address, 
    delivery_state, delivery_country, 
    amount_paid, additional_information, 
    payment_method, delivery_landmark, invoice_id,
    customer_name, customer_phonenumber, customer_email, redirect_url, land, countryData } = useSelector((state) => state.commerce)

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [payment, setPayment] = useState('');
  const [additional, setAdditional] = useState('');
  const [view, setView] = useState(true);
  const [st, setSt] = useState([]);
  const [deliveryOption, setDeliveryOption] = useState('pickup');
  const [sd, setSd] = useState(false);

  const handleOptionChange = (e) => {
    const selectedValue = e.target.value;
    setDeliveryOption(selectedValue);
  
    if (selectedValue === "delivery") {
      setSd(true);
    } else {
      setSd(false);
      localStorage.removeItem("landmark_price");
    }
  };
  


  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.product_amount * item.order_quantity,
      0
    );
    setTotal(totalAmount);
  }, [cartItems]);

//   const handleQuantityChange = (index, increment) => {
//     const updatedCart = cartItems.map((item, i) => {
//       if (i === index) {
//         const newQuantity = item.quantity + increment;
//         return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
//       }
//       return item;
//     });
//     setCartItems(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//   };


  const handleChange = (e) => {
    const { name, value } = e.target;
  
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'country':
        setCountry(value);
        const countries = JSON.parse(localStorage.getItem("fetchedData"));
        if (countries) {
          const selectedCountry = countries.find(country => country.name === value);
  
          if (selectedCountry) {
            setSt(selectedCountry.states || []);
            console.log('States for selected country:', selectedCountry.states);
          } else {
            setSt([]);
            console.log('No states found for selected country.');
          }
        }
        break;
      case 'state':
        setState(value);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'landmark':
        setLandmark(value);
        const selectedValue = e.target.value;
        const [landmarkName, landmarkPrice] = selectedValue.split('-');

        setLandmark(selectedValue); 

        localStorage.setItem('landmark_price', landmarkPrice);
        break;
      case 'payment':
        setPayment(value);
        break;
      case 'additional':
        setAdditional(value);
        break;
      default:
        break;
    }
  };
  

 function generateUniqueId() {
    const prefix = "Lh";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = prefix;
  
    for (let i = 0; i < 14; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
  
    return result;
  }

  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);
  
  useEffect(() => {
    if (state) {
      dispatch(getLandMark({ stateItem: state }));
    }
  }, [state, dispatch]);

const handleSubmit = async (e) => {
  e.preventDefault();
  const cartItem = localStorage.getItem('cart');
  const lprice = localStorage.getItem("landmark_price");
  const cartView = cartItem ? JSON.parse(cartItem) : [];
  const productsToSubmit = cartView.map(({ images, product_name, ...rest }) => rest);
  
  // Log the products and token
  console.log(productsToSubmit);
  console.log(token);

  if (!cartItem || !payment || !name || !email || !phone) {
      Swal.fire({
          icon: 'error',
          title: 'Missing Information',
          text: 'Please fill in all the fields.',
          confirmButtonColor: '#FF962E'
      });
      return;
  }

  const uniqueId = generateUniqueId();
  const roundedAmount = Math.round(total);

  // Prepare invoice data before submission
  const invoiceData = {
      token, 
      products: productsToSubmit, 
      delivery_address: address || "pickup",
      delivery_state: state || "pickup",
      delivery_country: country || "pickup",
      amount_paid: lprice ? roundedAmount + parseInt(lprice) : roundedAmount, 
      payment_method: payment,
      invoice_id: uniqueId,
      customer_email: email,
      customer_name: name,
      customer_phonenumber: phone,
      delivery_landmark: landmark || "pickup",
      additional_information: additional,
      redirect_url: "https://legithairng.com/success.html"
  };

  localStorage.setItem("tot", invoiceData.amount_paid)

  // Log the invoice data before submission
  console.log("Invoice Data:", invoiceData);

  try {
      const result = await dispatch(createInvoice(invoiceData)).unwrap();

      if (result) {
          Swal.fire({
              icon: 'success',
              title: 'Created Successfully',
              text: 'Order created successfully.',
              confirmButtonColor: '#FF962E'
          });

          dispatch(getInvoiceData({ token, invoice_id: result.invoicenumber }));
  
          setTimeout(() => {
              Swal.close();
              resetForm();
              setModal(false);
              localStorage.setItem("inum", result.invoicenumber);
              localStorage.setItem("liurl", result.data.link);
              setView(false);
              clearCart()
          }, 3000);
      } else {
          throw new Error(result.message || 'Failed to create order.');
      }
  } catch (err) {
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'An error occurred during the submission. Please try again.',
          confirmButtonColor: '#FF962E'
      });
  }
};


 const resetForm = () => {
    setAddress('');
    setState('');
    setCountry('');
    setPayment('');
    setName('');
    setEmail('');
    setPhone('');
    setLandmark('');
    setAdditional('');
};

  const hideModal = () => {
      setModal(false);
      localStorage.removeItem("landmark_price");
      localStorage.removeItem("tot");
      setAddress('');
      setState('');
      setCountry('');
      setLandmark('');
      deliveryOption('pickup')

  }

  const cartModal = () => {
    setModal(true)
    dispatch(getCountries())
  }

  return (
    <>
    {view ? (
    <>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
            {cartItems.map((item) => (
            <div key={item.id} className="mt-3">
                <div className="row p-3 mx-3 my-2" style={{border: '1px solid rgb(226, 218, 218)', borderRadius: '15px'}}>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                      <img src={item.images[0].filename} alt={item.product_name} style={{ borderRadius: '20px' }} className="w-50 img-thumbnail"/>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <p className='my-3'>{item.product_name}</p>

                    <div className='d-block d-lg-flex gap-5'>
                      <p><span style={{ color: '#FF962E' }}>Price:</span> ₦{item.product_amount.toLocaleString()}</p>
                      <p><span style={{ color: '#FF962E' }}>Inches:</span>{item.inches}</p>
                      <p><span style={{ color: '#FF962E' }}>  Quantity:</span>{item.order_quantity}</p>
                    </div>
                  </div>
                </div>
            </div>
                
            ))}
            <hr style={{ border: '2px solid #FF962E', margin: '20px 0' }} />

            <div className='d-block d-lg-flex justify-content-between mt-3'>
              <button className='pro-btn mb-5 mb-lg-0' onClick={cartModal}>Generate Invoice</button>
              <h4><span style={{ color: '#FF962E' }}>Total:</span> ₦{total.toLocaleString()}</h4>
            </div>
        </>
      )}
    </>
    ) : <Invoice />}
      

      {modal ? (
          <>
           <div className="modal-overlay">
                <div className="modal-content2">
                    <div className="head-mode">
                            <h3>Provide Information</h3>
                            <button className="modal-close" onClick={hideModal}>
                                &times;
                            </button>
                    </div>
                    <div className="modal-body">
                        <form className='w-100' onSubmit={handleSubmit}>
                            <p className='mb-3' style={{color: '#FF962E'}}>Customer Bio</p>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="customer">Name</label>
                                        <input type="text" name="name" placeholder='cyril' className='w-100' value={name} onChange={handleChange}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="customer">Email</label>
                                        <input type="email" name="email" placeholder='cyril@gmail.com' className='w-100' value={email} onChange={handleChange}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                                    <div className="form-group">
                                        <label htmlFor="customer">Phone Number</label>
                                        <input type="text" name="phone" placeholder='091234567' className='w-100' value={phone} onChange={handleChange}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                                    <div className="form-group">
                                        <label htmlFor="customer">Amount</label>
                                        <input type="text" name=""  className='w-100' value={Math.round(total)} disabled/>
                                    </div>
                                </div>
                            </div>
                            <div>
                              <p className='my-5' style={{color: '#FF962E'}}>Delivery Details</p>
                            
                            </div>
                            

                            <div className="form-check form-check-inline">
                            <input
                              type="radio"
                              name="deliveryOption"
                              value="pickup"
                              checked={deliveryOption === 'pickup'}
                              onChange={handleOptionChange}
                              className="lint"
                            />

                              <label className="form-check-label" for="inlineRadio1">pick up</label>
                            </div>
                            <div className="form-check form-check-inline">
                            <input
                              type="radio"
                              name="deliveryOption"
                              value="delivery"
                              checked={deliveryOption === 'delivery'}
                              onChange={handleOptionChange}
                              className="lint"
                            />

                              <label className="form-check-label" for="inlineRadio2">Delivery</label>
                            </div>

                            {sd ? (
                              <>
                                <div className="row">
                                  <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                                      <div className="form-group">
                                          <label htmlFor="customer">Country</label>
                                          {/* <input type="text" name="country" placeholder='Nigeria' className='w-100' value={country} onChange={handleChange}/> */}
                                          <select name="country" id="" value={country} onChange={handleChange}>
                                            <option>--choose country--</option>
                                            {countryData.data.map((country, index) => 
                                              <option key={index} value={country.name}>{country.name}</option>
                                            )}
                                          </select>
                                      </div>
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                                    <div className="form-group">
                                      <label htmlFor="customer">State</label>
                                      <select name="state" id="" value={state} onChange={handleChange}>
                                        <option>--choose state--</option>
                                        {st.map((item, index) => {
                                          // Remove "State" and make the first character lowercase
                                          const formattedName = item.name.replace(/state/i, '').trim();
                                          const displayName = formattedName.charAt(0).toLowerCase() + formattedName.slice(1);
                                          
                                          return (
                                            <option key={index} value={displayName}>{displayName}</option>
                                          );
                                        })}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                                      <div className="form-group">
                                          <label htmlFor="customer">Address</label>
                                          <input type="text" name="address" className='w-100' value={address} onChange={handleChange}/>
                                      </div>
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                                      <div className="form-group">
                                          <label htmlFor="customer">Nearest Landmark</label>
                                          {/* <input type="text" name="landmark" className='w-100' value={landmark} onChange={handleChange}/> */}
                                          <select name="landmark" id="" value={landmark} onChange={handleChange}>
                                          <option>--choose landmark--</option>
                                          {land.map((ln, index) => 
                                            <option 
                                              key={index} 
                                              value={`${ln.landmark_name}-${ln.landmark_price}`}
                                            >
                                              {`${ln.landmark_name} - ${ln.landmark_price}`}
                                            </option>
                                          )}
                                        </select>
                                      </div>
                                  </div>
                              </div>
                              </>
                            ) : ('')}
                            
                            <p className='my-3' style={{color: '#FF962E'}}>Others</p>
                            <div className="row">
                                    <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                                        <div className="form-group">
                                            <label htmlFor="customer">Payment Method</label>
                                            <input type="text" name="payment" className='w-100' value={payment} onChange={handleChange}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                                        <div className="form-group">
                                            <label htmlFor="customer">Additional Information</label>
                                            <input type="text" name="additional" className='w-100' value={additional} onChange={handleChange}/>
                                        </div>
                                    </div>
                            </div>
                            <button className='log-btn mt-3'>
                                {
                                    spinItem ?(
                                        <>
                                        <div className="spinner-border spinner-border-sm text-light" role="status">
                                            <span className="sr-only"></span>
                                        </div>
                                        <span>Sending... </span>
                                        </>
                                        
                                    ): (
                                        'Send Details'
                                    )
                                }
                            </button>
                        </form>
                    </div>
                </div>
           </div>
          </>
      ) : ''}
      
    </>
  );
};

export default Cart;


