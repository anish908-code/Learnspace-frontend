import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { fetchQuiz, submitQuizAnswers, clearCurrentQuiz, clearQuizError } from "../../features/student/quizSlice";
import { fetchEnrollments } from "../../features/student/enrollmentSlice";
import { Skeleton, SkeletonLine } from "../../components/common/Skeleton";

const optionLabels = [
    { key: "option_a", label: "A" },
    { key: "option_b", label: "B" },
    { key: "option_c", label: "C" },
    { key: "option_d", label: "D" },
];

const QuizPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { quizId } = useParams();
    const { quiz, result, loading, submitting, error } = useSelector((state) => state.studentQuiz);
    const { enrollments } = useSelector((state) => state.studentEnrollments);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        dispatch(fetchQuiz(quizId));
        dispatch(fetchEnrollments());
        return () => { dispatch(clearCurrentQuiz()); dispatch(clearQuizError()); };
    }, [dispatch, quizId]);

    const enrollment = quiz ? enrollments.find((e) => e.course_id === quiz.course_id) : null;
    const alreadyPassed = enrollment?.final_quiz_passed;

    if (loading && !quiz) {
        return (
            <div className="mx-auto max-w-3xl px-4">
                <SkeletonLine className="h-6 w-56" />
                <SkeletonLine className="mt-2 h-3 w-44" />
                <div className="mt-6 space-y-5">
                    {[1,2,3].map((n) => (
                        <div key={n} className="card p-5">
                            <SkeletonLine className="h-4 w-3/4" />
                            <div className="mt-4 space-y-2">{[1,2,3,4].map((o) => <Skeleton key={o} className="h-10 w-full rounded-md" />)}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error && !quiz) return <div className="rounded-md px-4 py-3 text-sm" style={{ background: "var(--error-bg)", color: "var(--error)" }}>{error}</div>;
    if (!quiz) return null;

    if (alreadyPassed) {
        return (
            <div className="mx-auto max-w-xl px-4">
                <div className="card p-6 text-center sm:p-8">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "var(--success-bg)" }}>
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ color: "var(--success)" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: "var(--success)" }}>
                        Already Passed
                    </h1>
                    <p className="mt-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
                        You have already passed this quiz. No need to retake it.
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Score: {Number(enrollment.final_quiz_score || 0).toFixed(1)}%
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        <button type="button" onClick={() => navigate("/student/projects")} className="btn-primary">Go to Projects</button>
                        <button type="button" onClick={() => navigate("/student/courses")} className="btn-secondary">Back to Courses</button>
                    </div>
                </div>
            </div>
        );
    }

    const handleChange = (questionId, optionKey) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionKey.replace("option_", "") }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(submitQuizAnswers({ id: quiz.id, answers }));
    };

    if (result) {
        return (
            <div className="mx-auto max-w-xl px-4">
                <div className="card p-6 text-center sm:p-8">
                    <h1 className="text-2xl" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: result.passed ? "var(--accent)" : "var(--error)" }}>
                        {result.passed ? "Passed!" : "Not Passed"}
                    </h1>
                    <p className="mt-4 text-lg" style={{ color: "var(--foreground)" }}>
                        Score: {Number(result.score).toFixed(1)}%
                        <span className="text-sm" style={{ color: "var(--muted-foreground)" }}> (passing: {Number(result.passing_percentage)}%)</span>
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3 sm:gap-4">
                        {[
                            { label: "Questions", value: result.total_questions },
                            { label: "Correct", value: result.correct_answers },
                            { label: "Marks", value: `${result.earned_marks}/${result.total_marks}` },
                        ].map((item) => (
                            <div key={item.label} className="rounded-md p-3" style={{ background: "var(--muted)" }}>
                                <p style={{ color: "var(--muted-foreground)" }}>{item.label}</p>
                                <p className="mt-1 text-lg font-bold" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>{item.value}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
                        {result.passed ? "Congratulations! Course completed. Now unlock your project on the Projects page." : "Try again — you can re-attempt this quiz."}
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        {!result.passed ? (
                            <button type="button" onClick={() => dispatch(fetchQuiz(quizId))} className="btn-primary">Retake Quiz</button>
                        ) : (
                            <button type="button" onClick={() => navigate("/student/projects")} className="btn-primary">Go to Project</button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-6">
                <h1 className="page-title">{quiz.title}</h1>
                <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>Passing percentage: {Number(quiz.passing_percentage)}%</p>
            </div>

            {error && <div className="mb-5 rounded-md px-4 py-3 text-sm" style={{ background: "var(--error-bg)", color: "var(--error)" }}>{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
                {quiz.questions.map((question, index) => (
                    <div key={question.id} className="card p-5">
                        <h2 className="font-medium" style={{ color: "var(--foreground)" }}>
                            Q{index + 1}. {question.question}
                            <span className="ml-2 text-xs" style={{ color: "var(--muted-foreground)" }}>({question.marks} mark{question.marks > 1 ? "s" : ""})</span>
                        </h2>
                        <div className="mt-3 space-y-2">
                            {optionLabels.map((option) => (
                                <label key={option.key} className="flex cursor-pointer items-center gap-3 rounded-md border px-4 py-2.5 text-sm transition hover:bg-muted" style={{ borderColor: "var(--border)" }}>
                                    <input type="radio" name={`question_${question.id}`} checked={answers[question.id] === option.key.replace("option_", "")} onChange={() => handleChange(question.id, option.key)} />
                                    <span className="font-medium" style={{ color: "var(--muted-foreground)" }}>{option.label}.</span>
                                    <span style={{ color: "var(--foreground)" }}>{question[option.key]}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                    {submitting ? "Submitting..." : "Submit Quiz"}
                </button>
            </form>
        </div>
    );
};

export default QuizPage;
