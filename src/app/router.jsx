import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import StudentLayout from "../layouts/StudentLayout";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";

import ProtectedRoute from "../routes/ProtectedRoute";
import StudentRoute from "../routes/StudentRoute";
import AdminRoute from "../routes/AdminRoute";
import AuthGate from "../routes/AuthGate";

import Landing from "../pages/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import StudentDashboard from "../pages/student/StudentDashboard";
import Courses from "../pages/student/Courses";
import CourseDetail from "../pages/student/CourseDetail";
import LessonView from "../pages/student/LessonView";
import QuizPage from "../pages/student/QuizPage";
import Projects from "../pages/student/Projects";
import ProjectDetail from "../pages/student/ProjectDetail";
import Submissions from "../pages/student/Submissions";
import Notifications from "../pages/student/Notifications";
import Profile from "../pages/student/Profile";
import StudentCertificates from "../pages/student/Certificates";
import StudentCertificateView from "../pages/student/CertificateView";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminStudents from "../pages/admin/Students";
import AdminCourses from "../pages/admin/Courses";
import AdminCourseLessons from "../pages/admin/CourseLessons";
import AdminQuizzes from "../pages/admin/Quizzes";
import AdminQuizQuestions from "../pages/admin/QuizQuestions";
import AdminProjects from "../pages/admin/Projects";
import AdminSubmissions from "../pages/admin/Submissions";
import AdminCertificates from "../pages/admin/Certificates";

import VerifyCertificate from "../pages/public/VerifyCertificate";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
    // Public routes
    {
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: (
                    <AuthGate>
                        <Landing />
                    </AuthGate>
                ),
            },
        ],
    },

    {
        path: "/certificates/verify/:certificateCode",
        element: <VerifyCertificate />,
    },

    {
        path: "/login",
        element: (
            <AuthGate>
                <AuthLayout image="login">
                    <Login />
                </AuthLayout>
            </AuthGate>
        ),
    },
    {
        path: "/register",
        element: (
            <AuthGate>
                <AuthLayout image="register">
                    <Register />
                </AuthLayout>
            </AuthGate>
        ),
    },
    {
        path: "/forgot-password",
        element: (
            <AuthGate>
                <AuthLayout image="forgot">
                    <ForgotPassword />
                </AuthLayout>
            </AuthGate>
        ),
    },
    {
        path: "/reset-password",
        element: (
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
                                element: <StudentDashboard />,
                            },
                            {
                                path: "/student/courses",
                                element: <Courses />,
                            },
                            {
                                path: "/student/courses/:courseId",
                                element: <CourseDetail />,
                            },
                            {
                                path: "/student/courses/:courseId/lessons/:lessonId",
                                element: <LessonView />,
                            },
                            {
                                path: "/student/quizzes/:quizId",
                                element: <QuizPage />,
                            },
                            {
                                path: "/student/projects",
                                element: <Projects />,
                            },
                            {
                                path: "/student/projects/:projectId",
                                element: <ProjectDetail />,
                            },
                            {
                                path: "/student/submissions",
                                element: <Submissions />,
                            },
                            {
                                path: "/student/certificates",
                                element: <StudentCertificates />,
                            },
                            {
                                path: "/student/certificates/:certificateId",
                                element: <StudentCertificateView />,
                            },
                            {
                                path: "/student/notifications",
                                element: <Notifications />,
                            },
                            {
                                path: "/student/profile",
                                element: <Profile />,
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
                                element: <AdminDashboard />,
                            },
                            {
                                path: "/admin/students",
                                element: <AdminStudents />,
                            },
                            {
                                path: "/admin/courses",
                                element: <AdminCourses />,
                            },
                            {
                                path: "/admin/courses/:courseId",
                                element: <AdminCourseLessons />,
                            },
                            {
                                path: "/admin/quizzes",
                                element: <AdminQuizzes />,
                            },
                            {
                                path: "/admin/quizzes/:quizId",
                                element: <AdminQuizQuestions />,
                            },
                            {
                                path: "/admin/projects",
                                element: <AdminProjects />,
                            },
                            {
                                path: "/admin/submissions",
                                element: <AdminSubmissions />,
                            },
                            {
                                path: "/admin/certificates",
                                element: <AdminCertificates />,
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
        element: <NotFound />,
    },
]);

export default router;
