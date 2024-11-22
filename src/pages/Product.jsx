import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCaretRight, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDetails, selectSearchDetails, setCurrentPage, selectCurrentPage, selectTotalPages, selectViewDetails, viewCategory, getProductDetails, updateProduct, selectProductDetails, changeStatus, selectIsLoading, selectError } from '../features/allProductSlice';
import { fetchCategories } from '../features/categorySlice';
import Products from './support/Products';
import AddProduct from './support/AddProduct';
import Category from './support/Category';
import Swal from 'sweetalert2';

import './pages.css'

const Product = () => {

  const [pro, setPro] = useState(true);
  const [form, setForm] = useState(false);
  const [search, setSearch] = useState(true);
  const [dt, setDt] = useState(true);
  const [pr, setPr] = useState(false);
  const [myValue, setMyValue] = useState('')
  const [wal, setWal] = useState(false);
  const [selectId, setSelectedId] = useState('');
  const [alter, setAlter] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [vimode, setVimode] = useState(false);

  // new code
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

  const searchDetails = useSelector(selectSearchDetails);
  const currentPage = useSelector(selectCurrentPage);
  const total_pages = useSelector(selectTotalPages);
  const viewDetails = useSelector(selectViewDetails);

  // new code 
  const productDetails = useSelector(selectProductDetails);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);





  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  let token = localStorage.getItem("key");

  useEffect(() => {
    if (token) {
      setPro(false)
      if(myValue === '') {
        setPro(true);
        setWal(false)
      }
      else {
        setWal(true)
        setAlter(true);
        dispatch(fetchDetails({ token, searchValue: myValue }));
      }
    }
  }, [dispatch, token, myValue]);


  useEffect(() => {
    if (token) {
      dispatch(fetchCategories(token));
    }
  }, [dispatch, token]);

  const resetPage = () => {
    dispatch(setCurrentPage(1));
  };

  const showProductForm = (e) => {
    e.preventDefault();
    setPro(false)
    setSearch(false)
    setDt(false)
    setForm(true)
    setPr(true)
    setWal(false)
  }

  const original = (e) => {
    e.preventDefault();
    setPro(true)
    setSearch(true)
    setDt(true)
    setForm(false)
    setPr(false)
    setWal(false)
  }

  const pickChange = (e) => {
    const categoryId = e.target.value;
    setPro(false);
    setWal(true);
    setAlter(false);
    setSelectedId(categoryId);
    resetPage();
    console.log(categoryId);

     
    if (categoryId && token) {
      console.log("Dispatching viewDetails with:", { token, id: categoryId, page: currentPage });
      dispatch(viewCategory({ token, id: categoryId, page: 1 }));
    }
  };


  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));

    if (alter) {
      dispatch(fetchDetails({ token, searchValue: myValue, page }));
    } else {
      dispatch(viewCategory({ token, id: selectId, page }));
    }
  };

  const renderCategoryOptions = (categories) => {
    return categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ));
  };

  // new code 

  const switchStatus = (id, token) => {
    console.log(id)
    dispatch(changeStatus({id, token})).then(() => {
      Swal.fire({
        title: "Success",
        text: "Status changed successfully!",
        icon: "success",
        button: "OK",
      })
      setPro(true);
      setWal(false)
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
  
  const hideModal = () => {
    setModalVisible(false);
    setVimode(false)
  }
  const showTheModal = (id, token) => {
    localStorage.setItem('product', id);
    setModalVisible(true);
    dispatch(getProductDetails({ id, token }));
  }

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
      setPro(true)
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

  const myProductDetails = (id) => {
    setVimode(true);
    dispatch(getProductDetails({ id, token }));
  }

  
  return (
    <>
    {pr ? (
      <div className="pro-header d-flex justify-content-between mt-3">
      <div className='d-flex gap-2 mt-3'>
        <p style={{color: '#FF962E'}}>Product</p>
        <p style={{color: '#6E7079'}}><FontAwesomeIcon icon={faCaretRight} style={{color: '#C2C6CE'}}/> Add Product</p>
      </div>

      <button className='pcancel' onClick={original}><FontAwesomeIcon icon={faTimes} style={{color: '#888', marginRight: '8px'}}/>Cancel</button>
    </div>
    ): ''}
    
    {search ? (
      <div className="row mt-5 mt-lg-3">
        <div className="col-sm-12 col-md-12 col-lg-5">
          <div className="search-container">
            <input type="text" placeholder="Search Order..." className="search-input2" value={myValue} onChange={(e) => setMyValue(e.target.value)}/>
            <span className="search-icon">&#128269;</span>
          </div>
        </div>
        <div className="col-sm-12 col-md-12 col-lg-4">
          <div className='mt-2'>
            <select value={selectId} onChange={pickChange}>
              <option value="">Select a Category</option>
              {categories && renderCategoryOptions(categories)}
            </select>
          </div>
        </div>
        <div className="col-sm-12 col-md-12 col-lg-3 mt-3 mb-4 text-left">
          <button className='pro-btn' onClick={showProductForm}>+ Add Products</button>
        </div>
      </div>
    ): ''}
      
    {dt ? (
      <div className="scub d-flex">
      {/* <div className="pro d-flex ml-5">
          {getMyStatus}
      </div> */}
      <div className="pro-right d-flex mt-2">
      
      </div>
    </div>
    ): ''}  
      

      {pro ? (
        <Products />
      ) : ''}


      {form ? (
        <AddProduct />
      ): ''}

      {wal ? (
        <div>
          <div className="table-container">
            <table className="my-table">
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
              {alter ? (
                searchDetails && searchDetails.data?.length > 0 ? (
                  searchDetails.data.map((search) => (
                    <tr key={search.id} onClick={() => myProductDetails(search.id)}>
                      <td>
                        <img
                          src={typeof search.images[0]?.filename === 'string' ? search.images[0]?.filename : 'default_image.png'}
                          width={80} className="img-thumbnail" alt="Thumbnail" style={{boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'}}
                        />
                      </td>
                      <td style={{textAlign: 'left'}}>{search.product_name}</td>
                      <td>{search.price}</td>
                      <td>{search.discount}</td>
                      <td>{search.product_number}</td>
                      <td><button className='btn-status' onClick={(e) => {
                        e.stopPropagation();
                        switchStatus(search.id, token)
                      }}>Change Status</button></td>
                      <td style={{ cursor: 'pointer' }} onClick={(e) => e.stopPropagation()}>
                        <FontAwesomeIcon 
                          icon={faEdit} 
                          style={{ color: '#FF962E' }} 
                          onClick={() => showTheModal(search.id, token)} 
                        /> 
                        Edit
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No products available</td>
                  </tr>
                )
              ) : (
                viewDetails && viewDetails.data?.length > 0 ? (
                  viewDetails.data.map((view) => (
                    <tr key={view.id} onClick={() => myProductDetails(view.id)}>
                      <td>
                        <img
                          src={typeof view.images[0]?.filename === 'string' ? view.images[0]?.filename : 'default_image.png'}
                          width={80} className="img-thumbnail" alt="Thumbnail" style={{boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'}}
                        />
                      </td>
                      <td style={{textAlign: 'left'}}>{view.product_name}</td>
                      <td>₦{Number(view.price).toLocaleString()}</td>
                      <td>₦{Number(view.discount).toLocaleString()}</td>
                      <td>{view.product_number}</td>
                      <td><button className='btn-status' onClick={(e) => {
                        e.stopPropagation();
                        switchStatus(view.id, token)
                      }}>Change Status</button></td>
                      <td style={{ cursor: 'pointer' }} onClick={(e) => e.stopPropagation()}>
                        <FontAwesomeIcon 
                          icon={faEdit} 
                          style={{ color: '#FF962E' }} 
                          onClick={() => showTheModal(view.id, token)} 
                        /> 
                        Edit
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No products available</td>
                  </tr>
                )
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
        </div>
      ): ''}

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
  )
}

export default Product
