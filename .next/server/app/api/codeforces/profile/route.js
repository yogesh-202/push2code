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
exports.id = "app/api/codeforces/profile/route";
exports.ids = ["app/api/codeforces/profile/route"];
exports.modules = {

/***/ "(rsc)/./app/api/codeforces/profile/route.js":
/*!*********************************************!*\
  !*** ./app/api/codeforces/profile/route.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _utils_codeforcesApi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/utils/codeforcesApi */ \"(rsc)/./utils/codeforcesApi.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.js\");\n\n\n\nasync function GET(request) {\n    try {\n        // Get user's CF handle from query parameters\n        const { searchParams } = new URL(request.url);\n        const cfHandle = searchParams.get('handle');\n        if (!cfHandle) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Codeforces handle is required'\n            }, {\n                status: 400\n            });\n        }\n        // Get user profile data\n        const profileData = await (0,_utils_codeforcesApi__WEBPACK_IMPORTED_MODULE_1__.analyzeUserPerformance)(cfHandle);\n        if (!profileData.success) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: profileData.error\n            }, {\n                status: 404\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(profileData);\n    } catch (error) {\n        console.error('Error fetching Codeforces profile:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to fetch profile data'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2NvZGVmb3JjZXMvcHJvZmlsZS9yb3V0ZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTJDO0FBQ29CO0FBQ3RCO0FBRWxDLGVBQWVHLElBQUlDLE9BQU87SUFDL0IsSUFBSTtRQUNGLDZDQUE2QztRQUM3QyxNQUFNLEVBQUVDLFlBQVksRUFBRSxHQUFHLElBQUlDLElBQUlGLFFBQVFHLEdBQUc7UUFDNUMsTUFBTUMsV0FBV0gsYUFBYUksR0FBRyxDQUFDO1FBRWxDLElBQUksQ0FBQ0QsVUFBVTtZQUNiLE9BQU9SLHFEQUFZQSxDQUFDVSxJQUFJLENBQ3RCO2dCQUFFQyxPQUFPO1lBQWdDLEdBQ3pDO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSx3QkFBd0I7UUFDeEIsTUFBTUMsY0FBYyxNQUFNWiw0RUFBc0JBLENBQUNPO1FBRWpELElBQUksQ0FBQ0ssWUFBWUMsT0FBTyxFQUFFO1lBQ3hCLE9BQU9kLHFEQUFZQSxDQUFDVSxJQUFJLENBQ3RCO2dCQUFFQyxPQUFPRSxZQUFZRixLQUFLO1lBQUMsR0FDM0I7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLE9BQU9aLHFEQUFZQSxDQUFDVSxJQUFJLENBQUNHO0lBQzNCLEVBQUUsT0FBT0YsT0FBTztRQUNkSSxRQUFRSixLQUFLLENBQUMsc0NBQXNDQTtRQUNwRCxPQUFPWCxxREFBWUEsQ0FBQ1UsSUFBSSxDQUN0QjtZQUFFQyxPQUFPO1FBQStCLEdBQ3hDO1lBQUVDLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL2FwcC9hcGkvY29kZWZvcmNlcy9wcm9maWxlL3JvdXRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcbmltcG9ydCB7IGFuYWx5emVVc2VyUGVyZm9ybWFuY2UgfSBmcm9tICdAL3V0aWxzL2NvZGVmb3JjZXNBcGknO1xuaW1wb3J0IHsgdmVyaWZ5VG9rZW4gfSBmcm9tICdAL2xpYi9hdXRoJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgLy8gR2V0IHVzZXIncyBDRiBoYW5kbGUgZnJvbSBxdWVyeSBwYXJhbWV0ZXJzXG4gICAgY29uc3QgeyBzZWFyY2hQYXJhbXMgfSA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xuICAgIGNvbnN0IGNmSGFuZGxlID0gc2VhcmNoUGFyYW1zLmdldCgnaGFuZGxlJyk7XG4gICAgXG4gICAgaWYgKCFjZkhhbmRsZSkge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiAnQ29kZWZvcmNlcyBoYW5kbGUgaXMgcmVxdWlyZWQnIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gR2V0IHVzZXIgcHJvZmlsZSBkYXRhXG4gICAgY29uc3QgcHJvZmlsZURhdGEgPSBhd2FpdCBhbmFseXplVXNlclBlcmZvcm1hbmNlKGNmSGFuZGxlKTtcbiAgICBcbiAgICBpZiAoIXByb2ZpbGVEYXRhLnN1Y2Nlc3MpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogcHJvZmlsZURhdGEuZXJyb3IgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwNCB9XG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24ocHJvZmlsZURhdGEpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIENvZGVmb3JjZXMgcHJvZmlsZTonLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogJ0ZhaWxlZCB0byBmZXRjaCBwcm9maWxlIGRhdGEnIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59Il0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImFuYWx5emVVc2VyUGVyZm9ybWFuY2UiLCJ2ZXJpZnlUb2tlbiIsIkdFVCIsInJlcXVlc3QiLCJzZWFyY2hQYXJhbXMiLCJVUkwiLCJ1cmwiLCJjZkhhbmRsZSIsImdldCIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsInByb2ZpbGVEYXRhIiwic3VjY2VzcyIsImNvbnNvbGUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/codeforces/profile/route.js\n");

/***/ }),

