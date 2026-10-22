import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import StudentLayout from "../layouts/StudentLayout";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";

import ProtectedRoute from "../routes/ProtectedRoute";
import StudentRoute from "../routes/StudentRoute";
import AdminRoute from "../routes/AdminRoute";
import AuthGate from "../routes/AuthGate";

/*
|--------------------------------------------------------------------------
| Code splitting
|--------------------------------------------------------------------------
| Pehle saare 25 pages ek hi chunk me the — initial bundle 2.2 MB tha.
| Ab har page apne chunk me lazy load hota hai, sirf jo route pe visit
| hoga wahi download hoga. Landing + auth pages pehle load hote hain,
| baaki on-demand.
*/

const Landing = lazy(() => import("../pages/Landing"));
const NotFound = lazy(() => import("../pages/NotFound"));

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

const StudentDashboard = lazy(() => import("../pages/student/StudentDashboard"));
const StudentCourses = lazy(() => import("../pages/student/Courses"));
const StudentCourseDetail = lazy(() => import("../pages/student/CourseDetail"));
const LessonView = lazy(() => import("../pages/student/LessonView"));
const QuizPage = lazy(() => import("../pages/student/QuizPage"));
const StudentProjects = lazy(() => import("../pages/student/Projects"));
const ProjectDetail = lazy(() => import("../pages/student/ProjectDetail"));
const StudentSubmissions = lazy(() => import("../pages/student/Submissions"));
const StudentNotifications = lazy(() => import("../pages/student/Notifications"));
const StudentProfile = lazy(() => import("../pages/student/Profile"));
const StudentCertificates = lazy(() => import("../pages/student/Certificates"));
const StudentCertificateView = lazy(() => import("../pages/student/CertificateView"));

const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminStudents = lazy(() => import("../pages/admin/Students"));
const AdminCourses = lazy(() => import("../pages/admin/Courses"));
const AdminCourseLessons = lazy(() => import("../pages/admin/CourseLessons"));
const AdminQuizzes = lazy(() => import("../pages/admin/Quizzes"));
const AdminQuizQuestions = lazy(() => import("../pages/admin/QuizQuestions"));
const AdminProjects = lazy(() => import("../pages/admin/Projects"));
const AdminSubmissions = lazy(() => import("../pages/admin/Submissions"));
const AdminCertificates = lazy(() => import("../pages/admin/Certificates"));


// Route switch hone pe dikhta hai — page content ki jagah
const RouteFallback = () => (
    <div
        className="flex min-h-[60vh] items-center justify-center"
        role="status"
        aria-live="polite"
        aria-busy="true"
    >
        <div className="flex flex-col items-center gap-3">
            <span
                aria-hidden="true"
                className="h-9 w-9 animate-spin rounded-full border-2 border-transparent border-t-accent border-r-accent"
            />
            <p className="technical-label">Loading view</p>
        </div>
    </div>
);

const withSuspense = (element) => (
    <Suspense fallback={<RouteFallback />}>{element}</Suspense>
);

const router = createBrowserRouter([
    // Public routes
    {
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: withSuspense(
                    <AuthGate>
                        <Landing />
                    </AuthGate>
                ),
            },
        ],
    },

    {
        path: "/login",
        element: withSuspense(
            <AuthGate>
                <AuthLayout image="login">
                    <Login />
                </AuthLayout>
            </AuthGate>
        ),
    },
    {
        path: "/register",
        element: withSuspense(
            <AuthGate>
                <AuthLayout image="register">
                    <Register />
                </AuthLayout>
            </AuthGate>
        ),
    },
    {
        path: "/forgot-password",
        element: withSuspense(
            <AuthGate>
                <AuthLayout image="forgot">
                    <ForgotPassword />
                </AuthLayout>
            </AuthGate>
        ),
    },
    {
        path: "/reset-password",
        element: withSuspense(
            <AuthGate>
                <AuthLayout image="reset">
                    <ResetPassword />
                </AuthLayout>
            </AuthGate>
        ),
    },

    // All authenticated routes
    {
        element: <ProtectedRoute />,
        children: [
            // Student routes
            {
                element: <StudentRoute />,
                children: [
                    {
                        element: <StudentLayout />,
                        children: [
                            {
                                path: "/student",
                                element: withSuspense(<StudentDashboard />),
                            },
                            {
                                path: "/student/courses",
                                element: withSuspense(<StudentCourses />),
                            },
                            {
                                path: "/student/courses/:courseId",
                                element: withSuspense(<StudentCourseDetail />),
                            },
                            {
                                path: "/student/courses/:courseId/lessons/:lessonId",
                                element: withSuspense(<LessonView />),
                            },
                            {
                                path: "/student/quizzes/:quizId",
                                element: withSuspense(<QuizPage />),
                            },
                            {
                                path: "/student/projects",
                                element: withSuspense(<StudentProjects />),
                            },
                            {
                                path: "/student/projects/:projectId",
                                element: withSuspense(<ProjectDetail />),
                            },
                            {
                                path: "/student/submissions",
                                element: withSuspense(<StudentSubmissions />),
                            },
                            {
                                path: "/student/certificates",
                                element: withSuspense(<StudentCertificates />),
                            },
                            {
                                path: "/student/certificates/:certificateId",
                                element: withSuspense(<StudentCertificateView />),
                            },
                            {
                                path: "/student/notifications",
                                element: withSuspense(<StudentNotifications />),
                            },
                            {
                                path: "/student/profile",
                                element: withSuspense(<StudentProfile />),
                            },
                        ],
                    },
                ],
            },

            // Admin routes
            {
                element: <AdminRoute />,
                children: [
                    {
                        element: <AdminLayout />,
                        children: [
                            {
                                path: "/admin",
                                element: withSuspense(<AdminDashboard />),
                            },
                            {
                                path: "/admin/students",
                                element: withSuspense(<AdminStudents />),
                            },
                            {
                                path: "/admin/courses",
                                element: withSuspense(<AdminCourses />),
                            },
                            {
                                path: "/admin/courses/:courseId",
                                element: withSuspense(<AdminCourseLessons />),
                            },
                            {
                                path: "/admin/quizzes",
                                element: withSuspense(<AdminQuizzes />),
                            },
                            {
                                path: "/admin/quizzes/:quizId",
                                element: withSuspense(<AdminQuizQuestions />),
                            },
                            {
                                path: "/admin/projects",
                                element: withSuspense(<AdminProjects />),
                            },
                            {
                                path: "/admin/submissions",
                                element: withSuspense(<AdminSubmissions />),
                            },
                            {
                                path: "/admin/certificates",
                                element: withSuspense(<AdminCertificates />),
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // Catch-all — 404 page
    {
        path: "*",
        element: withSuspense(<NotFound />),
    },
]);

export default router;
