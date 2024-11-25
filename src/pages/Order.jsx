import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrder, fetchDetails, updateStatus, clearStatusUpdate, allInvoice, setOrderPage, setInvoicePage } from '../features/orderSlice';
import { getInvoiceData } from '../features/commerceSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCaretRight, 
    faCalendar, 
    faUserAlt, 
    faEnvelope, 
    faMobile, 
    faUserCheck,
    faListAlt,
    faEdit
 } from '@fortawesome/free-solid-svg-icons';
 import Swal from 'sweetalert2';
 import Commerce from './support/Commerce';
 import { Carousel } from 'react-bootstrap';


const Order = () => {
  const [show, setShow] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [productView, setProductView] = useState(true);
  const [showInvoice, setShowInvoice] = useState(true);
  const [view, setView] = React.useState('orders');
  const [showButton, setShowButton] = useState(true);
  const [vi, setVi] = useState(false);
  const [activeButton, setActiveButton] = useState('');
  const [filterText, setFilterText] = useState('');

  const dispatch = useDispatch();
  const { order, currentPage, total_pages, isLoading, error, orderDetails, success, order_id, delivery_status, invoicedata, orderCurrentPage,
    orderTotalPages,
    invoiceCurrentPage,
    invoiceTotalPages, } = useSelector((state) => state.order);
    const { invoiceData } = useSelector((state) => state.commerce)

  const token = localStorage.getItem("key");
  const moid = localStorage.getItem("moid");


  // useEffect(() => {
  //   if (token) {
  //     dispatch(getOrder({ page: currentPage, token }));
  //   }
  // }, [dispatch, currentPage, token]);

  useEffect(() => {
    if (view === 'orders') {
      dispatch(getOrder({ token, page: orderCurrentPage }));
    } else if (view === 'invoices') {
      dispatch(allInvoice({ token, page: invoiceCurrentPage }));
    }
  }, [dispatch, token, view, orderCurrentPage, invoiceCurrentPage]);




  const viewDetails = (id) => {
    setShow(false);
    setShowButton(false);
    dispatch(fetchDetails({ token, id }));
  };

  
  const handlePageChange = (page) => {
    if (view === 'orders') {
      dispatch(setOrderPage(page));
    } else if (view === 'invoices') {
      dispatch(setInvoicePage(page));
    }
  };

  



  // const handleViewChange = (view) => {
  //   setProductView(view); // Update view and fetch data accordingly
  // };

     
    

  const hideModal = () => {
    setModalVisible(false);
    setDeliveryStatus('');
    setVi(false);
  };

  const handleStatusChange = (e) => {
    setDeliveryStatus(e.target.value);
  };

  const changeView = () => {
    setShow(true);
    setShowButton(true);
  }

  const changeProduct = () => {
    setProductView(true);
  }


  const displayModal = (id) => {
    console.log(id)
    localStorage.setItem('moid', id);
    setModalVisible(true);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (deliveryStatus) { 
      dispatch(updateStatus({ order_id: moid, delivery_status: deliveryStatus, token }));
      hideModal();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Please select a status',
        showConfirmButton: true,
      });
    }
  };


  useEffect(() => {
    if (success) {
      Swal.fire({
        icon: 'success',
        title: 'Order status updated successfully!',
        showConfirmButton: false,
        timer: 1500
      });

      setModalVisible(false);
      setShow(true);

      dispatch(clearStatusUpdate());
      dispatch(getOrder({ page: currentPage, token }));
    }
  }, [success, dispatch, currentPage, token]);

  const ecom = () => {
    setProductView(false)
  }

  const evoice = (e) => {
    e.preventDefault();
    setActiveButton('viewInvoices');
    if (token) {
      dispatch(allInvoice({token}));
      setShowInvoice(false)
    }
  }

  const ivoice = () => {
    setShowInvoice(true);
    setActiveButton('viewOrders');
  }

  const idetails = (id) => {
    setVi(true);
    dispatch(getInvoiceData({token, invoice_id: id}))
  }

  const filteredOrders = order.filter((item) =>
  (item.order_id && item.order_id.toLowerCase().includes(filterText.toLowerCase())) ||
  (item.amount_paid && item.amount_paid.toString().includes(filterText)) ||
  (item.payment_method && item.payment_method.toLowerCase().includes(filterText.toLowerCase())) ||
  (item.date && item.date.includes(filterText)) ||
  (item.date_delivered && item.date_delivered.includes(filterText)) ||
  (item.payment_status && item.payment_status.includes(filterText))
);



  return (
    <>
    {productView ? (
      <>
      {showButton ? (
        <div className="my-2 mt-lg-3">
          <input type="text" placeholder="Search Order..." className="search-input" value={filterText} onChange={(e) => setFilterText(e.target.value)}/>
          <button className={`or-btn my-3 mx-lg-1 ${activeButton === 'viewOrders' ? 'active-btn' : ''}`} onClick={ivoice}>View Orders</button>
          <button className={`or-btn my-3 mx-lg-1 ${activeButton === 'viewInvoices' ? 'active-btn' : ''}`} onClick={evoice}>View All Invoice</button>
          <button className='pro-btn my-3 mx-lg-5' onClick={ecom}>Create Manual Order</button>
        </div>
        ) : ''}
       
        {show ? (
        isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error?.message || 'Something went wrong'}</div>
        ) : (
          <>
          {showInvoice ? (
          <>

          <div className="table-container">
            <table className="my-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Amount Paid</th>
                  <th>Payment Method</th>
                  <th>Date</th>
                  <th>Date Delivered</th>
                  <th>Delivery Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders && filteredOrders.length > 0 ? (
                  filteredOrders.map((item) => (
                    <tr key={item.id} onClick={() => viewDetails(item.id)} style={{cursor: 'pointer'}}>
                      <td>{item.order_id}</td>
                      <td>₦{Number(item.amount_paid).toLocaleString()}</td>
                      <td>{item.payment_method}</td>
                      <td>{item.date}</td>
                      <td>{item.date_delivered}</td>
                      <td>
                        <button className={item.payment_status}>
                          {item.payment_status}
                        </button>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}><FontAwesomeIcon icon={faEdit} onClick={() => displayModal(item.id)}/></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11">No order available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
            
            {view === 'orders' && orderTotalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: orderTotalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    disabled={orderCurrentPage === i + 1}
                    className="mx-1"
                    style={{
                      backgroundColor: '#FF962E',
                      borderRadius: '10px',
                      border: '0',
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}

          </>
          ) : (
          <>
              <div className="table-container">
                <table className="my-table">
                  <thead>
                    <tr>
                      <th>Invoice Number</th>
                      <th>Customer Name</th>
                      <th>Customer Email</th>
                      <th>Phone Number</th>
                      <th>Delivery Country</th>
                      <th>Delivery State</th>
                      <th>Delivery Address</th>
                      <th>Delivery Landmark</th>
                      <th>Amount Paid</th>
                      <th>Date</th>
                      <th>Invoice Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoicedata && invoicedata.length > 0 ? (
                      invoicedata.map((item) => (
                        <tr key={item.id} onClick={() => idetails(item.invoicenumber)}>
                          <td>{item.invoicenumber}</td>
                          <td>{item.customer_name}</td>
                          <td>{item.customer_email}</td>
                          <td>{item.customer_phonenumber}</td>
                          <td>{item.delivery_country}</td>
                          <td>{item.delivery_state}</td>
                          <td>{item.delivery_address}</td>
                          <td>{item.delivery_landmark}</td>
                          <td>₦{Number(item.amount_paid).toLocaleString()}</td>
                          <td>{item.date}</td>
                          <td>{item.invoice_status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="11">No Invoice available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            {view === 'invoices' && invoiceTotalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: invoiceTotalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    disabled={invoiceCurrentPage === i + 1}
                    className="mx-1"
                    style={{
                      backgroundColor: '#FF962E',
                      borderRadius: '10px',
                      border: '0',
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
          )}
            
          </>
        )
      ) : (
          <>
            <div className='d-flex gap-2 mt-5 mt-lg-3'>
                <p style={{color: '#FF962E', cursor: 'pointer'}} onClick={changeView}>Order</p>
                <p style={{color: '#6E7079'}}><FontAwesomeIcon icon={faCaretRight} style={{color: '#C2C6CE'}}/> View Details</p>
            </div>

            <div className="row mb-4">
              <div className="col-sm-12 col-md-12 col-lg-6" style={{borderRight: '1px solid #FF962E', borderRadius: '20px'}}>
                <div>
                  <div className='d-flex justify-content-between'>
                      <p>Delivery Date:</p>
                      <div className='d-flex'>
                          <FontAwesomeIcon icon={faCalendar} style={{color: '#FF962E'}}/>
                          <p className='cc mx-2'>{orderDetails.date}</p>
                      </div>
                  </div>
                  <div className='d-flex justify-content-between'>
                      <p>Order Number:</p>
                      <div className='d-flex'>
                          <FontAwesomeIcon icon={faListAlt} style={{color: '#FF962E'}}/>
                          <p className='cc mx-2'>{orderDetails.order_id}</p>
                      </div>
                  </div>
                  <div className='d-flex justify-content-between'>
                      <p>Payment Status:</p>
                      <p className='cc'>{orderDetails.payment_status}</p>
                  </div>
                  <div className='d-flex justify-content-between'>
                      <p>Payment Method:</p>
                      <p className='cc'>{orderDetails.payment_method}</p>
                  </div>

                  <div className='d-flex justify-content-between'>
                      <p>Order Status:</p>
                      <p className={orderDetails.delivery_status}>{orderDetails.delivery_status}</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-12 offset-lg-1 col-lg-5">
                <h5 className='text-center'>Ordered By</h5>
                <div className='d-flex justify-content-between'>
                  <p><FontAwesomeIcon icon={faUserAlt} style={{color: '#FF962E'}}/></p>
                  <small>{orderDetails?.ordered_by?.name}</small>
                </div>
                <div className='d-flex justify-content-between'>
                  <p><FontAwesomeIcon icon={faEnvelope} style={{color: '#FF962E'}}/></p>
                  <small>{orderDetails?.ordered_by?.email}</small>
                </div>
                <div className='d-flex justify-content-between'>
                  <p><FontAwesomeIcon icon={faMobile} style={{color: '#FF962E'}}/></p>
                  <small>{orderDetails?.ordered_by?.phone_number}</small>
                </div>
                
                <div className='d-flex justify-content-between'>
                    <p><FontAwesomeIcon icon={faUserCheck} style={{color: '#FF962E'}}/></p>
                    <small className={
                      orderDetails?.ordered_by?.account_status === 0 ? 'Inactive' : 'Active'
                    }>{orderDetails?.ordered_by?.account_status === 0 ? 'Inactive' : 'Active'}</small>
                </div>
              </div>
            </div>

              {orderDetails?.product?.map((image, index) => 
                <div key={index} className="d-flex justify-content-between">
                  {image.images?.map((img) =>
                    <img src={img.filename} alt="Thumbnail" className="img-thumbnail w-25 p-3"/> 
                  )}
                </div>
              )}

              <div className="table-container">
              <table className="my-table my-5">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Product Amount</th>
                  <th>Initial Amount</th>
                  <th>Inches</th>
                  <th>Quantity</th>
                  <th>Discounted</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails?.product?.map((order) =>
                  <tr>
                    <td>{order.category_name}</td>
                    <td>₦{Number(order.product_amount).toLocaleString()}</td>
                    <td>₦{Number(order.initial_amount).toLocaleString()}</td>
                    <td>{order.inches}</td>
                    <td>{order.order_quantity}</td>
                    <td>{order.discounted === 0 ? "No" : "Yes"}</td>
                  </tr> 
                )}
              </tbody>
            </table>
              </div>
          </>
      )}

      {modalVisible ? (
          <div className="modal-overlay">
            <div className="modal-content2">
                <div className="head-mode">
                    <h3>Change Status</h3>
                    <button className="modal-close" onClick={hideModal}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <form style={{width: '100%'}} onSubmit={handleSubmit}>
                        <div className="form-group mb-4">
                            <label>Select Status</label>
                            <select className='w-100' name='delivery_status' value={deliveryStatus} onChange={handleStatusChange}>
                                <option value="">--Choose Option--</option>
                                <option value="processing">Processing</option>
                                <option value="out for delivery">Out for delivery</option>
                                <option value="delivered">Delivered</option>
                            </select>
                            <button className='log-btn mt-3'>update status</button>
                        </div>
                    </form>
                </div>
            </div>
          </div>
      ) : ''}
      </>

    ) : (
      <>
       <div className='d-flex gap-2 mt-5 mt-lg-3'>
          <p style={{color: '#FF962E', cursor: 'pointer'}} onClick={changeProduct}>Order</p>
          <p style={{color: '#6E7079'}}><FontAwesomeIcon icon={faCaretRight} style={{color: '#C2C6CE'}}/> View Products</p>
        </div>
      <Commerce />
      </>
    )}

    {vi ? (
      <>
      <div className="modal-overlay">
        <div className="modal-content2" style={{ width: '900px' }}>
          <div className="head-mode">
            <h3>Invoice Details</h3>
            <button className="modal-close" onClick={hideModal}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error: {error?.message || 'Something went wrong'}</div>
            ) : (
              <div>
                <div className="table-container">
                  <table className="my-table">
                    <thead>
                      <tr>
                        <th>Customer Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Product Amount</th>
                        <th>Order Quantity</th>
                        <th>Discounted</th>
                        <th>Initial Amount</th>
                        <th>Images</th>
                        <th>Amount Paid</th>
                        <th>Delivery State</th>
                        <th>Landmark</th>
                        <th>Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData?.products?.map((product, index) => (
                        <tr key={index}>
                          {index === 0 && (
                            <>
                              <td rowSpan={invoiceData.products.length}>
                                {invoiceData.customer_name}
                              </td>
                              <td rowSpan={invoiceData.products.length}>
                                {invoiceData.customer_email}
                              </td>
                              <td rowSpan={invoiceData.products.length}>
                                {invoiceData.customer_phonenumber}
                              </td>
                            </>
                          )}
                          <td>₦{Number(product.product_amount).toLocaleString()}</td>
                          <td>{product.order_quantity}</td>
                          <td>₦{Number(product.discounted).toLocaleString()}</td>
                          <td>₦{Number(product.initial_amount).toLocaleString()}</td>
                          <td>
                            <Carousel indicators={false}>
                              {product.images.map((image, imgIndex) => (
                                <Carousel.Item key={imgIndex}>
                                  <img
                                    src={image.filename}
                                    alt={`Product Image ${imgIndex + 1}`}
                                    style={{
                                      width: '100px',
                                      height: 'auto',
                                      borderRadius: '5px',
                                      objectFit: 'cover',
                                    }}
                                  />
                                </Carousel.Item>
                              ))}
                            </Carousel>
                          </td>
                          {index === 0 && (
                            <>
                              <td rowSpan={invoiceData.products.length}>
                                ₦{Number(invoiceData.amount_paid).toLocaleString()}
                              </td>
                              <td rowSpan={invoiceData.products.length}>
                                {invoiceData.delivery_state}
                              </td>
                              <td rowSpan={invoiceData.products.length}>
                                {invoiceData.delivery_landmark}
                              </td>
                              <td rowSpan={invoiceData.products.length}>
                                {invoiceData.delivery_address}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                      {invoiceData?.products?.length === 0 && (
                        <tr>
                          <td colSpan="12" className="text-center">
                            No products found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      </>
    ) : ''}
      
    </>
  );
};

export default Order;


