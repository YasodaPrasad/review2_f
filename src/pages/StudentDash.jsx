import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function StudentDash() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. Get user data from LocalStorage
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/'); // Redirect to login if no user session
            return;
        }

        // 2. Fetch reports for this specific student
        axios.get(`http://localhost:5000/api/student-report/${user.id}`)
            .then(res => {
                setReports(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading reports:", err);
                setLoading(false);
            });
    }, [user?.id]);

    // 3. Analytics Calculations
    const totalCourses = reports.length;
    
    const avgMarks = totalCourses > 0 
        ? (reports.reduce((acc, curr) => acc + curr.marks, 0) / totalCourses).toFixed(1) 
        : 0;

    const avgAttendance = totalCourses > 0 
        ? (reports.reduce((acc, curr) => acc + curr.attendance, 0) / totalCourses).toFixed(1) 
        : 0;

    // 4. Logout Function
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (loading) return <div className="container"><h3>Loading your analytics...</h3></div>;

    return (
        <div className="container">
            {/* --- HEADER SECTION --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Student Analytics Portal</h1>
                    <p style={{ color: '#666' }}>Track your academic growth and insights</p>
                </div>
                <button onClick={handleLogout} style={{ backgroundColor: '#cc0000' }}>Logout</button>
            </div>

            {/* --- ANALYTICS SUMMARY CARDS --- */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div className="card" style={{ flex: 1, textAlign: 'center', borderTop: '5px solid #1a2a6c' }}>
                    <small style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>GPA Average</small>
                    <h2 style={{ fontSize: '2.5rem', margin: '10px 0', color: '#1a2a6c' }}>{avgMarks}%</h2>
                    <p style={{ fontSize: '12px', color: '#888' }}>Overall Score</p>
                </div>
                
                <div className="card" style={{ flex: 1, textAlign: 'center', borderTop: '5px solid #2ecc71' }}>
                    <small style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Attendance</small>
                    <h2 style={{ fontSize: '2.5rem', margin: '10px 0', color: '#1a2a6c' }}>{avgAttendance}%</h2>
                    <p style={{ fontSize: '12px', color: '#888' }}>Average Presence</p>
                </div>

                <div className="card" style={{ flex: 1, textAlign: 'center', borderTop: '5px solid #f1c40f' }}>
                    <small style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Courses</small>
                    <h2 style={{ fontSize: '2.5rem', margin: '10px 0', color: '#1a2a6c' }}>{totalCourses}</h2>
                    <p style={{ fontSize: '12px', color: '#888' }}>Total Enrolled</p>
                </div>
            </div>

            {/* --- PROFILE OVERVIEW --- */}
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
                <div>
                    <h3 style={{ marginBottom: '10px' }}>Personal Profile</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        <div>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Student ID:</strong> {user.college_id}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                        </div>
                        <div>
                            <p><strong>College:</strong> {user.college}</p>
                            <p><strong>Faculty:</strong> {user.faculty}</p>
                            <p><strong>DOB:</strong> {user.dob}</p>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'right', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                    <p style={{ margin: 0, color: '#888' }}>Academic Status</p>
                    <h4 style={{ margin: 0, color: avgMarks >= 50 ? '#2ecc71' : '#e74c3c' }}>
                        {avgMarks >= 50 ? 'GOOD STANDING' : 'PROBATION'}
                    </h4>
                </div>
            </div>

            {/* --- DETAILED TABLE --- */}
            <h2>Detailed Academic Records</h2>
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ margin: 0 }}>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Marks</th>
                            <th>Attendance</th>
                            <th>Faculty In-Charge</th>
                            <th>Actionable Recommendations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length > 0 ? (
                            reports.map((r, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: '600' }}>{r.course_name}</td>
                                    <td>
                                        <span style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '4px', 
                                            backgroundColor: r.marks >= 50 ? '#e8f5e9' : '#ffebee',
                                            color: r.marks >= 50 ? '#2e7d32' : '#c62828'
                                        }}>
                                            {r.marks}/100
                                        </span>
                                    </td>
                                    <td>{r.attendance}%</td>
                                    <td>{r.faculty_name}</td>
                                    <td>
                                        <div className="recommendation-box">
                                            {r.recommendation || "Maintain current progress."}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                                    No academic records have been published by the faculty yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- AREAS FOR IMPROVEMENT BOX --- */}
            {reports.length > 0 && (
                <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', border: '1px dashed #1a2a6c' }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>💡 Performance Insight:</h4>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                        {avgMarks < 75 
                            ? "Your average score is below the 75% threshold. We recommend following the faculty's feedback in the Pale Yellow boxes closely to improve your grades." 
                            : "Excellent work! You are maintaining a high average. Focus on maintaining your attendance to stay at the top of your class."
                        }
                    </p>
                </div>
            )}
        </div>
    );
}