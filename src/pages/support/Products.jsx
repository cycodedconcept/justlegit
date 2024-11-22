import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Category from './Category';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchAllProducts, 
    setPage, 
    selectProducts, 
    selectCurrentPage, 
    selectTotalPages, 
    selectIsLoading, 
    selectError,
    selectProductDetails,
    getProductDetails,
    updateProduct,
    changeStatus
} from '../../features/allProductSlice';

const Products = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [vimode, setVimode] = useState(false)
  const [inputValues, setInputValues] = useState({
    productName: '',
    price: '',
    discount: '',
    stock: '',
    status: '',
    productDescription: '',
    category: ''
  });
  const [categoryId, setCategoryId] = useState('');

  const dispatch = useDispatch();

  const products = useSelector(selectProducts);
  const currentPage = useSelector(selectCurrentPage);
  const total_pages = useSelector(selectTotalPages);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const productDetails = useSelector(selectProductDetails);

  const [inputGroups, setInputGroups] = useState([
    { input1: '', input2: '', input3: '' },
  ]);

  const handleAddInputGroup = (e) => {
    e.preventDefault();
    setInputGroups([...inputGroups, { inche: '', price: '', discount: '' }]);
  };
  

  const handleRemoveInputGroup = (index) => {
    const newInputGroups = [...inputGroups];
    newInputGroups.splice(index, 1);
    setInputGroups(newInputGroups);
  };

  let token = localStorage.getItem("key");

  useEffect(() => {
    if (token) {
      dispatch(fetchAllProducts({ page: currentPage, token }));
    }
  }, [dispatch, currentPage, token]);

  useEffect(() => {
    if (productDetails) {
      setInputValues({
        productName: productDetails.product_name || '',
        price: productDetails.main_price || '',
        discount: productDetails.main_price_discount || '',
        stock: productDetails.stock || '',
        status: productDetails.status || '',
        productDescription: productDetails.product_description || '',
        category: productDetails.category_id || '',
      });
    }
    if (productDetails.inches) {
      setInputGroups(
        productDetails.inches.map((inch) => ({
          inche: inch.inche || '', 
          price: inch.price || '',
          discount: inch.discount || ''
        }))
      );
    }
    
  }, [productDetails]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      dispatch(setPage(page));
    }
  };

  const showTheModal = (id, token) => {
    localStorage.setItem('product', id);
    setModalVisible(true);
    dispatch(getProductDetails({ id, token }));
  };

  const switchStatus = (id, token) => {
    console.log(id)
    dispatch(changeStatus({id, token})).then(() => {
      Swal.fire({
        title: "Success",
        text: "Status changed successfully!",
        icon: "success",
        button: "OK",
      })
    })
    .catch((error) => {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong while updating the product!",
        icon: "error",
        confirmButtonText: "OK"
      });
    });
  }

  const hideModal = () => {
    setModalVisible(false);
    setVimode(false)
  };

  const updateDetails = (e) => {
    e.preventDefault();

    const getId = localStorage.getItem("product");

    const formData = new FormData();

    formData.append('product_name', inputValues.productName);
    formData.append('price', inputValues.price);
    formData.append('product_description', inputValues.productDescription);
    formData.append('discount', inputValues.discount);
    formData.append('stock', inputValues.stock);
    formData.append('category_id', categoryId);
    formData.append('inches', JSON.stringify(inputGroups));
    formData.append('status', inputValues.status);
    formData.append('product_id', getId);


    dispatch(updateProduct({formData, token})).then(() => {
      Swal.fire({
        title: "Success",
        text: "Product updated successfully!",
        icon: "success",
        button: "OK",
      })
    })
    .then(() => {
      hideModal();
    })
    .catch((error) => {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong while updating the product!",
        icon: "error",
        confirmButtonText: "OK"
      });
    });
  };

  const handleCategoryChange = (category) => {
    setInputValues({ ...inputValues, category });
  };

  const myProductDetails = (id) => {
    setVimode(true);
    dispatch(getProductDetails({ id, token }));
  }

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error?.message || 'Something went wrong'}</div>
      ) : (
        <>
         <div className="table-container">
         <table className='my-table'>
            <thead>
              <tr>
                <th>Product Image</th>
                <th style={{width: '250px'}}>Product Name</th>
                <th>Product Price</th>
                <th>Discounts</th>
                <th>Product Number</th>
                <th>Status Setting</th>
                <th>Product Settings</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} onClick={() => myProductDetails(product.id)} style={{cursor: 'pointer'}}>
                    <td>
                      <img
                        src={typeof product.images[0]?.filename === 'string' ? product.images[0]?.filename : 'default_image.png'}
                        alt="Thumbnail" className='img-thumbnail' style={{boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'}}
                        width={80}
                      />
                    </td>
                    <td style={{textAlign: 'left'}}>{product.product_name}</td>
                    <td>₦{Number(product.price).toLocaleString()}</td>
                    <td>₦{Number(product.discount).toLocaleString()}</td>
                    <td>{product.product_number}</td>
                    <td>
                      <button className='btn-status' 
                        onClick={(e) => {
                          e.stopPropagation();
                          switchStatus(product.id, token);
                        }}          
                        >Change Status
                      </button>
                    </td>
                    <td style={{ cursor: 'pointer' }} onClick={(e) => e.stopPropagation()}>
                      <FontAwesomeIcon 
                        icon={faEdit} 
                        style={{ color: '#FF962E' }} 
                        onClick={() => showTheModal(product.id, token)} 
                      /> 
                      Edit
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No products available</td>
                </tr>
              )}
            </tbody>
          </table>
         </div>
          

          {total_pages > 1 && (
            <div className="pagination">

              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="mx-1"
                  style={{
                    backgroundColor: '#FF962E',
                    borderRadius: '10px',
                    border: '0',
                  }}
                >
                  {currentPage - 1}
                </button>
              )}

              {/* Previous dots if there are more pages before the previous page */}
              {/* {currentPage > 2 && <span className="mx-1">...</span>} */}

              <button
                onClick={() => handlePageChange(currentPage)}
                disabled
                className="mx-1"
                style={{
                  backgroundColor: '#FF962E',
                  borderRadius: '10px',
                  border: '0',
                }}
              >
                {currentPage}
              </button>

              {currentPage < total_pages && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="mx-1"
                  style={{
                    backgroundColor: '#FF962E',
                    borderRadius: '10px',
                    border: '0',
                  }}
                >
                  {currentPage + 1}
                </button>
              )}

              {currentPage < total_pages - 1 && <span className="mx-1">...</span>}
            </div>
          )}
        </>
      )}
      

      {modalVisible ? (
        <div className="modal-overlay">
          <div className="modal-content2">
            <div className="head-mode">
              <h3>Update Product</h3>
              <button className="modal-close" onClick={hideModal}>
               &times;
              </button>
            </div>

            <div className="modal-body mt-3">
              <form className='w-100' onSubmit={updateDetails}>
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="form-group mb-4">
                      <label>Product Name</label>
                      <input 
                        type="text" 
                        placeholder='Product name' 
                        value={inputValues.productName}
                        onChange={(e) => setInputValues({ ...inputValues, productName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="form-group">
                      <label>Price</label>
                      <input 
                        type="number" 
                        placeholder='Price' 
                        value={inputValues.price}
                        onChange={(e) => setInputValues({ ...inputValues, price: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="form-group">
                      <label>Product Discount</label>
                      <input 
                        type="number" 
                        placeholder='Discount' 
                        value={inputValues.discount}
                        onChange={(e) => setInputValues({ ...inputValues, discount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="form-group">
                      <label>Stock</label>
                      <input 
                        type="number" 
                        placeholder='Stock'
                        value={inputValues.stock}
                        onChange={(e) => setInputValues({ ...inputValues, stock: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                  {productDetails?.images && productDetails.images.length > 0 && (
                    <div className="row">
                      {productDetails.images.map((image, index) => (
                        <div key={index} className="col-sm-12 col-md-12 col-lg-4">
                          <img src={image.filename} alt="Product Image" className="w-100"/>
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
                  

                  <div className="col-sm-12 col-md-12 col-lg-6 mt-4">
                    <div className="form-group">
                      <label>Status</label>
                      <input 
                        type="text" 
                        placeholder='Status'
                        value={inputValues.status}
                        onChange={(e) => setInputValues({ ...inputValues, status: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-6 mt-4">
                    <div className="form-group">
                      <label>Product Description</label>
                      <textarea 
                        cols="30" 
                        rows="5"
                        value={inputValues.productDescription}
                        onChange={(e) => setInputValues({ ...inputValues, productDescription: e.target.value })}
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-6 mt-4">
                    <div className="form-group">
                      <label>Category</label>
                      <Category 
                        onCategoryChange={setCategoryId} 
                        selectedCategory={inputValues.category || ''}
                      />
                    </div>
                  </div>

                  
                  <div className="col-sm-12 col-md-12 col-lg-12 mt-4">
                    <div className="form-group">
                      <div className="d-flex justify-content-between mb-3">
                        <label htmlFor="exampleInputPassword1">Inches</label>
                        <button
                          onClick={handleAddInputGroup}
                          style={{
                            outline: 'none',
                            background: 'none',
                            color: '#FF962E',
                            fontSize: '25px',
                            padding: '0',
                            border: '0',
                          }}
                        >
                          +
                        </button>
                      </div>

                      {inputGroups.map((group, index) => (
                        <div key={index} style={{ marginBottom: '20px' }} className="d-flex">
                          <input
                            type="text"
                            name="input1"
                            value={group.inche || ''}
                            onChange={(e) => {
                              const newInputGroups = [...inputGroups];
                              newInputGroups[index] = { ...group, inche: e.target.value };
                              setInputGroups(newInputGroups);
                            }}
                            placeholder="Inches"
                            className="mx-2"
                          />
                          <input
                            type="text"
                            name="input2"
                            value={group.price || ''}
                            onChange={(e) => {
                              const newInputGroups = [...inputGroups];
                              newInputGroups[index] = { ...group, price: e.target.value };
                              setInputGroups(newInputGroups);
                            }}
                            placeholder="Price"
                            className="mx-2"
                          />
                          <input
                            type="text"
                            name="input3"
                            value={group.discount || ''}
                            onChange={(e) => {
                              const newInputGroups = [...inputGroups];
                              newInputGroups[index] = { ...group, discount: e.target.value };
                              setInputGroups(newInputGroups);
                            }}
                            placeholder="Discount"
                            className="mx-2"
                          />
                          <FontAwesomeIcon
                            icon={faTimes}
                            onClick={() => handleRemoveInputGroup(index)}
                            style={{ color: '#FF962E', cursor: 'pointer' }}
                          />
                        </div>
                      ))}

                    </div>
                  </div>


                 <button className='log-btn mt-5'> Update Product </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {vimode ? (
        <div className="modal-overlay">
          <div className="modal-content2" style={{width: '900px'}}>
            <div className="head-mode">
                <h3>Product Details</h3>
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
                <div className="">
                  <div className='d-flex justify-content-between'>
                    <p>Product Name: </p>
                    <small style={{width: '250px'}}>{productDetails.product_name}</small>
                  </div>
                  <hr style={{border: '1px solid #FF962E'}}/>
                  <div className='d-flex justify-content-between'>
                    <p>Price: </p>
                    <small>₦{Number(productDetails.main_price).toLocaleString()}</small>
                  </div>
                  <div className='d-flex justify-content-between'>
                    <p>Discount: </p>
                    <small>₦{Number(productDetails.main_price_discount).toLocaleString()}</small>
                  </div>
                  <div className='d-flex justify-content-between'>
                    <p>Date Added: </p>
                    <small>{productDetails.date_added}</small>
                  </div>
                  <div className='d-flex justify-content-between'>
                    <p>Stock: </p>
                    <small>{productDetails.stock}</small>
                  </div>
                  <div className='d-flex justify-content-between'>
                    <p>Product Number: </p>
                    <small>{productDetails.product_number}</small>
                  </div>
                  <div className='d-flex justify-content-between'>
                    <p>Number Ordered: </p>
                    <small>{productDetails.total_number_ordered}</small>
                  </div>
                  <div className='d-flex justify-content-between'>
                    <p>Category Name: </p>
                    <small>{productDetails.category_name}</small>
                  </div>
                  <div className='d-flex justify-content-between'>
                    <p>Status: </p>
                    <small className={productDetails.status === 0 ? 'Inactive' : 'Active'}><b>{productDetails.status === 0 ? 'Inactive' : 'Active'}</b></small>
                  </div>
                  <hr style={{border: '1px solid #FF962E'}}/>

                  <div className="row">
                    {productDetails.images.map((image) =>
                      <div className="col-sm-4 col-md-12 col-lg-4 d-flex justify-content-center">
                        <div style={{
                            backgroundImage: `url(${image.filename})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'contain',
                            width: '100%',
                            height: '150px',
                            borderRadius: '20px',
                          }}>
                        </div>
                      </div> 
                    )}
                  </div>
                  <hr style={{border: '1px solid #FF962E'}}/>
                  <div className="table-container">
                  <table className='my-table'>
                    <thead>
                      <tr>
                        <th>Inches</th>
                        <th>Price</th>
                        <th>Discount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productDetails.inches && productDetails.inches.length > 0 ? (
                        productDetails.inches.map((inche) =>
                          <tr>
                            <td>{inche.inche}</td>
                            <td>₦{Number(inche.price).toLocaleString()}</td>
                            <td>₦{Number(inche.discount).toLocaleString()}</td>
                          </tr> 
                        )
                      ): (
                        <tr>
                          <td colSpan="7">No inches available</td>
                        </tr>
                      )} 
                    </tbody>
                  </table>
                  </div>
                  <hr style={{border: '1px solid #FF962E'}}/>
                  <small>{productDetails.product_description}</small>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : ''}
      
    </>
  );
};

export default Products;


