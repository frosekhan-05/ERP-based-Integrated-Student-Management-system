import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Trophy, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { AnimatedNumber } from '../../animation/AnimatedNumber';
import { staggerContainer, fadeUp } from '../../animation/variants';

export const StudentMarks = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Simulated API response
    setTimeout(() => {
      setStats({
        cgpa: 3.84,
        rank: 12,
        totalCredits: 120,
        completedCredits: 45
      });
    }, 400);
  }, []);

  const marksData = [
    { id: 1, subject: 'Advanced Mathematics', code: 'MATH-401', credits: 4, midTerm: 88, final: 92, assignment: 95, total: 92, grade: 'A' },
    { id: 2, subject: 'Computer Science 101', code: 'CS-101', credits: 3, midTerm: 75, final: 82, assignment: 88, total: 81, grade: 'B' },
    { id: 3, subject: 'Physics Practical', code: 'PHY-202P', credits: 2, midTerm: 90, final: 94, assignment: 90, total: 92, grade: 'A' },
    { id: 4, subject: 'Database Systems', code: 'CS-305', credits: 4, midTerm: 65, final: 78, assignment: 85, total: 76, grade: 'C' },
    { id: 5, subject: 'Software Engineering', code: 'CS-410', credits: 3, midTerm: 85, final: 88, assignment: 92, total: 88, grade: 'B+' },
  ];

  const getGradeColor = (grade) => {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Current CGPA', value: stats?.cgpa || 0, isDecimal: true, icon: <Trophy className="h-5 w-5"/>, color: 'text-yellow-600 dark:text-yellow-400' },
          { label: 'Class Rank', value: stats?.rank || 0, prefix: '#', icon: <TrendingUp className="h-5 w-5"/>, color: 'text-indigo-600 dark:text-indigo-400' },
          { label: 'Credits Earned', value: stats?.completedCredits || 0, icon: <FileText className="h-5 w-5"/>, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Academic Standing', stringValue: 'Excellent', icon: <AlertCircle className="h-5 w-5"/>, color: 'text-blue-600 dark:text-blue-400' },
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

      <motion.div variants={fadeUp}>
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Semester Results (Fall 2023)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Subject</th>
                  <th className="px-6 py-4 font-semibold">Credits</th>
                  <th className="px-6 py-4 font-semibold">Mid-Term</th>
                  <th className="px-6 py-4 font-semibold">Assignment</th>
                  <th className="px-6 py-4 font-semibold">Final</th>
                  <th className="px-6 py-4 font-semibold">Total (%)</th>
                  <th className="px-6 py-4 font-semibold text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {marksData.map((mark, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={mark.id} 
                    className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">{mark.subject}</p>
                      <p className="text-xs opacity-70 mt-0.5">{mark.code}</p>
                    </td>
                    <td className="px-6 py-4">{mark.credits}</td>
                    <td className="px-6 py-4">{mark.midTerm}</td>
                    <td className="px-6 py-4">{mark.assignment}</td>
                    <td className="px-6 py-4">{mark.final}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{mark.total}%</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ${getGradeColor(mark.grade)}`}>
                        {mark.grade}
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
