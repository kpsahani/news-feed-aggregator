"use client";
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './LoginModal.module.css';
import api from '@/Services/api';
import { loginSuccess } from '@/store/reducers/authSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

const LoginModal = ({ closeModal }) => {

  const dispatch =  useDispatch()

  const handleLogin = (data) => {
    api.post('/login', { ...data }).then((response) =>{
      dispatch(loginSuccess({ ...response.data}));
      toast.success('Logged In!');
      closeModal();
    }).catch((error) =>{
      toast.error(error.data.message);
    })
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: (values) => {
      console.log('Logging in with:', values);
      handleLogin(values)
    },
  });

  return (
    <div className={styles.modal}>
      <div className={styles['modal-content']}>
        <span className={styles.close} onClick={closeModal}>&times;</span>

        <form onSubmit={formik.handleSubmit}>
          <div className={styles['input-group']}>
            <label htmlFor="loginEmail">Email:</label>
            <input
              type="text"
              id="loginEmail"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className={styles.error}>{formik.errors.email}</div>
            ) : null}
          </div>

          <div className={styles['input-group']}>
            <label htmlFor="loginPassword">Password:</label>
            <input
              type="password"
              id="loginPassword"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className={styles.error}>{formik.errors.password}</div>
            ) : null}
          </div>

          <button className={styles.button} type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
