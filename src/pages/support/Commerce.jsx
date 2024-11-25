import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { productItem, setPageProduct } from '../../features/orderSlice';
import { getProductDetails, viewCategory, selectViewDetails, selectCurrentPage, selectTotalPages, } from '../../features/allProductSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import ImageCarousel from './ImageCarousel';
import ProductCartButton from './ProductCartButton';
import Swal from 'sweetalert2';
import { useCart } from '../CartContext';
import FilterCategory from './FilterCategory';
import { Fil } from '../../assets/images'


const Commerce = () => {
  const token = localStorage.getItem("key");
  let maxLength = 20;

  const { cartItems, updateCart } = useCart();

  const dispatch = useDispatch();
  const { isLoading, error, product, productPage, productTotalPages} = useSelector((state) => state.order);
  const { productDetails } = useSelector((state) => state.allProducts);

  const viewDetails = useSelector(selectViewDetails);
  const currentPage = useSelector(selectCurrentPage);
  const total_pages = useSelector(selectTotalPages);

  const [details, setDetails] = useState(true);
  const [selectedInch, setSelectedInch] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [displayPrice, setDisplayPrice] = useState(productDetails.main_price);
  const [strikethroughPrice, setStrikethroughPrice] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [mod, setMod] = useState(false);
  const [cat, setCat] = useState(true);
  const [back, setBack] = useState(false);

  //   new state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setMod(false)
    dispatch(viewCategory({token, id: selectedCategory, page: 1})); 
  };

  useEffect(() => {
    if (selectedCategory) {
      console.log('Selected category:', selectedCategory);
    }
  }, [selectedCategory]);

  //   ends here


  const hideModal = () => {
    setMod(false);
  };

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    console.log('Saved cart:', savedCart);
  }, []);


 
  useEffect(() => {
    if (token) {
        dispatch(productItem({token, page: productPage}))
    }
  }, [dispatch, token, productPage]);

  const handlePageChange = (page) => {
    dispatch(setPageProduct(page));
  };

  const proDetails = (id) => {
    if (token) {
        dispatch(getProductDetails({id: id, token}));
        setDetails(false);
        setSelectedInch('');
        setQuantity(1);
        setDisplayPrice(productDetails.main_price);
        setStrikethroughPrice(null);
    }
  }


  const changeProduct = () => {
    setDetails(true);
  }

  const handleInchChange = (e) => {
    setSelectedInch(e.target.value);
    const selectedInchObject = productDetails.inches.find((inch) => String(inch.inche) === String(e.target.value));

    if (selectedInchObject) {
      if (selectedInchObject.discount) {
        setDisplayPrice(selectedInchObject.discount);
        setStrikethroughPrice(selectedInchObject.price);
      } else {
        setDisplayPrice(selectedInchObject.price);
        setStrikethroughPrice(null);
      }
    } else {
      setDisplayPrice(productDetails.main_price_discount || productDetails.main_price);
      setStrikethroughPrice(productDetails.main_price_discount ? productDetails.main_price : null);
    }
  };


  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prevQuantity => prevQuantity + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };


  const renderProductPagination = () => {
    if (!isLoading && productTotalPages) {
        return (
            <div className="pagination">
                {productPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="mx-1"
                            style={{
                                backgroundColor: '#FF962E',
                                borderRadius: '10px',
                                border: '0',
                            }}
                        >
                            1
                        </button>
                        {productPage > 3 && <span>...</span>}
                    </>
                )}

                {productPage > 2 && (
                    <button
                        onClick={() => handlePageChange(productPage - 1)}
                        className="mx-1"
                        style={{
                            backgroundColor: '#FF962E',
                            borderRadius: '10px',
                            border: '0',
                        }}
                    >
                        {productPage - 1}
                    </button>
                )}

                <button
                    onClick={() => handlePageChange(productPage)}
                    disabled
                    className="mx-1"
                    style={{
                        backgroundColor: '#FF962E',
                        borderRadius: '10px',
                        border: '0',
                    }}
                >
                    {productPage}
                </button>

                {productPage < productTotalPages && (
                    <button
                        onClick={() => handlePageChange(productPage + 1)}
                        className="mx-1"
                        style={{
                            backgroundColor: '#FF962E',
                            borderRadius: '10px',
                            border: '0',
                        }}
                    >
                        {productPage + 1}
                    </button>
                )}

                {productPage < productTotalPages - 1 && (
                    <>
                        {productPage < productTotalPages - 2 && <span>...</span>}
                        <button
                            onClick={() => handlePageChange(productTotalPages)}
                            className="mx-1"
                            style={{
                                backgroundColor: '#FF962E',
                                borderRadius: '10px',
                                border: '0',
                            }}
                        >
                            {productTotalPages}
                        </button>
                    </>
                )}
            </div>
        );
    }
  };

//   const addToCart = (productToAdd) => {
//     // Ensure an inch is selected if required
//     if (!selectedInch && productToAdd.inches && productToAdd.inches.length > 0) {
//         Swal.fire({
//             title: 'Select an Inch',
//             text: 'Please select an inch before adding to the cart.',
//             icon: 'warning',
//             timer: 3000,
//             showConfirmButton: false,
//         });
//         return;
//     }

