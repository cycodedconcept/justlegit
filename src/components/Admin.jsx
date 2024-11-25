import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { adminUser, setAdminFormData, getMenus, assignMenu, updateBankDetails, setUpdateDetails, setUpdateOnline, updateOnline, showUsers } from '../features/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';


const Admin = () => {
    const banks = [
        { "id": "1", "name": "Access Bank" ,"code":"044" },
        { "id": "2", "name": "Citibank","code":"023" },
        { "id": "3", "name": "Diamond Bank","code":"063" },
        { "id": "4", "name": "Dynamic Standard Bank","code":"" },
        { "id": "5", "name": "Ecobank Nigeria","code":"050" },
        { "id": "6", "name": "Fidelity Bank Nigeria","code":"070" },
        { "id": "7", "name": "First Bank of Nigeria","code":"011" },
        { "id": "8", "name": "First City Monument Bank","code":"214" },
        { "id": "9", "name": "Guaranty Trust Bank","code":"058" },
        { "id": "10", "name": "Heritage Bank Plc","code":"030" },
        { "id": "11", "name": "Jaiz Bank","code":"301" },
        { "id": "12", "name": "Keystone Bank Limited","code":"082" },
        { "id": "13", "name": "Providus Bank Plc","code":"101" },
        { "id": "14", "name": "Polaris Bank","code":"076" },
        { "id": "15", "name": "Stanbic IBTC Bank Nigeria Limited","code":"221" },
        { "id": "16", "name": "Standard Chartered Bank","code":"068" },
        { "id": "17", "name": "Sterling Bank","code":"232" },
        { "id": "18", "name": "Suntrust Bank Nigeria Limited","code":"100" },
        { "id": "19", "name": "Union Bank of Nigeria","code":"032" },
        { "id": "20", "name": "United Bank for Africa","code":"033" },
        { "id": "21", "name": "Unity Bank Plc","code":"215" },
        { "id": "22", "name": "Wema Bank","code":"035" },
        { "id": "23", "name": "Zenith Bank","code":"057" }
    ]

  const dispatch = useDispatch();
  let token = localStorage.getItem("key");
  const [details, setDetails] = useState(true);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');


  const { 
      name, email, phone_number, 
      error, success, spinItem, spinItem2, spinItem3, 
      menus, menu_id, admin_user_id,
      bank_name, account_name, account_number,
      payment_public_key, payment_secrete_key,
      users
    } = useSelector((state) => state.admin);



  const logChange = (e) => {
    const { name, value } = e.target;
    dispatch(setAdminFormData({ field: name, value}))
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !email || !phone_number) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all the fields.',
        confirmButtonColor: '#FF962E'
      });
      return;
    }
  
    const rawData = { name, email, phone_number };
  
    try {
      const result = await dispatch(adminUser({token, rawData})).unwrap();
  
      if (result) {
        Swal.fire({
          icon: 'success',
          title: 'Created Successfully',
          text: 'The user has been created successfully.',
          confirmButtonColor: '#FF962E'
        });
       dispatch(showUsers({token}));
  
        setTimeout(() => {
            Swal.close();
            resetForm();
        }, 3000);
      } 
      else {
        throw new Error(result.message || 'Failed to create user.');
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

  const logBank = (e) => {
    const { name, value } = e.target;
    dispatch(setUpdateDetails({ field: name, value}))
  }

  const submitBank = async (e) => {
    e.preventDefault();
    if (!bank_name || !account_name || !account_number) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Information',
            text: 'Please fill in all the fields.',
            confirmButtonColor: '#FF962E'
        });
        return;
    }

    const rawBank = { bank_name, account_name, account_number };

    try {
      const result = await dispatch(updateBankDetails({token, rawBank})).unwrap();
      if (result) {
        Swal.fire({
          icon: 'success',
          title: 'Updated Successfully',
          text: 'Bank details updated successfully.',
          confirmButtonColor: '#FF962E'
        });
  
        setTimeout(() => {
            Swal.close();
            resetForm();
        }, 3000);
      }
      else {
        throw new Error(result.message || 'Failed to update details.');
      }
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message || 'An error occurred during the submission. Please try again.',
            confirmButtonColor: '#FF962E'
        });
    }
  }
  
  const logOnline = (e) => {
    const { name, value } = e.target;
    dispatch(setUpdateOnline({ field: name, value}))
  }

  const submitOnline = async (e) => {
    e.preventDefault();

    if (!payment_public_key || !payment_secrete_key) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Information',
            text: 'Please fill in all the fields.',
            confirmButtonColor: '#FF962E'
        });
        return;
    }

    const rawOnline = { payment_public_key, payment_secrete_key };

    try {
        const result = await dispatch(updateOnline({token, rawOnline})).unwrap();
        if (result) {
            Swal.fire({
              icon: 'success',
              title: 'Updated Successfully',
              text: 'Online details updated successfully.',
              confirmButtonColor: '#FF962E'
            });
      
            setTimeout(() => {
                Swal.close();
                resetForm();
            }, 3000);
        }
        else {
          throw new Error(result.message || 'Failed to update details.');
        } 
    }
    catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message || 'An error occurred during the submission. Please try again.',
            confirmButtonColor: '#FF962E'
        });
    }
  }
  
  const resetForm = () => {
    dispatch(setAdminFormData({ field: 'name', value: '' }));
    dispatch(setAdminFormData({ field: 'email', value: '' }));
    dispatch(setAdminFormData({ field: 'phone_number', value: '' }));

    dispatch(setUpdateDetails({ field: 'bank_name', value: '' }));
    dispatch(setUpdateDetails({ field: 'account_name', value: '' }));
    dispatch(setUpdateDetails({ field: 'account_number', value: '' }));

    dispatch(setUpdateOnline({ field: 'payment_public_key', value: '' }));
    dispatch(setUpdateOnline({ field: 'payment_secrete_key', value: '' }));
  }; 

  useEffect(() => {
    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Session Expired',
            text: 'Please log in again.',
            confirmButtonColor: '#FF962E'
        });
        return;
    }
    dispatch(getMenus({token}));
    dispatch(showUsers({token}));
 }, [dispatch, token]);


  const switchMode = () => {
      setDetails(false)
  }
  const changeView = () => {
      setDetails(true)
  }

  const handleMenuChange = (menuId) => {
    setSelectedMenus((prev) => 
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    console.log('Selected User ID:', userId);
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || selectedMenus.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Missing Information',
          text: 'Please select an admin user and at least one menu.',
          confirmButtonColor: '#FF962E'
        });
        return;
    }
    
    const menuData = { admin_user_id: selectedUser, menu_id: selectedMenus };
    
  
    try {
      const result = await dispatch(assignMenu({ token, menuData })).unwrap();
      if (result) {
        Swal.fire({
          icon: 'success',
          title: 'Menus Assigned',
          text: 'Menus assigned successfully to the admin user.',
          confirmButtonColor: '#FF962E'
        });

        setSelectedMenus([]);
        setSelectedUser('');

        setTimeout(() => {
            Swal.close();
        }, 3000);

      } else {
        throw new Error(result.message || 'Failed to assign menus.');
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
  
  

  return (
    <>
    {details ? (
        <>
            <div className="update-bank text-left mt-5 mt-lg-3">
                <button className='pro-btn' onClick={switchMode}>Update Bank Details</button>
            </div>
            <form style={{width: '100%'}} onSubmit={handleSubmit}>
                <h5 style={{color: '#FF962E', textAlign: 'center'}}>Create Admin User</h5>
                <div className="form-group">
                    <label className='mt-3'>Admin User Name</label>
                    <input type="text" placeholder='legit hair' name='name' value={name} onChange={logChange}/>
                </div>
                <div className="form-group">
                    <label className='mt-3'>Admin User Email</label>
                    <input type="email" placeholder='legit@gmail.com' name='email' value={email} onChange={logChange}/>
                </div>
                <div className="form-group">
                    <label className='mt-3'>Admin User Phone Number</label>
                    <input type="tel" placeholder='08131529845' name='phone_number' value={phone_number} onChange={logChange}/>
                </div>
                <button className='log-btn mt-5'>
                {
                    spinItem ?(
                    <>
                        <div className="spinner-border spinner-border-sm text-light" role="status">
                        <span className="sr-only"></span>
                        </div>
                        <span>Creating... </span>
                    </>
                        
                    ): (
                        'Add Admin User'
                    )
                }
                </button>
            </form>

            <hr style={{border: '1px solid #FF962E'}}/>

            <h5 style={{color: '#FF962E', textAlign: 'center'}}>Assign Users Menus</h5>
            <form className='w-100' onSubmit={handleMenuSubmit}>
                <div className="form-group">
                    <label htmlFor="menus">Menu</label>
                    <div className="row mb-5">
                        {menus.map((menu) => 
                            <div className="col-sm-12 col-md-12 col-lg-4" key={menu.id}>
                                <label className="custom-checkbox">
                                <input type="checkbox" name="options" 
                                value={menu.id} 
                                checked={selectedMenus.includes(menu.id)} 
                                onChange={() => handleMenuChange(menu.id)}/>
                                <span className="checkmark"></span>
                                {menu.menu_name}
                                </label>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="user" className='mb-2'>Admin Users</label>
                    <select name="user" id="user" onChange={handleUserChange} value={selectedUser}>
                        <option>--Select Admin User--</option>
                        {users.map((user) => 
                          <option key={user.id} value={user.id}>{user.email}</option>
                        )}
                    </select>
                </div>
                
                <button className='log-btn mt-5'>
                {
                    spinItem3 ?(
                    <>
                        <div className="spinner-border spinner-border-sm text-light" role="status">
                        <span className="sr-only"></span>
                        </div>
                        <span>Creating... </span>
                    </>
                        
                    ): (
                        'Assign Menus'
                    )
                }
                </button>
            </form>
        </>
    ) : (
        <>
            <div className='d-flex gap-2 mt-5 mt-lg-3'>
                <p style={{color: '#FF962E', cursor: 'pointer'}} onClick={changeView}>Admin Settings</p>
                <p style={{color: '#6E7079'}}><FontAwesomeIcon icon={faCaretRight} style={{color: '#C2C6CE'}}/> Bank Details</p>
            </div>

            <div className="row">
                <div className="col-sm-12 col-sm-12 col-lg-6" style={{borderRight: '2px solid #FF962E', borderRadius: '20px'}}>
                    <h5 className='text-center'>Update Bank Information</h5>
                    <form style={{width: '100%'}} onSubmit={submitBank}>
                        <div className="form-group">
                            <label className='mt-3'>Bank Name</label>
                            {/* <input type="text" placeholder='Guaranty Trust Bank' name='bank_name' value={bank_name} onChange={logBank}/> */}
                            <select name='bank_name' onChange={logBank} value={bank_name}>
                                <option>--Select Bank--</option>
                                {banks.map((bank) => 
                                  <option key={bank.id} value={bank.name}>{bank.name}</option>
                                )}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className='mt-3'>Accont Name</label>
                            <input type="text" placeholder='legithair' name='account_name' value={account_name} onChange={logBank}/>
                        </div>
                        <div className="form-group">
                            <label className='mt-3'>Account Number</label>
                            <input type="text" placeholder='8131529845' name='account_number' value={account_number} onChange={logBank}/>
                        </div>
                        <button className='log-btn mt-5'>
                        {
                            spinItem ?(
                            <>
                                <div className="spinner-border spinner-border-sm text-light" role="status">
                                <span className="sr-only"></span>
                                </div>
                                <span>Creating... </span>
                            </>
                                
                            ): (
                                'Update Bank Details'
                            )
                        }
                        </button>
                    </form>
                </div>
                <div className="col-sm-12 col-sm-12 col-lg-6 mt-5 mt-lg-0">
                <h5 className='text-center'>Update Online Information</h5>
                    <form style={{width: '100%'}} onSubmit={submitOnline}>
                        <div className="form-group">
                            <label className='mt-3'>Enter Payment Publick Key</label>
                            <input type="text" placeholder='pk_test_345677764ecrewe34657yhfds' name='payment_public_key' value={payment_public_key} onChange={logOnline}/>
                        </div>
                        <div className="form-group">
                            <label className='mt-3'>Enter Payment Secrete Key</label>
                            <input type="text" placeholder='pk_sk_45678987656743234567' name='payment_secrete_key' value={payment_secrete_key} onChange={logOnline}/>
                        </div>
                        <button className='log-btn mt-5'>
                        {
                            spinItem2 ?(
                            <>
                                <div className="spinner-border spinner-border-sm text-light" role="status">
                                <span className="sr-only"></span>
                                </div>
                                <span>Creating... </span>
                            </>
                                
                            ): (
                                'Update Online Details'
                            )
                        }
                        </button>
                    </form>
                </div>
            </div>
        </>
    )}
    </>
  )
}

export default Admin
