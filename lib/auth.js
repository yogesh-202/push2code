// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// /**
//  * Get the current session
//  * @param {Request} request - The request object
//  * @returns {Promise<object|null>} - Session data or null if not authenticated
//  */
// export async function getSession(request) {
//   return await getServerSession(authOptions);
// }

// /**
//  * Authorization middleware for API routes
//  * @param {Request} request - The request object
//  * @returns {Promise<object|null>} - Session data or null if not authenticated
//  */
// export async function verifyAuth(request) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return null;
//   }
//   return session;
// }

// /**
//  * Authorization middleware for API routes
//  * @param {function} handler - The API route handler
//  * @returns {function} - Middleware function
//  */
// export function withAuth(handler) {
//   return async (req, res) => {
//     try {
//       const session = await getServerSession(authOptions);
//       if (!session) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
      
//       // Add user info to request
//       req.user = {
//         id: session.user.id,
//         email: session.user.email,
//         name: session.user.name
//       };
      
//       // Call the original handler
//       return handler(req, res);
//     } catch (error) {
//       console.error('Auth middleware error:', error);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//   };
// }
