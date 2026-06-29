// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Save, User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
// import { adminCredentials as defaultCreds } from '../config/adminCredentials';

// export default function AccountSettings() {
//   const [username, setUsername] = useState(() => {
//     const savedCreds = localStorage.getItem('admin_credentials');
//     if (savedCreds) {
//       return JSON.parse(savedCreds).username;
//     }
//     return defaultCreds.username;
//   });
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPasswords, setShowPasswords] = useState(false);
//   const [saved, setSaved] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     // Keep internal consistency if needed, but primary init is in useState
//   }, []);

//   const handleSave = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     // Verify current password
//     const savedCreds = localStorage.getItem('admin_credentials');
//     const actualCreds = savedCreds ? JSON.parse(savedCreds) : defaultCreds;

//     if (currentPassword !== actualCreds.password) {
//       setError('当前密码不正确');
//       return;
//     }

//     if (newPassword && newPassword !== confirmPassword) {
//       setError('两次输入的新密码不一致');
//       return;
//     }

//     const updatedCreds = {
//       username: username,
//       password: newPassword || actualCreds.password
//     };

//     localStorage.setItem('admin_credentials', JSON.stringify(updatedCreds));
//     setSaved(true);
//     setCurrentPassword('');
//     setNewPassword('');
//     setConfirmPassword('');
//     setTimeout(() => setSaved(false), 3000);
//   };

//   return (
//     <div className="max-w-2xl mx-auto space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">账户设置</h1>
//           <p className="text-gray-500 text-sm">修改您的管理员登录账号和密码</p>
//         </div>
//       </div>

//       <form onSubmit={handleSave} className="space-y-6">
//         {/* Username */}
//         <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
//           <h3 className="font-medium text-gray-800 flex items-center gap-2">
//             <User className="w-5 h-5" /> 登录账号
//           </h3>
//           <div>
//             <label className="block text-sm text-gray-500 mb-1">管理员用户名</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
//               required
//             />
//           </div>
//         </div>

//         {/* Password */}
//         <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
//           <div className="flex items-center justify-between">
//             <h3 className="font-medium text-gray-800 flex items-center gap-2">
//               <Lock className="w-5 h-5" /> 密码修改
//             </h3>
//             <button
//               type="button"
//               onClick={() => setShowPasswords(!showPasswords)}
//               className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
//             >
//               {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//               {showPasswords ? '隐藏密码' : '显示密码'}
//             </button>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm text-gray-500 mb-1">当前密码（验证身份）</label>
//               <input
//                 type={showPasswords ? 'text' : 'password'}
//                 value={currentPassword}
//                 onChange={(e) => setCurrentPassword(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm text-gray-500 mb-1">新密码（不修改请留空）</label>
//                 <input
//                   type={showPasswords ? 'text' : 'password'}
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
//                   placeholder="留空保持不变"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm text-gray-500 mb-1">确认新密码</label>
//                 <input
//                   type={showPasswords ? 'text' : 'password'}
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
//                   placeholder="再次输入新密码"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
//             <AlertCircle className="w-4 h-4" />
//             {error}
//           </div>
//         )}

//         <div className="flex justify-end pt-4">
//           <button
//             type="submit"
//             className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-all flex items-center gap-2 shadow-lg"
//           >
//             <Save className="w-5 h-5" />
//             保存修改
//           </button>
//         </div>
//       </form>

//       {/* Success Notification */}
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: saved ? 1 : 0, y: saved ? 0 : 50 }}
//         className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-50 pointer-events-none"
//       >
//         <div className="w-2 h-2 bg-white rounded-full' animated-pulse" />
//         账户设置已成功保存
//       </motion.div>
//     </div>
//   );
// }
