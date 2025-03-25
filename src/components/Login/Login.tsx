import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import { appDataService, authService } from '../../services/app.data.service';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleLogin = async () => {
        if (!userId) {
            setError('Please enter your email');
            return;
        }

        if (!isValidEmail(userId)) {
            setError('Please enter a valid email address');
            return;
        }

        setError('');
        sessionStorage.setItem('userEmail', userId);
        
        try {
            authService.setUserEmail(userId);
            const customerData = await appDataService.fetchCustomerDetails();
            sessionStorage.setItem('customerData', JSON.stringify(customerData));
            onLogin();
            navigate('/inbox');
        } catch (error) {
            setError('Login failed. Customer not found.');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-image"></div>
                <div className="login-form">
                    <div className='login-form-header'>
                    <img src="/assets/Jarvis.png"></img>

                    </div>
                <h2>Login</h2>
                    <div className="input-group">
                        <label htmlFor="userId">Username</label>
                        <input
                            type="text"
                            id="userId"
                            placeholder="Email or phone number"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </div>
              
                    {error && <span className="error-message">{error}</span>}
                    <button className="sign-in-btn" onClick={handleLogin}>Sign in</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
