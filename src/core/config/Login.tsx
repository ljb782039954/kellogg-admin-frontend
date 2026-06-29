// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Eye, EyeOff, Lock, User } from 'lucide-react';
// import { adminCredentials } from '../config/adminCredentials';
// import siteSettings from '../config/siteSettings.json';

// export default function Login() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     const savedCreds = localStorage.getItem('admin_credentials');
//     const actualCreds = savedCreds ? JSON.parse(savedCreds) : adminCredentials;

//     if (username === actualCreds.username && password === actualCreds.password) {
//       // Store login state
//       sessionStorage.setItem('admin_logged_in', 'true');
//       navigate('/dashboard');
//     } else {
//       setError('用户名或密码错误');
//     }

//     setIsLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md"
//       >
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             {siteSettings.brand.logo && (
//               <img src={siteSettings.brand.logo} alt="Logo" className="h-16 w-16 object-contain" />
//             )}
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">{siteSettings.brand.name.zh}</h1>
//           <p className="text-gray-500">后台管理系统</p>
//         </div>

//         {/* Login Form */}
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
//             管理员登录
//           </h2>

//           {error && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm"
//             >
//               {error}
//             </motion.div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Username */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 用户名
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   placeholder="请输入用户名"
//                   className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 密码
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="请输入密码"
//                   className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   登录中...
//                 </>
//               ) : (
//                 '登录'
//               )}
//             </button>
//           </form>

//           {/* Demo Credentials */}
//           <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-500 space-y-1">
//             <p className="font-medium text-gray-700">默认账号：</p>
//             <p>用户名：admin</p>
//             <p>密码：admin123</p>
//             <p className="text-xs text-gray-400 pt-2 border-t mt-2">
//               提示：登录后可在“账户设置”中修改。
//             </p>
//           </div>
//         </div>

//         {/* Back to Home */}
//         <div className="text-center mt-6">
//           <a href="/" className="text-gray-500 hover:text-gray-800 text-sm transition-colors">
//             ← 返回网站首页
//           </a>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
