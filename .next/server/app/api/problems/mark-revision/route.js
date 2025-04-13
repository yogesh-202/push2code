/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/problems/mark-revision/route";
exports.ids = ["app/api/problems/mark-revision/route"];
exports.modules = {

/***/ "(rsc)/./app/api/problems/mark-revision/route.js":
/*!*************************************************!*\
  !*** ./app/api/problems/mark-revision/route.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.js\");\n/* harmony import */ var _lib_mongodb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/mongodb */ \"(rsc)/./lib/mongodb.js\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nasync function POST(request) {\n    try {\n        const token = request.headers.get('Authorization')?.split(' ')[1];\n        const payload = (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.verifyToken)(token);\n        if (!payload) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: 'Unauthorized'\n            }, {\n                status: 401\n            });\n        }\n        const { problemId } = await request.json();\n        const { db } = await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_2__.connectToDatabase)();\n        // Check if problem is already marked for revision\n        const existingMark = await db.collection('revisionProblems').findOne({\n            userId: payload.userId,\n            problemId: new mongodb__WEBPACK_IMPORTED_MODULE_3__.ObjectId(problemId)\n        });\n        if (existingMark) {\n            // Remove from revision if already marked\n            await db.collection('revisionProblems').deleteOne({\n                userId: payload.userId,\n                problemId: new mongodb__WEBPACK_IMPORTED_MODULE_3__.ObjectId(problemId)\n            });\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: 'Problem removed from revision',\n                markedForRevision: false\n            });\n        } else {\n            // Add to revision if not marked\n            await db.collection('revisionProblems').insertOne({\n                userId: payload.userId,\n                problemId: new mongodb__WEBPACK_IMPORTED_MODULE_3__.ObjectId(problemId),\n                markedAt: new Date()\n            });\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: 'Problem marked for revision',\n                markedForRevision: true\n            });\n        }\n    } catch (error) {\n        console.error('Error marking problem for revision:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: 'Error marking problem for revision'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3Byb2JsZW1zL21hcmstcmV2aXNpb24vcm91dGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQzJDO0FBQ0Y7QUFDUztBQUNmO0FBRTVCLGVBQWVJLEtBQUtDLE9BQU87SUFDaEMsSUFBSTtRQUNGLE1BQU1DLFFBQVFELFFBQVFFLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLGtCQUFrQkMsTUFBTSxJQUFJLENBQUMsRUFBRTtRQUNqRSxNQUFNQyxVQUFVVCxzREFBV0EsQ0FBQ0s7UUFFNUIsSUFBSSxDQUFDSSxTQUFTO1lBQ1osT0FBT1YscURBQVlBLENBQUNXLElBQUksQ0FDdEI7Z0JBQUVDLFNBQVM7WUFBZSxHQUMxQjtnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsTUFBTSxFQUFFQyxTQUFTLEVBQUUsR0FBRyxNQUFNVCxRQUFRTSxJQUFJO1FBRXhDLE1BQU0sRUFBRUksRUFBRSxFQUFFLEdBQUcsTUFBTWIsK0RBQWlCQTtRQUV0QyxrREFBa0Q7UUFDbEQsTUFBTWMsZUFBZSxNQUFNRCxHQUFHRSxVQUFVLENBQUMsb0JBQW9CQyxPQUFPLENBQUM7WUFDbkVDLFFBQVFULFFBQVFTLE1BQU07WUFDdEJMLFdBQVcsSUFBSVgsNkNBQVFBLENBQUNXO1FBQzFCO1FBRUEsSUFBSUUsY0FBYztZQUNoQix5Q0FBeUM7WUFDekMsTUFBTUQsR0FBR0UsVUFBVSxDQUFDLG9CQUFvQkcsU0FBUyxDQUFDO2dCQUNoREQsUUFBUVQsUUFBUVMsTUFBTTtnQkFDdEJMLFdBQVcsSUFBSVgsNkNBQVFBLENBQUNXO1lBQzFCO1lBQ0EsT0FBT2QscURBQVlBLENBQUNXLElBQUksQ0FBQztnQkFDdkJDLFNBQVM7Z0JBQ1RTLG1CQUFtQjtZQUNyQjtRQUNGLE9BQU87WUFDTCxnQ0FBZ0M7WUFDaEMsTUFBTU4sR0FBR0UsVUFBVSxDQUFDLG9CQUFvQkssU0FBUyxDQUFDO2dCQUNoREgsUUFBUVQsUUFBUVMsTUFBTTtnQkFDdEJMLFdBQVcsSUFBSVgsNkNBQVFBLENBQUNXO2dCQUN4QlMsVUFBVSxJQUFJQztZQUNoQjtZQUNBLE9BQU94QixxREFBWUEsQ0FBQ1csSUFBSSxDQUFDO2dCQUN2QkMsU0FBUztnQkFDVFMsbUJBQW1CO1lBQ3JCO1FBQ0Y7SUFDRixFQUFFLE9BQU9JLE9BQU87UUFDZEMsUUFBUUQsS0FBSyxDQUFDLHVDQUF1Q0E7UUFDckQsT0FBT3pCLHFEQUFZQSxDQUFDVyxJQUFJLENBQ3RCO1lBQUVDLFNBQVM7UUFBcUMsR0FDaEQ7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIi9ob21lL3J1bm5lci93b3Jrc3BhY2UvYXBwL2FwaS9wcm9ibGVtcy9tYXJrLXJldmlzaW9uL3JvdXRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgdmVyaWZ5VG9rZW4gfSBmcm9tICdAL2xpYi9hdXRoJztcbmltcG9ydCB7IGNvbm5lY3RUb0RhdGFiYXNlIH0gZnJvbSAnQC9saWIvbW9uZ29kYic7XG5pbXBvcnQgeyBPYmplY3RJZCB9IGZyb20gJ21vbmdvZGInO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgdG9rZW4gPSByZXF1ZXN0LmhlYWRlcnMuZ2V0KCdBdXRob3JpemF0aW9uJyk/LnNwbGl0KCcgJylbMV07XG4gICAgY29uc3QgcGF5bG9hZCA9IHZlcmlmeVRva2VuKHRva2VuKTtcbiAgICBcbiAgICBpZiAoIXBheWxvYWQpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBtZXNzYWdlOiAnVW5hdXRob3JpemVkJyB9LFxuICAgICAgICB7IHN0YXR1czogNDAxIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBwcm9ibGVtSWQgfSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xuICAgIFxuICAgIGNvbnN0IHsgZGIgfSA9IGF3YWl0IGNvbm5lY3RUb0RhdGFiYXNlKCk7XG4gICAgXG4gICAgLy8gQ2hlY2sgaWYgcHJvYmxlbSBpcyBhbHJlYWR5IG1hcmtlZCBmb3IgcmV2aXNpb25cbiAgICBjb25zdCBleGlzdGluZ01hcmsgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdyZXZpc2lvblByb2JsZW1zJykuZmluZE9uZSh7XG4gICAgICB1c2VySWQ6IHBheWxvYWQudXNlcklkLFxuICAgICAgcHJvYmxlbUlkOiBuZXcgT2JqZWN0SWQocHJvYmxlbUlkKVxuICAgIH0pO1xuXG4gICAgaWYgKGV4aXN0aW5nTWFyaykge1xuICAgICAgLy8gUmVtb3ZlIGZyb20gcmV2aXNpb24gaWYgYWxyZWFkeSBtYXJrZWRcbiAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3JldmlzaW9uUHJvYmxlbXMnKS5kZWxldGVPbmUoe1xuICAgICAgICB1c2VySWQ6IHBheWxvYWQudXNlcklkLFxuICAgICAgICBwcm9ibGVtSWQ6IG5ldyBPYmplY3RJZChwcm9ibGVtSWQpXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IFxuICAgICAgICBtZXNzYWdlOiAnUHJvYmxlbSByZW1vdmVkIGZyb20gcmV2aXNpb24nLFxuICAgICAgICBtYXJrZWRGb3JSZXZpc2lvbjogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBZGQgdG8gcmV2aXNpb24gaWYgbm90IG1hcmtlZFxuICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigncmV2aXNpb25Qcm9ibGVtcycpLmluc2VydE9uZSh7XG4gICAgICAgIHVzZXJJZDogcGF5bG9hZC51c2VySWQsXG4gICAgICAgIHByb2JsZW1JZDogbmV3IE9iamVjdElkKHByb2JsZW1JZCksXG4gICAgICAgIG1hcmtlZEF0OiBuZXcgRGF0ZSgpXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IFxuICAgICAgICBtZXNzYWdlOiAnUHJvYmxlbSBtYXJrZWQgZm9yIHJldmlzaW9uJyxcbiAgICAgICAgbWFya2VkRm9yUmV2aXNpb246IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBtYXJraW5nIHByb2JsZW0gZm9yIHJldmlzaW9uOicsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IG1lc3NhZ2U6ICdFcnJvciBtYXJraW5nIHByb2JsZW0gZm9yIHJldmlzaW9uJyB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInZlcmlmeVRva2VuIiwiY29ubmVjdFRvRGF0YWJhc2UiLCJPYmplY3RJZCIsIlBPU1QiLCJyZXF1ZXN0IiwidG9rZW4iLCJoZWFkZXJzIiwiZ2V0Iiwic3BsaXQiLCJwYXlsb2FkIiwianNvbiIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJwcm9ibGVtSWQiLCJkYiIsImV4aXN0aW5nTWFyayIsImNvbGxlY3Rpb24iLCJmaW5kT25lIiwidXNlcklkIiwiZGVsZXRlT25lIiwibWFya2VkRm9yUmV2aXNpb24iLCJpbnNlcnRPbmUiLCJtYXJrZWRBdCIsIkRhdGUiLCJlcnJvciIsImNvbnNvbGUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/problems/mark-revision/route.js\n");

