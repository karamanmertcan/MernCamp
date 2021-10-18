import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserContext } from '../context';
import router from 'next/router';

const Nav = () => {
  const [current, setCurrent] = useState('');
  const [state, setState] = useContext(UserContext);

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const router = useRouter();

  const logout = () => {
    window.localStorage.removeItem('auth');
    setState(null); //empty object
    router.push('/login');
  };

  return (
    <nav className="nav  bg-primary d-flex justify-content-between">
      <Link href="/">
        <a className={`nav-link text-light logo ${current === '/' && 'active'}`}>MERNCAMP</a>
      </Link>
      {state !== null ? (
        <>
          <Link href="/user/dashboard">
            <a className={`nav-link text-light ${current === '/user/dashboard' && 'active'}`}>
              {state && state.user && state.user.name}
            </a>
          </Link>
          <a className="nav-link text-light" onClick={logout}>
            Logout
          </a>
        </>
      ) : (
        <>
          <Link href="/login">
            <a className={`nav-link text-light ${current === '/login' && 'active'}`}>Login</a>
          </Link>
          <Link href="/register">
            <a className={`nav-link text-light ${current === '/register' && 'active'}`}>Register</a>
          </Link>
        </>
      )}
    </nav>
  );
};

export default Nav;
