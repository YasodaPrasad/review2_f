import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Registration() {
    const [form, setForm] = useState({ 
        name: '', 
        college_id: '', 
        email: '', 
        password: '', 
        role: 'student', 
        dob: '', 
        college: '', 
        faculty: '' 
    });
    
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // This calls your Backend API
            await axios.post('http://localhost:5000/api/register', form);
            alert("Registration Successful! Now you can Login.");
            navigate('/'); // Redirect to Login page
        } catch (err) {
            alert("Error: " + (err.response?.data?.error || "Registration failed"));
        }
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '500px', margin: 'auto' }}>
                <h2 style={{textAlign: 'center'}}>Student Analytics System</h2>
                <h3 style={{textAlign: 'center', color: '#666'}}>Create Account</h3>
                
                <form onSubmit={handleRegister}>
                    <input 
                        placeholder="Full Name" 
                        onChange={e => setForm({ ...form, name: e.target.value })} 
                        required 
                    />
                    <input 
                        placeholder="College ID" 
                        onChange={e => setForm({ ...form, college_id: e.target.value })} 
                        required 
                    />
                    <input 
                        placeholder="Email Address" 
                        type="email" 
                        onChange={e => setForm({ ...form, email: e.target.value })} 
                        required 
                    />
                    <input 
                        placeholder="Password" 
                        type="password" 
                        onChange={e => setForm({ ...form, password: e.target.value })} 
                        required 
                    />
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{flex: 1}}>
                            <label style={{fontSize: '12px', color: '#888'}}>Date of Birth</label>
                            <input 
                                type="date" 
                                style={{ width: '100%' }}
                                onChange={e => setForm({ ...form, dob: e.target.value })} 
                            />
                        </div>
                        <div style={{flex: 1}}>
                            <label style={{fontSize: '12px', color: '#888'}}>Register As</label>
                            <select 
                                style={{ width: '100%' }}
                                onChange={e => setForm({ ...form, role: e.target.value })}
                            >
                                <option value="student">Student</option>
                                <option value="admin">Teacher/Admin</option>
                            </select>
                        </div>
                    </div>

                    <input 
                        placeholder="College Name" 
                        onChange={e => setForm({ ...form, college: e.target.value })} 
                    />
                    <input 
                        placeholder="Faculty / Department" 
                        onChange={e => setForm({ ...form, faculty: e.target.value })} 
                    />

                    <button type="submit" style={{marginTop: '10px'}}>Sign Up & Create Profile</button>
                </form>
                
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
                    Already have an account? <a href="/" style={{color: '#1a2a6c', fontWeight: 'bold'}}>Login Here</a>
                </p>
            </div>
        </div>
    );
}