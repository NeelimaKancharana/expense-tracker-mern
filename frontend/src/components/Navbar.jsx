/*import React, { useEffect, useRef, useState } from 'react';
import { navbarStyles } from '../assets/dummyStyles';
import img1 from '../assets/logo.png';
import { ChevronDown, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api';
const Navbar = ({user : propUser, onLogout}) => {
    const navigate = useNavigate();
    const menuRef = useRef();

    const [menuOpen, setMenuOpen ] = useState(false);

    const user = propUser || {
        name : "",
        email : "",
    };

    // fetch the user data from server

    useEffect(() => {
        const fetchUserData = async () => {
            try{
                const token = localStorage.getItem("token");
                if(!token)
                {
                    return;
                }

                const response = await axios.get(`${BASE_URL}/user/me`,{
                    headers : { Authorization: `Bearer ${token}`},
                });

                const userData = response.data.user || response.data;
                setUser(userData);
            }

            catch(err)
            {
               console.error("failed to load profile",err);
            }
        };

        if(!propUser)
        {
            fetchUserData();
        }
    },[propUser]);

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const handleLogout = () => {
          setMenuOpen(false);
          localStorage.removeItem("token");
          onLogout?.();
          navigate('/login');
    };

    // close the toggle menu if click outside the box

     useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    return(
        <header className={navbarStyles.header}>
           <div className={navbarStyles.container}>
            
              <div onClick={() => navigate('/')} className={navbarStyles.logoContainer}>
                  <div className={navbarStyles.logoImage}>
                      <img src={img1} alt="logo" />
                  </div>
                  <span className={navbarStyles.logoText}>Expense Tracker</span>
              </div>
            

              {user && (
                <div className={navbarStyles.userContainer} ref={menuRef}>
                    <button onClick={toggleMenu} className={navbarStyles.userButton}>
                       <div className="relative">
                          <div className={navbarStyles.userAvatar}>
                              {user?.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div className={navbarStyles.statusIndicator}>

                          </div>
                          <div className={navbarStyles.userTextContainer}>
                              <p className={navbarStyles.userName}>
                                {user?.name || "user"}
                              </p>

                              <p className={navbarStyles.userEmail}>
                                 {user?.email || "user@expensetracker.com"}
                              </p>
                          </div>
                       </div>
                       <ChevronDown className={navbarStyles.chevronIcon(menuOpen)} />
                    </button>

            

                    {menuOpen && (
                        <div className={navbarStyles.dropdownMenu}>
                           <div className={navbarStyles.dropdownHeader}>
                               <div className="flex items-center gap-3">
                                   <div className={navbarStyles.dropdownAvatar}>
                                       {user?.name?.[0]?.toUpperCase() || "U"}
                                    </div>

                                    <div>
                                       <div className={navbarStyles.dropdownName}>
                                          {user?.name || "user"}
                                        </div>

                                        <div className={navbarStyles.dropdownEmail}>
                                           {user?.email || "user@expensetracker.com"}
                                        </div>
                                    </div>
                               </div>
                            </div>

                            <div className={navbarStyles.menuItemContainer}>
                               <button onClick={() => {
                                   setMenuOpen(false);
                                   navigate("/profile");
                               }} className={navbarStyles.menuItem} 
                               >
                                <User className=" w-4 h-4" />
                                <span>My Profile</span>
                               </button>
                            </div>

                            <div className={navbarStyles.menuItemBorder}>
                                <button onClick={handleLogout} className={navbarStyles.logoutButton}>
                                    <LogOut className= " w-4 h-4" />
                                    <span>Log out</span>
                                </button>
                            </div>

                        </div>  
                    )}
                </div>
              )}
           </div>
        </header>
    )
}

export default Navbar; */


import React, { useEffect, useRef, useState } from 'react';
import { navbarStyles } from '../assets/dummyStyles';
import img1 from '../assets/logo.png';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api';

const Navbar = ({ user: propUser, onLogout }) => {
    const navigate = useNavigate();
    const menuRef = useRef();

    const [menuOpen, setMenuOpen] = useState(false);

    // User data fetched from backend when propUser is not provided
    const [fetchedUser, setFetchedUser] = useState({
        name: '',
        email: '',
    });

    const user = propUser || fetchedUser;

    // Fetch user data from server
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    return;
                }

                const response = await axios.get(`${BASE_URL}/user/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const userData = response.data.user || response.data;

                setFetchedUser(userData);
            } catch (err) {
                console.error('Failed to load profile', err);
            }
        };

        if (!propUser) {
            fetchUserData();
        }
    }, [propUser]);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleLogout = () => {
        setMenuOpen(false);
        localStorage.removeItem('token');
        onLogout?.();
        navigate('/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className={navbarStyles.header}>
            <div className={navbarStyles.container}>

                {/* Logo */}
                <div
                    onClick={() => navigate('/')}
                    className={navbarStyles.logoContainer}
                >
                    <div className={navbarStyles.logoImage}>
                        <img src={img1} alt="logo" />
                    </div>

                    <span className={navbarStyles.logoText}>
                        Expense Tracker
                    </span>
                </div>

                {/* User */}
                {user && (
                    <div
                        className={navbarStyles.userContainer}
                        ref={menuRef}
                    >
                        <button
                            onClick={toggleMenu}
                            className={navbarStyles.userButton}
                        >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className={navbarStyles.userAvatar}>
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>

                                <div className={navbarStyles.statusIndicator}></div>
                            </div>

                            {/* User name + email */}
                            <div className={navbarStyles.userTextContainer}>
                                <p className={navbarStyles.userName}>
                                    {user?.name || 'user'}
                                </p>

                                <p className={navbarStyles.userEmail}>
                                    {user?.email || 'user@expensetracker.com'}
                                </p>
                            </div>

                            {/* Dropdown arrow */}
                            <ChevronDown
                                className={navbarStyles.chevronIcon(menuOpen)}
                            />
                        </button>

                        {/* Dropdown menu */}
                        {menuOpen && (
                            <div className={navbarStyles.dropdownMenu}>

                                {/* Dropdown header */}
                                <div className={navbarStyles.dropdownHeader}>
                                    <div className="flex items-center gap-3">

                                        <div className={navbarStyles.dropdownAvatar}>
                                            {user?.name?.[0]?.toUpperCase() || 'U'}
                                        </div>

                                        <div>
                                            <div className={navbarStyles.dropdownName}>
                                                {user?.name || 'user'}
                                            </div>

                                            <div className={navbarStyles.dropdownEmail}>
                                                {user?.email || 'user@expensetracker.com'}
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* Profile */}
                                <div className={navbarStyles.menuItemContainer}>
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            navigate('/profile');
                                        }}
                                        className={navbarStyles.menuItem}
                                    >
                                        <User className="w-4 h-4" />
                                        <span>My Profile</span>
                                    </button>
                                </div>

                                {/* Logout */}
                                <div className={navbarStyles.menuItemBorder}>
                                    <button
                                        onClick={handleLogout}
                                        className={navbarStyles.logoutButton}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Log out</span>
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>
                )}

            </div>
        </header>
    );
};

export default Navbar;