import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, User, Calendar as CalendarIcon, Grid, List as ListIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { staggerContainer, fadeUp } from '../../animation/variants';
import { AuthContext } from '../../context/AuthContext';
import timetableService from '../../services/timetableService';
import { Skeleton } from '../../components/ui/Skeleton';

export const StudentTimetable = () => {
  const { user } = useContext(AuthContext);
  const [activeDay, setActiveDay] = useState('MONDAY');
  const [isLoading, setIsLoading] = useState(true);
  const [timetableData, setTimetableData] = useState({});
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'weekly'

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-blue-500', 'bg-fuchsia-500', 'bg-rose-500', 'bg-slate-500'];

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await timetableService.getTimetableByStudent(user.id);
        const records = data.data || [];
        
        // Group by dayOfWeek
        const grouped = {};
        days.forEach(d => grouped[d] = []);
        
        records.forEach((record, index) => {
          const day = record.dayOfWeek ? record.dayOfWeek.toUpperCase() : 'MONDAY';
          if (!grouped[day]) grouped[day] = [];
          
          grouped[day].push({
            id: record.id || index,
            subject: record.subject?.name || 'Unknown Subject',
            time: `${record.startTime || 'TBD'} - ${record.endTime || 'TBD'}`,
            room: record.roomNo || 'TBD',
            teacher: record.teacher ? `${record.teacher.firstName} ${record.teacher.lastName}` : 'TBA',
            type: record.subject?.type || 'Lecture',
            color: colors[index % colors.length]
          });
        });
        
        // Sort each day by time (simplified sorting, assuming HH:MM format)
        Object.keys(grouped).forEach(day => {
          grouped[day].sort((a, b) => a.time.localeCompare(b.time));
        });
        
        setTimetableData(grouped);
      } catch (error) {
        console.error("Failed to fetch timetable", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimetable();
  }, [user]);

  const renderDailyView = () => (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
      <AnimatePresence mode="popLayout">
        {timetableData[activeDay]?.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 overflow-hidden relative z-10">
              <div className={`absolute inset-0 ${item.color} opacity-80`}></div>
              <Clock size={16} className="relative z-10 text-white" />
            </div>

            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${item.color.replace('bg-', 'text-')}`}>
                  {item.type}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.time}</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.subject}</h4>
              <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center">
                  <User size={14} className="mr-1.5 opacity-70" />
                  <span>{item.teacher}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1.5 opacity-70" />
                  <span>{item.room}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {(!timetableData[activeDay] || timetableData[activeDay].length === 0) && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400"
        >
          <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <CalendarIcon size={32} className="opacity-50" />
          </div>
          <p>No classes scheduled for {activeDay}. Enjoy your free day!</p>
        </motion.div>
      )}
    </div>
  );

  const renderWeeklyView = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {days.map((day, dayIndex) => (
        <motion.div 
          key={day}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: dayIndex * 0.1 }}
          className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800"
        >
          <h3 className="text-center font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
            {day.substring(0, 3)}
          </h3>
          <div className="space-y-3">
            {timetableData[day]?.length > 0 ? (
              timetableData[day].map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border-l-4 border-l-indigo-500 text-sm">
                  <p className="font-bold text-slate-900 dark:text-white truncate" title={item.subject}>{item.subject}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.time}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.room}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-xs text-slate-400 py-4">No classes</div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Timetable</h1>
          <p className="text-slate-500 dark:text-slate-400">View your class schedule and locations.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Toggle View Mode */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('daily')}
              className={`p-1.5 flex items-center rounded-md transition-colors ${viewMode === 'daily' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`p-1.5 flex items-center rounded-md transition-colors ${viewMode === 'weekly' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
            >
              <Grid size={18} />
            </button>
          </div>

          {/* Daily Mode Day Selector */}
          {viewMode === 'daily' && (
            <div className="flex items-center space-x-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeDay === day 
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="p-6 min-h-[400px]">
          {viewMode === 'daily' && (
            <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <CalendarIcon size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{activeDay.toLowerCase()}'s Schedule</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {timetableData[activeDay]?.length || 0} classes scheduled
                </p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          ) : viewMode === 'daily' ? (
            renderDailyView()
          ) : (
            renderWeeklyView()
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};
