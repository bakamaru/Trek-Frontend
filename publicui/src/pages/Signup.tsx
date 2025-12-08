
// import React, { useState, useContext } from 'react';
// import { RouterContext } from '../index';
// import SEO from '../components/SEO';

// const Signup: React.FC = () => {
//     const { navigate } = useContext(RouterContext);
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: ''
//     });
//     const [isLoading, setIsLoading] = useState(false);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.id]: e.target.value });
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (formData.password !== formData.confirmPassword) {
//             alert("Passwords do not match!");
//             return;
//         }
//         setIsLoading(true);
//         // Simulate API call
//         setTimeout(() => {
//             setIsLoading(false);
//             navigate('/dashboard');
//         }, 1500);
//     };

//     return (
//         <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
//             <SEO title="Sign Up" description="Create a Territory Himalayas account." />
//             <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
//                 <div className="text-center mb-8">
//                     <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create Account</h1>
//                     <p className="text-gray-600 dark:text-gray-400 mt-2">Join us for your next adventure</p>
//                 </div>
                
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                         <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
//                         <input 
//                             type="text" 
//                             id="name" 
//                             value={formData.name}
//                             onChange={handleChange}
//                             required 
//                             className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
//                             placeholder="John Doe"
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
//                         <input 
//                             type="email" 
//                             id="email" 
//                             value={formData.email}
//                             onChange={handleChange}
//                             required 
//                             className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
//                             placeholder="you@example.com"
//                         />
//                     </div>
                    
//                     <div>
//                         <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
//                         <input 
//                             type="password" 
//                             id="password" 
//                             value={formData.password}
//                             onChange={handleChange}
//                             required 
//                             className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
//                             placeholder="••••••••"
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
//                         <input 
//                             type="password" 
//                             id="confirmPassword" 
//                             value={formData.confirmPassword}
//                             onChange={handleChange}
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
//                         ) : 'Create Account'}
//                     </button>
//                 </form>

//                 <div className="mt-6 text-center">
//                     <p className="text-gray-600 dark:text-gray-400">
//                         Already have an account?{' '}
//                         <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="text-blue-700 font-semibold hover:text-blue-800 dark:text-blue-400">
//                             Sign In
//                         </a>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Signup;
