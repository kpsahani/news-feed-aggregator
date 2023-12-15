"use client";
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './index.module.css';
import api from '@/Services/api';
import { toast } from 'react-hot-toast';

const SignupModal = ({ closeModal }) => {

  const handleSignup = async (data) => {
      api.post('/register', { ...data }).then(() =>{
        toast.success('Registration Done!');
        closeModal();
      }).catch((error) =>{
        toast.error(error.data.message);
      })
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: (values) => {
      console.log('Signing up with:', values);
      handleSignup(values)
    },
  });

  return (
    <div className={styles.modal}>
      <div className={styles['modal-content']}>
        <span className={styles.close} onClick={closeModal}>&times;</span>

        <form onSubmit={formik.handleSubmit}>
          <div className={styles['input-group']}>
            <label htmlFor="signupName">Name:</label>
            <input
              type="text"
              id="signupName"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className={styles.error}>{formik.errors.name}</div>
            ) : null}
          </div>

          <div className={styles['input-group']}>
            <label htmlFor="signupEmail">Email:</label>
            <input
              type="text"
              id="signupEmail"
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
            <label htmlFor="signupPassword">Password:</label>
            <input
              type="password"
              id="signupPassword"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className={styles.error}>{formik.errors.password}</div>
            ) : null}
          </div>

          <button className={styles.button} type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
