// src/SignIn.js
import React, { useState } from 'react';
import './index.css'; // Or your custom CSS file
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Please enter both email and password.');
            setLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Login successful with Firebase!');
        } catch (err) {
            switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    setError('Invalid email or password.');
                    break;
                case 'auth/invalid-email':
                    setError('The email address is not valid.');
                    break;
                case 'auth/user-disabled':
                    setError('This account has been disabled.');
                    break;
                default:
                    setError(`Login failed: ${err.message}`);
                    console.error('Firebase login error:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        setError('');
        setLoading(true);
        if (!email || !password) {
            setError('Please enter both email and password for registration.');
            setLoading(false);
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log('Registration successful with Firebase!');
        } catch (err) {
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already registered. Please log in.');
                    break;
                case 'auth/weak-password':
                    setError('Password should be at least 6 characters.');
                    break;
                case 'auth/invalid-email':
                    setError('The email address is not valid.');
                    break;
                default:
                    setError(`Registration failed: ${err.message}`);
                    console.error('Firebase registration error:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        // Remove the <body> tag. Wrap content in a <div> or Fragment if needed.
        // The styling will be applied to a wrapper in App.js
        <main className="form-signin w-100 m-auto">
            <form onSubmit={handleLogin}>
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

                <button
                    className="btn btn-outline-secondary w-100 py-2 mt-2"
                    type="button"
                    onClick={handleRegister}
                    disabled={loading}
                >
                    Register (First Time User)
                </button>

                <p className="mt-5 mb-3 text-body-secondary">&copy; 2017–2025</p>
            </form>
        </main>
    );
};

export default SignIn;