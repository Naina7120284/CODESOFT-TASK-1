import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { MdPerson, MdEmail, MdBadge, MdDelete, MdSearch, MdClose } from 'react-icons/md';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, candidates: 0, employers: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'candidate' });
  const [lastSynced, setLastSynced] = useState(new Date()); 
  const [timeAgo, setTimeAgo] = useState("Just now");
  const [isLoading, setIsLoading] = useState(false);


const fetchUsers = async () => {
    setIsLoading(true);
    try {
        const res = await fetch(`${window.API_URL}/api/admin/users`);
        const data = await res.json();
        if (res.ok) {
            console.log("Users fetched:", data);
            setUsers(data);
            setLastSynced(new Date());
            setTimeAgo("Just now");
            setStats({
                total: data.length,
                candidates: data.filter(u => u.role === 'candidate').length,
                employers: data.filter(u => u.role === 'employer').length
            });
        }
    } catch (err) {
        console.error("Fetch failed:", err);
    } finally {
        setTimeout(() => setIsLoading(false), 600);
    }
};


useEffect(() => {
    fetchUsers();
}, []);

useEffect(() => {
    const interval = setInterval(() => {
        const seconds = Math.floor((new Date() - lastSynced) / 1000);
        
        if (seconds < 60) setTimeAgo("Just now");
        else if (seconds < 3600) setTimeAgo(`${Math.floor(seconds / 60)} mins ago`);
        else setTimeAgo(`${Math.floor(seconds / 3600)} hours ago`);
    }, 60000); 

    return () => clearInterval(interval);
}, [lastSynced]);
    
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
const handleDeleteUser = async (userId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "This user will be permanently removed from the platform!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#7c3aed', 
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Yes, delete member!',
    background: '#ffffff',
    borderRadius: '16px',
    customClass: {
      popup: 'premium-swal-popup',
      title: 'premium-swal-title'
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
         const res = await fetch(`${window.API_URL}/api/admin/users/${userId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setUsers(users.filter(user => user._id !== userId));
          
          Swal.fire({
            title: 'Deleted!',
            text: 'User has been successfully removed.',
            icon: 'success',
            confirmButtonColor: '#7c3aed'
          });
        }
      } catch (err) {
        Swal.fire('Error', 'Connection failed. Is the server running?', 'error');
      }
    }
  });
};

const handleAddUser = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${window.API_URL}/api/admin/users/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser) 
    });

    const data = await res.json();

    if (res.ok) {
      setUsers([...users, data]); 
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'candidate' });
      toast.success("New member added successfully!");
    } else {
      toast.error(data.message || "Failed to create user.");
    }
  } catch (err) {
    console.error("Add user error:", err);
    toast.error("Network error. Is your backend running?");
  }
};

const handleToggleStatus = async (userId) => {
  try {
    const res = await fetch(`${window.API_URL}/api/admin/users/toggle-status/${userId}`, {
      method: 'PUT',
    });
    const data = await res.json();

    if (res.ok) {

      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: data.status } : user
      ));
      
      Swal.fire({
        title: 'Status Updated',
        text: `User is now ${data.status}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  } catch (err) {
    console.error("Status toggle error:", err);
  }
};
 
const highlightText = (text, highlight) => {
  if (!highlight.trim()) return text; 
  
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} className="search-highlight">{part}</mark> 
        ) : (
          part
        )
      )}
    </span>
  );
};

  return (
    <div className="users-management-view fade-in">
      <h1 className="view-title">Users Management</h1>

      {/* Mini Stats Boxes */}
      <div className="stats-grid-premium">
        <div className="stat-card-mini">
          <div className="stat-icon-blue"><MdPerson /></div>
          <div><h3>{stats.total}</h3><p>All Users</p></div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-purple"><MdBadge /></div>
          <div><h3>{stats.candidates}</h3><p>Candidates</p></div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-green"><MdBadge /></div>
          <div><h3>{stats.employers}</h3><p>Employers</p></div>
        </div>
      </div>

      {/* Table Controls */}
      <div className="table-controls">
        <div className="search-box-premium">
          <MdSearch />
          <input 
          type="text" 
          placeholder="Search users by name or email..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
       />
        {searchTerm && (
           <button 
             className="clear-search-btn" 
             onClick={() => setSearchTerm('')}
             title="Clear search"
          >
             <MdClose />
          </button>
         )}
        </div>
         <div className="button-group">
            <span className="sync-time">
               <i className={`clock-icon ${timeAgo === "Just now" ? "pulse" : ""}`}>🕒</i> 
                {timeAgo}
             </span>
            <button className="refresh-btn" onClick={fetchUsers}>Refresh Data</button>
            <button className="add-user-btn" onClick={() => setShowAddModal(true)}>Add New User</button>
        </div>
      </div>

      {/* Users Table */}
      <div className="premium-table-container">
        <table className="admin-pro-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th>REGISTERED</th>
              <th>ACTION</th>
            </tr>
          </thead>

                  <tbody>
                   {filteredUsers.length > 0 ? (
                     filteredUsers.map((user) => (
                      <tr key={user._id} className="table-row-hover">
                        <td>
                         <div className="user-name-cell">
                           <div className="user-avatar-small"><MdPerson /></div>
                          <strong>{highlightText(user.name, searchTerm)}</strong>
                        </div>
                     </td>
                    <td>{highlightText(user.email, searchTerm)}</td>
                   <td>
                     <span className={`role-pill ${user.role}`}>
                     {user.role}
                 </span>
             </td>
               <td><span className={`status-pill ${user.status === 'blocked' ? 'blocked' : 'active'}`}
                         onClick={() => handleToggleStatus(user._id)}
                         style={{ cursor: 'pointer' }}
                         title="Click to toggle status"
                     >
                        {user.status === 'blocked' ? 'Blocked' : 'Active'}
                   </span>
                </td>
               <td>{new Date(user.createdAt).toLocaleDateString()}</td>
               <td>
                <button 
                   className="delete-icon-btn" 
                   onClick={() => handleDeleteUser(user._id)} 
                   title="Delete User"
                  >
                  <MdDelete />
            </button>
            </td>
         </tr>
       ))
    ) : (
      <tr>
         <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
          No users found.
        </td>
      </tr>
     )} 
        </tbody>
        </table>
      </div>
      {showAddModal && (
  <div className="modal-overlay">
    <div className="premium-modal">
      <h2>Add New Member</h2>
      <form onSubmit={async (e) => {
        e.preventDefault();
         const res = await fetch(`${window.API_URL}/api/admin/users/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });
        if (res.ok) {
          const createdUser = await res.json();
          setUsers([...users, createdUser]); 
          setShowAddModal(false);
          toast.success("User added!");
        }
      }}>
        <input type="text" placeholder="Full Name" required onChange={e => setNewUser({...newUser, name: e.target.value})} />
        <input type="email" placeholder="Email Address" required onChange={e => setNewUser({...newUser, email: e.target.value})} />
        <input type="password" placeholder="Password" required onChange={e => setNewUser({...newUser, password: e.target.value})} />
        <select onChange={e => setNewUser({...newUser, role: e.target.value})}>
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
        </select>
        <div className="modal-actions">
           <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
           <button type="submit" className="add-user-btn">Create User</button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminUsers;