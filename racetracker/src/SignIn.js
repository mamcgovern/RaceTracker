import React, { useState } from 'react';
import './index.css';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Please enter both email and password.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                localStorage.setItem('userToken', data.token);
                window.location.href = '/';
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <body className="d-flex align-items-center justify-content-center py-4 bg-body-tertiary" style={{ minHeight: '100vh' }}>
            <main className="form-signin w-100 m-auto">
                <form onSubmit={handleSubmit}>
                    {/* Removed mt-5 and added inline style for a larger margin-top */}
                    <h1 className="h3 mb-3 fw-normal" style={{ marginTop: '6rem' }}>Please sign in</h1> 

                    <div className="form-floating">
                        <input
                            type="email"
                            className="form-control"
                            id="floatingInput"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <div className="form-check text-start my-3">
                        <input className="form-check-input" type="checkbox" value="remember-me" id="checkDefault" />
                        <label className="form-check-label" htmlFor="checkDefault">
                            Remember me
                        </label>
                    </div>

                    {error && <div className="alert alert-danger" role="alert">{error}</div>}

                    <button className="btn btn-primary w-100 py-2" type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </main>
        </body>
    );
};

export default SignIn;