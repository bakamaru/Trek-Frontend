
// import React, { useState, useContext } from 'react';
// import { RouterContext } from '../index';
// import SEO from '../components/SEO';

// const Login: React.FC = () => {
//     const { navigate } = useContext(RouterContext);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);
//         // Simulate API call
//         setTimeout(() => {
//             setIsLoading(false);
//             navigate('/dashboard');
//         }, 1500);
//     };

//     return (
//         <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
//             <SEO title="Login" description="Log in to your Territory Himalayas account to manage bookings." />
//             <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
//                 <div className="text-center mb-8">
//                     <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h1>
//                     <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to continue to your dashboard</p>
//                 </div>
                
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
//                         <input 
//                             type="email" 
//                             id="email" 
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required 
//                             className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
//                             placeholder="you@example.com"
//                         />
//                     </div>
                    
//                     <div>
//                         <div className="flex justify-between items-center mb-1">
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
//                             <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-blue-700 hover:text-blue-800 dark:text-blue-400">Forgot password?</a>
//                         </div>
//                         <input 
//                             type="password" 
//                             id="password" 
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required 
//                             className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
//                             placeholder="••••••••"
//                         />
//                     </div>

//                     <button 
//                         type="submit" 
//                         disabled={isLoading}
//                         className="w-full bg-blue-700 text-white py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
//                     >
//                         {isLoading ? (
//                             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                         ) : 'Sign In'}
//                     </button>
//                 </form>

//                 <div className="mt-6 text-center">
//                     <p className="text-gray-600 dark:text-gray-400">
//                         Don't have an account?{' '}
//                         <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }} className="text-blue-700 font-semibold hover:text-blue-800 dark:text-blue-400">
//                             Sign Up
//                         </a>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;
