import api from "./axios";

const toFormData = (data) => {
    if (data instanceof FormData) return data;

    const hasFile = Object.values(data).some((v) => v instanceof File);
    if (!hasFile) return data;

    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
            fd.append(key, value);
        }
    });
    return fd;
};

/*
|--------------------------------------------------------------------------
| STUDENTS
|--------------------------------------------------------------------------
*/

export const getStudents = () => {
    return api.get("/admin/students");
};

export const getStudentDetail = (id) => {
    return api.get(`/admin/students/${id}`);
};

/*
|--------------------------------------------------------------------------
| COURSES
|--------------------------------------------------------------------------
*/

export const getCourses = () => {
    return api.get("/admin/courses");
};

export const getCourseDetail = (id) => {
    return api.get(`/admin/courses/${id}`);
};

export const createCourse = (data) => {
    return api.post("/admin/courses", data);
};

export const updateCourse = (id, data) => {
    return api.put(`/admin/courses/${id}`, data);
};

export const deleteCourse = (id) => {
    return api.delete(`/admin/courses/${id}`);
};

/*
|--------------------------------------------------------------------------
| LESSONS
|--------------------------------------------------------------------------
*/

export const getCourseLessons = (courseId) => {
    return api.get(`/admin/courses/${courseId}/lessons`);
};

export const createLesson = (data) => {
    return api.post("/admin/lessons", toFormData(data));
};

export const updateLesson = (id, data) => {
    return api.put(`/admin/lessons/${id}`, toFormData(data));
};

export const deleteLesson = (id) => {
    return api.delete(`/admin/lessons/${id}`);
};

/*
|--------------------------------------------------------------------------
| QUIZZES + QUESTIONS
|--------------------------------------------------------------------------
*/

export const getQuizzes = () => {
    return api.get("/admin/quizzes");
};

export const getQuizDetail = (id) => {
    return api.get(`/admin/quizzes/${id}`);
};

export const createQuiz = (data) => {
    return api.post("/admin/quizzes", data);
};

export const updateQuiz = (id, data) => {
    return api.put(`/admin/quizzes/${id}`, data);
};

export const deleteQuiz = (id) => {
    return api.delete(`/admin/quizzes/${id}`);
};

export const getQuizQuestions = (quizId) => {
    return api.get(`/admin/quizzes/${quizId}/questions`);
};

export const createQuestion = (quizId, data) => {
    return api.post(`/admin/quizzes/${quizId}/questions`, data);
};

export const bulkCreateQuestions = (quizId, questions) => {
    return api.post(`/admin/quizzes/${quizId}/questions/bulk`, { questions });
};

export const updateQuestion = (quizId, id, data) => {
    return api.put(`/admin/quizzes/${quizId}/questions/${id}`, data);
};

export const deleteQuestion = (quizId, id) => {
    return api.delete(`/admin/quizzes/${quizId}/questions/${id}`);
};

/*
|--------------------------------------------------------------------------
| PROJECTS
|--------------------------------------------------------------------------
*/

export const getProjects = () => {
    return api.get("/admin/projects");
};

export const createProject = (data) => {
    return api.post("/admin/projects", data);
};

export const updateProject = (id, data) => {
    return api.put(`/admin/projects/${id}`, data);
};

export const deleteProject = (id) => {
    return api.delete(`/admin/projects/${id}`);
};

/*
|--------------------------------------------------------------------------
| SUBMISSIONS
|--------------------------------------------------------------------------
*/

export const getSubmissions = () => {
    return api.get("/admin/submissions");
};

export const reviewSubmission = (id, data) => {
    return api.patch(`/admin/submissions/${id}`, data);
};

/*
|--------------------------------------------------------------------------
| CERTIFICATES
|--------------------------------------------------------------------------
*/

export const getCertificates = () => {
    return api.get("/admin/certificates");
};

export const generateCertificate = (data) => {
    return api.post("/admin/certificates", data);
};

export const getCertificateDetail = (id) => {
    return api.get(`/admin/certificates/${id}`);
};

export const deleteCertificate = (id) => {
    return api.delete(`/admin/certificates/${id}`);
};

/*
|--------------------------------------------------------------------------
| PROFILE
|--------------------------------------------------------------------------
*/

export const updateAdminProfile = (data) => {
    return api.put("/admin/profile", data);
};