//     const isProductInCart = cart.some(item => Number(item.id) === Number(productToAdd.id));
    
//     if (!isProductInCart) {
//         // Find the selected inch object, if any
//         const selectedInchObject = productToAdd.inches?.find((inche) => String(inche.inche) === String(selectedInch));

//         // Determine product amount based on conditions
//         const productAmount = selectedInchObject
//             ? selectedInchObject.discount || selectedInchObject.price
//             : productToAdd.main_price_discount || productToAdd.main_price;

//         const newCartItem = {
//             product_id: productToAdd.product_id,
//             product_name: productToAdd.product_name,
//             product_amount: productAmount,
//             images: productToAdd.images,
//             inches: selectedInch,
//             category_id: productToAdd.category_id,
//             order_quantity: quantity,
//             initial_amount: selectedInchObject ? selectedInchObject.price : 0,
//             discounted: selectedInchObject ? selectedInchObject.discount : 0,
//         };

//         const updatedCart = [...cart, newCartItem];
//         setCart(updatedCart);
//         localStorage.setItem('cart', JSON.stringify(updatedCart));

//         Swal.fire({
//             title: 'Added to Cart!',
//             text: `${productToAdd.product_name} has been added to your cart.`,
//             icon: 'success',
//             timer: 3000,
//             showConfirmButton: false
//         });
//     } else {
//         Swal.fire({
//             title: 'Already in Cart',
//             text: `${productToAdd.product_name} is already in your cart.`,
//             icon: 'info',
//             timer: 3000,
//             showConfirmButton: false
//         });
//     }
//   };



