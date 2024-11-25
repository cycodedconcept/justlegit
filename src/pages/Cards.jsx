import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { adminBoard } from '../features/dashboardSlice';

import { User, Order } from '../assets/images';
import { BarChart, Progress } from './Chart';
import Wig from './Wig';

const Cards = () => {
  let token = localStorage.getItem("key");

  const { board } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();


  const [progress, setProgress] = useState(0);
  const [pro2, setPro2] = useState(0);

  const cardItems = [
    {
      id: 0,
      icon: User,
      content: "New Signup",
      cvalue: board.newSignupsCount,
    },
    {
      id: 1,
      icon: Order,
      content: "Orders",
      otherContent: "Active",
      cvalue: board.totalcompletedOrders,
    },
    {
      id: 2,
      icon: Order,
      content: "Orders",
      otherContent: "Pending",
      dvalue: board.totalpendingOrders,
    },
    {
      id: 3,
      icon: Order,
      content: "Orders",
      anotherContent: "Completed",
      cvalue: board.totalcompletedOrders,
    },

    {
      id: 4,
      icon: Order,
      content: "Total Orders",
      anotherContent: "Total Product",
      cvalue: board.totalorders,
      evalue: board.totalproducts,
    },
    {
      id: 5,
      icon: User,
      content: "Total Customers",
      cvalue: board.totalcustomer,
    },
  ]

  useEffect(() => {
    if (token) {
      dispatch(adminBoard({token}));
    }

  }, [dispatch, token])

  useEffect(() => {
    if (board) {
      setProgress(board.totalactivecustomers || 0);
      setPro2(board.totalinactivecustomers || 0);
    }
  }, [board]);

  const cardDisplay = cardItems.map((item) => 
    <div className="card-single mb-3" key={item.id}>
      <div className="card-head p-2">
        <img src={item.icon} alt="" />
      </div>
      <div className="card-body d-flex justify-content-between">
        <div>
          <p style={{color: '#FF962E', fontWeight: '500'}}>{item.content}</p>
          <p style={{ fontWeight: '600'}}>{item.cvalue}</p>
        </div>
        <div>
          <p>{item.otherContent}</p>
          <p style={{ fontWeight: '600'}}>{item.dvalue}</p>
        </div>
        <div>
          <p style={{color: '#FF962E'}}>{item.anotherContent}</p>
          <p style={{ fontWeight: '600'}}>{item.evalue}</p>
        </div>
      </div>
    </div>

  )

  return (
    <>
      <div className="dash-cards">
        { cardDisplay }
      </div>
      <div className="row mt-5">
        <div className="col-sm-12 col-md-12 col-lg-6">
          <BarChart />
          <div className='text-center mx-5 w-75 mt-5 p-5' style={{boxShadow: 'rgb(38, 57, 77) 0px 20px 30px -10px'}}>
            <h5 className='mb-3'>Active Customers</h5>
            <Progress percentage={progress}/>

            <hr style={{border: '2px solid #FF962E'}} />

            <h5 className='mb-3'>Inactive Customers</h5>
            <Progress percentage={pro2}/>
          </div>
        </div>
        <div className="col-sm-12 col-md-12 col-lg-6" style={{borderLeft: '1px solid #FF962E'}}>
          <h5 className='mb-3' style={{color: '#FF962E'}}>Recent Orders</h5>
          <Wig />
        </div>
      </div>
    </>
  )
}

export default Cards
