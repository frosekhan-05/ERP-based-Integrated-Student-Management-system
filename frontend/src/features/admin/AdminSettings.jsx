import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Settings, Bell, Shield, Database } from 'lucide-react';
import settingsService from '../../services/settingsService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { staggerContainer, fadeUp } from '../../animation/variants';
import { toast } from 'react-toastify';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    instituteName: '',
    academicYear: '',
    currentSemester: 1,
    emailNotifications: false,
    smsNotifications: false,
    theme: 'system'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await settingsService.getSettings();
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingsService.updateSettings(settings);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-4xl"
    >
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage global application preferences</p>
        </div>
      </motion.div>

      <form onSubmit={handleSave}>
        <div className="space-y-6">
          <motion.div variants={fadeUp}>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Database size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Academic Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Institute Name</label>
                  <input 
                    type="text" 
                    name="instituteName"
                    value={settings.instituteName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Academic Year</label>
                  <input 
                    type="text" 
                    name="academicYear"
                    value={settings.academicYear}
                    onChange={handleChange}
                    placeholder="e.g. 2023-2024"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Semester</label>
                  <select 
                    name="currentSemester"
                    value={settings.currentSemester}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
                  >
                    {[1,2,3,4,5,6,7,8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <Bell size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h2>
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                  <input 
                    type="checkbox" 
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                    <p className="text-sm text-slate-500">Send automatic emails for attendance and marks updates</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                  <input 
                    type="checkbox" 
                    name="smsNotifications"
                    checked={settings.smsNotifications}
                    onChange={handleChange}
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">SMS Alerts</p>
                    <p className="text-sm text-slate-500">Send SMS for urgent announcements and fee reminders</p>
                  </div>
                </label>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} className="flex justify-end gap-4 pt-4">
            <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};
