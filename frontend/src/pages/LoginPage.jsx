import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
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
        
        const email = String(document.getElementById('user_email').value);
        const password = String(document.getElementById('user_password').value);
        if (!email || !password) {
            throw new Error('Please fill in all fields');
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await response.json();
            if (data.status == 'error') {
                Cookies.remove('token');
                localStorage.removeItem("user");
                console.log(data.message);
                return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            Cookies.set("token", data.token, { expires: 14 });
            navigate('/');
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
                    <p>Sign in to access your resume templates</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="user_email">Email</label>
                        <input
                            type="user_email"
                            id="user_email"
                            required
                            placeholder="your@email.com"
                            autoComplete="email"
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

                    <button
                        type="submit"
                        className={styles.loginButton}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className={styles.signupLink}>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;