/***/ }),

/***/ "(rsc)/./lib/auth.js":
/*!*********************!*\
  !*** ./lib/auth.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken),\n/* harmony export */   withAuth: () => (/* binding */ withAuth)\n/* harmony export */ });\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);\n\nconst JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';\n/**\n * Verify JWT token\n * @param {string} token - The JWT token to verify\n * @returns {object|null} - Decoded token payload or null if invalid\n */ function verifyToken(token) {\n    if (!token) {\n        return null;\n    }\n    try {\n        return (0,jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__.verify)(token, JWT_SECRET);\n    } catch (error) {\n        console.error('Token verification error:', error);\n        return null;\n    }\n}\n/**\n * Authorization middleware for API routes\n * @param {function} handler - The API route handler\n * @returns {function} - Middleware function\n */ function withAuth(handler) {\n    return async (req, res)=>{\n        try {\n            // Extract token from Authorization header\n            const authHeader = req.headers.authorization;\n            if (!authHeader || !authHeader.startsWith('Bearer ')) {\n                return res.status(401).json({\n                    message: 'Unauthorized'\n                });\n            }\n            const token = authHeader.split(' ')[1];\n            const payload = verifyToken(token);\n            if (!payload) {\n                return res.status(401).json({\n                    message: 'Invalid token'\n                });\n            }\n            // Add user info to request\n            req.user = payload;\n            // Call the original handler\n            return handler(req, res);\n        } catch (error) {\n            console.error('Auth middleware error:', error);\n            return res.status(500).json({\n                message: 'Internal server error'\n            });\n        }\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQXNDO0FBRXRDLE1BQU1DLGFBQWFDLFFBQVFDLEdBQUcsQ0FBQ0YsVUFBVSxJQUFJO0FBRTdDOzs7O0NBSUMsR0FDTSxTQUFTRyxZQUFZQyxLQUFLO0lBQy9CLElBQUksQ0FBQ0EsT0FBTztRQUNWLE9BQU87SUFDVDtJQUVBLElBQUk7UUFDRixPQUFPTCxvREFBTUEsQ0FBQ0ssT0FBT0o7SUFDdkIsRUFBRSxPQUFPSyxPQUFPO1FBQ2RDLFFBQVFELEtBQUssQ0FBQyw2QkFBNkJBO1FBQzNDLE9BQU87SUFDVDtBQUNGO0FBRUE7Ozs7Q0FJQyxHQUNNLFNBQVNFLFNBQVNDLE9BQU87SUFDOUIsT0FBTyxPQUFPQyxLQUFLQztRQUNqQixJQUFJO1lBQ0YsMENBQTBDO1lBQzFDLE1BQU1DLGFBQWFGLElBQUlHLE9BQU8sQ0FBQ0MsYUFBYTtZQUM1QyxJQUFJLENBQUNGLGNBQWMsQ0FBQ0EsV0FBV0csVUFBVSxDQUFDLFlBQVk7Z0JBQ3BELE9BQU9KLElBQUlLLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7b0JBQUVDLFNBQVM7Z0JBQWU7WUFDeEQ7WUFFQSxNQUFNYixRQUFRTyxXQUFXTyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdEMsTUFBTUMsVUFBVWhCLFlBQVlDO1lBRTVCLElBQUksQ0FBQ2UsU0FBUztnQkFDWixPQUFPVCxJQUFJSyxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO29CQUFFQyxTQUFTO2dCQUFnQjtZQUN6RDtZQUVBLDJCQUEyQjtZQUMzQlIsSUFBSVcsSUFBSSxHQUFHRDtZQUVYLDRCQUE0QjtZQUM1QixPQUFPWCxRQUFRQyxLQUFLQztRQUN0QixFQUFFLE9BQU9MLE9BQU87WUFDZEMsUUFBUUQsS0FBSyxDQUFDLDBCQUEwQkE7WUFDeEMsT0FBT0ssSUFBSUssTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztnQkFBRUMsU0FBUztZQUF3QjtRQUNqRTtJQUNGO0FBQ0YiLCJzb3VyY2VzIjpbIi9ob21lL3J1bm5lci93b3Jrc3BhY2UvbGliL2F1dGguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdmVyaWZ5IH0gZnJvbSAnanNvbndlYnRva2VuJztcblxuY29uc3QgSldUX1NFQ1JFVCA9IHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgfHwgJ2RlZmF1bHRfand0X3NlY3JldCc7XG5cbi8qKlxuICogVmVyaWZ5IEpXVCB0b2tlblxuICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gVGhlIEpXVCB0b2tlbiB0byB2ZXJpZnlcbiAqIEByZXR1cm5zIHtvYmplY3R8bnVsbH0gLSBEZWNvZGVkIHRva2VuIHBheWxvYWQgb3IgbnVsbCBpZiBpbnZhbGlkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlUb2tlbih0b2tlbikge1xuICBpZiAoIXRva2VuKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgXG4gIHRyeSB7XG4gICAgcmV0dXJuIHZlcmlmeSh0b2tlbiwgSldUX1NFQ1JFVCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignVG9rZW4gdmVyaWZpY2F0aW9uIGVycm9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIEF1dGhvcml6YXRpb24gbWlkZGxld2FyZSBmb3IgQVBJIHJvdXRlc1xuICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciAtIFRoZSBBUEkgcm91dGUgaGFuZGxlclxuICogQHJldHVybnMge2Z1bmN0aW9ufSAtIE1pZGRsZXdhcmUgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhBdXRoKGhhbmRsZXIpIHtcbiAgcmV0dXJuIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgIHRyeSB7XG4gICAgICAvLyBFeHRyYWN0IHRva2VuIGZyb20gQXV0aG9yaXphdGlvbiBoZWFkZXJcbiAgICAgIGNvbnN0IGF1dGhIZWFkZXIgPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uO1xuICAgICAgaWYgKCFhdXRoSGVhZGVyIHx8ICFhdXRoSGVhZGVyLnN0YXJ0c1dpdGgoJ0JlYXJlciAnKSkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLmpzb24oeyBtZXNzYWdlOiAnVW5hdXRob3JpemVkJyB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgY29uc3QgdG9rZW4gPSBhdXRoSGVhZGVyLnNwbGl0KCcgJylbMV07XG4gICAgICBjb25zdCBwYXlsb2FkID0gdmVyaWZ5VG9rZW4odG9rZW4pO1xuICAgICAgXG4gICAgICBpZiAoIXBheWxvYWQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKHsgbWVzc2FnZTogJ0ludmFsaWQgdG9rZW4nIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBBZGQgdXNlciBpbmZvIHRvIHJlcXVlc3RcbiAgICAgIHJlcS51c2VyID0gcGF5bG9hZDtcbiAgICAgIFxuICAgICAgLy8gQ2FsbCB0aGUgb3JpZ2luYWwgaGFuZGxlclxuICAgICAgcmV0dXJuIGhhbmRsZXIocmVxLCByZXMpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdBdXRoIG1pZGRsZXdhcmUgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogJ0ludGVybmFsIHNlcnZlciBlcnJvcicgfSk7XG4gICAgfVxuICB9O1xufVxuIl0sIm5hbWVzIjpbInZlcmlmeSIsIkpXVF9TRUNSRVQiLCJwcm9jZXNzIiwiZW52IiwidmVyaWZ5VG9rZW4iLCJ0b2tlbiIsImVycm9yIiwiY29uc29sZSIsIndpdGhBdXRoIiwiaGFuZGxlciIsInJlcSIsInJlcyIsImF1dGhIZWFkZXIiLCJoZWFkZXJzIiwiYXV0aG9yaXphdGlvbiIsInN0YXJ0c1dpdGgiLCJzdGF0dXMiLCJqc29uIiwibWVzc2FnZSIsInNwbGl0IiwicGF5bG9hZCIsInVzZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.js\n");