/***/ "(rsc)/./lib/auth.js":
/*!*********************!*\
  !*** ./lib/auth.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken),\n/* harmony export */   withAuth: () => (/* binding */ withAuth)\n/* harmony export */ });\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);\n\nconst JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';\n/**\n * Verify JWT token\n * @param {string} token - The JWT token to verify\n * @returns {object|null} - Decoded token payload or null if invalid\n */ function verifyToken(token) {\n    if (!token) {\n        return null;\n    }\n    try {\n        return (0,jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__.verify)(token, JWT_SECRET);\n    } catch (error) {\n        console.error('Token verification error:', error);\n        return null;\n    }\n}\n/**\n * Authorization middleware for API routes\n * @param {function} handler - The API route handler\n * @returns {function} - Middleware function\n */ function withAuth(handler) {\n    return async (req, res)=>{\n        try {\n            // Extract token from Authorization header\n            const authHeader = req.headers.authorization;\n            if (!authHeader || !authHeader.startsWith('Bearer ')) {\n                return res.status(401).json({\n                    message: 'Unauthorized'\n                });\n            }\n            const token = authHeader.split(' ')[1];\n            const payload = verifyToken(token);\n            if (!payload) {\n                return res.status(401).json({\n                    message: 'Invalid token'\n                });\n            }\n            // Add user info to request\n            req.user = payload;\n            // Call the original handler\n            return handler(req, res);\n        } catch (error) {\n            console.error('Auth middleware error:', error);\n            return res.status(500).json({\n                message: 'Internal server error'\n            });\n        }\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQXNDO0FBRXRDLE1BQU1DLGFBQWFDLFFBQVFDLEdBQUcsQ0FBQ0YsVUFBVSxJQUFJO0FBRTdDOzs7O0NBSUMsR0FDTSxTQUFTRyxZQUFZQyxLQUFLO0lBQy9CLElBQUksQ0FBQ0EsT0FBTztRQUNWLE9BQU87SUFDVDtJQUVBLElBQUk7UUFDRixPQUFPTCxvREFBTUEsQ0FBQ0ssT0FBT0o7SUFDdkIsRUFBRSxPQUFPSyxPQUFPO1FBQ2RDLFFBQVFELEtBQUssQ0FBQyw2QkFBNkJBO1FBQzNDLE9BQU87SUFDVDtBQUNGO0FBRUE7Ozs7Q0FJQyxHQUNNLFNBQVNFLFNBQVNDLE9BQU87SUFDOUIsT0FBTyxPQUFPQyxLQUFLQztRQUNqQixJQUFJO1lBQ0YsMENBQTBDO1lBQzFDLE1BQU1DLGFBQWFGLElBQUlHLE9BQU8sQ0FBQ0MsYUFBYTtZQUM1QyxJQUFJLENBQUNGLGNBQWMsQ0FBQ0EsV0FBV0csVUFBVSxDQUFDLFlBQVk7Z0JBQ3BELE9BQU9KLElBQUlLLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7b0JBQUVDLFNBQVM7Z0JBQWU7WUFDeEQ7WUFFQSxNQUFNYixRQUFRTyxXQUFXTyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdEMsTUFBTUMsVUFBVWhCLFlBQVlDO1lBRTVCLElBQUksQ0FBQ2UsU0FBUztnQkFDWixPQUFPVCxJQUFJSyxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO29CQUFFQyxTQUFTO2dCQUFnQjtZQUN6RDtZQUVBLDJCQUEyQjtZQUMzQlIsSUFBSVcsSUFBSSxHQUFHRDtZQUVYLDRCQUE0QjtZQUM1QixPQUFPWCxRQUFRQyxLQUFLQztRQUN0QixFQUFFLE9BQU9MLE9BQU87WUFDZEMsUUFBUUQsS0FBSyxDQUFDLDBCQUEwQkE7WUFDeEMsT0FBT0ssSUFBSUssTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztnQkFBRUMsU0FBUztZQUF3QjtRQUNqRTtJQUNGO0FBQ0YiLCJzb3VyY2VzIjpbIi9ob21lL3J1bm5lci93b3Jrc3BhY2UvbGliL2F1dGguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdmVyaWZ5IH0gZnJvbSAnanNvbndlYnRva2VuJztcblxuY29uc3QgSldUX1NFQ1JFVCA9IHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgfHwgJ2RlZmF1bHRfand0X3NlY3JldCc7XG5cbi8qKlxuICogVmVyaWZ5IEpXVCB0b2tlblxuICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gVGhlIEpXVCB0b2tlbiB0byB2ZXJpZnlcbiAqIEByZXR1cm5zIHtvYmplY3R8bnVsbH0gLSBEZWNvZGVkIHRva2VuIHBheWxvYWQgb3IgbnVsbCBpZiBpbnZhbGlkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlUb2tlbih0b2tlbikge1xuICBpZiAoIXRva2VuKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgXG4gIHRyeSB7XG4gICAgcmV0dXJuIHZlcmlmeSh0b2tlbiwgSldUX1NFQ1JFVCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignVG9rZW4gdmVyaWZpY2F0aW9uIGVycm9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIEF1dGhvcml6YXRpb24gbWlkZGxld2FyZSBmb3IgQVBJIHJvdXRlc1xuICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciAtIFRoZSBBUEkgcm91dGUgaGFuZGxlclxuICogQHJldHVybnMge2Z1bmN0aW9ufSAtIE1pZGRsZXdhcmUgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhBdXRoKGhhbmRsZXIpIHtcbiAgcmV0dXJuIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgIHRyeSB7XG4gICAgICAvLyBFeHRyYWN0IHRva2VuIGZyb20gQXV0aG9yaXphdGlvbiBoZWFkZXJcbiAgICAgIGNvbnN0IGF1dGhIZWFkZXIgPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uO1xuICAgICAgaWYgKCFhdXRoSGVhZGVyIHx8ICFhdXRoSGVhZGVyLnN0YXJ0c1dpdGgoJ0JlYXJlciAnKSkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLmpzb24oeyBtZXNzYWdlOiAnVW5hdXRob3JpemVkJyB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgY29uc3QgdG9rZW4gPSBhdXRoSGVhZGVyLnNwbGl0KCcgJylbMV07XG4gICAgICBjb25zdCBwYXlsb2FkID0gdmVyaWZ5VG9rZW4odG9rZW4pO1xuICAgICAgXG4gICAgICBpZiAoIXBheWxvYWQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKHsgbWVzc2FnZTogJ0ludmFsaWQgdG9rZW4nIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBBZGQgdXNlciBpbmZvIHRvIHJlcXVlc3RcbiAgICAgIHJlcS51c2VyID0gcGF5bG9hZDtcbiAgICAgIFxuICAgICAgLy8gQ2FsbCB0aGUgb3JpZ2luYWwgaGFuZGxlclxuICAgICAgcmV0dXJuIGhhbmRsZXIocmVxLCByZXMpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdBdXRoIG1pZGRsZXdhcmUgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogJ0ludGVybmFsIHNlcnZlciBlcnJvcicgfSk7XG4gICAgfVxuICB9O1xufVxuIl0sIm5hbWVzIjpbInZlcmlmeSIsIkpXVF9TRUNSRVQiLCJwcm9jZXNzIiwiZW52IiwidmVyaWZ5VG9rZW4iLCJ0b2tlbiIsImVycm9yIiwiY29uc29sZSIsIndpdGhBdXRoIiwiaGFuZGxlciIsInJlcSIsInJlcyIsImF1dGhIZWFkZXIiLCJoZWFkZXJzIiwiYXV0aG9yaXphdGlvbiIsInN0YXJ0c1dpdGgiLCJzdGF0dXMiLCJqc29uIiwibWVzc2FnZSIsInNwbGl0IiwicGF5bG9hZCIsInVzZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fcodeforces%2Fprofile%2Froute&page=%2Fapi%2Fcodeforces%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcodeforces%2Fprofile%2Froute.js&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fcodeforces%2Fprofile%2Froute&page=%2Fapi%2Fcodeforces%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcodeforces%2Fprofile%2Froute.js&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_runner_workspace_app_api_codeforces_profile_route_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/codeforces/profile/route.js */ \"(rsc)/./app/api/codeforces/profile/route.js\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/codeforces/profile/route\",\n        pathname: \"/api/codeforces/profile\",\n        filename: \"route\",\n        bundlePath: \"app/api/codeforces/profile/route\"\n    },\n    resolvedPagePath: \"/home/runner/workspace/app/api/codeforces/profile/route.js\",\n    nextConfigOutput,\n    userland: _home_runner_workspace_app_api_codeforces_profile_route_js__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZjb2RlZm9yY2VzJTJGcHJvZmlsZSUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGY29kZWZvcmNlcyUyRnByb2ZpbGUlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZjb2RlZm9yY2VzJTJGcHJvZmlsZSUyRnJvdXRlLmpzJmFwcERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNVO0FBQ3ZGO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL2FwcC9hcGkvY29kZWZvcmNlcy9wcm9maWxlL3JvdXRlLmpzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9jb2RlZm9yY2VzL3Byb2ZpbGUvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9jb2RlZm9yY2VzL3Byb2ZpbGVcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2NvZGVmb3JjZXMvcHJvZmlsZS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9ob21lL3J1bm5lci93b3Jrc3BhY2UvYXBwL2FwaS9jb2RlZm9yY2VzL3Byb2ZpbGUvcm91dGUuanNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fcodeforces%2Fprofile%2Froute&page=%2Fapi%2Fcodeforces%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcodeforces%2Fprofile%2Froute.js&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./utils/codeforcesApi.js":
