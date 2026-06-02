import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!form.email.includes('@') || form.password.length < 6) return setError('Enter a valid email and password with at least 6 characters.');
    const result = login(form);
    if (!result.ok) return setError(result.message);
    navigate(location.state?.from?.pathname || '/profile');
  };

  return <AuthForm title="Login" error={error} form={form} setForm={setForm} submit={submit} button="Login" footer={<span>New here? <Link className="fw-bold text-danger" to="/register">Register</Link></span>} />;
};

export const AuthForm = ({ title, error, form, setForm, submit, button, footer, register = false }) => (
  <section className="container py-5">
    <div className="mx-auto max-w-lg premium-card rounded-lg p-4 p-md-5">
      <h1 className="section-title">{title}</h1>
      <p className="text-slate-600">Frontend auth is persisted with localStorage.</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="vstack gap-3" onSubmit={submit}>
        {register && <input className="form-control form-control-lg" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
        <input className="form-control form-control-lg" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="form-control form-control-lg" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-brand btn-lg fw-bold" type="submit">{button}</button>
      </form>
      <p className="mt-3 mb-0 text-slate-600">{footer}</p>
    </div>
  </section>
);

export default Login;