/***/ }),

/***/ "(rsc)/./lib/mongodb.js":
/*!************************!*\
  !*** ./lib/mongodb.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   connectToDatabase: () => (/* binding */ connectToDatabase),\n/* harmony export */   initDatabase: () => (/* binding */ initDatabase)\n/* harmony export */ });\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);\n\nconst MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yogn7294:Yogikamongo%407240@foodapp.ozfxw.mongodb.net/first_db?retryWrites=true&w=majority&appName=Foodapp';\nconst MONGODB_DB = process.env.MONGODB_DB || 'first_db';\n// Create cached connection variable\nlet cachedClient = null;\nlet cachedDb = null;\nasync function connectToDatabase() {\n    // If the connection is already established, return the cached connection\n    if (cachedClient && cachedDb) {\n        return {\n            client: cachedClient,\n            db: cachedDb\n        };\n    }\n    // Set the connection options\n    const opts = {\n        useNewUrlParser: true,\n        useUnifiedTopology: true\n    };\n    // Connect to the server\n    let client = new mongodb__WEBPACK_IMPORTED_MODULE_0__.MongoClient(MONGODB_URI, opts);\n    await client.connect();\n    let db = client.db(MONGODB_DB);\n    // Cache the client and connection\n    cachedClient = client;\n    cachedDb = db;\n    return {\n        client,\n        db\n    };\n}\n// Initialize database with collections and indexes\nasync function initDatabase() {\n    const { db } = await connectToDatabase();\n    // Create collections if they don't exist\n    const collections = await db.listCollections().toArray();\n    const collectionNames = collections.map((c)=>c.name);\n    // Users collection\n    if (!collectionNames.includes('users')) {\n        await db.createCollection('users');\n        await db.collection('users').createIndex({\n            email: 1\n        }, {\n            unique: true\n        });\n        await db.collection('users').createIndex({\n            username: 1\n        }, {\n            unique: true\n        });\n    }\n    // Problems collection\n    if (!collectionNames.includes('problems')) {\n        await db.createCollection('problems');\n        await db.collection('problems').createIndex({\n            title: 1\n        }, {\n            unique: true\n        });\n        await db.collection('problems').createIndex({\n            topic: 1\n        });\n        await db.collection('problems').createIndex({\n            difficulty: 1\n        });\n    }\n    // Solved problems collection\n    if (!collectionNames.includes('solvedProblems')) {\n        await db.createCollection('solvedProblems');\n        await db.collection('solvedProblems').createIndex({\n            userId: 1,\n            problemId: 1\n        }, {\n            unique: true\n        });\n        await db.collection('solvedProblems').createIndex({\n            userId: 1\n        });\n        await db.collection('solvedProblems').createIndex({\n            solvedAt: 1\n        });\n    }\n    console.log('Database initialized');\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvbW9uZ29kYi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQXNDO0FBRXRDLE1BQU1DLGNBQWNDLFFBQVFDLEdBQUcsQ0FBQ0YsV0FBVyxJQUFJO0FBQy9DLE1BQU1HLGFBQWFGLFFBQVFDLEdBQUcsQ0FBQ0MsVUFBVSxJQUFJO0FBRTdDLG9DQUFvQztBQUNwQyxJQUFJQyxlQUFlO0FBQ25CLElBQUlDLFdBQVc7QUFFUixlQUFlQztJQUNwQix5RUFBeUU7SUFDekUsSUFBSUYsZ0JBQWdCQyxVQUFVO1FBQzVCLE9BQU87WUFBRUUsUUFBUUg7WUFBY0ksSUFBSUg7UUFBUztJQUM5QztJQUVBLDZCQUE2QjtJQUM3QixNQUFNSSxPQUFPO1FBQ1hDLGlCQUFpQjtRQUNqQkMsb0JBQW9CO0lBQ3RCO0lBRUEsd0JBQXdCO0lBQ3hCLElBQUlKLFNBQVMsSUFBSVIsZ0RBQVdBLENBQUNDLGFBQWFTO0lBQzFDLE1BQU1GLE9BQU9LLE9BQU87SUFDcEIsSUFBSUosS0FBS0QsT0FBT0MsRUFBRSxDQUFDTDtJQUVuQixrQ0FBa0M7SUFDbENDLGVBQWVHO0lBQ2ZGLFdBQVdHO0lBRVgsT0FBTztRQUFFRDtRQUFRQztJQUFHO0FBQ3RCO0FBRUEsbURBQW1EO0FBQzVDLGVBQWVLO0lBQ3BCLE1BQU0sRUFBRUwsRUFBRSxFQUFFLEdBQUcsTUFBTUY7SUFFckIseUNBQXlDO0lBQ3pDLE1BQU1RLGNBQWMsTUFBTU4sR0FBR08sZUFBZSxHQUFHQyxPQUFPO0lBQ3RELE1BQU1DLGtCQUFrQkgsWUFBWUksR0FBRyxDQUFDQyxDQUFBQSxJQUFLQSxFQUFFQyxJQUFJO0lBRW5ELG1CQUFtQjtJQUNuQixJQUFJLENBQUNILGdCQUFnQkksUUFBUSxDQUFDLFVBQVU7UUFDdEMsTUFBTWIsR0FBR2MsZ0JBQWdCLENBQUM7UUFDMUIsTUFBTWQsR0FBR2UsVUFBVSxDQUFDLFNBQVNDLFdBQVcsQ0FBQztZQUFFQyxPQUFPO1FBQUUsR0FBRztZQUFFQyxRQUFRO1FBQUs7UUFDdEUsTUFBTWxCLEdBQUdlLFVBQVUsQ0FBQyxTQUFTQyxXQUFXLENBQUM7WUFBRUcsVUFBVTtRQUFFLEdBQUc7WUFBRUQsUUFBUTtRQUFLO0lBQzNFO0lBRUEsc0JBQXNCO0lBQ3RCLElBQUksQ0FBQ1QsZ0JBQWdCSSxRQUFRLENBQUMsYUFBYTtRQUN6QyxNQUFNYixHQUFHYyxnQkFBZ0IsQ0FBQztRQUMxQixNQUFNZCxHQUFHZSxVQUFVLENBQUMsWUFBWUMsV0FBVyxDQUFDO1lBQUVJLE9BQU87UUFBRSxHQUFHO1lBQUVGLFFBQVE7UUFBSztRQUN6RSxNQUFNbEIsR0FBR2UsVUFBVSxDQUFDLFlBQVlDLFdBQVcsQ0FBQztZQUFFSyxPQUFPO1FBQUU7UUFDdkQsTUFBTXJCLEdBQUdlLFVBQVUsQ0FBQyxZQUFZQyxXQUFXLENBQUM7WUFBRU0sWUFBWTtRQUFFO0lBQzlEO0lBRUEsNkJBQTZCO0lBQzdCLElBQUksQ0FBQ2IsZ0JBQWdCSSxRQUFRLENBQUMsbUJBQW1CO1FBQy9DLE1BQU1iLEdBQUdjLGdCQUFnQixDQUFDO1FBQzFCLE1BQU1kLEdBQUdlLFVBQVUsQ0FBQyxrQkFBa0JDLFdBQVcsQ0FBQztZQUFFTyxRQUFRO1lBQUdDLFdBQVc7UUFBRSxHQUFHO1lBQUVOLFFBQVE7UUFBSztRQUM5RixNQUFNbEIsR0FBR2UsVUFBVSxDQUFDLGtCQUFrQkMsV0FBVyxDQUFDO1lBQUVPLFFBQVE7UUFBRTtRQUM5RCxNQUFNdkIsR0FBR2UsVUFBVSxDQUFDLGtCQUFrQkMsV0FBVyxDQUFDO1lBQUVTLFVBQVU7UUFBRTtJQUNsRTtJQUVBQyxRQUFRQyxHQUFHLENBQUM7QUFDZCIsInNvdXJjZXMiOlsiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9saWIvbW9uZ29kYi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb25nb0NsaWVudCB9IGZyb20gJ21vbmdvZGInO1xuXG5jb25zdCBNT05HT0RCX1VSSSA9IHByb2Nlc3MuZW52Lk1PTkdPREJfVVJJIHx8ICdtb25nb2RiK3NydjovL3lvZ243Mjk0OllvZ2lrYW1vbmdvJTQwNzI0MEBmb29kYXBwLm96Znh3Lm1vbmdvZGIubmV0L2ZpcnN0X2RiP3JldHJ5V3JpdGVzPXRydWUmdz1tYWpvcml0eSZhcHBOYW1lPUZvb2RhcHAnO1xuY29uc3QgTU9OR09EQl9EQiA9IHByb2Nlc3MuZW52Lk1PTkdPREJfREIgfHwgJ2ZpcnN0X2RiJztcblxuLy8gQ3JlYXRlIGNhY2hlZCBjb25uZWN0aW9uIHZhcmlhYmxlXG5sZXQgY2FjaGVkQ2xpZW50ID0gbnVsbDtcbmxldCBjYWNoZWREYiA9IG51bGw7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb25uZWN0VG9EYXRhYmFzZSgpIHtcbiAgLy8gSWYgdGhlIGNvbm5lY3Rpb24gaXMgYWxyZWFkeSBlc3RhYmxpc2hlZCwgcmV0dXJuIHRoZSBjYWNoZWQgY29ubmVjdGlvblxuICBpZiAoY2FjaGVkQ2xpZW50ICYmIGNhY2hlZERiKSB7XG4gICAgcmV0dXJuIHsgY2xpZW50OiBjYWNoZWRDbGllbnQsIGRiOiBjYWNoZWREYiB9O1xuICB9XG5cbiAgLy8gU2V0IHRoZSBjb25uZWN0aW9uIG9wdGlvbnNcbiAgY29uc3Qgb3B0cyA9IHtcbiAgICB1c2VOZXdVcmxQYXJzZXI6IHRydWUsXG4gICAgdXNlVW5pZmllZFRvcG9sb2d5OiB0cnVlLFxuICB9O1xuXG4gIC8vIENvbm5lY3QgdG8gdGhlIHNlcnZlclxuICBsZXQgY2xpZW50ID0gbmV3IE1vbmdvQ2xpZW50KE1PTkdPREJfVVJJLCBvcHRzKTtcbiAgYXdhaXQgY2xpZW50LmNvbm5lY3QoKTtcbiAgbGV0IGRiID0gY2xpZW50LmRiKE1PTkdPREJfREIpO1xuXG4gIC8vIENhY2hlIHRoZSBjbGllbnQgYW5kIGNvbm5lY3Rpb25cbiAgY2FjaGVkQ2xpZW50ID0gY2xpZW50O1xuICBjYWNoZWREYiA9IGRiO1xuXG4gIHJldHVybiB7IGNsaWVudCwgZGIgfTtcbn1cblxuLy8gSW5pdGlhbGl6ZSBkYXRhYmFzZSB3aXRoIGNvbGxlY3Rpb25zIGFuZCBpbmRleGVzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5pdERhdGFiYXNlKCkge1xuICBjb25zdCB7IGRiIH0gPSBhd2FpdCBjb25uZWN0VG9EYXRhYmFzZSgpO1xuICBcbiAgLy8gQ3JlYXRlIGNvbGxlY3Rpb25zIGlmIHRoZXkgZG9uJ3QgZXhpc3RcbiAgY29uc3QgY29sbGVjdGlvbnMgPSBhd2FpdCBkYi5saXN0Q29sbGVjdGlvbnMoKS50b0FycmF5KCk7XG4gIGNvbnN0IGNvbGxlY3Rpb25OYW1lcyA9IGNvbGxlY3Rpb25zLm1hcChjID0+IGMubmFtZSk7XG4gIFxuICAvLyBVc2VycyBjb2xsZWN0aW9uXG4gIGlmICghY29sbGVjdGlvbk5hbWVzLmluY2x1ZGVzKCd1c2VycycpKSB7XG4gICAgYXdhaXQgZGIuY3JlYXRlQ29sbGVjdGlvbigndXNlcnMnKTtcbiAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VycycpLmNyZWF0ZUluZGV4KHsgZW1haWw6IDEgfSwgeyB1bmlxdWU6IHRydWUgfSk7XG4gICAgYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcnMnKS5jcmVhdGVJbmRleCh7IHVzZXJuYW1lOiAxIH0sIHsgdW5pcXVlOiB0cnVlIH0pO1xuICB9XG4gIFxuICAvLyBQcm9ibGVtcyBjb2xsZWN0aW9uXG4gIGlmICghY29sbGVjdGlvbk5hbWVzLmluY2x1ZGVzKCdwcm9ibGVtcycpKSB7XG4gICAgYXdhaXQgZGIuY3JlYXRlQ29sbGVjdGlvbigncHJvYmxlbXMnKTtcbiAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdwcm9ibGVtcycpLmNyZWF0ZUluZGV4KHsgdGl0bGU6IDEgfSwgeyB1bmlxdWU6IHRydWUgfSk7XG4gICAgYXdhaXQgZGIuY29sbGVjdGlvbigncHJvYmxlbXMnKS5jcmVhdGVJbmRleCh7IHRvcGljOiAxIH0pO1xuICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Byb2JsZW1zJykuY3JlYXRlSW5kZXgoeyBkaWZmaWN1bHR5OiAxIH0pO1xuICB9XG4gIFxuICAvLyBTb2x2ZWQgcHJvYmxlbXMgY29sbGVjdGlvblxuICBpZiAoIWNvbGxlY3Rpb25OYW1lcy5pbmNsdWRlcygnc29sdmVkUHJvYmxlbXMnKSkge1xuICAgIGF3YWl0IGRiLmNyZWF0ZUNvbGxlY3Rpb24oJ3NvbHZlZFByb2JsZW1zJyk7XG4gICAgYXdhaXQgZGIuY29sbGVjdGlvbignc29sdmVkUHJvYmxlbXMnKS5jcmVhdGVJbmRleCh7IHVzZXJJZDogMSwgcHJvYmxlbUlkOiAxIH0sIHsgdW5pcXVlOiB0cnVlIH0pO1xuICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3NvbHZlZFByb2JsZW1zJykuY3JlYXRlSW5kZXgoeyB1c2VySWQ6IDEgfSk7XG4gICAgYXdhaXQgZGIuY29sbGVjdGlvbignc29sdmVkUHJvYmxlbXMnKS5jcmVhdGVJbmRleCh7IHNvbHZlZEF0OiAxIH0pO1xuICB9XG4gIFxuICBjb25zb2xlLmxvZygnRGF0YWJhc2UgaW5pdGlhbGl6ZWQnKTtcbn1cbiJdLCJuYW1lcyI6WyJNb25nb0NsaWVudCIsIk1PTkdPREJfVVJJIiwicHJvY2VzcyIsImVudiIsIk1PTkdPREJfREIiLCJjYWNoZWRDbGllbnQiLCJjYWNoZWREYiIsImNvbm5lY3RUb0RhdGFiYXNlIiwiY2xpZW50IiwiZGIiLCJvcHRzIiwidXNlTmV3VXJsUGFyc2VyIiwidXNlVW5pZmllZFRvcG9sb2d5IiwiY29ubmVjdCIsImluaXREYXRhYmFzZSIsImNvbGxlY3Rpb25zIiwibGlzdENvbGxlY3Rpb25zIiwidG9BcnJheSIsImNvbGxlY3Rpb25OYW1lcyIsIm1hcCIsImMiLCJuYW1lIiwiaW5jbHVkZXMiLCJjcmVhdGVDb2xsZWN0aW9uIiwiY29sbGVjdGlvbiIsImNyZWF0ZUluZGV4IiwiZW1haWwiLCJ1bmlxdWUiLCJ1c2VybmFtZSIsInRpdGxlIiwidG9waWMiLCJkaWZmaWN1bHR5IiwidXNlcklkIiwicHJvYmxlbUlkIiwic29sdmVkQXQiLCJjb25zb2xlIiwibG9nIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/mongodb.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fproblems%2Fmark-revision%2Froute&page=%2Fapi%2Fproblems%2Fmark-revision%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fproblems%2Fmark-revision%2Froute.js&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fproblems%2Fmark-revision%2Froute&page=%2Fapi%2Fproblems%2Fmark-revision%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fproblems%2Fmark-revision%2Froute.js&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_runner_workspace_app_api_problems_mark_revision_route_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/problems/mark-revision/route.js */ \"(rsc)/./app/api/problems/mark-revision/route.js\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/problems/mark-revision/route\",\n        pathname: \"/api/problems/mark-revision\",\n        filename: \"route\",\n        bundlePath: \"app/api/problems/mark-revision/route\"\n    },\n    resolvedPagePath: \"/home/runner/workspace/app/api/problems/mark-revision/route.js\",\n    nextConfigOutput,\n    userland: _home_runner_workspace_app_api_problems_mark_revision_route_js__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZwcm9ibGVtcyUyRm1hcmstcmV2aXNpb24lMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnByb2JsZW1zJTJGbWFyay1yZXZpc2lvbiUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnByb2JsZW1zJTJGbWFyay1yZXZpc2lvbiUyRnJvdXRlLmpzJmFwcERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNjO0FBQzNGO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL2FwcC9hcGkvcHJvYmxlbXMvbWFyay1yZXZpc2lvbi9yb3V0ZS5qc1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvcHJvYmxlbXMvbWFyay1yZXZpc2lvbi9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3Byb2JsZW1zL21hcmstcmV2aXNpb25cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3Byb2JsZW1zL21hcmstcmV2aXNpb24vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL2FwcC9hcGkvcHJvYmxlbXMvbWFyay1yZXZpc2lvbi9yb3V0ZS5qc1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fproblems%2Fmark-revision%2Froute&page=%2Fapi%2Fproblems%2Fmark-revision%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fproblems%2Fmark-revision%2Froute.js&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongodb");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/ms","vendor-chunks/semver","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fproblems%2Fmark-revision%2Froute&page=%2Fapi%2Fproblems%2Fmark-revision%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fproblems%2Fmark-revision%2Froute.js&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();