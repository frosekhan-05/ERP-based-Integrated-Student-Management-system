import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { AnimatedNumber } from '../../animation/AnimatedNumber';
import { staggerContainer, fadeUp } from '../../animation/variants';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import attendanceService from '../../services/attendanceService';
import { Skeleton } from '../../components/ui/Skeleton';

export const StudentAttendance = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyAttendance, setDailyAttendance] = useState(null);
  const [isDailyLoading, setIsDailyLoading] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchOverallAttendance = async () => {
      if (!user) return;
      try {
        const data = await attendanceService.getAttendanceByStudent(user.id);
        const records = data.data || [];
        
        let attended = 0;
        let absent = 0;
        let late = 0;

        records.forEach(record => {
          if (record.status === 'PRESENT') attended++;
          else if (record.status === 'ABSENT') absent++;
          else if (record.status === 'LATE') late++;
        });

        const totalClasses = records.length;
        const percentage = totalClasses > 0 ? (attended / totalClasses) * 100 : 0;

        setStats({
          totalClasses,
          attended,
          absent,
          late,
          percentage: Number(percentage.toFixed(1))
        });
      } catch (error) {
        console.error("Failed to fetch attendance stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverallAttendance();
  }, [user, refreshTrigger]);

  useEffect(() => {
    const fetchDailyAttendance = async () => {
      if (!user || !selectedDate) return;
      setIsDailyLoading(true);
      try {
        const data = await attendanceService.getAttendanceByStudent(user.id, selectedDate);
        setDailyAttendance(data.data || []);
      } catch (error) {
        console.error("Failed to fetch daily attendance", error);
      } finally {
        setIsDailyLoading(false);
      }
    };

    fetchDailyAttendance();
  }, [user, selectedDate, refreshTrigger]);

  const handleMarkAttendance = async () => {
    setIsMarking(true);
    try {
      const response = await attendanceService.markSelfAttendance(selectedDate);
      const newRecord = response.data || response;
      
      const validRecord = {
        id: newRecord?.id || Date.now(),
        status: newRecord?.status || 'PRESENT',
        markedAt: newRecord?.markedAt || new Date().toISOString(),
        date: newRecord?.date || selectedDate,
        subject: newRecord?.subject || { name: 'Daily Attendance' }
      };

      setDailyAttendance(prev => prev && prev.length > 0 ? [...prev, validRecord] : [validRecord]);
      
      setStats(prev => {
        if (!prev) return prev;
        const attended = validRecord.status === 'PRESENT' ? prev.attended + 1 : prev.attended;
        const late = validRecord.status === 'LATE' ? prev.late + 1 : prev.late;
        const totalClasses = prev.totalClasses + 1;
        const percentage = totalClasses > 0 ? ((attended + late) / totalClasses) * 100 : 0;
        
        return {
          ...prev,
          attended,
          late,
          totalClasses,
          percentage: Number(percentage.toFixed(1))
        };
      });

      toast.success('Attendance marked successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to mark attendance');
    } finally {
      setIsMarking(false);
    }
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const isAlreadyMarked = isToday && dailyAttendance && dailyAttendance.length > 0;

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'PRESENT': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
      case 'ABSENT': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/50';
      case 'LATE': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
      default: return 'bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border-transparent';
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Attendance</h1>
          <p className="text-slate-500 dark:text-slate-400">Track your daily class presence and overall percentage.</p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { label: 'Overall Attendance', value: stats?.percentage || 0, suffix: '%', icon: <CalendarIcon className="h-5 w-5"/>, color: 'text-indigo-600 dark:text-indigo-400' },
            { label: 'Total Classes', value: stats?.totalClasses || 0, icon: <Clock className="h-5 w-5"/>, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Classes Attended', value: (stats?.attended || 0) + (stats?.late || 0), icon: <CheckCircle className="h-5 w-5"/>, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Late Arrivals', value: stats?.late || 0, icon: <Clock className="h-5 w-5"/>, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Classes Missed', value: stats?.absent || 0, icon: <XCircle className="h-5 w-5"/>, color: 'text-rose-600 dark:text-rose-400' },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  <AnimatedNumber value={stat.value} />
                  {stat.suffix && <span>{stat.suffix}</span>}
                </h3>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div variants={fadeUp}>
        <Card className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Attendance Record</h3>
            <div className="flex items-center space-x-4">
              {isToday && (
                <button
                  onClick={handleMarkAttendance}
                  disabled={isAlreadyMarked || isMarking}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    isAlreadyMarked 
                      ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'
                  }`}
                >
                  {isMarking ? 'Marking...' : isAlreadyMarked ? 'Attendance Marked' : 'Mark Attendance'}
                </button>
              )}
              <div className="relative">
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-4 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {isDailyLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Skeleton className="h-24 rounded-xl w-full" />
              </motion.div>
            ) : dailyAttendance && dailyAttendance.length > 0 ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {dailyAttendance.map((record) => (
                  <div 
                    key={record.id}
                    className={`flex items-center justify-between p-4 rounded-xl border ${getStatusColor(record.status)}`}
                  >
                    <div>
                      <h4 className="font-bold">{record.subject?.name || 'Daily Attendance'}</h4>
                      <div className="flex items-center text-sm opacity-80 mt-1">
                        <Clock size={14} className="mr-1" />
                        <span>Marked at {new Date(record.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/50 dark:bg-black/20">
                        {record.status}
                      </span>
                      {record.teacher && (
                        <p className="text-xs mt-1 opacity-80">by {record.teacher.firstName} {record.teacher.lastName}</p>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-slate-500 dark:text-slate-400"
              >
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p>No attendance records found for {selectedDate}.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center space-x-6 mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-400 mr-2"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Present</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-rose-400 mr-2"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Absent</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-400 mr-2"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Late</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
