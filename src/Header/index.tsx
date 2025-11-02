 // сссылка не регистрацию в header
 import React from 'react';
 import { Link } from 'react-router-dom';
 const Header: React.FC = () => {
 return (
 <nav>
 <Link to="/register">Register</Link>
 </nav>
 );
 };
 export default Header;