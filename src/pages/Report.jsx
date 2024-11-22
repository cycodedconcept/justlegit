import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerReport } from '../features/reportSlice';

const Report = () => {
  let token = localStorage.getItem("key");
  const { isLoading, error, data} = useSelector((state) => state.report);
  const dispatch = useDispatch();

  const [customer, setCustomer] = useState(false);
  const [product, setProduct] = useState(false);
  const [order, setOrder] = useState(false);
  const [show, setShow] = useState(false);
  const [myValue, setMyValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setMyValue(value);

    setCustomer(false);
    setOrder(false);
    setProduct(false);
    
    
    setShow(false)
  }

  // const handleStatusChange = (e) => {
  //   const value = e.target.value;
  //   setMyValue(value);

  //   setCustomer(false);
  //   setOrder(false);
  //   setProduct(false);
    
  //   if (value === 'customers' && token) {
  //     setCustomer(true);
  //     dispatch(getCustomerReport({token, item: myValue}));
  //   }
  //   else if (value === 'orders' && token) {
  //     setOrder(true);
  //     dispatch(getCustomerReport({token, item: myValue}));
  //   }
  //   else if (value === 'products' && token) {
  //     dispatch(getCustomerReport({token, item: myValue}));
  //     setProduct(true);
  //   } 
  //   setShow(true)
  // }


  const getReport = (e) => {
    e.preventDefault();
    setShow(true);
    if (myValue === 'customers') {
      setCustomer(true);
    }
    else if (myValue === 'orders') {
      setOrder(true);
    }
    else if (myValue === 'products') {
      setProduct(true);
    }
    
    if (token) {
      dispatch(getCustomerReport({token, item: myValue}));
    }
  }
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data?.length / itemsPerPage);


  const downloadExcel = (data, sheetName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    
    saveAs(blob, `${sheetName}.xlsx`);
  };

  const customerData = currentItems?.map(item => ({
    "Name": item.name,
    "Email": item.email,
    "Phone Number": item.phone_number,
    "Status": item.account_status,
  }));

  const orderData = currentItems?.map(item => ({
    "Customer Name": item.customerName,
    "Delivery Date": item.date,
    "Payment Status": item.paymentStatus,
    "Payment Method": item.paymentMethod,
    "Total Amount": item.totalAmountPaid,
    "Order ID": item.orderId,
    "Date Delivered": item.dateDelivered,
    "Products Ordered": item.productsOrdered
      ?.map(product => 
        `Name: ${product.productName}, Price: ${product.productPrice}, Inches: ${product.inches}, Quantity: ${product.OrderQuantity}, Discounted: ${product.discounted}, Company: ${product.companyName}`
      )
      .join("\n") // Join products with a newline or any separator you prefer
  }));
  
  

  const productData = currentItems?.map(item => ({
    "Product Name": item.name,
    "Product Price": item.price,
    "Product Discount": item.discount,
    "Product Description": item.product_description,
    "Product Number": item.product_number,
    "Product Stock": item.stock,
    "Order Count": item.orderCount,
    "Date Added": item.date_added,
  }));

  return (
    <>
    <form style={{ width: '100%', padding: '0' }} onSubmit={getReport} className="mt-5 mt-lg-3">
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-4">
          <div className="form-group mb-4">
            <label>Select Report</label>
            <select className='w-100' name='report_type' value={myValue} onChange={handleStatusChange}>
              <option value="">--Choose Option--</option>
              <option value="customers">Customers</option>
              <option value="products">Products</option>
              <option value="orders">Orders</option>
            </select>
          </div>
        </div>
        <div className="col-sm-12 col-md-12 col-lg-4">
          <button className='pro-btn' style={{marginTop: '40px'}}>Get Report</button>
          
        </div>
        <div className="col-sm-12 col-md-12 col-lg-4">
        <div className="text-left" style={{marginTop: '40px'}}>
            {customer && (
              <button className='pro-btn' onClick={() => downloadExcel(customerData, 'Customers')}>
                <FontAwesomeIcon icon={faFileExcel} className="mx-2"/>Customers Export to Excel
              </button>
            )}

            {order && (
              <button className='pro-btn' onClick={() => downloadExcel(orderData, 'Orders')}>
                <FontAwesomeIcon icon={faFileExcel} className="mx-2"/>Orders Export to Excel
              </button>
            )}

            {product && (
              <button className='pro-btn' onClick={() => downloadExcel(productData, 'Products')}>
                <FontAwesomeIcon icon={faFileExcel} className="mx-2"/>Products Export to Excel
              </button>
            )}
          </div>
        </div>
      </div>
      </form>

      


      <div className='mt-5'>
      {show ? (
        <>
         {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error?.message || 'Something went wrong'}</div>
      ) : (
        <>
          {myValue === 'customers' && (
            <div className='table-container'>
              <table className="my-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems?.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.phone_number}</td>
                    <td>{item.account_status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No customers found</td>
                </tr>
              )}
            </tbody>
            </table>
            </div>
            
            
          )}

          {myValue === 'orders' && (
            <>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <>
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-6" style={{borderRight: '1px solid #FF962E', borderRadius: '20px' }}>
                    <div className='mb-3 d-flex justify-content-between'>
                      <p style={{color: '#FF962E'}}>Customer Name:</p>
                      <p>{item.customerName}</p>
                    </div>
                    <div className='mb-3 d-flex justify-content-between'>
                      <p style={{color: '#FF962E'}}>Delivery Date:</p>
                      <p>{item.date}</p>
                    </div>
                    <div className='mb-3 d-flex justify-content-between'>
                      <p style={{color: '#FF962E'}}>Payment Status:</p>
                      <button className={item.paymentStatus}>{item.paymentStatus}</button>
                    </div>
                    <div className='mb-3 d-flex justify-content-between'>
                      <p style={{color: '#FF962E'}}>Payment Method:</p>
                      <p>{item.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <div className="col-sm-12 col-md-12 col-lg-6">
                  <div className="d-flex justify-content-between mb-3">
                      <p>Delivery Country:</p>
                      <small style={{width: '200px'}}>{item.deliveryCountry}</small>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <p>Delivery State:</p>
                      <small style={{width: '200px'}}>{item.deliveryState}</small>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>Delivery Address:</p>
                      <small style={{width: '200px'}}>{item.deliveryAddress}</small>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <p>Delivery Process:</p>
                      <button className={item.deliveryStatus}>{item.deliveryStatus}</button>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                      <p>Total Amount:</p>
                      <small>₦{item.totalAmountPaid}</small>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                      <p>Order Id:</p>
                      <small>{item.orderId}</small>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                      <p>Date Delivered:</p>
                      <small>{item.dateDelivered}</small>
                    </div>
                  </div>
                </div>
                <div className="table-container">
                  <table className="my-table my-5">
                    <thead>
                      <tr>
                        <th style={{width: '250px', textAlign: 'left'}}>Product Name</th>
                        <th>Price</th>
                        <th>Inches</th>
                        <th>Quantity</th>
                        <th>Discounted</th>
                        <th>Company</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.productsOrdered.map((product, index) => 
                        <tr key={index}>
                          <td style={{width: '250px', textAlign: 'left'}}>{product.productName}</td>
                          <td>₦{Number(product.productPrice).toLocaleString()}</td>
                          <td>{product.inches}</td>
                          <td>{product.orderQuantity}</td>
                          <td>{product.discounted}</td>
                          <td>{product.companyName}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {index !== currentItems.length - 1 && (
                    <hr style={{border: '1px solid #FF962E'}}/>
                )}
                </>
              ))
            ) : (
              <tr>
                <td colSpan="4">No products found</td>
              </tr>
            )}
            </>
            
          )}

          {myValue === 'products' && (
            <div className="table-container">
                <table className="my-table">
                <thead>
                  <tr>
                    <th style={{width: '250px', textAlign: 'left'}}>Product Name</th>
                    <th>Product Price</th>
                    <th>Product Discount</th>
                    <th style={{width: '250px', textAlign: 'left'}}>Product Description</th>
                    <th>Product Number</th>
                    <th>Product Stock</th>
                    <th>Order Count</th>
                    <th>Product Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.length > 0 ? (
                    currentItems.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td style={{textAlign: 'left'}}>{item.name}</td>
                          <td>₦{item.price}</td>
                          <td>₦{item.discount}</td>
                          <td style={{textAlign: 'left'}}>{item.product_description}</td>
                          <td>{item.product_number}</td>
                          <td>{item.stock}</td>
                          <td>{item.orderCount}</td>
                          <td>{item.date_added}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="2">No orders found</td>
                    </tr>
                  )}
                </tbody>
                </table>
            </div>
            
            
          )}
          
          <div className='sticky-pagination'>
            {currentPage > 2 && <button 
            onClick={() => setCurrentPage(1)}
            className="mx-1"
            style={{
              backgroundColor: '#FF962E',
              borderRadius: '10px',
              border: '0',
            }}
            >1</button>}
            {currentPage > 3 && <span>...</span>}

            {Array.from({ length: totalPages }, (_, i) => {
              if (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1) {
                return (
                  <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)}
                  className="mx-1"
                  disabled={currentPage === i + 1}
                  style={{
                    backgroundColor: '#FF962E',
                    borderRadius: '10px',
                    border: '0',
                  }}
                  >
                    {i + 1}
                  </button>
                );
              }
              return null;
            })}

            {currentPage < totalPages - 2 && <span>...</span>}
            {currentPage < totalPages - 1 && (
              <button 
              onClick={() => setCurrentPage(totalPages)}
              className="mx-1"
              style={{
                backgroundColor: '#FF962E',
                borderRadius: '10px',
                border: '0',
              }}
              >{totalPages}</button>
            )}
          </div>

        </>
      )}
        </>
      ): ''}
      </div>

      
    </>
  )
}

export default Report
