import api from "./axios";

/*
|--------------------------------------------------------------------------
| PROFILE
|--------------------------------------------------------------------------
*/

export const getStudentProfile = () => {
    return api.get("/student/profile");
};

export const updateStudentProfile = (data) => {
    return api.put("/student/profile", data);
};

/*
|--------------------------------------------------------------------------
| COURSES
|--------------------------------------------------------------------------
*/

export const getCourses = () => {
    return api.get("/student/courses");
};

export const getCourseDetail = (id) => {
    return api.get(`/student/courses/${id}`);
};

/*
|--------------------------------------------------------------------------
| ENROLLMENTS
|--------------------------------------------------------------------------
*/

export const getEnrollments = () => {
    return api.get("/student/enrollments");
};

export const enrollInCourse = (courseId) => {
    return api.post("/student/enrollments", { course_id: courseId });
};

export const syncEnrollmentProgress = (id) => {
    return api.patch(`/student/enrollments/${id}`);
};

/*
|--------------------------------------------------------------------------
| LESSONS
|--------------------------------------------------------------------------
*/

export const getCourseLessons = (courseId) => {
    return api.get(`/student/courses/${courseId}/lessons`);
};

export const getLesson = (id) => {
    return api.get(`/student/lessons/${id}`);
};

export const markLessonComplete = (id) => {
    return api.post(`/student/lessons/${id}/complete`);
};

/*
|--------------------------------------------------------------------------
| QUIZZES
|--------------------------------------------------------------------------
*/

export const getQuiz = (id) => {
    return api.get(`/student/quizzes/${id}`);
};

export const submitQuiz = (id, answers) => {
    return api.post(`/student/quizzes/${id}/submit`, { answers });
};

/*
|--------------------------------------------------------------------------
| PROJECTS
|--------------------------------------------------------------------------
*/

export const getProjects = () => {
    return api.get("/student/projects");
};

export const getProjectDetail = (id) => {
    return api.get(`/student/projects/${id}`);
};

/*
|--------------------------------------------------------------------------
| SUBMISSIONS
|--------------------------------------------------------------------------
*/

export const getSubmissions = () => {
    return api.get("/student/submissions");
};

export const createSubmission = (data) => {
    return api.post("/student/submissions", data);
};

export const getSubmissionDetail = (id) => {
    return api.get(`/student/submissions/${id}`);
};

/*
|--------------------------------------------------------------------------
| CERTIFICATES
|--------------------------------------------------------------------------
*/

export const getCertificates = () => {
    return api.get("/student/certificates");
};

export const getCertificateDetail = (id) => {
    return api.get(`/student/certificates/${id}`);
};

/*
|--------------------------------------------------------------------------
| NOTIFICATIONS
|--------------------------------------------------------------------------
*/

export const getNotifications = () => {
    return api.get("/student/notifications");
};

export const markNotificationAsRead = (id) => {
    return api.patch(`/student/notifications/${id}/read`);
};

export const clearNotifications = () => {
    return api.delete("/student/notifications");
};
