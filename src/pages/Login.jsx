import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api'; // Import the API function

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await loginUser({ email, password, role });
            
            // If successful, save user data to local storage
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Redirect based on role
            if (response.data.user.role === 'admin') {
                navigate('/admin-dash');
            } else {
                navigate('/student-dash');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check credentials.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>{role.toUpperCase()} LOGIN</h2>
                
                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label>Email Address</label>
                    <input 
                        type="email" 
                        placeholder="Enter email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={styles.input}
                    />

                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={styles.input}
                    />

                    <label>Login As:</label>
                    <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                        style={styles.input}
                    >
                        <option value="student">Student</option>
                        <option value="admin">Admin (Teacher)</option>
                    </select>

                    <button type="submit" style={styles.button}>Login</button>
                </form>

                <p style={styles.footer}>
                    Don't have an account? <Link to="/register">Register/Sign In</Link>
                </p>
            </div>
        </div>
    );
}

// Simple Inline Styles
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
    card: { backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '350px' },
    title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
    form: { display: 'flex', flexDirection: 'column' },
    input: { padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' },
    button: { padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    error: { color: 'red', textAlign: 'center', fontSize: '14px', marginBottom: '10px' },
    footer: { textAlign: 'center', marginTop: '15px', fontSize: '14px' }
};