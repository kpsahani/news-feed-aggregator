"use client";

import styles from "./index.module.css";
import LoginModal from "@/components/LoginModal";
import SignupModal from "@/components/SignupModal";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated, logout } from "@/store/reducers/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);

  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  const openSignupModal = () => {
    setSignupModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  const closeSignupModal = () => {
    setSignupModalOpen(false);
  };

  const userLogOut = () => {
    dispatch(logout());
  };

  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.navbar}>
            <div className={styles.logo}>
              <h1>News Feed</h1>
            </div>
            <div className={styles.menus}>
              <ul>
                {!isAuthenticated ? (
                  <>
                    <li>
                      <button onClick={openLoginModal} className={styles.login}>
                        Login
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={openSignupModal}
                        className={styles.Signup}
                      >
                        Signup
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <button onClick={userLogOut} className={styles.Signup}>
                      Logout
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </header>
      {isLoginModalOpen && <LoginModal closeModal={closeLoginModal} />}
      {isSignupModalOpen && <SignupModal closeModal={closeSignupModal} />}
    </>
  );
}
