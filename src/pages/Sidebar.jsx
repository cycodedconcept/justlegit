import React, {useState, useEffect} from 'react';
import { Dash, Logo, Order, Roduct, Report, User, Com } from '../assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import './pages.css';

const Sidebar = ({ onButtonClick, activeContent, onLogout }) => {
    const [menus, setMenus] = useState([]);

    useEffect(() => {
        const storedMenus = localStorage.getItem('menus');
        if (storedMenus) {
            setMenus(JSON.parse(storedMenus));
        }
    }, []);

    const menuIcons = {
        'Dashboard': Dash,
        'product management': Roduct,
        'Company Management': Com,
        'Order Management': Order,
        'Customer Management': User,
        'Reports': Report,
        'Admin Settings': User
    };

    const uniqueMenus = Array.from(new Set(menus?.map(menu => menu.menu_name)))
        .map(name => menus.find(menu => menu.menu_name === name));

    const sidebarItems = uniqueMenus.map((menu, index) => ({
        id: menu.id,
        name: menu.menu_name,
        image: menuIcons[menu.menu_name],
        bname: menu.menu_name.toLowerCase().replace(/\s+/g, ' '), 
    }));

    const showMenu = sidebarItems.map((item) => { 
        return (
            <button 
                key={item.id} 
                className={activeContent === item.bname ? 'sidebar-menu button active' : 'sidebar-menu button'}
                onClick={() => onButtonClick(item.bname)}
            >
                <img src={item.image} alt={item.name} className='px-3' style={{width: '50px'}}/>
                {item.name}
            </button>
        );
    });

    return (
        <>
            <div className="sidebar">
                <img src={Logo} alt="Logo" className='w-50 mx-2 mt-2'/>
                <div className="sidebar-menu">
                    {showMenu}
                </div>
                <button 
                    className="sidebar-menu button logout-button" 
                    onClick={onLogout}
                >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    <span className='mx-3'>Logout</span>
                </button>
            </div>
        </>
    );
};

export default Sidebar;


