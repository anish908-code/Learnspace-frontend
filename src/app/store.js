import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import studentReducer from "../features/student/studentSlice";
import courseReducer from "../features/student/courseSlice";
import enrollmentReducer from "../features/student/enrollmentSlice";
import lessonReducer from "../features/student/lessonSlice";
import quizReducer from "../features/student/quizSlice";
import projectReducer from "../features/student/projectSlice";
import submissionReducer from "../features/student/submissionSlice";
import certificateReducer from "../features/student/certificateSlice";
import notificationReducer from "../features/student/notificationSlice";
import profileReducer from "../features/student/profileSlice";

import adminOverviewReducer from "../features/admin/adminOverviewSlice";
import adminStudentReducer from "../features/admin/adminStudentSlice";
import adminCourseReducer from "../features/admin/adminCourseSlice";
import adminLessonReducer from "../features/admin/adminLessonSlice";
import adminQuizReducer from "../features/admin/adminQuizSlice";
import adminQuestionReducer from "../features/admin/adminQuestionSlice";
import adminProjectReducer from "../features/admin/adminProjectSlice";
import adminSubmissionReducer from "../features/admin/adminSubmissionSlice";
import adminCertificateReducer from "../features/admin/adminCertificateSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,

    student: studentReducer,
    studentCourses: courseReducer,
    studentEnrollments: enrollmentReducer,
    studentLessons: lessonReducer,
    studentQuiz: quizReducer,
    studentProjects: projectReducer,
    studentSubmissions: submissionReducer,
    studentCertificates: certificateReducer,
    studentNotifications: notificationReducer,
    studentProfile: profileReducer,

    adminOverview: adminOverviewReducer,
    adminStudents: adminStudentReducer,
    adminCourses: adminCourseReducer,
    adminLessons: adminLessonReducer,
    adminQuizzes: adminQuizReducer,
    adminQuestions: adminQuestionReducer,
    adminProjects: adminProjectReducer,
    adminSubmissions: adminSubmissionReducer,
    adminCertificates: adminCertificateReducer,
  },
});
