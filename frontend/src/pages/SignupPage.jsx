import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/LoginPage.module.css';

const LoginPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Replace with your actual authentication logic
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            // Mock authentication - in real app, verify credentials with backend
            if (email === 'user@example.com' && password === 'password') {
                localStorage.setItem('isAuthenticated', 'true');
                navigate('/editor'); // Redirect to editor after login
            } else {
                throw new Error('Invalid email or password');
            }
        } catch (err) {
            setError(err.message);
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

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <input
                            type="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="John Doe"
                            autoComplete="name"
                            className={styles.inputField}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="your@email.com"
                            autoComplete="email"
                            className={styles.inputField}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {loading ? 'Signing in...' : 'Sign In'}
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