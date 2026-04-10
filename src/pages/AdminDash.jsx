import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDash() {
    const [view, setView] = useState('add'); // 'add' or 'list'
    const [students, setStudents] = useState([]);
    const [allReports, setAllReports] = useState([]);
    const [report, setReport] = useState({ student_id:'', course:'', marks:'', attendance:'', className:'', facultyName:'', recommendation:'' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const stdRes = await axios.get('http://localhost:5000/api/admin/students');
        const repRes = await axios.get('http://localhost:5000/api/admin/all-reports');
        setStudents(stdRes.data);
        setAllReports(repRes.data);
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete this record?")) {
            await axios.delete(`http://localhost:5000/api/admin/report/${id}`);
            fetchData();
        }
    };

    return (
        <div className="container">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h1>Educator Control Panel</h1>
                <div>
                    <button onClick={() => setView('add')} style={{marginRight:'10px'}}>Add New Entry</button>
                    <button onClick={() => setView('list')} style={{backgroundColor:'#444'}}>View All Reports</button>
                </div>
            </div>

            {view === 'add' ? (
                <div className="card">
                    <h3>New Performance Entry</h3>
                    <form onSubmit={async (e) => { e.preventDefault(); await axios.post('http://localhost:5000/api/reports', report); alert("Saved!"); fetchData(); }}>
                        <select onChange={e => setReport({...report, student_id: e.target.value})} required>
                            <option value="">Select Student</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.custom_id})</option>)}
                        </select>
                        <input placeholder="Course" onChange={e => setReport({...report, course: e.target.value})} />
                        <input placeholder="Marks" type="number" onChange={e => setReport({...report, marks: e.target.value})} />
                        <input placeholder="Attendance %" type="number" onChange={e => setReport({...report, attendance: e.target.value})} />
                        <input placeholder="Class Room" onChange={e => setReport({...report, className: e.target.value})} />
                        <input placeholder="Faculty Name" onChange={e => setReport({...report, facultyName: e.target.value})} />
                        <textarea style={{gridColumn:'span 2'}} placeholder="Actionable Recommendation" onChange={e => setReport({...report, recommendation: e.target.value})} />
                        <button type="submit">Analyze & Save to DB</button>
                    </form>
                </div>
            ) : (
                <div className="card" style={{padding:'0'}}>
                    <table>
                        <thead>
                            <tr>
                                <th>Student</th><th>Course</th><th>Marks</th><th>Attendance</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allReports.map((r) => (
                                <tr key={r.report_id}>
                                    <td>{r.student_name}<br/><small>{r.custom_id}</small></td>
                                    <td>{r.course_name}</td>
                                    <td>{r.marks}</td>
                                    <td>{r.attendance}%</td>
                                    <td>
                                        <button onClick={() => handleDelete(r.report_id)} style={{backgroundColor:'#ff4d4d', padding:'5px 10px'}}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}