import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-[#D7D9DC] flex items-center justify-center text-xs font-semibold whitespace-nowrap text-black"
      >
        {user?.role === 'admin' ? 'Admin' : 'Officer1'}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg py-1 z-50 border border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
