import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { AuthForm } from './Login.jsx';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (form.name.trim().length < 2) return setError('Name must be at least 2 characters.');
    if (!form.email.includes('@') || form.password.length < 6) return setError('Enter a valid email and password with at least 6 characters.');
    const result = register(form);
    if (!result.ok) return setError(result.message);
    navigate('/profile');
  };

  return <AuthForm title="Register" error={error} form={form} setForm={setForm} submit={submit} button="Create Account" register footer={<span>Already have an account? <Link className="fw-bold text-danger" to="/login">Login</Link></span>} />;
};

export default Register;