const addToCart = (productToAdd) => {
    if (!selectedInch && productToAdd.inches && productToAdd.inches.length > 0) {
      Swal.fire({
        title: 'Select an Inch',
        text: 'Please select an inch before adding to the cart.',
        icon: 'warning',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    const isProductInCart = cartItems.some(item => Number(item.id) === Number(productToAdd.id));
    
    if (!isProductInCart) {
      const selectedInchObject = productToAdd.inches?.find((inche) => String(inche.inche) === String(selectedInch));

      const productAmount = selectedInchObject
        ? selectedInchObject.discount || selectedInchObject.price
        : productToAdd.main_price_discount || productToAdd.main_price;

      const newCartItem = {
        product_id: productToAdd.product_id,
        product_name: productToAdd.product_name,
        product_amount: productAmount,
        images: productToAdd.images,
        inches: selectedInch,
        category_id: productToAdd.category_id,
        order_quantity: quantity,
        initial_amount: selectedInchObject ? selectedInchObject.price : 0,
        discounted: selectedInchObject ? selectedInchObject.discount : 0,
      };

      const updatedCart = [...cartItems, newCartItem];
      updateCart(updatedCart);

      Swal.fire({
        title: 'Added to Cart!',
        text: `${productToAdd.product_name} has been added to your cart.`,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        title: 'Already in Cart',
        text: `${productToAdd.product_name} is already in your cart.`,
        icon: 'info',
        timer: 3000,
        showConfirmButton: false
      });
    }
  };


  const filteredProducts = product.filter((item) => {
    return (
      item.product_name.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  

  const catMode = () => {
    setMod(true);
    setCat(false);
    setBack(true);
  }

  const showAllProduct = () => {
    setCat(true);
    setBack(false);
  }
  
  return (
    <>
    {details ? (
        <>
            <div className="text-left tl">
              {back ? (
              <>
                <button className='pro-btn2' onClick={showAllProduct}><FontAwesomeIcon icon={faCaretLeft} /> Back to all Product</button>
              </>
              ) : (
                <input type="text" placeholder="Search Product..." className="search-input3 mb-3" value={filterText} onChange={(e) => setFilterText(e.target.value)}/>
              )}
              <img src={ Fil } alt="" className='fil-img' onClick={() => catMode()}/>
            </div>

            {cat ? (
              <>
                <div className="row mt-5 mt-lg-3">
                {isLoading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>Error: {error?.message || 'Something went wrong'}</div>
                ) : filteredProducts?.length > 0 ? (
                    filteredProducts.map((item) => 
                        <div className="col-sm-12 col-md-12 col-lg-3 mb-5" key={item.id}>
                            <div className="card-item" style={{boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderRadius: '20px'}}>
                                <div className="card-img">
                                {item?.images && item.images.length > 0 ? (
                                  <img src={item.images[0].filename} alt="image" className='w-100 rounded-pill' />
                                  ) : (
                                  <p>No images found</p>
                                )}

                                </div>
                                <div className="card-body">
                                    <small>{item.product_name.length > maxLength ? item.product_name.slice(0, maxLength) + "..." : item.product_name}</small>
                                    <p style={{color: '#FF962E'}}>₦{item.price.toLocaleString()}</p>
                                </div>
                                <div className="card-footer-item p-3 ml-0">
                                    <button className='el2-btn w-100' onClick={() => proDetails(item.id)}><FontAwesomeIcon icon={faShoppingCart} className="mx-2" />View More</button>
                                </div>
                            </div>
                        </div>
                    )
                ): (
                    <p className='text-center'>No product available.</p>
                )}
                </div>
                {renderProductPagination()}
              </>
            ) : (
            <>
              <div className="row mt-5 mt-lg-3">
                {isLoading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>Error: {error?.message || 'Something went wrong'}</div>
                ) : viewDetails?.data.length > 0 ? (
                    viewDetails?.data.map((item) => 
                        <div className="col-sm-12 col-md-12 col-lg-3 mb-5" key={item.id}>
                            <div className="card-item" style={{boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderRadius: '20px'}}>
                                <div className="card-img">
                                {item?.images && item.images.length > 0 ? (
                                  <img src={item.images[0].filename} alt="image" className='w-100 rounded-pill' />
                                  ) : (
                                  <p>No images found</p>
                                )}

                                </div>
                                <div className="card-body">
                                    <small>{item.product_name.length > maxLength ? item.product_name.slice(0, maxLength) + "..." : item.product_name}</small>
                                    <p style={{color: '#FF962E'}}>₦{item.price.toLocaleString()}</p>
                                </div>
                                <div className="card-footer-item p-3 ml-0">
                                    <button className='el2-btn w-100' onClick={() => proDetails(item.id)}><FontAwesomeIcon icon={faShoppingCart} className="mx-2" />View More</button>
                                </div>
                            </div>
                        </div>
                    )
                ): (
                    <p className='text-center'>No product available.</p>
                )}
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
            </>
            )}
        </>
    ) : (
        <>
           <div className='d-flex gap-2 mt-5 mt-lg-3'>
                <p style={{color: '#FF962E', cursor: 'pointer'}} onClick={changeProduct}>View Products</p>
                <p style={{color: '#6E7079'}}><FontAwesomeIcon icon={faCaretRight} style={{color: '#C2C6CE'}}/> Product Details</p>
            </div>
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-6">
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        productDetails.images && productDetails.images.length > 0 ? (
                            <ImageCarousel images={productDetails.images} />
                        ) : (
                            <p>No images found</p>
                        )
                    )}
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6">
                    <p>{productDetails.product_name}</p>
                    <p style={{ color: '#f3a557' }}>
                        <b>
                            {productDetails.main_price_discount ? (
                            <>
                                <span className="mx-2">
                                ₦{productDetails.main_price_discount ? productDetails.main_price_discount.toLocaleString() : '0'}
                                </span>
                                <span style={{ textDecoration: 'line-through', color: '#000', fontSize: '13px' }}>
                                ₦{productDetails.main_price ? productDetails.main_price.toLocaleString() : '0'}
                                </span>
                            </>
                            ) : (
                            <>₦{productDetails.main_price ? productDetails.main_price.toLocaleString() : '0'}</>
                            )}
                        </b>
                        </p>

                    <div className="d-flex justify-content-between">
                      <p>{productDetails.product_number}</p>
                      <p>status: {productDetails.status}</p>
                      <p>stock: {productDetails.stock}</p>
                    </div>

                    {productDetails.inches && productDetails.inches.length > 0 && (
                        <>
                            <label htmlFor="inches" className="mt-5">Select inches</label>
                            <select id="inches" value={selectedInch} onChange={handleInchChange}>
                            <option value="">--select inches--</option>
                            {productDetails.inches.map((inch, index) => (
                                <option value={inch.inche} key={index}>{inch.inche}</option>
                            ))}
                            </select>
                        </>
                        )}
                    <div className="d-flex align-items-center mt-3">
                        <button 
                        onClick={() => handleQuantityChange('decrease')}
                        style={{
                            backgroundColor: '#FF962E',
                            borderRadius: '10px',
                            border: '0',
                        }}
                        >-</button>
                        <span className="mx-3">{quantity}</span>
                        <button onClick={() => handleQuantityChange('increase')}
                        style={{
                            backgroundColor: '#FF962E',
                            borderRadius: '10px',
                            border: '0',
                        }}
                        >+</button>
                    </div>

                    <ProductCartButton 
                        product={productDetails}
                        // cart={cart}
                        onAddToCart={addToCart}
                        className="log-btn mt-5 w-100"
                    />
                </div>
            </div>
            <div className="below-section mt-5">
                <h5 style={{color: '#f3a557'}}>Product Description</h5>
                <small>{productDetails.product_description}</small>
            </div>
            
        </>
    )}

    {mod ? (
        <>
          <div className="modal-overlay">
              <div className="modal-content2">
                  <div className="head-mode">
                      <h3>Select Category</h3>
                        <button className="modal-close" onClick={hideModal}>
                        &times;
                        </button>
                  </div>
                  <div className="modal-body">
                    <FilterCategory onCategorySelect={handleCategorySelect} />
                  </div>
              </div>
          </div>
        </>
    ) : ''}
    </>
  )
}

export default Commerce

