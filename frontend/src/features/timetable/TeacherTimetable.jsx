import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, Loader2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { staggerContainer, fadeUp } from '../../animation/variants';

export const TeacherTimetable = () => {
  const [schedule, setSchedule] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Monday');
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    // Simulate fetching teacher timetable
    setIsLoading(true);
    setTimeout(() => {
      const mockSchedule = {
        'Monday': [
          { id: 1, time: '09:00 AM - 10:30 AM', subject: 'Computer Science 101', type: 'Lecture', room: 'Room 302', course: 'B.Tech CS - Sem 1' },
          { id: 2, time: '11:00 AM - 12:30 PM', subject: 'Data Structures', type: 'Lab', room: 'Computer Lab 1', course: 'B.Tech CS - Sem 3' }
        ],
        'Tuesday': [
          { id: 3, time: '10:00 AM - 11:30 AM', subject: 'Software Engineering', type: 'Lecture', room: 'Room 405', course: 'B.Tech CS - Sem 5' },
          { id: 4, time: '02:00 PM - 03:30 PM', subject: 'Computer Science 101', type: 'Tutorial', room: 'Room 302', course: 'B.Tech CS - Sem 1' }
        ],
        'Wednesday': [
          { id: 5, time: '09:00 AM - 12:00 PM', subject: 'Data Structures', type: 'Lab', room: 'Computer Lab 1', course: 'B.Tech CS - Sem 3' }
        ],
        'Thursday': [
          { id: 6, time: '11:00 AM - 12:30 PM', subject: 'Software Engineering', type: 'Lecture', room: 'Room 405', course: 'B.Tech CS - Sem 5' },
          { id: 7, time: '01:30 PM - 03:00 PM', subject: 'Computer Science 101', type: 'Lecture', room: 'Room 302', course: 'B.Tech CS - Sem 1' }
        ],
        'Friday': [
          { id: 8, time: '10:00 AM - 11:30 AM', subject: 'Data Structures', type: 'Lecture', room: 'Room 401', course: 'B.Tech CS - Sem 3' },
          { id: 9, time: '02:00 PM - 04:00 PM', subject: 'Faculty Meeting', type: 'Meeting', room: 'Conference Room', course: 'All Faculty' }
        ]
      };
      setSchedule(mockSchedule);
      setIsLoading(false);
    }, 500);
  }, []);

  const getTypeColor = (type) => {
    switch(type) {
      case 'Lecture': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400';
      case 'Lab': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400';
      case 'Tutorial': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Timetable</h1>
          <p className="text-slate-500 dark:text-slate-400">View your weekly teaching schedule</p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="overflow-hidden">
          <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 py-4 px-6 text-center font-medium whitespace-nowrap transition-colors border-b-2 ${
                  selectedDay === day 
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </div>
            ) : schedule[selectedDay] && schedule[selectedDay].length > 0 ? (
              <div className="space-y-4">
                {schedule[selectedDay].map((cls, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={cls.id} 
                    className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:shadow-md transition-shadow bg-white dark:bg-slate-900"
                  >
                    <div className="w-full md:w-48 shrink-0">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                        <Clock size={16} />
                        {cls.time}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{cls.subject}</h3>
                          <p className="text-sm font-medium text-slate-500 mt-1">{cls.course}</p>
                        </div>
                        <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getTypeColor(cls.type)}`}>
                          {cls.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                        <MapPin size={14} />
                        {cls.room}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <CalendarIcon size={48} className="opacity-20 mb-4" />
                <p className="text-lg font-medium">No classes scheduled for {selectedDay}</p>
                <p className="text-sm mt-1">Enjoy your free time or use it for preparation.</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
