import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCalendar, faUserAlt, faEnvelope, faMobile } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, disableUser, getUserOrder, setOrderUsersPage, getOrderDetails } from '../features/customerSlice';


const Customer = () => {
  const [enable, setEnable] = useState(true);
  const [disable, setDisable] = useState(true);
  const [background, setBackground] = useState('all');
  const [more, setMore] = useState(true);
  const [myModal, setMyModal] = useState(false);


  const dispatch = useDispatch();
  const { 
    fetchAllUsers, 
    isLoading, 
    total_pages, 
    currentPage, 
    error, 
    user_id,
    orderUsersPage,
    orderUsersTotalPages,
    userOrders,
    order_id,
    orderDetails
  } = useSelector((state) => state.customers);

  let token = localStorage.getItem("key");

  useEffect(() => {
    if (token) {
      dispatch(getUsers({ token, page: currentPage }));
    }
  }, [dispatch, currentPage, token]);

  const handleButtonClick = (status) => {
    setBackground(status);  
  };

  const handlePageChange = (page) => {
    if (currentPage !== page) {
      dispatch(setPage(page));
      if (more) {
        dispatch(getUsers({ token, page: currentPage }));
      }
    }
  };

  const handleViewOrdersPageChange = (page) => {
    if (orderUsersPage !== page && id) {
      dispatch(setOrderUsersPage(page));
      dispatch(getUserOrder({ token, user_id: id, page }));
    }
  };

  const hideModal = () => {
    setMyModal(false);
  };

  const callDetails = (id) => {
    console.log(id);
    setMyModal(true);
    dispatch(getOrderDetails({token, order_id: id}))
  }

  const filterUser = fetchAllUsers.filter(user => {
    if (background === 'all') return true;
    if (background === 'Active') return user.account_status === 1;
    if (background === 'Blocked') return user.account_status === 0;
    return false;
  });

  const switchStatus = (id, token) => {
    console.log(id)
    if (token) {
      dispatch(disableUser({token, user_id: id}))
      .then((result) => {
        if (result.type === 'customers/disableUser/fulfilled') {
          dispatch(getUsers({ token, page: 1 }));
          Swal.fire({
            title: "Success",
            text: "User Blocked successfully!",
            icon: "success",
            button: "OK",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: "Something went wrong while blocking a user!",
          icon: "error",
          confirmButtonText: "OK"
        });
      });
    }
  }

  const renderPagination = () => {
    if (!isLoading && total_pages > 1) {
      return (
        <div className="pagination">
          {Array.from({ length: total_pages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              disabled={currentPage === i + 1}
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
      );
    }
    return null;
  };

  const renderViewOrdersPagination = () => {
    if (!isLoading && orderUsersTotalPages > 1) {
      return (
        <div className="pagination">
          {Array.from({ length: orderUsersTotalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handleViewOrdersPageChange(i + 1)}
              disabled={orderUsersPage === i + 1}
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
      );
    }
    return null;
  };

  const myOrders = (id) => {
    console.log(id)
    setMore(false);
    dispatch(getUserOrder({token, user_id: id}))
  }

  const goBack = () => {
    setMore(true);
    dispatch(getUserOrder({token, user_id: id}))
  }

  return (
    <>
    {more ? (
      <>
        <div className="d-flex justify-content-between mt-5 mb-4 mt-lg-3 mb-lg-4">
        <div className="sts-btn p-2">
          <button
            onClick={() => { 
                handleButtonClick('all');
                setDisable(true)
                setEnable(true)
            }}
            style={{
              backgroundColor: background === 'all' ? '#f6e7d7' : '#fff',
              color: background === 'all' ? '#FF962E' : 'black',
              border: '0',
            }}
          >
            All Customers
          </button>
          <button
            onClick={() => {
              handleButtonClick('Active');
              setDisable(true)
              setEnable(false)
            }}
            style={{
              backgroundColor: background === 'Active' ? '#f6e7d7' : '#FFF',
              color: background === 'Active' ? '#FF962E' : '#6E7079',
              border: '0',
            }}
          >
            Active
          </button>
          <button
            onClick={() => {
              handleButtonClick('Blocked');
              setDisable(false)
              setEnable(true)
            }}
            style={{
              backgroundColor: background === 'Blocked' ? '#f6e7d7' : '#FFF',
              color: background === 'Blocked' ? '#FF962E' : '#6E7079',
              border: '0',
            }}
          >
            Block
          </button>
        </div>
        {/* <div>
            {enable ? (
              <button className='el2-btn'>Activate</button>
            ) : ''}

            {disable ? (
              <button className='el2-btn'>Dactivate</button>
            ) : ''}
        </div> */}
        </div>

        <div className="row">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error?.message || 'Something went wrong'}</div> 
          ) : (
            <>
            <div className="table-container">
              <table className="my-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Customer Email</th>
                    <th>Phone Number</th>
                    <th>Status</th>
                    <th>Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filterUser.map((fill) => (
                    <tr key={fill.id} onClick={() => myOrders(fill.id)} style={{cursor: 'pointer'}}>
                      <td>{fill.name}</td>
                      <td>{fill.email}</td>
                      <td>{fill.phone_number}</td>
                      <td className={fill.account_status === 1 ? 'Active' : 'Blocked'}>{fill.account_status === 1 ? 'Active' : 'Blocked'}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => {
                          switchStatus(fill.id, token)
                        }} className={fill.account_status === 1 ? 'deactivate' : 'activate'}>{fill.account_status === 1 ? 'Block' : 'Activate'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
              
            </>
          )
        }
        {renderPagination()}
        </div>
      </>
    ) : (
      <>
       <div className="order-details-section mt-5 mt-lg-0">
          <div className='d-flex gap-2 mt-3'>
            <p style={{color: '#FF962E', cursor: 'pointer'}} onClick={goBack}>Customer Management</p>
            <p style={{color: '#6E7079'}}><FontAwesomeIcon icon={faCaretRight} style={{color: '#C2C6CE'}}/> View Details</p>
          </div>

          <div className="table-container">
          <div className="order-details">
              {isLoading ? (
                <p>Loading orders...</p>
              ) : error ? (
                <p>Error: {error.message || 'Failed to load orders'}</p>
              ) : userOrders.length > 0 ? (
                <table className="my-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Payment Status</th>
                      <th>Payment Method</th>
                      <th>Amount Paid</th>
                      <th>Delivery Status</th>
                      <th>Order Number</th>
                      <th>Date Delivered</th>
                      <th>Additional Info</th>
                      <th>Delivery Country</th>
                      <th>Delivery State</th>
                      <th>Delivery Address</th>
                      <th>Products</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders.map((user) => (
                      <React.Fragment key={user.id}>
                        <tr onClick={() => callDetails(user.id)}>
                          <td>{user.date}</td>
                          <td>{user.payment_status}</td>
                          <td>{user.payment_method}</td>
                          <td>₦{Number(user.amount_paid).toLocaleString()}</td>
                          {/* <td>{user.delivery_status}</td> */}
                          <td className={`status-${user.delivery_status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {user.delivery_status}
                          </td>
                          <td>{user.order_id}</td>
                          <td>{user.date_delivered}</td>
                          <td>{user.additional_information}</td>
                          <td>{user.delivery_country}</td>
                          <td>{user.delivery_state}</td>
                          <td>{user.delivery_address}</td>
                          <td>
                            {user.product && JSON.parse(user.product).length > 0 ? (
                              <table className="product-table">
                                <thead>
                                  <tr>
                                    <th>Product Amount</th>
                                    <th>Initial Amount</th>
                                    <th>Discounted</th>
                                    <th>Inches</th>
                                    <th>Order Quantity</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {JSON.parse(user.product).map((prod, index) => (
                                    <tr key={index}>
                                      <td>₦{Number(prod.product_amount).toLocaleString()}</td>
                                      <td>₦{Number(prod.initial_amount).toLocaleString()}</td>
                                      <td>{prod.discounted ? 'Yes' : 'No'}</td>
                                      <td>{prod.inches}</td>
                                      <td>{prod.order_quantity}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p>No product record found</p>
                            )}
                          </td>
                        </tr>
                        {/* <tr>
                          <td colSpan="12" className="view-details-cell">
                            <button className="pro-btn" onClick={() => callDetails(user.id)}>
                              View Order Details
                            </button>
                          </td>
                        </tr> */}
                        <tr>
                          <td colSpan="12">
                            <hr style={{ border: '1px solid #FF962E' }} />
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">No order available for this user.</p>
              )}
          </div>
          </div>
          

          {renderViewOrdersPagination()}
       </div>
      </>
       )}

       {myModal ? (
         <>
           <div className="modal-overlay">
              <div className="modal-content2">
                <div className="head-mode">
                  <h3> Order Details</h3>
                  <button className="modal-close" onClick={hideModal}>
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                {isLoading ? (
                  <p>Loading orders...</p>
                ) : error ? (
                  <p>Error: {error.message || 'Failed to load details'}</p>
                ) : orderDetails && orderDetails.product && orderDetails.product.length > 0 ? (
                  <>
                    <div className='d-flex mt-3'>
                      <p><b>Order ID:</b></p>
                      <p style={{color: '#FF962E', marginLeft: '20px'}}>{orderDetails.order_id}</p>
                    </div>
                    <h4 className='text-center mb-4'>User Information</h4>
                    <div className="row">
                      <div className="col-sm-12 col-md-12 col-lg-5 p-3" style={{borderRight: '2px solid #FF962E', borderRadius: '20px'}}>
                        <div className='d-flex justify-content-between'>
                          <FontAwesomeIcon icon={faUserAlt} style={{color: '#FF962E'}}/>
                          <p>{orderDetails.ordered_by.name}</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                          <FontAwesomeIcon icon={faEnvelope} style={{color: '#FF962E'}}/>
                          <p>{orderDetails.ordered_by.email}</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                          <FontAwesomeIcon icon={faMobile} style={{color: '#FF962E'}}/>
                          <p>{orderDetails.ordered_by.phone_number}</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                          <FontAwesomeIcon icon={faCalendar} style={{color: '#FF962E'}}/>
                          <p>{orderDetails.date}</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                          <p>Account Status:</p>
                          <p className={orderDetails.ordered_by.account_status === 0 ? 'inactive' : 'active'}>{orderDetails.ordered_by.account_status === 0 ? 'inactive' : 'active'}</p>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 offset-lg-1 col-lg-6 p-3">
                        <div className='d-flex justify-content-between'>
                          <p>Amount Paid:</p>
                          <p>₦{orderDetails.amount_paid}</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                          <p>Delivery Status:</p>
                          <p>{orderDetails.delivery_status}</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                          <p>Payment Status:</p>
                          <p className={orderDetails.payment_status}>{orderDetails.payment_status}</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                          <p>Payment Method:</p>
                          <p>{orderDetails.payment_method}</p>
                        </div>
                      </div>
                    </div>
                    <h4 className='text-center mb-4 mt-4'>Product Information</h4>
                    <div className="table-container">
                      <table className="my-table">
                          <thead>
                            <tr>
                              <th>Product Amount</th>
                              <th>Initial Amount</th>
                              <th>Discounted</th>
                              <th>Inches</th>
                              <th>Order Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                              {orderDetails.product && orderDetails.product.length > 0 ? (
                                orderDetails.product.map((prod, index) =>
                                  <tr key={index}>
                                    <td>₦{Number(prod.product_amount).toLocaleString()}</td>
                                    <td>₦{Number(prod.initial_amount).toLocaleString()}</td>
                                    <td>{prod.discounted ? 'Yes' : 'No'}</td>
                                    <td>{prod.inches}</td>
                                    <td>{prod.order_quantity}</td>
                                  </tr> 
                                )
                              ) : (
                                <p className='text-center'>No product record found</p>
                              )}
                          </tbody>
                      </table>
                    </div>
                    
                    {orderDetails.product.map((prod, index) => (
                    <div key={index}>
                      <div className="images mt-5">
                        <div className="row">
                          {prod.images.map((img, imgIndex) => (
                            <div className="col-sm-12 col-md-12 col-lg-4">
                              <img key={imgIndex} src={img.filename} alt={`Product image ${imgIndex + 1}`} className="w-100"/>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    ))}
                    <h5 className='text-center mt-5'>Delivery Information</h5>
                    <div className='d-flex justify-content-between mb-3'>
                      <p>Delivery Country:</p>
                      <small className='w-75'>{orderDetails.delivery_country}</small>
                    </div>
                    <div className='d-flex justify-content-between mb-3'>
                      <p>Delivery State:</p>
                      <small className='w-75'>{orderDetails.delivery_state}</small>
                    </div>
                    <div className='d-flex justify-content-between mb-3'>
                      <p>Delivery Address:</p>
                      <small className='w-75'>{orderDetails.delivery_address}</small>
                    </div>
                    <div className='d-flex justify-content-between'>
                      <p>Delivery Landmark:</p>
                      <small className='w-75'>{orderDetails.delivery_landmark}</small>
                    </div>

                  </>
                ) : (
                  <p className="text-center">No product record found</p>
                )}
                </div>
              </div>
            </div>
         </>
       ) : ''}
       
    </>
  )
}

export default Customer
