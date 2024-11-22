import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, selectProductDetails } from '../features/allProductSlice';
import {
  fetchCompanyCategory,
  fetchCategoryStatus,
  fetchSubcategories,
  suspendProduct,
  fetchSearchValue,
  viewDetails,
  setPage,
  resetViewCategoryDetails,
  setViewDetailsPage,
  catForm,
  createCategory,
  bulkSuspend,
  bulkPrice
} from '../features/categorySlice';

const Company = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [background, setBackground] = useState('all');
  const [myValue, setMyValue] = useState('');
  const [more, setMore] = useState(true);
  const [viewingCategoryId, setViewingCategoryId] = useState(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [enable, setEnable] = useState(true);
  const [disable, setDisable] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [price, setPrice] = useState('');
  const [mode, setMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [catv, setCatv] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const [categories, setCategories] = useState([]);
  const [after, setAfter] = useState(false);
  const [vm, setVm] = useState(false);

  

  const dispatch = useDispatch();
  const {
    companyCategory,
    categoryStatus,
    currentPage,
    total_pages,
    isLoading,
    error,
    searchValue,
    viewCategoryDetails,
    viewDetailsPage,
    viewDetailsTotalPages,
    spinItem,
    success,
    catSuccess,
    subCategories,
    cat_name,
    cat_parent_id,
    percentage
  } = useSelector((state) => state.categories);
  const productDetails = useSelector(selectProductDetails);


  let token = localStorage.getItem("key");

  const handleButtonClick = (status) => {
    setBackground(status);
    setFilterStatus(status); // Update the filter status based on the button clicked
  
    // if (status === 'enable') {
    //   setEnable(1, token); // Fetch enabled categories
    // } else if (status === 'disable') {
    //   showDisable(0, token); // Fetch disabled categories
    // } else {
    //   dispatch(fetchCompanyCategory({ token, page: currentPage })); // Fetch all categories
    // }
  };
  

  useEffect(() => {
    if (token) {
      dispatch(fetchCompanyCategory({ token, page: currentPage }));
      setFilterStatus('all');
    }
  }, [dispatch, currentPage, token]);
  

  // Fetch category status (enable/disable)
//   const showEnable = (value, token) => {
//     if (token) {
//       dispatch(fetchCategoryStatus({ token, statusId: value }));
//     }
//   };

//   const showDisable = (value, token) => {
//     if (token) {
//       dispatch(fetchCategoryStatus({ token, statusId: value }));
//     }
//   };

  const changeView = () => {
    setMore(true);
    if (token) {
      dispatch(fetchCompanyCategory({ token, page: currentPage }));
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  }

  const getPrice = (e) => {
    setPrice(e.target.value);
  }

  const showModal = () => {
      setModalVisible(true);
  }

  const hideModal = () => {
    setModalVisible(false);
    setMode(false);
    setAfter(false);
    setVm(false);
    localStorage.removeItem("main");
    localStorage.removeItem("selectedCategory");
    localStorage.removeItem("cname");
    setCatv('')

  };

  const newCategory = (e) => {
    e.preventDefault();
    if (inputValue) {
        dispatch(catForm({token, cat_name: inputValue}));
        console.log(inputValue)
        Swal.fire({
            icon: 'success',
            title: 'Category added successfully!',
            showConfirmButton: false,
            timer: 3000
        });
        hideModal();
        dispatch(fetchCompanyCategory({ token, page: currentPage }));
    }else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to add category',
          showConfirmButton: true,
        });
    }
  }

//   useEffect(() => {
//     if (success) {
    //   Swal.fire({
    //     icon: 'success',
    //     title: 'Category added successfully!',
    //     showConfirmButton: false,
    //     timer: 3000
    //   });

    //   setModalVisible(false);
    //   dispatch(fetchCompanyCategory({ token, page: currentPage }));
