import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Mail, ShieldCheck } from 'lucide-react';

export default function TeamDirectory({ user }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTeam = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/users?assignerRole=${user.role}`);
      const data = await res.json();
      setTeamMembers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [user]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add employee');
      setSuccess('Personnel successfully onboarded!');
      setName('');
      setEmail('');
      fetchTeam();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to remove this employee and unassign their tasks?')) return;
    try {
      await fetch(`http://localhost:5001/api/users/${id}`, { method: 'DELETE' });
      fetchTeam();
    } catch (err) {
      console.error(err);
    }
  };

  const canManage = ['BOSS', 'GM', 'MANAGER', 'TL'].includes(user.role);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Enterprise Team Directory</h2>
        <p className="text-xs text-slate-400 mt-1">Manage corporate personnel, role hierarchies, and departmental access.</p>
      </div>

      {canManage && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono uppercase">
            <UserPlus className="w-4 h-4" />
            <span>Onboard New Team Member</span>
          </div>
          {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">{error}</div>}
          {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg">{success}</div>}
          
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <input
              type="email"
              placeholder="Corporate Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="TL">TL</option>
              <option value="MANAGER">MANAGER</option>
              <option value="GM">GM</option>
              <option value="BOSS">BOSS</option>
            </select>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs py-2.5 transition cursor-pointer"
            >
              Add Personnel
            </button>
          </form>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-mono text-xs text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Active Workforce Roster ({teamMembers.length})</span>
          <span className="text-cyan-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Cluster Connected
          </span>
        </div>
        <div className="divide-y divide-slate-800/80">
          {teamMembers.map((member) => (
            <div key={member._id} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{member.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" />
                    <span>{member.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 text-[9px] font-mono font-bold rounded-md bg-slate-800 text-cyan-400 border border-slate-700 uppercase">
                  {member.role}
                </span>
                {canManage && member._id !== (user._id || user.id) && (
                  <button
                    onClick={() => handleDeleteUser(member._id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                    title="Remove Personnel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}