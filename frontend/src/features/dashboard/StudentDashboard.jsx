import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ClipboardCheck, FileText, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { AnimatedNumber } from '../../animation/AnimatedNumber';
import { staggerContainer, fadeUp } from '../../animation/variants';
import { Skeleton } from '../../components/ui/Skeleton';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching student-specific stats
    const fetchStats = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); // fake network delay
        setStats({
          attendance: 92,
          assignmentsPending: 3,
          upcomingExams: 2,
          overallGrade: 88,
        });
      } catch (error) {
        console.error("Error fetching student stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Overall Attendance', value: stats?.attendance || 0, suffix: '%', icon: <ClipboardCheck className="h-6 w-6" />, color: 'bg-emerald-500', text: 'text-emerald-500' },
    { title: 'Pending Assignments', value: stats?.assignmentsPending || 0, icon: <FileText className="h-6 w-6" />, color: 'bg-amber-500', text: 'text-amber-500' },
    { title: 'Upcoming Exams', value: stats?.upcomingExams || 0, icon: <Calendar className="h-6 w-6" />, color: 'bg-blue-500', text: 'text-blue-500' },
    { title: 'Overall Grade', value: stats?.overallGrade || 0, suffix: '%', icon: <TrendingUp className="h-6 w-6" />, color: 'bg-indigo-500', text: 'text-indigo-500' },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.username || 'Student'}!</h1>
          <p className="text-slate-500 dark:text-slate-400">Here's your academic overview for this semester</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array(4).fill(0).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </Card>
            ))
          : statCards.map((stat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="p-6 overflow-hidden relative">
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2 flex items-baseline">
                        <AnimatedNumber value={stat.value} />
                        {stat.suffix && <span className="text-lg ml-1 text-slate-600 dark:text-slate-300">{stat.suffix}</span>}
                      </h3>
                    </div>
                    <div className={`p-4 rounded-2xl ${stat.color} bg-opacity-10 ${stat.text}`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${stat.color} opacity-5`}></div>
                </Card>
              </motion.div>
            ))}
      </div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Today's Classes</h3>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center">
              Full Timetable <ArrowUpRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {[
              { subject: 'Advanced Mathematics', time: '09:00 AM - 10:30 AM', room: 'Room 402' },
              { subject: 'Computer Science 101', time: '11:00 AM - 12:30 PM', room: 'Lab 2' },
              { subject: 'Physics Practical', time: '02:00 PM - 04:00 PM', room: 'Physics Lab' },
            ].map((cls, i) => (
              <div key={i} className="flex items-start pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{cls.subject}</p>
                  <div className="flex items-center justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>{cls.time}</span>
                    <span className="font-medium bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">{cls.room}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Announcements</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
              <h4 className="text-sm font-bold text-indigo-900">Mid-term Examinations</h4>
              <p className="text-sm text-indigo-700 mt-1">The schedule for mid-term exams has been published. Please check the notice board.</p>
              <p className="text-xs text-indigo-400 mt-2">Posted 2 days ago</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <h4 className="text-sm font-bold text-amber-900">Fee Payment Deadline</h4>
              <p className="text-sm text-amber-700 mt-1">Last date for 2nd semester fee payment is approaching. Clear dues to avoid late fees.</p>
              <p className="text-xs text-amber-400 mt-2">Posted 5 days ago</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
