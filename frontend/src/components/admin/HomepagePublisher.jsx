import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Send, 
  Trash2, 
  Plus, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Layers, 
  Eye, 
  Megaphone,
  Radio,
  Pin
} from 'lucide-react';
import { 
  getNotificationsApi, 
  createNotificationApi, 
  deleteNotificationApi 
} from '../../services/admin';
import { Pagination } from '../common/Pagination';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const HomepagePublisher = () => {
  const { announcements: demoAnnouncements, addAnnouncement: demoAdd, deleteAnnouncement: demoDelete, showToast, isDemoMode } = useApp();
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('announcement');
  const [urgent, setUrgent] = useState(false);
  const [publishedBy, setPublishedBy] = useState('MoES Training & Capacity Cell');
  const [summary, setSummary] = useState('');
  const [linkText, setLinkText] = useState('View Guidelines');

  // Real backend notifications state
  const [realNotifications, setRealNotifications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 6, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isDemoMode) {
      loadNotifications(1);
    }
  }, [isDemoMode]);

  const loadNotifications = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getNotificationsApi({ page, limit: 6 });
      if (res) {
        setRealNotifications(res.notifications || []);
        setPagination({
          page: res.page || page,
          limit: res.limit || 6,
          total: res.total || 0,
          totalPages: res.totalPages || 1
        });
      }
    } catch (err) {
      console.log('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    if (isDemoMode) {
      demoAdd({
        id: `ann-${Date.now()}`,
        title: title.trim(),
        category,
        date: new Date().toISOString().split('T')[0],
        urgent,
        publishedBy: publishedBy.trim() || 'MoES Training Cell',
        summary: summary.trim(),
        linkText: linkText.trim() || 'Read Circular',
        targetRole: 'all'
      });
      setTitle('');
      setSummary('');
      setShowModal(false);
      showToast('Announcement published (Demo Mode)', 'success');
      return;
    }

    // Map to backend schema: type must be 'announcement', 'achievement', or 'new_content'
    let backendType = 'announcement';
    if (category === 'achievement') backendType = 'achievement';
    else if (category === 'new_content' || category === 'New Course') backendType = 'new_content';

    setSubmitting(true);
    try {
      await createNotificationApi({
        type: backendType,
        title: title.trim(),
        body: summary.trim(),
        isPinned: urgent,
        isActive: true
      });

      showToast('Broadcast published to homepage successfully!', 'success');
      setTitle('');
      setSummary('');
      setShowModal(false);
      loadNotifications(1);
    } catch (err) {
      showToast(err.message || 'Failed to publish notification', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    const id = item._id || item.id;
    if (isDemoMode) {
      demoDelete(id);
      showToast('Announcement removed (Demo Mode)', 'info');
      return;
    }

    try {
      await deleteNotificationApi(id);
      showToast('Notification unpublished from homepage', 'success');
      loadNotifications(pagination.page);
    } catch (err) {
      showToast(err.message || 'Failed to delete notification', 'error');
    }
  };

  const displayList = isDemoMode ? demoAnnouncements : realNotifications;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Portal Broadcast & CMS Manager</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Homepage Announcements & Circulars CMS
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish real-time urgent meteorological alerts, achievements, and newly added learning modules dynamically to the homepage.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Broadcast</span>
        </button>
      </div>

      {/* Live Broadcasts Feed */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-500" />
          <span>Live Broadcasts Active on Homepage ({isDemoMode ? demoAnnouncements.length : pagination.total})</span>
        </h3>

        {loading ? (
          <div className="p-8 text-center"><LoadingSpinner text="Loading broadcasts..." /></div>
        ) : displayList.length === 0 ? (
          <div className="p-8 text-center text-slate-500 glass-card rounded-2xl border border-slate-200 dark:border-slate-800">
            No live broadcasts currently published. Click "Publish Broadcast" to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayList.map(item => {
              const id = item._id || item.id;
              const isUrgent = item.isPinned !== undefined ? item.isPinned : item.urgent;
              const itemType = item.type || item.category || 'announcement';
              const textBody = item.body || item.summary || '';
              const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.date || 'Recent');

              return (
                <div
                  key={id}
                  className={`glass-card p-6 rounded-2xl border shadow-sm flex flex-col justify-between space-y-4 relative ${
                    isUrgent 
                      ? 'border-red-300 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/20' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {isUrgent && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold uppercase px-3 py-1 rounded-bl-xl flex items-center gap-1">
                      <Pin className="w-2.5 h-2.5" />
                      Live Emergency Broadcast
                    </span>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {itemType}
                      </span>
                      <span className="text-[11px] text-slate-400">{dateStr}</span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {textBody}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">Source: <strong>{item.publishedBy || 'MoES Admin'}</strong></span>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold text-xs p-1"
                      title="Remove broadcast"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Unpublish</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isDemoMode && pagination.totalPages > 1 && (
          <div className="pt-2">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={loadNotifications}
            />
          </div>
        )}
      </div>

      {/* Publish Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-500" />
                <span>Publish Announcement / Notification to Homepage</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handlePublish} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Broadcast Headline / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IMD Monsoon Capacity Building Workshop (Nagpur Centre)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Announcement Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Urgent Circular">Urgent Circular</option>
                    <option value="Achievement">MoES Achievement</option>
                    <option value="New Course">New Course Curriculum</option>
                    <option value="Trainer Advisory">Trainer Advisory</option>
                    <option value="Live Workshop">Live Workshop Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Publishing Authority
                  </label>
                  <input
                    type="text"
                    value={publishedBy}
                    onChange={(e) => setPublishedBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Urgent Flag Toggle */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-amber-900 dark:text-amber-300">Highlight as Urgent Broadcast?</p>
                  <p className="text-[10px] text-amber-700 dark:text-amber-400">Triggers red marquee ticker on portal navbar.</p>
                </div>
                <input
                  type="checkbox"
                  checked={urgent}
                  onChange={(e) => setUrgent(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Announcement Description / Circular Text
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter official circular details, target audience, and guidelines..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none text-xs"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Broadcast to Homepage'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
