import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, User, Calendar as CalendarIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { staggerContainer, fadeUp } from '../../animation/variants';

export const StudentTimetable = () => {
  const [activeDay, setActiveDay] = useState('Monday');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const timetableData = {
    Monday: [
      { id: 1, subject: 'Advanced Mathematics', time: '09:00 AM - 10:30 AM', room: 'Room 402', teacher: 'Prof. Alan Turing', type: 'Lecture', color: 'bg-indigo-500' },
      { id: 2, subject: 'Computer Science 101', time: '11:00 AM - 12:30 PM', room: 'Lab 2', teacher: 'Dr. Grace Hopper', type: 'Lab', color: 'bg-emerald-500' },
      { id: 3, subject: 'Physics Practical', time: '02:00 PM - 04:00 PM', room: 'Physics Lab', teacher: 'Dr. Richard Feynman', type: 'Practical', color: 'bg-amber-500' },
    ],
    Tuesday: [
      { id: 4, subject: 'Database Systems', time: '10:00 AM - 11:30 AM', room: 'Room 305', teacher: 'Dr. E.F. Codd', type: 'Lecture', color: 'bg-blue-500' },
      { id: 5, subject: 'Software Engineering', time: '01:00 PM - 02:30 PM', room: 'Room 410', teacher: 'Prof. Margaret Hamilton', type: 'Lecture', color: 'bg-fuchsia-500' },
    ],
    Wednesday: [
      { id: 6, subject: 'Advanced Mathematics', time: '09:00 AM - 10:30 AM', room: 'Room 402', teacher: 'Prof. Alan Turing', type: 'Lecture', color: 'bg-indigo-500' },
      { id: 7, subject: 'Web Technologies', time: '11:00 AM - 01:00 PM', room: 'Lab 1', teacher: 'Dr. Tim Berners-Lee', type: 'Lab', color: 'bg-rose-500' },
    ],
    Thursday: [
      { id: 8, subject: 'Computer Science 101', time: '09:30 AM - 11:00 AM', room: 'Room 301', teacher: 'Dr. Grace Hopper', type: 'Lecture', color: 'bg-emerald-500' },
      { id: 9, subject: 'Database Systems', time: '11:30 AM - 01:00 PM', room: 'Lab 3', teacher: 'Dr. E.F. Codd', type: 'Lab', color: 'bg-blue-500' },
      { id: 10, subject: 'Library Hour', time: '02:00 PM - 03:00 PM', room: 'Main Library', teacher: 'Self Study', type: 'Study', color: 'bg-slate-500' },
    ],
    Friday: [
      { id: 11, subject: 'Software Engineering', time: '10:00 AM - 12:00 PM', room: 'Room 410', teacher: 'Prof. Margaret Hamilton', type: 'Lecture', color: 'bg-fuchsia-500' },
      { id: 12, subject: 'Web Technologies', time: '01:00 PM - 03:00 PM', room: 'Room 205', teacher: 'Dr. Tim Berners-Lee', type: 'Lecture', color: 'bg-rose-500' },
    ],
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Timetable</h1>
          <p className="text-slate-500 dark:text-slate-400">View your weekly class schedule and locations.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeDay === day 
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              {day.substring(0, 3)}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="p-6 min-h-[400px]">
          <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{activeDay}'s Schedule</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {timetableData[activeDay]?.length || 0} classes scheduled for today
              </p>
            </div>
          </div>

          {!isLoading && (
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
              {timetableData[activeDay]?.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
              
              {(!timetableData[activeDay] || timetableData[activeDay].length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
                  <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <CalendarIcon size={32} className="opacity-50" />
                  </div>
                  <p>No classes scheduled for {activeDay}. Enjoy your free day!</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};
