import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../features/createProductSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Category from './Category';

const AddProduct = () => {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [discount, setDiscount] = useState('');
    const [stock, setStock] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [inches, setInches] = useState([{ inche: 0, price: 0, discount: 0 }]);
    const [images, setImages] = useState([]);
    const [status, setStatus] = useState('1');

    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.product);

    const [inputGroups, setInputGroups] = useState([
        { input1: '', input2: '', input3: '' },
    ]);

    const handleAddInputGroup = (e) => {
        e.preventDefault();
        setInputGroups([...inputGroups, { input1: '', input2: '', input3: '' }]);
    };

    const handleRemoveInputGroup = (index) => {
        const newInputGroups = [...inputGroups];
        newInputGroups.splice(index, 1);
        setInputGroups(newInputGroups);
    };

    const token = localStorage.getItem('key');
    

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    
    //     const formData = new FormData();
    //     formData.append('product_name', productName);
    //     formData.append('price', price);
    //     formData.append('product_description', productDescription);
    //     formData.append('discount', discount);
    //     formData.append('stock', stock);
    //     formData.append('category_id', categoryId);
    //     formData.append('inches', JSON.stringify(inches)); 
    //     images.forEach((file) => formData.append('images', file));
    //     formData.append('status', status);
    
    //     dispatch(createProduct({formData, token})).then(() => {
    //         Swal.fire({
    //             title: "Success",
    //             text: "Product created successfully!",
    //             icon: "success",
    //             button: "OK",
    //         }).then(() => {
    //             setProductName('');
    //             setPrice('');
    //             setProductDescription('');
    //             setDiscount('');
    //             setStock('');
    //             setCategoryId('');
    //             setInches([{ inche: 0, price: 0, discount: 0 }]);
    //             setImages([]);
    //             setStatus('1');
    //         });
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    
    // };
    
    const handleSubmit = (e) => {
        e.preventDefault();
    
        const matchingInch = inches.find(
            (inch) => inch.price === parseInt(price) && inch.discount === parseInt(discount)
        );
    
        if (!matchingInch) {
            Swal.fire({
                title: "Error",
                text: "The inches array must contain an item with a price and discount matching the main price and discount.",
                icon: "error",
                button: "OK",
            });
            return;
        }
    
        // Proceed with submission if matching object is found
        const formData = new FormData();
        formData.append('product_name', productName);
        formData.append('price', price);
        formData.append('product_description', productDescription);
        formData.append('discount', discount);
        formData.append('stock', stock);
        formData.append('category_id', categoryId);
        formData.append('inches', JSON.stringify(inches)); 
        images.forEach((file) => formData.append('images', file));
        formData.append('status', status);
    
        dispatch(createProduct({ formData, token }))
            .then(() => {
                Swal.fire({
                    title: "Success",
                    text: "Product created successfully!",
                    icon: "success",
                    button: "OK",
                }).then(() => {
                    setProductName('');
                    setPrice('');
                    setProductDescription('');
                    setDiscount('');
                    setStock('');
                    setCategoryId('');
                    setInches([{ inche: 0, price: 0, discount: 0 }]);
                    setImages([]);
                    setStatus('1');
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };
    
  return (
    <>
      
       <form className='w-100' onSubmit={handleSubmit}>
           <div className="row">
               <div className="col-sm-12 col-md-12 col-lg-6">
                 <div className="form-group mb-4">
                <label htmlFor="exampleInputEmail1">Product Name</label>
                <input type="text" placeholder='legit hair' value={productName} onChange={(e) => setProductName(e.target.value)}/>
                 </div>
               </div>
               <div className="col-sm-12 col-md-12 col-lg-6">
                 <div className="form-group">
                <label htmlFor="exampleInputPassword1">Price</label>
                <input type="number" placeholder='40000' value={price} onChange={(e) => setPrice(e.target.value)}/>
                 </div>
               </div>
               <div className="col-sm-12 col-md-12 col-lg-6">
               <div className="form-group">
                   <label htmlFor="exampleInputPassword1">Product Discount</label>
                     <input type="number" placeholder='40000' value={discount} onChange={(e) => setDiscount(e.target.value)}/>
                 </div>
                 
               </div>
               <div className="col-sm-12 col-md-12 col-lg-6">
                  <div className="form-group">
                     <label htmlFor="exampleInputPassword1">Stock</label>
                     <input type="number" placeholder='40000' value={stock} onChange={(e) => setStock(e.target.value)}/>
                 </div>
               </div>

               <div className="col-sm-12 col-md-12 col-lg-6 mt-4">
                  <div className="form-group">
                     <label htmlFor="exampleInputPassword1">Product Images</label>
                     <input type="file" multiple onChange={(e) => setImages([...e.target.files])}/>
                 </div>
               </div>
               <div className="col-sm-12 col-md-12 col-lg-6 mt-4">
                  <div className="form-group">
                     <label htmlFor="exampleInputPassword1">Status</label>
                     <input type="text" placeholder='pending' value={status} onChange={(e) => setStatus(e.target.value)}/>
                 </div>
               </div>
               <div className="col-sm-12 col-md-12 col-lg-6 mt-4">
                  <div className="form-group">
                   <label htmlFor="exampleInputPassword1">Product Description</label>
                   <textarea name="" id="" cols="30" rows="5" value={productDescription} onChange={(e) => setProductDescription(e.target.value)}></textarea>
                  </div>
               </div>
               <div className="col-sm-12 col-md-12 col-lg-6 mt-4">
                   <div className="form-group">
                        <div className="d-flex justify-content-between mb-3">
                            <label htmlFor="exampleInputPassword1">Inches</label>
                            <button onClick={handleAddInputGroup} style={{
                                outline: 'none', 
                                background: 'none', 
                                color: '#FF962E',
                                fontSize: '25px',
                                padding: '0',
                                border: '0'
                            }}>+</button>
                        </div>
                      {inputGroups.map((inch, index) => (
                        <div key={index} style={{ marginBottom: '20px' }} className="d-flex">
                        <input
                            type="text"
                            name="input1"
                            value={inches[index]?.inche || ''}
                            onChange={(e) => {
                                const newInches = [...inches];
                                newInches[index] = { ...newInches[index], inche: parseInt(e.target.value, 10) || 0 };
                                setInches(newInches);
                            }}
                            placeholder="Inches"
                            className='mx-2'
                        />
                        <input
                            type="number"
                            name="input2"
                            value={inches[index]?.price || ''}
                            onChange={(e) => {
                                const newInches = [...inches];
                                newInches[index] = { ...newInches[index], price: parseInt(e.target.value, 10) || 0 };
                                setInches(newInches);
                            }}             
                            placeholder="Price"
                            className='mx-2'
                        />
                        <input
                            type="number"
                            name="input3"
                            value={inches[index]?.discount || ''}
                            onChange={(e) => {
                                const newInches = [...inches];
                                newInches[index] = { ...newInches[index], discount: parseInt(e.target.value, 10) || 0 };
                                setInches(newInches); 
                            }}
                            placeholder="Discount"
                            className='mx-2'
                        />
                            <FontAwesomeIcon icon={faTimes} onClick={() => handleRemoveInputGroup(index)} style={{color: '#FF962E'}}/>
                        </div>
                       ))}
                   </div>
               </div>
               <div className="col-sm-12 col-md-12 col-lg-6 mt-4">
                 <div className="form-group">
                     <label htmlFor="exampleInputPassword1">Categories</label>
                     <Category onCategoryChange={setCategoryId}/>
                 </div>
               </div>
           </div>
            
            
            
           <button className='log-btn mt-5'>
                {isLoading ? 'Creating Product...' : 'Create Product'}
            </button>
        </form>
    </>
  )
}

export default AddProduct
