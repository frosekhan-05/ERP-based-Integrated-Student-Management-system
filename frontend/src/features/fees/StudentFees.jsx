import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AnimatedNumber } from '../../animation/AnimatedNumber';
import { staggerContainer, fadeUp } from '../../animation/variants';

export const StudentFees = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Simulated API response
    setTimeout(() => {
      setStats({
        totalFees: 15000,
        paidFees: 10000,
        dueFees: 5000,
        nextDueDate: '2023-11-15'
      });
    }, 400);
  }, []);

  const transactions = [
    { id: 'TXN-847291', date: 'Oct 01, 2023', amount: 5000, description: 'First Semester Tuition - Installment 2', status: 'completed', method: 'Credit Card' },
    { id: 'TXN-847103', date: 'Sep 01, 2023', amount: 5000, description: 'First Semester Tuition - Installment 1', status: 'completed', method: 'Bank Transfer' },
    { id: 'TXN-846922', date: 'Aug 15, 2023', amount: 500, description: 'Library Registration Fee', status: 'completed', method: 'Debit Card' },
  ];

  const upcomingFees = [
    { id: 'FEE-991', description: 'First Semester Tuition - Final Installment', dueDate: 'Nov 15, 2023', amount: 5000, status: 'pending' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fee Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your payments, dues, and download receipts.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={fadeUp}>
          <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0">
            <div className="relative z-10">
              <p className="text-indigo-100 font-medium">Total Fees (Academic Year)</p>
              <h3 className="text-3xl font-bold mt-2">
                ${stats ? <AnimatedNumber value={stats.totalFees} /> : '0'}
              </h3>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 scale-150 translate-x-4 translate-y-4">
              <CreditCard size={120} />
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={fadeUp}>
          <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
            <div className="relative z-10">
              <p className="text-emerald-100 font-medium">Total Paid</p>
              <h3 className="text-3xl font-bold mt-2">
                ${stats ? <AnimatedNumber value={stats.paidFees} /> : '0'}
              </h3>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 scale-150 translate-x-4 translate-y-4">
              <CheckCircle2 size={120} />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-rose-500 to-rose-600 text-white border-0">
            <div className="relative z-10">
              <p className="text-rose-100 font-medium">Pending Dues</p>
              <h3 className="text-3xl font-bold mt-2">
                ${stats ? <AnimatedNumber value={stats.dueFees} /> : '0'}
              </h3>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 scale-150 translate-x-4 translate-y-4">
              <AlertCircle size={120} />
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={fadeUp}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center">
                  View all <ArrowUpRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <div className="space-y-4">
                {transactions.map((txn, i) => (
                  <motion.div 
                    key={txn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-4 shrink-0">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{txn.description}</h4>
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1 space-x-2">
                          <span>{txn.date}</span>
                          <span>•</span>
                          <span>{txn.method}</span>
                          <span>•</span>
                          <span className="font-mono text-xs">{txn.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(txn.amount)}</span>
                      <button className="text-xs text-indigo-600 hover:text-indigo-700 mt-1 flex items-center">
                        <Download size={12} className="mr-1" /> Receipt
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <motion.div variants={fadeUp}>
            <Card className="p-6 border-l-4 border-l-amber-500">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upcoming Payment</h3>
              
              {upcomingFees.map(fee => (
                <div key={fee.id}>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Description</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{fee.description}</p>
                  </div>
                  
                  <div className="flex justify-between mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Due Date</p>
                      <p className="font-semibold text-rose-600 dark:text-rose-400">{fee.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Amount</p>
                      <p className="font-bold text-xl text-slate-900 dark:text-white">{formatCurrency(fee.amount)}</p>
                    </div>
                  </div>
                  
                  <Button className="w-full justify-center flex items-center space-x-2">
                    <CreditCard size={18} />
                    <span>Pay Now</span>
                  </Button>
                  <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center">
                    <CheckCircle2 size={12} className="mr-1 text-emerald-500" /> Secure encrypted payment
                  </p>
                </div>
              ))}
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