//     }
//   }, [success, dispatch, currentPage, token]);

  // Suspend or enable category
  const switchStatus = (id, token) => {
      console.log(id)
    if (token) {
      dispatch(suspendProduct({ token, id }))
        .then((result) => {
          if (result.type === 'categories/suspendProduct/fulfilled') {
            dispatch(fetchCompanyCategory({ token, page: 1 }));
            Swal.fire({
              title: "Success",
              text: "Status changed successfully!",
              icon: "success",
              button: "OK",
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            title: "Error",
            text: "Something went wrong while updating the product!",
            icon: "error",
            confirmButtonText: "OK"
          });
        });
    }
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchSearchValue({ token, searchValue: myValue }));
    }
  }, [dispatch, token, myValue]);

  const myDetails = (id) => {
    setMore(false);
    setIsViewingDetails(true);
    setViewingCategoryId(id);

    dispatch(resetViewCategoryDetails());
    dispatch(setViewDetailsPage(1));

    if (token) {
      dispatch(viewDetails({ token, catId: id, page: 1 }));
    }
  };

  // const getCat = (id) => {
  //   localStorage.setItem("main", id);
  //     if (token) {
  //       console.log(id);
  //       setMode(true);
  //       dispatch(fetchSubcategories({token, id}))
  //     }
  // }

  const getCat = (id) => {
    localStorage.setItem("main", id);
    if (token) {
      console.log(id);
      setMode(true);
      dispatch(fetchSubcategories({ token, id }))
        .then((response) => {
          const subcategories = response.payload;
          
          if (subcategories.length > 0) {
            // Update hierarchy only if subcategories exist
            const newHierarchy = [...categoryHierarchy];
            newHierarchy.push({ level: newHierarchy.length, selectedCategory: '', subcategories });
            setCategoryHierarchy(newHierarchy);
          }
        });
    }
  };
  

  const handlePageChange = (page) => {
    if (currentPage !== page) {
      dispatch(setPage(page));
      if (more) {
        dispatch(fetchCompanyCategory({ token, page }));
      }
    }
  };

  const handleViewDetailsPageChange = (page) => {
    if (viewDetailsPage !== page && viewingCategoryId) {
      dispatch(setViewDetailsPage(page));
      dispatch(viewDetails({ token, catId: viewingCategoryId, page }));
    }
  };

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

  const renderViewDetailsPagination = () => {
    if (!isLoading && viewDetailsTotalPages > 1) {
      return (
        <div className="pagination">
          {Array.from({ length: viewDetailsTotalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handleViewDetailsPageChange(i + 1)}
              disabled={viewDetailsPage === i + 1}
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


 const filteredCategories = companyCategory.filter(category => {
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'enable'
        ? category.categories.status === 1
        : category.categories.status === 0;
  
    const searchInput = myValue ? myValue.toLowerCase().trim() : '';
  
    const matchesSearchValue = searchInput === ''
      ? true
      : category.categories.category_name.toLowerCase().includes(searchInput);
  
    return matchesStatus && matchesSearchValue;
  });
    
  
  // const handleCategoryChange = (event) => {
  //   const selectedValue = event.target.value;
  //   const selectedOption = event.target.options[event.target.selectedIndex].text;

  //   setSelectedCategory(selectedValue);
  //   setSelectedCategoryName(selectedOption);

  //   console.log('Selected Category ID:', selectedValue);
  //   console.log('Selected Category Name:', selectedOption);
  // };


//   const handleCheckboxChange = (id) => {
//     setSelectedCategoryIds((prevSelected) => {
//       if (prevSelected.includes(id)) {
//         // If the ID is already selected, remove it
//         return prevSelected.filter((categoryId) => categoryId !== id);
//       } else {
//         // If the ID is not selected, add it
//         return [...prevSelected, id];
//       }
//     });
//   };

const handleCheckboxChange = (id) => {
    setSelectedCategoryIds((prevSelected) => {
      const updatedSelected = prevSelected.includes(id)
        ? prevSelected.filter((categoryId) => categoryId !== id)
        : [...prevSelected, id];
  
      console.log('Updated Selected Category IDs:', updatedSelected);
      return updatedSelected;
    });
  };

//   const disableAll = (e) => {
//       e.preventDefault();

//       if (token) {
//         dispatch(bulkSuspend({token, cat_idarray: updatedSelected}))
//       }
//   }

const disableAll = async (e) => {
    e.preventDefault();

    if (!selectedCategoryIds || selectedCategoryIds.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please click on the checkbox.',
        confirmButtonColor: '#FF962E'
      });
      return;
    }

    try {
      const result = await dispatch(bulkSuspend({token, cat_idarray: selectedCategoryIds})).unwrap();
      if (result) {
        Swal.fire({
          icon: 'success',
          title: 'Status',
          text: 'Status Changed Successfully',
          confirmButtonColor: '#FF962E'
        });

        setSelectedCategoryIds([]); 

        setTimeout(() => {
          Swal.close();
          dispatch(fetchCompanyCategory({ token, page: currentPage }));
        }, 3000)
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'An error occurred during the assignment. Please try again.',
        confirmButtonColor: '#FF962E'
      });
    }
};
  
  

  
  // const CategorySelect = () => {
  //   const renderCategories = (subCategories, indent = 0) => {
  //     return subCategories.map((category) => (
  //       <React.Fragment key={category.id}>
  //         <option
  //           value={category.id}
  //           selected={category.id === selectedCategory}
  //         >
  //           {"-".repeat(indent)} {category.category_name}
  //         </option>
  //         {category.children && category.children.length > 0 &&
  //           renderCategories(category.children, indent + 2)
  //         }
  //       </React.Fragment>
  //     ));
  //   };
  
  //   return (
  //     <select value={selectedCategory} onChange={handleCategoryChange}>
  //       <option value="">Select a category</option>
  //       {renderCategories(subCategories)}
  //     </select>
  //   );
  // };

  // const saveToLocalStorage = (selectedId) => {
  //   localStorage.setItem('selectedCategory', selectedId);
  // };

  // const handleCategoryChange = async (event, level) => {
  //   const selectedValue = event.target.value;

  //   saveToLocalStorage(selectedValue);

  //   const response = await axios.get(`https://testbackendproject.pluralcode.academy/admin/get_sub_category?cat_id=${selectedValue}`, {
  //     headers: { 
  //       Authorization: `Bearer ${token}` 
  //   },
  //   });
  //   const subcategories = response.data;

  //   const newHierarchy = [...categoryHierarchy];
  //   newHierarchy[level].selectedCategory = selectedValue;
  //   newHierarchy[level].subcategories = subcategories;

  //   if (subcategories.length > 0) {
  //     newHierarchy[level + 1] = { level: level + 1, selectedCategory: '', subcategories: [] };
  //   } else {
  //     newHierarchy.length = level + 1;
  //   }

  //   setCategoryHierarchy(newHierarchy);
  // };

  const [categoryHierarchy, setCategoryHierarchy] = useState([
    { level: 0, selectedCategory: '', subcategories: subCategories }
  ]);

  const saveToLocalStorage = (selectedId) => {
    localStorage.setItem('selectedCategory', selectedId);
  };
  
  // const handleCategoryChange = async (event, level) => {
  //   const selectedValue = event.target.value;
  //   saveToLocalStorage(selectedValue);
  
  //   const response = await axios.get(
  //     `https://testbackendproject.pluralcode.academy/admin/get_sub_category?cat_id=${selectedValue}`, 
  //     { headers: { Authorization: `Bearer ${token}` }}
  //   );
  //   const subcategories = response.data;
  
  //   const newHierarchy = [...categoryHierarchy];
  //   newHierarchy[level].selectedCategory = selectedValue;
  //   newHierarchy[level].subcategories = subcategories;
  
  //   if (subcategories.length > 0) {
  //     newHierarchy[level + 1] = { level: level + 1, selectedCategory: '', subcategories: [] };
  //   } else {
  //     newHierarchy.length = level + 1;
  //   }
  
  //   setCategoryHierarchy(newHierarchy);
  // };
  
  const handleCategoryChange = async (event, level) => {
    const selectedValue = event.target.value;
    saveToLocalStorage(selectedValue);
  
    const selectedCategoryName = categoryHierarchy[level].subcategories.find(
      (subcategory) => subcategory.id === Number(selectedValue)
    )?.category_name || "Category not found";
  
    console.log("Selected Category Name:", selectedCategoryName);
    localStorage.setItem("cname", selectedCategoryName)
  
    const response = await axios.get(
      `https://legithairng.com/backend/admin/get_sub_category?cat_id=${selectedValue}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const subcategories = response.data;
  
    const newHierarchy = categoryHierarchy.slice(0, level + 1);
  
    newHierarchy[level] = {
      ...newHierarchy[level],
      selectedCategory: selectedValue,
      subcategories: subcategories.length > 0 ? subcategories : []
    };
  
    if (subcategories.length > 0) {
      newHierarchy[level + 1] = { level: level + 1, selectedCategory: '', subcategories: [] };
    }
  
    setCategoryHierarchy(newHierarchy);
  };
  
  
  
  const handleSubmit = () => {
    const storedCategory = localStorage.getItem('selectedCategory');
    const mainId = localStorage.getItem("main");
    
    const catParentId = storedCategory || mainId;
    console.log(catv, catParentId)
  
    if (catv && catParentId) {
      dispatch(createCategory({ token, cat_name: catv, cat_parent_id: catParentId }));
      Swal.fire({
        icon: 'success',
        title: 'Category added successfully!',
        showConfirmButton: false,
        timer: 3000
      });
  
      setCatv('');
      hideModal();
      dispatch(fetchCompanyCategory({ token, page: 1 }));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed to add category',
        showConfirmButton: true,
      });
    }
  };
  

  const modalPrice = (id) => {
    setAfter(true);
    localStorage.setItem("mp", id);
  }
  
  const changeBulkPrice = async (e) => {
    e.preventDefault();
    const myId = localStorage.getItem("mp");

    if (price === '') {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all the fields.',
        confirmButtonColor: '#FF962E'
      });
      return;
    }

    const priceChange = parseInt(price) / 100;

    try {
      const result = await dispatch(bulkPrice({token, id: myId, percentage: priceChange})).unwrap();

      if (result) {
        Swal.fire({
          icon: 'success',
          title: 'Update Successfully',
          text: 'Bulk price update suceessful',
          confirmButtonColor: '#FF962E'
        });

        setTimeout(() => {
          Swal.close();
          hideModal()
          dispatch(fetchCompanyCategory({ token, page: currentPage }));
        }, 3000)
        
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'An error occurred during the assignment. Please try again.',
        confirmButtonColor: '#FF962E'
      });
    }
  }

  const pDetails = (id) => {
    setVm(true)
    dispatch(getProductDetails({id, token}))
  }
  return (
    <>
      {more ? (
        <>
          <div className="row mt-5 mt-lg-3">
            <div className="col-sm-12 col-md-12 col-lg-9">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search Company..."
                  className="search-input"
                  value={myValue}
                  onChange={(e) => setMyValue(e.target.value)}
                />
                <span className="search-icon">&#128269;</span>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-3 mt-3 mt-lg-3 text-left">
              <button className="pro-btn" onClick={showModal}>+ Create Company</button>
            </div>
          </div>
  
          <div className="d-block d-lg-flex justify-content-between mt-4 mb-5 mt-lg-4 mb-lg-4">
            <div className="sts-btn p-2 p-sm-0">
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
                All Company
              </button>
              <button
                onClick={() => {
                  handleButtonClick('enable');
                //   showEnable(1, token); 
                setDisable(true)
                setEnable(false)
                }}
                style={{
                  backgroundColor: background === 'enable' ? '#f6e7d7' : '#FFF',
                  color: background === 'enable' ? '#FF962E' : '#6E7079',
                  border: '0',
                }}
              >
                Enable
              </button>
              <button
                onClick={() => {
                  handleButtonClick('disable');
                //   showDisable(0, token); 
                setDisable(false)
                setEnable(true)
                }}
                style={{
                  backgroundColor: background === 'disable' ? '#f6e7d7' : '#FFF',
                  color: background === 'disable' ? '#FF962E' : '#6E7079',
                  border: '0',
                }}
              >
                Disable
              </button>
            </div>
            <div>
                {enable ? (
                  <button className='el2-btn mb-2 mb-lg-0 mx-lg-2 mx-2' onClick={disableAll}>Enable</button>
                ) : ''}

                {disable ? (
                  <button className='el2-btn' onClick={disableAll}>Disable</button>
                ) : ''}
            </div>
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
                        <th>Check</th>
                        <th>Company</th>
                        <th>Product</th>
                        <th>Status</th>
                        <th>Subcategories</th>
                        <th>Bulk Price Change</th>
                        <th>Change Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories?.map((category) => (
                        <tr key={category.categories.id} onClick={() => myDetails(category.categories.id)}>
                          <td onClick={(e) => e.stopPropagation()}>
                            <label className="custom-checkbox">
                              <input type="checkbox" name="options" checked={selectedCategoryIds.includes(category.categories.id)} 
                              onChange={() => handleCheckboxChange(category.categories.id)} />
                              <span className="checkmark"></span>
                            </label>
                          </td>
                          <td>{category.categories.category_name}</td>
                          <td>{category.products}</td>
                          <td className={category.categories.status === 1 ? 'Enable' : 'Disable'}>
                            {category.categories.status === 1 ? 'Enable' : 'Disable'}
                          </td>
                          <td onClick={(e) => e.stopPropagation()}>
                            <button className="pro-btn mt-3" onClick={() => getCat(category.categories.id)}>Subcategories</button>
                          </td>
                          <td onClick={(e) => e.stopPropagation()}>
                            <button className='pro-btn' onClick={() => modalPrice(category.categories.id)}>bulk price change</button>
                          </td>
                          <td onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => {
                              switchStatus(category.categories.id, token)
                              }} className={category.categories.status === 1 ? 'deactivate' : 'activate'}>{category.categories.status === 1 ? 'Disable' : 'Activate'}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                </>
            )}
            {renderPagination()}
            </div>

        </>
      ) : (
        <div className="view-details-section">
            {/* <button onClick={changeView} style={{ color: '#FF962E' }}>
                &#8592; Back
            </button> */}

            <div className='d-flex gap-2 mt-5 mt-lg-3'>
                <p style={{color: '#FF962E', cursor: 'pointer'}} onClick={changeView}>Company Management</p>
                <p style={{color: '#6E7079'}}><FontAwesomeIcon icon={faCaretRight} style={{color: '#C2C6CE'}}/> View Details</p>
            </div>

            {/* <div className="category-details">
                {isLoading ? (
                <p>Loading details...</p>
                ) : error ? (
                <p>Error: {error.message || 'Failed to load details'}</p>
                ) : viewCategoryDetails?.length > 0 ? (
                    viewCategoryDetails.map((detail) => (
                        <div key={detail.id}>
                            <div className="">
                                <div className='mb-3 doub d-flex justify-content-between'>
                                  <p>Product Name:</p>
                                  <small>{detail.product_name}</small>
                                </div>
                                <div className='doub d-flex justify-content-between'>
                                    <p>Product Price:</p>
                                    <small>₦{Number(detail.price).toLocaleString()}</small>
                                </div>
                                <div className='doub d-flex justify-content-between'>
                                    <p>Product Number:</p>
                                    <small>{detail.product_number}</small>
                                </div>
                            </div>
                            <div className="">
                                <div className='mb-3 d-flex justify-content-between'>
                                    <p>Product Discount:</p>
                                    <small>₦{Number(detail.discount).toLocaleString()}</small>
                                </div>
                                <div className='text-center d-flex justify-content-between'>
                                    <p>Product Rating:</p>
                                    <small>{detail.total_rating}</small>
                                </div>
                            </div>
                            <div className="row mt-5">
                              {detail?.images && detail.images.length > 0 ? (
                                  detail.images.map((image, index) => (
                                      <div className="col-sm-12 col-md-12 col-lg-4 text-center" key={index}>
                                          <img src={image.filename} alt="Thumbnail" className='img-thumbnail' style={{width: '100px'}}/>
                                      </div>
                                  ))
                              ) : (
                                  <p>No images found</p>
                              )}

                            </div>
                            <div className="table-container">
                              <table className="my-table my-5">
                                <thead>
                                  <tr>
                                    <th>Inches</th>
                                    <th>Price</th>
                                    <th>Discount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {detail?.inches && detail.inches.length > 0 ? (
                                    detail.inches.map((inch, index) => 
                                      <tr key={index}>
                                        <td>{inch.inche}</td>
                                        <td>₦{Number(inch.price).toLocaleString()}</td>
                                        <td>₦{Number(inch.discount).toLocaleString()}</td>
                                      </tr>
                                    )
                                  ) : (
                                    <p className='text-center'>No inches records found</p>
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <hr style={{border: '1px solid #FF962E'}} />
                        </div>
                    ))
                ) : (
                <p className='text-center'>No details available for this category.</p>
                )}
            </div> */}
            <div className="category-details">
              {isLoading ? (
                <p>Loading details...</p>
              ) : error ? (
                <p>Error: {error.message || 'Failed to load details'}</p>
              ) : viewCategoryDetails?.length > 0 ? (
                <div className="table-container">
                  <table className="my-table">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Product Price</th>
                        <th>Product Number</th>
                        <th>Product Discount</th>
                        <th>Product Rating</th>
                        <th>Product Image</th>
                        <th>Inches</th>
                        <th>Inch Price</th>
                        <th>Inch Discount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewCategoryDetails.map((detail) => (
                        <tr key={detail.id} onClick={() => pDetails(detail.id)}>
                          <td>{detail.product_name}</td>

                          <td>₦{Number(detail.price).toLocaleString()}</td>

                          <td>{detail.product_number}</td>

                          <td>₦{Number(detail.discount).toLocaleString()}</td>

                          <td>{detail.total_rating}</td>

                          <td>
                          {detail.images && detail.images.length > 0 ? (
                            <img
                              src={detail.images[0].filename}
                              alt="Thumbnail"
                              className="img-thumbnail"
                              style={{ width: '100px', margin: '5px' }}
                            />
                          ) : (
                            <p>No images found</p>
                          )}

                          </td>

                          <td colSpan="3">
                            {detail.inches && detail.inches.length > 0 ? (
                              <table>
                                <tbody>
                                  {detail.inches.map((inch, index) => (
                                    <tr key={index}>
                                      <td>{inch.inche}</td>
                                      <td>₦{Number(inch.price).toLocaleString()}</td>
                                      <td>₦{Number(inch.discount).toLocaleString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p>No inches records found</p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center">No details available for this category.</p>
              )}
            </div>
            {renderViewDetailsPagination()}
        </div>
        )}

        {modalVisible ? (
            <>
             <div className="modal-overlay">
                <div className="modal-content2">
                    <div className="head-mode">
                        <h3> Add Company</h3>
                        <button className="modal-close" onClick={hideModal}>
                            &times;
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={newCategory}>
                            <div className="form-group">
                                <label htmlFor="category">Create Category</label>
                                <input type="text" name="" placeholder='category name' value={inputValue} onChange={handleChange} className='cat'/>
                                <button className='log-btn mt-5 cat'>
                                    {
                                    spinItem ?(
                                        <>
                                        <div className="spinner-border spinner-border-sm text-light" role="status">
                                            <span className="sr-only"></span>
                                        </div>
                                        <span>Loading... </span>
                                        </>
                                        
                                    ): (
                                        'Add Category'
                                    )
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </>
        ) : ''}

        {mode ? (
            <>
                <div className="modal-overlay">
                    <div className="modal-content2">
                      <div className="head-mode">
                        <h3> Add Categories & Subcategories</h3>
                        <button className="modal-close" onClick={hideModal}>
                            &times;
                        </button>
                      </div>
                      <div className="modal-body">
                        <p>{localStorage.getItem("cname")}</p>
                          {categoryHierarchy.map((categoryLevel, index) => (
                            <div key={index}>
                              {categoryLevel.subcategories && categoryLevel.subcategories.length > 0 && (
                                <>
                                  <select
                                    onChange={(event) => handleCategoryChange(event, index)}
                                    value={categoryLevel.selectedCategory}
                                    className="mb-3"
                                  >
                                    <option value="">Select Category</option>
                                    {categoryLevel.subcategories.map((subcategory) => (
                                      <option key={subcategory.id} value={subcategory.id}>
                                        {subcategory.category_name}
                                      </option>
                                    ))}
                                  </select>
                                </>
                              )}
                            </div>
                          ))}


                          <label className='mt-3'>New Name</label>
                          <input type="text" placeholder='category name' value={catv} onChange={(e) => setCatv(e.target.value)}/>

                          <button className='log-btn mt-3' onClick={handleSubmit}>Create Subcategory</button>
                      </div>

                    </div>
                </div>
            </>
        ) : ''}

        {after ? (
          <>
            <div className="modal-overlay">
              <div className="modal-content2">
                <div className="head-mode">
                  <h3>Bulk Price Change</h3>
                  <button className="modal-close" onClick={hideModal}>
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={changeBulkPrice}>
                    <input type="text" name="price" placeholder='100%' style={{width: '600px'}} value={price} onChange={getPrice}/>
                    <button className='log-btn mt-5' style={{width: '600px'}}>
                      {
                      spinItem ?(
                          <>
                          <div className="spinner-border spinner-border-sm text-light" role="status">
                            <span className="sr-only"></span>
                          </div>
                          <span>Loading... </span>
                          </>
                          
                      ): (
                          'Add Price Change'
                      )
                      }
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </>
        ) : ''}

        {vm ? (
          <>
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
          </>
        ) : ''}
        
    </>
  )
}
export default Company;
