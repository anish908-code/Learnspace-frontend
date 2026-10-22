import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { fetchQuiz, submitQuizAnswers, clearCurrentQuiz, clearQuizError } from "../../features/student/quizSlice";
import { fetchEnrollments } from "../../features/student/enrollmentSlice";
import { Skeleton, SkeletonLine } from "../../components/common/Skeleton";
import { PageHeader, AlertBanner } from "../../components/common";
import Button from "../../components/ui/Button";
import { OptionCard } from "../../components/ui/Field";
import { StatusLabel } from "../../components/ui/Badge";
import { CornerBrackets } from "../../components/ui/Deco";

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
            <div className="mx-auto max-w-3xl">
                <SkeletonLine className="mb-8 h-8 w-64" />
                <SkeletonLine className="mb-2 h-3 w-44" />
                <div className="mt-6 space-y-5">
                    {[1,2,3].map((n) => (
                        <div key={n} className="card p-5 sm:p-6">
                            <SkeletonLine className="h-4 w-3/4" />
                            <div className="mt-4 space-y-2.5">{[1,2,3,4].map((o) => <Skeleton key={o} className="h-12 w-full rounded-2xl" />)}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error && !quiz) return <AlertBanner type="error" message={error} />;
    if (!quiz) return null;

    if (alreadyPassed) {
        return (
            <div className="mx-auto max-w-xl">
                <div className="card p-6 text-center sm:p-8">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 text-teal">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>

                    <h1 className="font-display text-2xl font-bold text-teal">
                        Already Passed
                    </h1>

                    <p className="mt-3 text-sm text-muted">
                        You have already passed this quiz. No need to retake it.
                    </p>

                    <p className="mt-1.5 text-sm text-muted">
                        Score: {Number(enrollment.final_quiz_score || 0).toFixed(1)}%
                    </p>

                    <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                        <Button type="button" onClick={() => navigate("/student/projects")}>
                            Go to Projects
                        </Button>

                        <Button type="button" onClick={() => navigate("/student/courses")} variant="secondary">
                            Back to Courses
                        </Button>
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
            <div className="mx-auto max-w-xl">
                <div className="card relative overflow-hidden p-6 text-center sm:p-8">
                    <CornerBrackets />

                    <div className="relative">
                        <h1 className={`font-display text-2xl font-bold ${result.passed ? "text-accent" : "text-danger"}`}>
                            {result.passed ? "Passed!" : "Not Passed"}
                        </h1>

                        <p className="numeric mt-4 text-2xl font-bold text-fg">
                            Score: {Number(result.score).toFixed(1)}%
                            <span className="ml-1 text-sm font-medium text-muted">
                                (passing: {Number(result.passing_percentage)}%)
                            </span>
                        </p>

                        <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line text-left sm:grid-cols-3">
                            {[
                                { label: "Questions", value: result.total_questions },
                                { label: "Correct", value: result.correct_answers },
                                { label: "Marks", value: `${result.earned_marks}/${result.total_marks}` },
                            ].map((item) => (
                                <div key={item.label} className="bg-surface-2/70 px-4 py-3.5">
                                    <dt className="technical-label">{item.label}</dt>
                                    <dd className="mt-1.5 font-display text-lg font-bold text-fg">
                                        {item.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <p className="mt-6 text-sm text-muted">
                            {result.passed
                                ? "Congratulations! Course completed. Now unlock your project on the Projects page."
                                : "Try again — you can re-attempt this quiz."}
                        </p>

                        <div className="mt-7 flex justify-center">
                            {!result.passed ? (
                                <Button type="button" onClick={() => dispatch(fetchQuiz(quizId))}>
                                    Retake Quiz
                                </Button>
                            ) : (
                                <Button type="button" onClick={() => navigate("/student/projects")}>
                                    Go to Project
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            <PageHeader
                eyebrow="final quiz"
                title={quiz.title}
                subtitle={`Passing percentage: ${Number(quiz.passing_percentage)}%`}
                action={<StatusLabel>{quiz.questions.length} questions</StatusLabel>}
            />

            {error && <AlertBanner type="error" message={error} />}

            <form onSubmit={handleSubmit} className="space-y-5">
                {quiz.questions.map((question, index) => (
                    <div key={question.id} className="card p-5 sm:p-6">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <span className="technical-label">Q{index + 1}</span>
                            <span className="technical-label">
                                {question.marks} mark{question.marks > 1 ? "s" : ""}
                            </span>
                        </div>

                        <h2 className="mt-3 font-display text-base font-semibold leading-snug text-fg">
                            {question.question}
                        </h2>

                        <div className="mt-4 space-y-2.5">
                            {optionLabels.map((option) => (
                                <OptionCard
                                    key={option.key}
                                    name={`question_${question.id}`}
                                    checked={answers[question.id] === option.key.replace("option_", "")}
                                    onChange={() => handleChange(question.id, option.key)}
                                >
                                    <span className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-accent">
                                        {option.label}.
                                    </span>
                                    <span className="ml-2">{question[option.key]}</span>
                                </OptionCard>
                            ))}
                        </div>
                    </div>
                ))}

                <Button
                    type="submit"
                    loading={submitting}
                    loadingText="Submitting..."
                    fullWidth
                    size="lg"
                >
                    Submit Quiz
                </Button>
            </form>
        </div>
    );
};

export default QuizPage;