/*!********************************!*\
  !*** ./utils/codeforcesApi.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   analyzeUserPerformance: () => (/* binding */ analyzeUserPerformance),\n/* harmony export */   getCuratedProblemList: () => (/* binding */ getCuratedProblemList),\n/* harmony export */   getProblemSet: () => (/* binding */ getProblemSet),\n/* harmony export */   getUserInfo: () => (/* binding */ getUserInfo),\n/* harmony export */   getUserRatingHistory: () => (/* binding */ getUserRatingHistory),\n/* harmony export */   getUserSubmissions: () => (/* binding */ getUserSubmissions)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"(rsc)/./node_modules/axios/lib/axios.js\");\n\n/**\n * Base URL for Codeforces API\n */ const CF_API_BASE = 'https://codeforces.com/api';\n/**\n * Get user information from Codeforces API\n * @param {string} handle - Codeforces handle/username\n * @returns {Promise<Object>} - User information\n */ async function getUserInfo(handle) {\n    try {\n        const response = await axios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get(`${CF_API_BASE}/user.info?handles=${handle}`);\n        if (response.data.status === 'OK') {\n            return {\n                success: true,\n                user: response.data.result[0]\n            };\n        }\n        return {\n            success: false,\n            error: 'Could not fetch user information'\n        };\n    } catch (error) {\n        return {\n            success: false,\n            error: error.response?.data?.comment || 'Error fetching user data'\n        };\n    }\n}\n/**\n * Get user's submission statistics from Codeforces API\n * @param {string} handle - Codeforces handle/username\n * @returns {Promise<Object>} - Submission statistics\n */ async function getUserSubmissions(handle) {\n    try {\n        const response = await axios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get(`${CF_API_BASE}/user.status?handle=${handle}&from=1&count=100`);\n        if (response.data.status === 'OK') {\n            return {\n                success: true,\n                submissions: response.data.result\n            };\n        }\n        return {\n            success: false,\n            error: 'Could not fetch user submissions'\n        };\n    } catch (error) {\n        return {\n            success: false,\n            error: error.response?.data?.comment || 'Error fetching submissions'\n        };\n    }\n}\n/**\n * Get user's contest rating history from Codeforces API\n * @param {string} handle - Codeforces handle/username\n * @returns {Promise<Object>} - Rating history\n */ async function getUserRatingHistory(handle) {\n    try {\n        const response = await axios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get(`${CF_API_BASE}/user.rating?handle=${handle}`);\n        if (response.data.status === 'OK') {\n            return {\n                success: true,\n                contests: response.data.result\n            };\n        }\n        return {\n            success: false,\n            error: 'Could not fetch rating history'\n        };\n    } catch (error) {\n        return {\n            success: false,\n            error: error.response?.data?.comment || 'Error fetching rating history'\n        };\n    }\n}\n/**\n * Get problem set from Codeforces API\n * @param {Object} params - Query parameters\n * @returns {Promise<Object>} - Problem set data\n */ async function getProblemSet(params = {}) {\n    try {\n        const response = await axios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get(`${CF_API_BASE}/problemset.problems`, {\n            params\n        });\n        if (response.data.status === 'OK') {\n            return {\n                success: true,\n                problems: response.data.result.problems,\n                problemStatistics: response.data.result.problemStatistics\n            };\n        }\n        return {\n            success: false,\n            error: 'Could not fetch problem set'\n        };\n    } catch (error) {\n        return {\n            success: false,\n            error: error.response?.data?.comment || 'Error fetching problem set'\n        };\n    }\n}\n/**\n * Filter and curate a list of 100 good problems from different difficulty levels\n * @returns {Promise<Array>} - Curated problem list\n */ async function getCuratedProblemList() {\n    try {\n        const { success, problems, error } = await getProblemSet();\n        if (!success) {\n            return {\n                success: false,\n                error\n            };\n        }\n        // Filter out problems without a rating (difficulty)\n        const ratedProblems = problems.filter((p)=>p.rating);\n        // Group problems by rating\n        const groupedByRating = {};\n        ratedProblems.forEach((problem)=>{\n            if (!groupedByRating[problem.rating]) {\n                groupedByRating[problem.rating] = [];\n            }\n            groupedByRating[problem.rating].push(problem);\n        });\n        // Get curated problems from different rating ranges\n        const curated = [];\n        const ratingRanges = [\n            {\n                min: 800,\n                max: 1000,\n                count: 15\n            },\n            {\n                min: 1100,\n                max: 1300,\n                count: 20\n            },\n            {\n                min: 1400,\n                max: 1600,\n                count: 25\n            },\n            {\n                min: 1700,\n                max: 1900,\n                count: 20\n            },\n            {\n                min: 2000,\n                max: 2400,\n                count: 15\n            },\n            {\n                min: 2500,\n                max: 3500,\n                count: 5\n            } // Expert\n        ];\n        ratingRanges.forEach((range)=>{\n            const problemsInRange = ratedProblems.filter((p)=>p.rating >= range.min && p.rating <= range.max);\n            // Add a subset of problems from this range to the curated list\n            const selectedFromRange = problemsInRange.sort(()=>0.5 - Math.random()) // Shuffle\n            .slice(0, range.count);\n            curated.push(...selectedFromRange);\n        });\n        return {\n            success: true,\n            problems: curated.slice(0, 100)\n        };\n    } catch (error) {\n        return {\n            success: false,\n            error: error.message || 'Error creating curated problem list'\n        };\n    }\n}\n/**\n * Analyze user performance based on submissions\n * @param {string} handle - Codeforces handle/username\n * @returns {Promise<Object>} - Analysis data\n */ async function analyzeUserPerformance(handle) {\n    try {\n        const [userInfoResponse, submissionsResponse, ratingResponse] = await Promise.all([\n            getUserInfo(handle),\n            getUserSubmissions(handle),\n            getUserRatingHistory(handle)\n        ]);\n        if (!userInfoResponse.success) {\n            return userInfoResponse;\n        }\n        const user = userInfoResponse.user;\n        const submissions = submissionsResponse.success ? submissionsResponse.submissions : [];\n        const ratingHistory = ratingResponse.success ? ratingResponse.contests : [];\n        // Count solved problems (distinct)\n        const solvedProblems = new Set();\n        const submissionsByVerdict = {};\n        const submissionsByTag = {};\n        submissions.forEach((submission)=>{\n            // Count by verdict\n            const verdict = submission.verdict || 'UNKNOWN';\n            submissionsByVerdict[verdict] = (submissionsByVerdict[verdict] || 0) + 1;\n            // Track solved problems\n            if (verdict === 'OK') {\n                const problemId = `${submission.problem.contestId}${submission.problem.index}`;\n                solvedProblems.add(problemId);\n                // Count by tag\n                if (submission.problem.tags) {\n                    submission.problem.tags.forEach((tag)=>{\n                        submissionsByTag[tag] = (submissionsByTag[tag] || 0) + 1;\n                    });\n                }\n            }\n        });\n        return {\n            success: true,\n            user,\n            stats: {\n                rating: user.rating,\n                maxRating: user.maxRating,\n                rank: user.rank,\n                solvedCount: solvedProblems.size,\n                submissionCount: submissions.length,\n                submissionsByVerdict,\n                submissionsByTag,\n                ratingHistory: ratingHistory.map((contest)=>({\n                        contestId: contest.contestId,\n                        contestName: contest.contestName,\n                        rank: contest.rank,\n                        oldRating: contest.oldRating,\n                        newRating: contest.newRating,\n                        ratingChange: contest.newRating - contest.oldRating\n                    }))\n            }\n        };\n    } catch (error) {\n        return {\n            success: false,\n            error: error.message || 'Error analyzing user performance'\n        };\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi91dGlscy9jb2RlZm9yY2VzQXBpLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBMEI7QUFFMUI7O0NBRUMsR0FDRCxNQUFNQyxjQUFjO0FBRXBCOzs7O0NBSUMsR0FDTSxlQUFlQyxZQUFZQyxNQUFNO0lBQ3RDLElBQUk7UUFDRixNQUFNQyxXQUFXLE1BQU1KLDZDQUFLQSxDQUFDSyxHQUFHLENBQUMsR0FBR0osWUFBWSxtQkFBbUIsRUFBRUUsUUFBUTtRQUU3RSxJQUFJQyxTQUFTRSxJQUFJLENBQUNDLE1BQU0sS0FBSyxNQUFNO1lBQ2pDLE9BQU87Z0JBQ0xDLFNBQVM7Z0JBQ1RDLE1BQU1MLFNBQVNFLElBQUksQ0FBQ0ksTUFBTSxDQUFDLEVBQUU7WUFDL0I7UUFDRjtRQUVBLE9BQU87WUFDTEYsU0FBUztZQUNURyxPQUFPO1FBQ1Q7SUFDRixFQUFFLE9BQU9BLE9BQU87UUFDZCxPQUFPO1lBQ0xILFNBQVM7WUFDVEcsT0FBT0EsTUFBTVAsUUFBUSxFQUFFRSxNQUFNTSxXQUFXO1FBQzFDO0lBQ0Y7QUFDRjtBQUVBOzs7O0NBSUMsR0FDTSxlQUFlQyxtQkFBbUJWLE1BQU07SUFDN0MsSUFBSTtRQUNGLE1BQU1DLFdBQVcsTUFBTUosNkNBQUtBLENBQUNLLEdBQUcsQ0FBQyxHQUFHSixZQUFZLG9CQUFvQixFQUFFRSxPQUFPLGlCQUFpQixDQUFDO1FBRS9GLElBQUlDLFNBQVNFLElBQUksQ0FBQ0MsTUFBTSxLQUFLLE1BQU07WUFDakMsT0FBTztnQkFDTEMsU0FBUztnQkFDVE0sYUFBYVYsU0FBU0UsSUFBSSxDQUFDSSxNQUFNO1lBQ25DO1FBQ0Y7UUFFQSxPQUFPO1lBQ0xGLFNBQVM7WUFDVEcsT0FBTztRQUNUO0lBQ0YsRUFBRSxPQUFPQSxPQUFPO1FBQ2QsT0FBTztZQUNMSCxTQUFTO1lBQ1RHLE9BQU9BLE1BQU1QLFFBQVEsRUFBRUUsTUFBTU0sV0FBVztRQUMxQztJQUNGO0FBQ0Y7QUFFQTs7OztDQUlDLEdBQ00sZUFBZUcscUJBQXFCWixNQUFNO0lBQy9DLElBQUk7UUFDRixNQUFNQyxXQUFXLE1BQU1KLDZDQUFLQSxDQUFDSyxHQUFHLENBQUMsR0FBR0osWUFBWSxvQkFBb0IsRUFBRUUsUUFBUTtRQUU5RSxJQUFJQyxTQUFTRSxJQUFJLENBQUNDLE1BQU0sS0FBSyxNQUFNO1lBQ2pDLE9BQU87Z0JBQ0xDLFNBQVM7Z0JBQ1RRLFVBQVVaLFNBQVNFLElBQUksQ0FBQ0ksTUFBTTtZQUNoQztRQUNGO1FBRUEsT0FBTztZQUNMRixTQUFTO1lBQ1RHLE9BQU87UUFDVDtJQUNGLEVBQUUsT0FBT0EsT0FBTztRQUNkLE9BQU87WUFDTEgsU0FBUztZQUNURyxPQUFPQSxNQUFNUCxRQUFRLEVBQUVFLE1BQU1NLFdBQVc7UUFDMUM7SUFDRjtBQUNGO0FBRUE7Ozs7Q0FJQyxHQUNNLGVBQWVLLGNBQWNDLFNBQVMsQ0FBQyxDQUFDO0lBQzdDLElBQUk7UUFDRixNQUFNZCxXQUFXLE1BQU1KLDZDQUFLQSxDQUFDSyxHQUFHLENBQUMsR0FBR0osWUFBWSxvQkFBb0IsQ0FBQyxFQUFFO1lBQUVpQjtRQUFPO1FBRWhGLElBQUlkLFNBQVNFLElBQUksQ0FBQ0MsTUFBTSxLQUFLLE1BQU07WUFDakMsT0FBTztnQkFDTEMsU0FBUztnQkFDVFcsVUFBVWYsU0FBU0UsSUFBSSxDQUFDSSxNQUFNLENBQUNTLFFBQVE7Z0JBQ3ZDQyxtQkFBbUJoQixTQUFTRSxJQUFJLENBQUNJLE1BQU0sQ0FBQ1UsaUJBQWlCO1lBQzNEO1FBQ0Y7UUFFQSxPQUFPO1lBQ0xaLFNBQVM7WUFDVEcsT0FBTztRQUNUO0lBQ0YsRUFBRSxPQUFPQSxPQUFPO1FBQ2QsT0FBTztZQUNMSCxTQUFTO1lBQ1RHLE9BQU9BLE1BQU1QLFFBQVEsRUFBRUUsTUFBTU0sV0FBVztRQUMxQztJQUNGO0FBQ0Y7QUFFQTs7O0NBR0MsR0FDTSxlQUFlUztJQUNwQixJQUFJO1FBQ0YsTUFBTSxFQUFFYixPQUFPLEVBQUVXLFFBQVEsRUFBRVIsS0FBSyxFQUFFLEdBQUcsTUFBTU07UUFFM0MsSUFBSSxDQUFDVCxTQUFTO1lBQ1osT0FBTztnQkFBRUEsU0FBUztnQkFBT0c7WUFBTTtRQUNqQztRQUVBLG9EQUFvRDtRQUNwRCxNQUFNVyxnQkFBZ0JILFNBQVNJLE1BQU0sQ0FBQ0MsQ0FBQUEsSUFBS0EsRUFBRUMsTUFBTTtRQUVuRCwyQkFBMkI7UUFDM0IsTUFBTUMsa0JBQWtCLENBQUM7UUFDekJKLGNBQWNLLE9BQU8sQ0FBQ0MsQ0FBQUE7WUFDcEIsSUFBSSxDQUFDRixlQUFlLENBQUNFLFFBQVFILE1BQU0sQ0FBQyxFQUFFO2dCQUNwQ0MsZUFBZSxDQUFDRSxRQUFRSCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ3RDO1lBQ0FDLGVBQWUsQ0FBQ0UsUUFBUUgsTUFBTSxDQUFDLENBQUNJLElBQUksQ0FBQ0Q7UUFDdkM7UUFFQSxvREFBb0Q7UUFDcEQsTUFBTUUsVUFBVSxFQUFFO1FBQ2xCLE1BQU1DLGVBQWU7WUFDbkI7Z0JBQUVDLEtBQUs7Z0JBQUtDLEtBQUs7Z0JBQU1DLE9BQU87WUFBRztZQUNqQztnQkFBRUYsS0FBSztnQkFBTUMsS0FBSztnQkFBTUMsT0FBTztZQUFHO1lBQ2xDO2dCQUFFRixLQUFLO2dCQUFNQyxLQUFLO2dCQUFNQyxPQUFPO1lBQUc7WUFDbEM7Z0JBQUVGLEtBQUs7Z0JBQU1DLEtBQUs7Z0JBQU1DLE9BQU87WUFBRztZQUNsQztnQkFBRUYsS0FBSztnQkFBTUMsS0FBSztnQkFBTUMsT0FBTztZQUFHO1lBQ2xDO2dCQUFFRixLQUFLO2dCQUFNQyxLQUFLO2dCQUFNQyxPQUFPO1lBQUUsRUFBSyxTQUFTO1NBQ2hEO1FBRURILGFBQWFKLE9BQU8sQ0FBQ1EsQ0FBQUE7WUFDbkIsTUFBTUMsa0JBQWtCZCxjQUFjQyxNQUFNLENBQUNDLENBQUFBLElBQzNDQSxFQUFFQyxNQUFNLElBQUlVLE1BQU1ILEdBQUcsSUFBSVIsRUFBRUMsTUFBTSxJQUFJVSxNQUFNRixHQUFHO1lBR2hELCtEQUErRDtZQUMvRCxNQUFNSSxvQkFBb0JELGdCQUN2QkUsSUFBSSxDQUFDLElBQU0sTUFBTUMsS0FBS0MsTUFBTSxJQUFJLFVBQVU7YUFDMUNDLEtBQUssQ0FBQyxHQUFHTixNQUFNRCxLQUFLO1lBRXZCSixRQUFRRCxJQUFJLElBQUlRO1FBQ2xCO1FBRUEsT0FBTztZQUNMN0IsU0FBUztZQUNUVyxVQUFVVyxRQUFRVyxLQUFLLENBQUMsR0FBRztRQUM3QjtJQUNGLEVBQUUsT0FBTzlCLE9BQU87UUFDZCxPQUFPO1lBQ0xILFNBQVM7WUFDVEcsT0FBT0EsTUFBTStCLE9BQU8sSUFBSTtRQUMxQjtJQUNGO0FBQ0Y7QUFFQTs7OztDQUlDLEdBQ00sZUFBZUMsdUJBQXVCeEMsTUFBTTtJQUNqRCxJQUFJO1FBQ0YsTUFBTSxDQUFDeUMsa0JBQWtCQyxxQkFBcUJDLGVBQWUsR0FBRyxNQUFNQyxRQUFRQyxHQUFHLENBQUM7WUFDaEY5QyxZQUFZQztZQUNaVSxtQkFBbUJWO1lBQ25CWSxxQkFBcUJaO1NBQ3RCO1FBRUQsSUFBSSxDQUFDeUMsaUJBQWlCcEMsT0FBTyxFQUFFO1lBQzdCLE9BQU9vQztRQUNUO1FBRUEsTUFBTW5DLE9BQU9tQyxpQkFBaUJuQyxJQUFJO1FBQ2xDLE1BQU1LLGNBQWMrQixvQkFBb0JyQyxPQUFPLEdBQUdxQyxvQkFBb0IvQixXQUFXLEdBQUcsRUFBRTtRQUN0RixNQUFNbUMsZ0JBQWdCSCxlQUFldEMsT0FBTyxHQUFHc0MsZUFBZTlCLFFBQVEsR0FBRyxFQUFFO1FBRTNFLG1DQUFtQztRQUNuQyxNQUFNa0MsaUJBQWlCLElBQUlDO1FBQzNCLE1BQU1DLHVCQUF1QixDQUFDO1FBQzlCLE1BQU1DLG1CQUFtQixDQUFDO1FBRTFCdkMsWUFBWWEsT0FBTyxDQUFDMkIsQ0FBQUE7WUFDbEIsbUJBQW1CO1lBQ25CLE1BQU1DLFVBQVVELFdBQVdDLE9BQU8sSUFBSTtZQUN0Q0gsb0JBQW9CLENBQUNHLFFBQVEsR0FBRyxDQUFDSCxvQkFBb0IsQ0FBQ0csUUFBUSxJQUFJLEtBQUs7WUFFdkUsd0JBQXdCO1lBQ3hCLElBQUlBLFlBQVksTUFBTTtnQkFDcEIsTUFBTUMsWUFBWSxHQUFHRixXQUFXMUIsT0FBTyxDQUFDNkIsU0FBUyxHQUFHSCxXQUFXMUIsT0FBTyxDQUFDOEIsS0FBSyxFQUFFO2dCQUM5RVIsZUFBZVMsR0FBRyxDQUFDSDtnQkFFbkIsZUFBZTtnQkFDZixJQUFJRixXQUFXMUIsT0FBTyxDQUFDZ0MsSUFBSSxFQUFFO29CQUMzQk4sV0FBVzFCLE9BQU8sQ0FBQ2dDLElBQUksQ0FBQ2pDLE9BQU8sQ0FBQ2tDLENBQUFBO3dCQUM5QlIsZ0JBQWdCLENBQUNRLElBQUksR0FBRyxDQUFDUixnQkFBZ0IsQ0FBQ1EsSUFBSSxJQUFJLEtBQUs7b0JBQ3pEO2dCQUNGO1lBQ0Y7UUFDRjtRQUVBLE9BQU87WUFDTHJELFNBQVM7WUFDVEM7WUFDQXFELE9BQU87Z0JBQ0xyQyxRQUFRaEIsS0FBS2dCLE1BQU07Z0JBQ25Cc0MsV0FBV3RELEtBQUtzRCxTQUFTO2dCQUN6QkMsTUFBTXZELEtBQUt1RCxJQUFJO2dCQUNmQyxhQUFhZixlQUFlZ0IsSUFBSTtnQkFDaENDLGlCQUFpQnJELFlBQVlzRCxNQUFNO2dCQUNuQ2hCO2dCQUNBQztnQkFDQUosZUFBZUEsY0FBY29CLEdBQUcsQ0FBQ0MsQ0FBQUEsVUFBWTt3QkFDM0NiLFdBQVdhLFFBQVFiLFNBQVM7d0JBQzVCYyxhQUFhRCxRQUFRQyxXQUFXO3dCQUNoQ1AsTUFBTU0sUUFBUU4sSUFBSTt3QkFDbEJRLFdBQVdGLFFBQVFFLFNBQVM7d0JBQzVCQyxXQUFXSCxRQUFRRyxTQUFTO3dCQUM1QkMsY0FBY0osUUFBUUcsU0FBUyxHQUFHSCxRQUFRRSxTQUFTO29CQUNyRDtZQUNGO1FBQ0Y7SUFDRixFQUFFLE9BQU83RCxPQUFPO1FBQ2QsT0FBTztZQUNMSCxTQUFTO1lBQ1RHLE9BQU9BLE1BQU0rQixPQUFPLElBQUk7UUFDMUI7SUFDRjtBQUNGIiwic291cmNlcyI6WyIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL3V0aWxzL2NvZGVmb3JjZXNBcGkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcblxuLyoqXG4gKiBCYXNlIFVSTCBmb3IgQ29kZWZvcmNlcyBBUElcbiAqL1xuY29uc3QgQ0ZfQVBJX0JBU0UgPSAnaHR0cHM6Ly9jb2RlZm9yY2VzLmNvbS9hcGknO1xuXG4vKipcbiAqIEdldCB1c2VyIGluZm9ybWF0aW9uIGZyb20gQ29kZWZvcmNlcyBBUElcbiAqIEBwYXJhbSB7c3RyaW5nfSBoYW5kbGUgLSBDb2RlZm9yY2VzIGhhbmRsZS91c2VybmFtZVxuICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0Pn0gLSBVc2VyIGluZm9ybWF0aW9uXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRVc2VySW5mbyhoYW5kbGUpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChgJHtDRl9BUElfQkFTRX0vdXNlci5pbmZvP2hhbmRsZXM9JHtoYW5kbGV9YCk7XG4gICAgXG4gICAgaWYgKHJlc3BvbnNlLmRhdGEuc3RhdHVzID09PSAnT0snKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICB1c2VyOiByZXNwb25zZS5kYXRhLnJlc3VsdFswXVxuICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgZXJyb3I6ICdDb3VsZCBub3QgZmV0Y2ggdXNlciBpbmZvcm1hdGlvbidcbiAgICB9O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB7XG4gICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgIGVycm9yOiBlcnJvci5yZXNwb25zZT8uZGF0YT8uY29tbWVudCB8fCAnRXJyb3IgZmV0Y2hpbmcgdXNlciBkYXRhJ1xuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgdXNlcidzIHN1Ym1pc3Npb24gc3RhdGlzdGljcyBmcm9tIENvZGVmb3JjZXMgQVBJXG4gKiBAcGFyYW0ge3N0cmluZ30gaGFuZGxlIC0gQ29kZWZvcmNlcyBoYW5kbGUvdXNlcm5hbWVcbiAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59IC0gU3VibWlzc2lvbiBzdGF0aXN0aWNzXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRVc2VyU3VibWlzc2lvbnMoaGFuZGxlKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQoYCR7Q0ZfQVBJX0JBU0V9L3VzZXIuc3RhdHVzP2hhbmRsZT0ke2hhbmRsZX0mZnJvbT0xJmNvdW50PTEwMGApO1xuICAgIFxuICAgIGlmIChyZXNwb25zZS5kYXRhLnN0YXR1cyA9PT0gJ09LJykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgc3VibWlzc2lvbnM6IHJlc3BvbnNlLmRhdGEucmVzdWx0XG4gICAgICB9O1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogJ0NvdWxkIG5vdCBmZXRjaCB1c2VyIHN1Ym1pc3Npb25zJ1xuICAgIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgZXJyb3I6IGVycm9yLnJlc3BvbnNlPy5kYXRhPy5jb21tZW50IHx8ICdFcnJvciBmZXRjaGluZyBzdWJtaXNzaW9ucydcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogR2V0IHVzZXIncyBjb250ZXN0IHJhdGluZyBoaXN0b3J5IGZyb20gQ29kZWZvcmNlcyBBUElcbiAqIEBwYXJhbSB7c3RyaW5nfSBoYW5kbGUgLSBDb2RlZm9yY2VzIGhhbmRsZS91c2VybmFtZVxuICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0Pn0gLSBSYXRpbmcgaGlzdG9yeVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VXNlclJhdGluZ0hpc3RvcnkoaGFuZGxlKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQoYCR7Q0ZfQVBJX0JBU0V9L3VzZXIucmF0aW5nP2hhbmRsZT0ke2hhbmRsZX1gKTtcbiAgICBcbiAgICBpZiAocmVzcG9uc2UuZGF0YS5zdGF0dXMgPT09ICdPSycpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIGNvbnRlc3RzOiByZXNwb25zZS5kYXRhLnJlc3VsdFxuICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgZXJyb3I6ICdDb3VsZCBub3QgZmV0Y2ggcmF0aW5nIGhpc3RvcnknXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogZXJyb3IucmVzcG9uc2U/LmRhdGE/LmNvbW1lbnQgfHwgJ0Vycm9yIGZldGNoaW5nIHJhdGluZyBoaXN0b3J5J1xuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgcHJvYmxlbSBzZXQgZnJvbSBDb2RlZm9yY2VzIEFQSVxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIFF1ZXJ5IHBhcmFtZXRlcnNcbiAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59IC0gUHJvYmxlbSBzZXQgZGF0YVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UHJvYmxlbVNldChwYXJhbXMgPSB7fSkge1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KGAke0NGX0FQSV9CQVNFfS9wcm9ibGVtc2V0LnByb2JsZW1zYCwgeyBwYXJhbXMgfSk7XG4gICAgXG4gICAgaWYgKHJlc3BvbnNlLmRhdGEuc3RhdHVzID09PSAnT0snKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBwcm9ibGVtczogcmVzcG9uc2UuZGF0YS5yZXN1bHQucHJvYmxlbXMsXG4gICAgICAgIHByb2JsZW1TdGF0aXN0aWNzOiByZXNwb25zZS5kYXRhLnJlc3VsdC5wcm9ibGVtU3RhdGlzdGljc1xuICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgZXJyb3I6ICdDb3VsZCBub3QgZmV0Y2ggcHJvYmxlbSBzZXQnXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogZXJyb3IucmVzcG9uc2U/LmRhdGE/LmNvbW1lbnQgfHwgJ0Vycm9yIGZldGNoaW5nIHByb2JsZW0gc2V0J1xuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBGaWx0ZXIgYW5kIGN1cmF0ZSBhIGxpc3Qgb2YgMTAwIGdvb2QgcHJvYmxlbXMgZnJvbSBkaWZmZXJlbnQgZGlmZmljdWx0eSBsZXZlbHNcbiAqIEByZXR1cm5zIHtQcm9taXNlPEFycmF5Pn0gLSBDdXJhdGVkIHByb2JsZW0gbGlzdFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q3VyYXRlZFByb2JsZW1MaXN0KCkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgc3VjY2VzcywgcHJvYmxlbXMsIGVycm9yIH0gPSBhd2FpdCBnZXRQcm9ibGVtU2V0KCk7XG4gICAgXG4gICAgaWYgKCFzdWNjZXNzKSB7XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3IgfTtcbiAgICB9XG4gICAgXG4gICAgLy8gRmlsdGVyIG91dCBwcm9ibGVtcyB3aXRob3V0IGEgcmF0aW5nIChkaWZmaWN1bHR5KVxuICAgIGNvbnN0IHJhdGVkUHJvYmxlbXMgPSBwcm9ibGVtcy5maWx0ZXIocCA9PiBwLnJhdGluZyk7XG4gICAgXG4gICAgLy8gR3JvdXAgcHJvYmxlbXMgYnkgcmF0aW5nXG4gICAgY29uc3QgZ3JvdXBlZEJ5UmF0aW5nID0ge307XG4gICAgcmF0ZWRQcm9ibGVtcy5mb3JFYWNoKHByb2JsZW0gPT4ge1xuICAgICAgaWYgKCFncm91cGVkQnlSYXRpbmdbcHJvYmxlbS5yYXRpbmddKSB7XG4gICAgICAgIGdyb3VwZWRCeVJhdGluZ1twcm9ibGVtLnJhdGluZ10gPSBbXTtcbiAgICAgIH1cbiAgICAgIGdyb3VwZWRCeVJhdGluZ1twcm9ibGVtLnJhdGluZ10ucHVzaChwcm9ibGVtKTtcbiAgICB9KTtcbiAgICBcbiAgICAvLyBHZXQgY3VyYXRlZCBwcm9ibGVtcyBmcm9tIGRpZmZlcmVudCByYXRpbmcgcmFuZ2VzXG4gICAgY29uc3QgY3VyYXRlZCA9IFtdO1xuICAgIGNvbnN0IHJhdGluZ1JhbmdlcyA9IFtcbiAgICAgIHsgbWluOiA4MDAsIG1heDogMTAwMCwgY291bnQ6IDE1IH0sICAgLy8gQmVnaW5uZXJcbiAgICAgIHsgbWluOiAxMTAwLCBtYXg6IDEzMDAsIGNvdW50OiAyMCB9LCAgLy8gRWFzeVxuICAgICAgeyBtaW46IDE0MDAsIG1heDogMTYwMCwgY291bnQ6IDI1IH0sICAvLyBNZWRpdW1cbiAgICAgIHsgbWluOiAxNzAwLCBtYXg6IDE5MDAsIGNvdW50OiAyMCB9LCAgLy8gSGFyZFxuICAgICAgeyBtaW46IDIwMDAsIG1heDogMjQwMCwgY291bnQ6IDE1IH0sICAvLyBBZHZhbmNlZFxuICAgICAgeyBtaW46IDI1MDAsIG1heDogMzUwMCwgY291bnQ6IDUgfSAgICAvLyBFeHBlcnRcbiAgICBdO1xuICAgIFxuICAgIHJhdGluZ1Jhbmdlcy5mb3JFYWNoKHJhbmdlID0+IHtcbiAgICAgIGNvbnN0IHByb2JsZW1zSW5SYW5nZSA9IHJhdGVkUHJvYmxlbXMuZmlsdGVyKHAgPT4gXG4gICAgICAgIHAucmF0aW5nID49IHJhbmdlLm1pbiAmJiBwLnJhdGluZyA8PSByYW5nZS5tYXhcbiAgICAgICk7XG4gICAgICBcbiAgICAgIC8vIEFkZCBhIHN1YnNldCBvZiBwcm9ibGVtcyBmcm9tIHRoaXMgcmFuZ2UgdG8gdGhlIGN1cmF0ZWQgbGlzdFxuICAgICAgY29uc3Qgc2VsZWN0ZWRGcm9tUmFuZ2UgPSBwcm9ibGVtc0luUmFuZ2VcbiAgICAgICAgLnNvcnQoKCkgPT4gMC41IC0gTWF0aC5yYW5kb20oKSkgLy8gU2h1ZmZsZVxuICAgICAgICAuc2xpY2UoMCwgcmFuZ2UuY291bnQpO1xuICAgICAgICBcbiAgICAgIGN1cmF0ZWQucHVzaCguLi5zZWxlY3RlZEZyb21SYW5nZSk7XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIHsgXG4gICAgICBzdWNjZXNzOiB0cnVlLCBcbiAgICAgIHByb2JsZW1zOiBjdXJhdGVkLnNsaWNlKDAsIDEwMCkgXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogZXJyb3IubWVzc2FnZSB8fCAnRXJyb3IgY3JlYXRpbmcgY3VyYXRlZCBwcm9ibGVtIGxpc3QnXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIEFuYWx5emUgdXNlciBwZXJmb3JtYW5jZSBiYXNlZCBvbiBzdWJtaXNzaW9uc1xuICogQHBhcmFtIHtzdHJpbmd9IGhhbmRsZSAtIENvZGVmb3JjZXMgaGFuZGxlL3VzZXJuYW1lXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fSAtIEFuYWx5c2lzIGRhdGFcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFuYWx5emVVc2VyUGVyZm9ybWFuY2UoaGFuZGxlKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgW3VzZXJJbmZvUmVzcG9uc2UsIHN1Ym1pc3Npb25zUmVzcG9uc2UsIHJhdGluZ1Jlc3BvbnNlXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIGdldFVzZXJJbmZvKGhhbmRsZSksXG4gICAgICBnZXRVc2VyU3VibWlzc2lvbnMoaGFuZGxlKSxcbiAgICAgIGdldFVzZXJSYXRpbmdIaXN0b3J5KGhhbmRsZSlcbiAgICBdKTtcbiAgICBcbiAgICBpZiAoIXVzZXJJbmZvUmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgcmV0dXJuIHVzZXJJbmZvUmVzcG9uc2U7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHVzZXIgPSB1c2VySW5mb1Jlc3BvbnNlLnVzZXI7XG4gICAgY29uc3Qgc3VibWlzc2lvbnMgPSBzdWJtaXNzaW9uc1Jlc3BvbnNlLnN1Y2Nlc3MgPyBzdWJtaXNzaW9uc1Jlc3BvbnNlLnN1Ym1pc3Npb25zIDogW107XG4gICAgY29uc3QgcmF0aW5nSGlzdG9yeSA9IHJhdGluZ1Jlc3BvbnNlLnN1Y2Nlc3MgPyByYXRpbmdSZXNwb25zZS5jb250ZXN0cyA6IFtdO1xuICAgIFxuICAgIC8vIENvdW50IHNvbHZlZCBwcm9ibGVtcyAoZGlzdGluY3QpXG4gICAgY29uc3Qgc29sdmVkUHJvYmxlbXMgPSBuZXcgU2V0KCk7XG4gICAgY29uc3Qgc3VibWlzc2lvbnNCeVZlcmRpY3QgPSB7fTtcbiAgICBjb25zdCBzdWJtaXNzaW9uc0J5VGFnID0ge307XG4gICAgXG4gICAgc3VibWlzc2lvbnMuZm9yRWFjaChzdWJtaXNzaW9uID0+IHtcbiAgICAgIC8vIENvdW50IGJ5IHZlcmRpY3RcbiAgICAgIGNvbnN0IHZlcmRpY3QgPSBzdWJtaXNzaW9uLnZlcmRpY3QgfHwgJ1VOS05PV04nO1xuICAgICAgc3VibWlzc2lvbnNCeVZlcmRpY3RbdmVyZGljdF0gPSAoc3VibWlzc2lvbnNCeVZlcmRpY3RbdmVyZGljdF0gfHwgMCkgKyAxO1xuICAgICAgXG4gICAgICAvLyBUcmFjayBzb2x2ZWQgcHJvYmxlbXNcbiAgICAgIGlmICh2ZXJkaWN0ID09PSAnT0snKSB7XG4gICAgICAgIGNvbnN0IHByb2JsZW1JZCA9IGAke3N1Ym1pc3Npb24ucHJvYmxlbS5jb250ZXN0SWR9JHtzdWJtaXNzaW9uLnByb2JsZW0uaW5kZXh9YDtcbiAgICAgICAgc29sdmVkUHJvYmxlbXMuYWRkKHByb2JsZW1JZCk7XG4gICAgICAgIFxuICAgICAgICAvLyBDb3VudCBieSB0YWdcbiAgICAgICAgaWYgKHN1Ym1pc3Npb24ucHJvYmxlbS50YWdzKSB7XG4gICAgICAgICAgc3VibWlzc2lvbi5wcm9ibGVtLnRhZ3MuZm9yRWFjaCh0YWcgPT4ge1xuICAgICAgICAgICAgc3VibWlzc2lvbnNCeVRhZ1t0YWddID0gKHN1Ym1pc3Npb25zQnlUYWdbdGFnXSB8fCAwKSArIDE7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIHVzZXIsXG4gICAgICBzdGF0czoge1xuICAgICAgICByYXRpbmc6IHVzZXIucmF0aW5nLFxuICAgICAgICBtYXhSYXRpbmc6IHVzZXIubWF4UmF0aW5nLFxuICAgICAgICByYW5rOiB1c2VyLnJhbmssXG4gICAgICAgIHNvbHZlZENvdW50OiBzb2x2ZWRQcm9ibGVtcy5zaXplLFxuICAgICAgICBzdWJtaXNzaW9uQ291bnQ6IHN1Ym1pc3Npb25zLmxlbmd0aCxcbiAgICAgICAgc3VibWlzc2lvbnNCeVZlcmRpY3QsXG4gICAgICAgIHN1Ym1pc3Npb25zQnlUYWcsXG4gICAgICAgIHJhdGluZ0hpc3Rvcnk6IHJhdGluZ0hpc3RvcnkubWFwKGNvbnRlc3QgPT4gKHtcbiAgICAgICAgICBjb250ZXN0SWQ6IGNvbnRlc3QuY29udGVzdElkLFxuICAgICAgICAgIGNvbnRlc3ROYW1lOiBjb250ZXN0LmNvbnRlc3ROYW1lLFxuICAgICAgICAgIHJhbms6IGNvbnRlc3QucmFuayxcbiAgICAgICAgICBvbGRSYXRpbmc6IGNvbnRlc3Qub2xkUmF0aW5nLFxuICAgICAgICAgIG5ld1JhdGluZzogY29udGVzdC5uZXdSYXRpbmcsXG4gICAgICAgICAgcmF0aW5nQ2hhbmdlOiBjb250ZXN0Lm5ld1JhdGluZyAtIGNvbnRlc3Qub2xkUmF0aW5nXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfHwgJ0Vycm9yIGFuYWx5emluZyB1c2VyIHBlcmZvcm1hbmNlJ1xuICAgIH07XG4gIH1cbn0iXSwibmFtZXMiOlsiYXhpb3MiLCJDRl9BUElfQkFTRSIsImdldFVzZXJJbmZvIiwiaGFuZGxlIiwicmVzcG9uc2UiLCJnZXQiLCJkYXRhIiwic3RhdHVzIiwic3VjY2VzcyIsInVzZXIiLCJyZXN1bHQiLCJlcnJvciIsImNvbW1lbnQiLCJnZXRVc2VyU3VibWlzc2lvbnMiLCJzdWJtaXNzaW9ucyIsImdldFVzZXJSYXRpbmdIaXN0b3J5IiwiY29udGVzdHMiLCJnZXRQcm9ibGVtU2V0IiwicGFyYW1zIiwicHJvYmxlbXMiLCJwcm9ibGVtU3RhdGlzdGljcyIsImdldEN1cmF0ZWRQcm9ibGVtTGlzdCIsInJhdGVkUHJvYmxlbXMiLCJmaWx0ZXIiLCJwIiwicmF0aW5nIiwiZ3JvdXBlZEJ5UmF0aW5nIiwiZm9yRWFjaCIsInByb2JsZW0iLCJwdXNoIiwiY3VyYXRlZCIsInJhdGluZ1JhbmdlcyIsIm1pbiIsIm1heCIsImNvdW50IiwicmFuZ2UiLCJwcm9ibGVtc0luUmFuZ2UiLCJzZWxlY3RlZEZyb21SYW5nZSIsInNvcnQiLCJNYXRoIiwicmFuZG9tIiwic2xpY2UiLCJtZXNzYWdlIiwiYW5hbHl6ZVVzZXJQZXJmb3JtYW5jZSIsInVzZXJJbmZvUmVzcG9uc2UiLCJzdWJtaXNzaW9uc1Jlc3BvbnNlIiwicmF0aW5nUmVzcG9uc2UiLCJQcm9taXNlIiwiYWxsIiwicmF0aW5nSGlzdG9yeSIsInNvbHZlZFByb2JsZW1zIiwiU2V0Iiwic3VibWlzc2lvbnNCeVZlcmRpY3QiLCJzdWJtaXNzaW9uc0J5VGFnIiwic3VibWlzc2lvbiIsInZlcmRpY3QiLCJwcm9ibGVtSWQiLCJjb250ZXN0SWQiLCJpbmRleCIsImFkZCIsInRhZ3MiLCJ0YWciLCJzdGF0cyIsIm1heFJhdGluZyIsInJhbmsiLCJzb2x2ZWRDb3VudCIsInNpemUiLCJzdWJtaXNzaW9uQ291bnQiLCJsZW5ndGgiLCJtYXAiLCJjb250ZXN0IiwiY29udGVzdE5hbWUiLCJvbGRSYXRpbmciLCJuZXdSYXRpbmciLCJyYXRpbmdDaGFuZ2UiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./utils/codeforcesApi.js\n");

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

/***/ "?d272":
/*!********************************!*\
  !*** supports-color (ignored) ***!
  \********************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

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

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

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

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/ms","vendor-chunks/semver","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time","vendor-chunks/mime-db","vendor-chunks/axios","vendor-chunks/follow-redirects","vendor-chunks/debug","vendor-chunks/get-intrinsic","vendor-chunks/form-data","vendor-chunks/asynckit","vendor-chunks/combined-stream","vendor-chunks/mime-types","vendor-chunks/proxy-from-env","vendor-chunks/has-symbols","vendor-chunks/delayed-stream","vendor-chunks/function-bind","vendor-chunks/es-set-tostringtag","vendor-chunks/get-proto","vendor-chunks/call-bind-apply-helpers","vendor-chunks/dunder-proto","vendor-chunks/math-intrinsics","vendor-chunks/es-errors","vendor-chunks/gopd","vendor-chunks/es-define-property","vendor-chunks/hasown","vendor-chunks/has-tostringtag","vendor-chunks/es-object-atoms"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fcodeforces%2Fprofile%2Froute&page=%2Fapi%2Fcodeforces%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcodeforces%2Fprofile%2Froute.js&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();