import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/LoginPage.module.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user")) || null;

    useEffect(() => {
        function checkLoginStatus() {
            if (user)
                navigate('/');
        }

        checkLoginStatus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const name = String(document.getElementById('user_name').value);
        const email = String(document.getElementById('user_email').value);
        const password = String(document.getElementById('user_password').value);
        if (!name || !email || !password) {
            throw new Error('Please fill in all fields');
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
                credentials: 'include'
            });

            const data = await response.json();
            if (data.status == 'error') {
                console.log(data.message);
                return;
            }

            navigate('/login');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <h2>Welcome to ResumeCraft Pro</h2>
                    <p>Create your free account to unlock all resume templates</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="user_name">Name</label>
                        <input
                            type="user_name"
                            id="user_name"
                            required
                            placeholder="John Doe"
                            autoComplete="name"
                            className={styles.inputField}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="user_email">Email</label>
                        <input
                            type="user_email"
                            id="user_email"
                            required
                            placeholder="your@email.com"
                            autoComplete="email"
                            className={styles.inputField}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="user_password">Password</label>
                        <input
                            type="user_password"
                            id="user_password"
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <div className={styles.rememberForgot}>
                        <label>
                            <input type="checkbox" /> Check this box to accept our Terms & Conditions.
                        </label>
                    </div>

                    <button
                        type="submit"
                        className={styles.loginButton}
                        disabled={loading}
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>

                <div className={styles.signupLink}>
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;