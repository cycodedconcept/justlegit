import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getOrder, fetchDetails } from '../features/orderSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendar, 
    faUserAlt, 
    faEnvelope, 
    faMobile, 
    faUserCheck,
    faListAlt,
 } from '@fortawesome/free-solid-svg-icons';
import './pages.css'

const Wig = () => {

  const [modalv, setModalv] = useState(false);

  const token = localStorage.getItem("key");
  const dispatch = useDispatch();
  const { order, currentPage, total_pages, isLoading, error, orderDetails } = useSelector((state) => state.order);

  useEffect(() => {
    if (token) {
      dispatch(getOrder({ page: currentPage, token }));
    }
  }, [dispatch, currentPage, token]);

  const handlePageChange = (page) => {
    dispatch(getOrder({ page, token }));
  };

  const hideModal = () => {
    setModalv(false)
  }

  const oDetails = (id) => {
    console.log(id);
    if (token) {
      dispatch(fetchDetails({ token, id }));
      setModalv(true)
    }
  }

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
        ) : error ? (
            <div>Error: {error?.message || 'Something went wrong'}</div>
        ) : !order || order?.length === 0 ? ( 
            <div>No Records Found</div>
        ) : (
            <>
               {Array.isArray(order) && order.length > 0 ? (
                order.slice(0, 8).map((item, index) => 
                    <div className="row" key={index} onClick={() => oDetails(item.id)} style={{cursor: 'pointer'}}>
                    <div className="col-sm-12 col-md-12 col-lg-8">
                        <label htmlFor=""><b>Delivery Address</b></label>
                        <p>{item.delivery_address}</p>

                        <label htmlFor=""><b>Delivery Landmark</b></label>
                        <p>{item.delivery_landmark}</p>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-4">
                        <label htmlFor=""><b>Date Ordered</b></label>
                        <p>{item.date}</p>
                    </div>
                    {index !== order.slice(0, 5).length - 1 && (
                        <hr style={{border: '2px solid #FF962E'}} />
                    )}
                    </div> 
                )
                ) : (
                <div>No orders found</div>
                )}


            {total_pages > 1 && (
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
            )}
            </>
        )}

        {modalv ? (
          <>
            <div className="modal-overlay">
              <div className="modal-content2">
                <div className="head-mode">
                  <h3>Order Details</h3>
                  <button className="modal-close" onClick={hideModal}>
                    &times;
                  </button>
                </div>
                <div className="modal-body">
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
                </div>
              </div>
            </div>
          </>
        ) : ''}
        
    </>
  )
}

export default Wig
