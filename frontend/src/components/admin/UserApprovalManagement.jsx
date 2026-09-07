import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  GraduationCap, 
  Search, 
  Filter, 
  Shield, 
  Building, 
  AlertTriangle,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { 
  getAllUsersApi, 
  getPendingUsersApi, 
  approveUserApi, 
  updateUserStatusApi, 
  changeUserRoleApi 
} from '../../services/admin';
import { Pagination } from '../common/Pagination';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const UserApprovalManagement = () => {
  const { users: demoUsers, approveUser: demoApprove, rejectUser: demoReject, changeUserRole: demoChangeRole, showToast, isDemoMode } = useApp();
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'approved'
  const [searchQuery, setSearchQuery] = useState('');

  // Real backend states
  const [realUsers, setRealUsers] = useState([]);
  const [usersPagination, setUsersPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [realPending, setRealPending] = useState([]);
  const [pendingPagination, setPendingPagination] = useState({ page: 1, limit: 6, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!isDemoMode) {
      loadPendingUsers(1);
      loadAllUsers(1);
    }
  }, [isDemoMode]);

  const loadPendingUsers = async (page = 1) => {
    try {
      const res = await getPendingUsersApi({ page, limit: 6 });
      if (res && res.users) {
        setRealPending(res.users);
        setPendingPagination({
          page: res.page || page,
          limit: res.limit || 6,
          total: res.total || res.users.length,
          totalPages: res.totalPages || 1
        });
      }
    } catch (err) {
      console.log('Error loading pending users:', err);
    }
  };

  const loadAllUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getAllUsersApi({ page, limit: 10 });
      if (res && res.users) {
        setRealUsers(res.users);
        setUsersPagination({
          page: res.page || page,
          limit: res.limit || 10,
          total: res.total || res.users.length,
          totalPages: res.totalPages || 1
        });
      }
    } catch (err) {
      console.log('Error loading all users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (isDemoMode) {
      demoApprove(userId);
      return;
    }
    setActionLoading(userId);
    try {
      await approveUserApi(userId);
      showToast('User approved successfully!', 'success');
      loadPendingUsers(pendingPagination.page);
      loadAllUsers(usersPagination.page);
    } catch (err) {
      showToast(err.message || 'Failed to approve user', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (userId, currentActive) => {
    if (isDemoMode) {
      showToast(`User ${currentActive ? 'deactivated' : 'activated'} (Demo Mode)`, 'info');
      return;
    }
    setActionLoading(userId);
    try {
      await updateUserStatusApi(userId, !currentActive);
      showToast(`User status updated to ${!currentActive ? 'Active' : 'Inactive'}`, 'success');
      loadAllUsers(usersPagination.page);
    } catch (err) {
      showToast(err.message || 'Failed to update user status', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (isDemoMode) {
      demoChangeRole(userId, newRole);
      return;
    }
    setActionLoading(userId);
    try {
      await changeUserRoleApi(userId, newRole);
      showToast(`User role changed to ${newRole}`, 'success');
      loadAllUsers(usersPagination.page);
    } catch (err) {
      showToast(err.message || 'Failed to change user role', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Determine active lists
  const displayPending = isDemoMode ? demoUsers.filter(u => u.status === 'pending') : realPending;
  const displayUsers = isDemoMode ? demoUsers : realUsers;

  const filteredUsers = displayUsers.filter(user => {
    const userStatus = user.isApproved !== undefined 
      ? (user.isApproved ? 'approved' : 'pending') 
      : (user.status || 'approved');
    const matchesStatus = filterStatus === 'all' || userStatus === filterStatus;
    const matchesSearch = 
      (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.organization || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.role || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingTotal = isDemoMode ? displayPending.length : (pendingPagination.total || displayPending.length);
  const usersTotal = isDemoMode ? displayUsers.length : (usersPagination.total || displayUsers.length);
  const approvedCount = isDemoMode 
    ? displayUsers.filter(u => u.status === 'approved').length 
    : Math.max(0, usersTotal - pendingTotal);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner with Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-xs font-bold text-slate-500 uppercase">Pending Approvals</span>
          <div className="flex items-center justify-between mt-1">
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingTotal}</p>
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Requires Administrator vetting</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-xs font-bold text-slate-500 uppercase">Approved Active Users</span>
          <div className="flex items-center justify-between mt-1">
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{approvedCount}</p>
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Granted portal learning access</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-xs font-bold text-slate-500 uppercase">Total User Directory</span>
          <div className="flex items-center justify-between mt-1">
            <p className="text-2xl font-black text-slate-900 dark:text-white">{usersTotal}</p>
            <span className="p-2 rounded-xl bg-moes-100 dark:bg-moes-950/60 text-moes-600">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Trainees, Trainers & Admins</p>
        </div>
      </div>

      {/* Pending Queue Highlight Box */}
      {displayPending.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border-2 border-amber-400/60 bg-amber-50/20 dark:bg-amber-950/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Pending Registration Approval Queue ({pendingTotal})
              </h3>
            </div>
            <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold">
              Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayPending.map(user => {
              const uId = user._id || user.id;
              return (
                <div
                  key={uId}
                  className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-amber-300 dark:border-amber-900/60 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'user'}`}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-400"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{user.name}</h4>
                        <p className="text-[10px] text-slate-500">{user.email}</p>
                        <p className="text-[10px] text-moes-600 dark:text-sky-400 font-semibold">{user.designation || 'Specialist'} • {user.organization || 'IMD / MoES'}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      user.role === 'trainer' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg">
                    <p>Status: <strong className="text-amber-600">Pending Review</strong></p>
                    <p>Registered: <strong>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : (user.joinedDate || 'Recently')}</strong></p>
                  </div>

                  {/* Approve / Reject Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    {isDemoMode && (
                      <button
                        onClick={() => demoReject(uId)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleApprove(uId)}
                      disabled={actionLoading === uId}
                      className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{actionLoading === uId ? 'Approving...' : 'Approve User'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {!isDemoMode && pendingPagination.totalPages > 1 && (
            <div className="pt-2">
              <Pagination
                page={pendingPagination.page}
                totalPages={pendingPagination.totalPages}
                total={pendingPagination.total}
                limit={pendingPagination.limit}
                onPageChange={loadPendingUsers}
              />
            </div>
          )}
        </div>
      )}

      {/* Full User Directory & Role Management Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Institutional User Directory & Role Governance
            </h3>
            <p className="text-xs text-slate-500">
              Manage accounts, modify organizational permissions, and inspect credentials.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved Only</option>
              <option value="pending">Pending Only</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        {loading ? (
          <div className="p-8 text-center"><LoadingSpinner text="Loading user directory..." /></div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Organization</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Role Assignment</th>
                  <th className="p-3">Active State</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      No users found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => {
                    const uId = u._id || u.id;
                    const isApproved = u.isApproved !== undefined ? u.isApproved : (u.status === 'approved');
                    const isActive = u.isActive !== undefined ? u.isActive : true;

                    return (
                      <tr key={uId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name || 'user'}`}
                              alt={u.name}
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300"
                            />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                              <p className="text-[10px] text-slate-500">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{u.organization || 'MoES / IMD'}</p>
                          <p className="text-[10px] text-slate-500">{u.designation || 'Staff'}</p>
                        </td>

                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isApproved
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          }`}>
                            {isApproved ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                            <span className="capitalize">{isApproved ? 'Approved' : 'Pending'}</span>
                          </span>
                        </td>

                        {/* Role Switcher */}
                        <td className="p-3">
                          <select
                            value={u.role}
                            disabled={actionLoading === uId}
                            onChange={(e) => handleRoleChange(uId, e.target.value)}
                            className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold disabled:opacity-50"
                          >
                            <option value="trainee">Trainee</option>
                            <option value="trainer">Trainer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        {/* Active State Toggle */}
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(uId, isActive)}
                            disabled={actionLoading === uId}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300'
                            }`}
                          >
                            {isActive ? <ToggleRight className="w-3.5 h-3.5 text-emerald-600" /> : <ToggleLeft className="w-3.5 h-3.5 text-red-600" />}
                            <span>{isActive ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>

                        <td className="p-3 text-right">
                          {!isApproved ? (
                            <button
                              onClick={() => handleApprove(uId)}
                              disabled={actionLoading === uId}
                              className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm disabled:opacity-50"
                            >
                              Approve
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">Approved</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isDemoMode && usersPagination.totalPages > 1 && (
          <div className="pt-2">
            <Pagination
              page={usersPagination.page}
              totalPages={usersPagination.totalPages}
              total={usersPagination.total}
              limit={usersPagination.limit}
              onPageChange={loadAllUsers}
            />
          </div>
        )}

      </div>

    </div>
  );
};
