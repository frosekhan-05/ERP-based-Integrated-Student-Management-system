import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { AnimatedNumber } from '../../animation/AnimatedNumber';
import { staggerContainer, fadeUp } from '../../animation/variants';

export const StudentAttendance = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Simulated API response for attendance
    setTimeout(() => {
      setStats({
        totalClasses: 120,
        attended: 110,
        absent: 8,
        late: 2,
        percentage: 91.6
      });
    }, 500);
  }, []);

  const getDaysInMonth = (year, month) => {
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  };

  // Mock past 30 days of attendance
  const generateMockCalendar = () => {
    const days = getDaysInMonth(2023, 9); // October
    return days.map(day => {
      const isWeekend = (new Date(2023, 9, day).getDay() % 6 === 0);
      if (isWeekend) return { day, status: 'weekend' };
      
      const rand = Math.random();
      let status = 'present';
      if (rand > 0.9) status = 'absent';
      else if (rand > 0.8) status = 'late';
      
      return { day, status };
    });
  };

  const calendarDays = generateMockCalendar();

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
      case 'absent': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/50';
      case 'late': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Overall Attendance', value: stats?.percentage || 0, suffix: '%', icon: <CalendarIcon className="h-5 w-5"/>, color: 'text-indigo-600 dark:text-indigo-400' },
          { label: 'Total Classes', value: stats?.totalClasses || 0, icon: <Clock className="h-5 w-5"/>, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Classes Attended', value: stats?.attended || 0, icon: <CheckCircle className="h-5 w-5"/>, color: 'text-emerald-600 dark:text-emerald-400' },
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

      <motion.div variants={fadeUp}>
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">October 2023 Overview</h3>
          
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-2">
                {day}
              </div>
            ))}
            
            {/* Empty slots for starting day of month (Oct 1 2023 was a Sunday, so no empty slots needed, but just an example) */}
            
            {calendarDays.map(({day, status}) => (
              <div 
                key={day} 
                className={`flex flex-col items-center justify-center p-2 rounded-xl border ${getStatusColor(status)} transition-colors duration-200`}
              >
                <span className="text-sm font-semibold">{day}</span>
                {status !== 'weekend' && (
                  <span className="text-[10px] mt-1 capitalize opacity-80">{status}</span>
                )}
              </div>
            ))}
          </div>

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
