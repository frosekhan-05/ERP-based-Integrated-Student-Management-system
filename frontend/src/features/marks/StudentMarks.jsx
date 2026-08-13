import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trophy, TrendingUp, AlertCircle, Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { AnimatedNumber } from '../../animation/AnimatedNumber';
import { staggerContainer, fadeUp } from '../../animation/variants';
import { AuthContext } from '../../context/AuthContext';
import { Skeleton } from '../../components/ui/Skeleton';
import marksService from '../../services/marksService';
import { toast } from 'react-toastify';

export const StudentMarks = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [marksData, setMarksData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarksData = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        // Fetch marks list
        const marksResponse = await marksService.getMarksByStudent(user.id);
        const marks = marksResponse.data || [];
        setMarksData(marks);

        // Fetch report for stats
        try {
            const reportResponse = await marksService.getStudentReport(user.id);
            if (reportResponse.data) {
                setStats({
                    cgpa: reportResponse.data.cgpa || 0,
                    rank: reportResponse.data.rank || 0,
                    totalCredits: reportResponse.data.totalCredits || 0,
                    completedCredits: reportResponse.data.completedCredits || 0,
                    standing: reportResponse.data.standing || 'Good'
                });
            }
        } catch (reportError) {
            console.error("Failed to fetch report, calculating basic stats", reportError);
            // Fallback calculation if report API fails or isn't fully implemented
            let totalGpa = 0;
            let validMarksCount = 0;
            marks.forEach(m => {
                if (m.gpa) {
                    totalGpa += m.gpa;
                    validMarksCount++;
                }
            });
            const cgpa = validMarksCount > 0 ? (totalGpa / validMarksCount) : 0;
            setStats({
                cgpa: Number(cgpa.toFixed(2)),
                rank: '-',
                totalCredits: marks.length * 3, // mock
                completedCredits: marks.length * 3, // mock
                standing: cgpa >= 3.0 ? 'Excellent' : 'Good'
            });
        }
      } catch (error) {
        console.error("Failed to fetch marks", error);
        toast.error("Could not load your marks data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarksData();
  }, [user]);

  const getGradeColor = (grade) => {
    if (!grade) return 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-400';
    if (grade.startsWith('A')) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
    if (grade.startsWith('C')) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
    return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400';
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Marks</h1>
          <p className="text-slate-500 dark:text-slate-400">View your academic performance and grades.</p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Current CGPA', value: stats?.cgpa || 0, isDecimal: true, icon: <Trophy className="h-5 w-5"/>, color: 'text-yellow-600 dark:text-yellow-400' },
          { label: 'Class Rank', value: stats?.rank || 0, prefix: '#', icon: <TrendingUp className="h-5 w-5"/>, color: 'text-indigo-600 dark:text-indigo-400' },
          { label: 'Credits Earned', value: stats?.completedCredits || 0, icon: <FileText className="h-5 w-5"/>, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Academic Standing', stringValue: stats?.standing || 'Good', icon: <AlertCircle className="h-5 w-5"/>, color: 'text-blue-600 dark:text-blue-400' },
        ].map((stat, i) => (
          <motion.div key={i} variants={fadeUp}>
            <Card className="p-6 h-full flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {stat.prefix && <span>{stat.prefix}</span>}
                {stat.stringValue ? stat.stringValue : <AnimatedNumber value={stat.value} decimals={stat.isDecimal ? 2 : 0} />}
                {stat.suffix && <span>{stat.suffix}</span>}
              </h3>
            </Card>
          </motion.div>
        ))}
      </div>
      )}

      <motion.div variants={fadeUp}>
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Semester Results</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Subject</th>
                  <th className="px-6 py-4 font-semibold">Exam</th>
                  <th className="px-6 py-4 font-semibold">Marks</th>
                  <th className="px-6 py-4 font-semibold">Total (%)</th>
                  <th className="px-6 py-4 font-semibold text-center">Grade</th>
                  <th className="px-6 py-4 font-semibold text-center">Result</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                    <tr>
                        <td colSpan="6" className="p-4">
                            <Skeleton className="h-10 w-full mb-2" />
                            <Skeleton className="h-10 w-full mb-2" />
                        </td>
                    </tr>
                ) : marksData.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                            <div className="flex flex-col items-center">
                                <Search className="h-10 w-10 opacity-20 mb-3" />
                                <p>No marks have been uploaded yet.</p>
                            </div>
                        </td>
                    </tr>
                ) : marksData.map((mark, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={mark.id} 
                    className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">{mark.subjectName}</p>
                    </td>
                    <td className="px-6 py-4">{mark.examName || 'Final Exam'}</td>
                    <td className="px-6 py-4">{mark.marksObtained} / {mark.maxMarks}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {mark.percentage ? mark.percentage.toFixed(1) : ((mark.marksObtained / mark.maxMarks) * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ${getGradeColor(mark.grade)}`}>
                        {mark.grade || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <span className={`text-xs font-bold ${mark.result === 'PASS' ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {mark.result || '-'}
                        </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

    </motion.div>
  );
};
