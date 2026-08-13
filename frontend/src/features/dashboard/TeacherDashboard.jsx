import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Calendar, Clock, Bell } from 'lucide-react';
import teacherService from '../../services/teacherService';
import { Card } from '../../components/ui/Card';
import { AnimatedNumber } from '../../animation/AnimatedNumber';
import { staggerContainer, fadeUp } from '../../animation/variants';
import { Skeleton } from '../../components/ui/Skeleton';

export const TeacherDashboard = () => {
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await teacherService.getDashboard().catch(() => ({
        totalStudents: 120,
        classesToday: 4,
        pendingAssignments: 15,
        upcomingExams: 2
      }));
      
      const annData = await teacherService.getAnnouncements().catch(() => [
        { id: 1, title: 'Faculty Meeting', date: '2023-11-20', content: 'Monthly faculty meeting at 3 PM in Room 401.' },
        { id: 2, title: 'Midterm Grades Due', date: '2023-11-25', content: 'Please ensure all midterm grades are uploaded.' }
      ]);

      setStats(data || {});
      setAnnouncements(annData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Teacher Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Overview of your classes and activities</p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Students', value: stats?.totalStudents || 0, icon: <Users className="h-5 w-5"/>, color: 'text-indigo-600 dark:text-indigo-400' },
            { label: 'Classes Today', value: stats?.classesToday || 0, icon: <BookOpen className="h-5 w-5"/>, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Pending Grading', value: stats?.pendingAssignments || 0, icon: <Clock className="h-5 w-5"/>, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Upcoming Exams', value: stats?.upcomingExams || 0, icon: <Calendar className="h-5 w-5"/>, color: 'text-rose-600 dark:text-rose-400' },
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
                </h3>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Today's Schedule</h3>
          {isLoading ? (
            <Skeleton className="h-40 rounded-xl w-full" />
          ) : (
            <div className="space-y-4">
              {[
                { time: '09:00 AM', subject: 'Computer Science 101', room: 'Room 302', type: 'Lecture' },
                { time: '11:00 AM', subject: 'Data Structures', room: 'Lab 1', type: 'Lab' },
                { time: '02:00 PM', subject: 'Software Engineering', room: 'Room 405', type: 'Lecture' },
              ].map((cls, i) => (
                <div key={i} className="flex items-center p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-24 text-sm font-bold text-indigo-600 dark:text-indigo-400">{cls.time}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white">{cls.subject}</h4>
                    <p className="text-sm text-slate-500">{cls.room}</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {cls.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Announcements</h3>
            <Bell size={18} className="text-slate-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-40 rounded-xl w-full" />
          ) : announcements.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No recent announcements</div>
          ) : (
            <div className="space-y-4">
              {announcements.map(ann => (
                <div key={ann.id} className="pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{ann.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-2">{new Date(ann.date).toLocaleDateString()}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};
