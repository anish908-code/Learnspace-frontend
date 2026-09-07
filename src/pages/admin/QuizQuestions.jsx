import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { ArrowLeft, Trash2, Upload, FileSpreadsheet } from "lucide-react";

import {
    fetchAdminQuestions,
    bulkAddQuestions,
    removeQuestion,
    clearAdminQuestionFeedback,
} from "../../features/admin/adminQuestionSlice";
import { SkeletonList } from "../../components/common/Skeleton";
import { parseCsv, mapRowToQuestion } from "../../utils/csv";

const QuizQuestions = () => {
    const dispatch = useDispatch();
    const { quizId } = useParams();

    const {
        quiz,
        questions,
        loading,
        saving,
    } = useSelector((state) => state.adminQuestions);

    const [bulkText, setBulkText] = useState("");
    const [csvFileName, setCsvFileName] = useState("");
    const [csvPreview, setCsvPreview] = useState(null);

    useEffect(() => {
        dispatch(fetchAdminQuestions(quizId));
    }, [dispatch, quizId]);

    useEffect(() => {
        return () => {
            dispatch(clearAdminQuestionFeedback());
        };
    }, [dispatch]);

    const handleDelete = (question) => {
        if (!window.confirm("Delete this question?")) {
            return;
        }

        dispatch(removeQuestion({ quizId, id: question.id }));
    };

    const handleBulkImport = () => {
        try {
            const parsed = JSON.parse(bulkText);

            if (!Array.isArray(parsed) || parsed.length === 0) {
                toast.error("The JSON must be a non-empty array.");
                return;
            }

            dispatch(bulkAddQuestions({ quizId, questions: parsed }));
        } catch {
            toast.error("Invalid JSON format — please check and paste again.");
        }
    };

    const handleCsvFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCsvFileName(file.name);

        const reader = new FileReader();

        reader.onload = (event) => {
            const text = event.target.result;
            const { rows } = parseCsv(text);

            if (rows.length === 0) {
                toast.error("CSV is empty or has no valid rows.");
                setCsvPreview(null);
                return;
            }

            const parsedQuestions = rows.map(mapRowToQuestion);

            const missing = parsedQuestions.filter(
                (q) => !q.question || !q.option_a || !q.option_b || !q.option_c || !q.option_d
            );

            if (missing.length > 0) {
                toast.error(
                    `${missing.length} row(s) are missing required fields (question, option_a-d). Please check your CSV headers and data.`
                );
                setCsvPreview(null);
                return;
            }

            setCsvPreview(parsedQuestions);
        };

        reader.readAsText(file);
        e.target.value = "";
    };

    const handleCsvConfirm = () => {
        if (!csvPreview) return;

        dispatch(bulkAddQuestions({ quizId, questions: csvPreview })).then(
            (result) => {
                if (result.meta.requestStatus === "fulfilled") {
                    setCsvPreview(null);
                    setCsvFileName("");
                }
            }
        );
    };

    return (
        <div>
            <Link
                to="/admin/quizzes"
                className="mb-4 inline-flex items-center gap-1.5 btn-ghost text-sm font-medium"
            >
                <ArrowLeft size={16} />
                Back to quizzes
            </Link>

            <h1 className="page-title">Questions — {quiz?.title || "..."}</h1>

            <p className="-mt-1 mb-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
                Total questions: {questions.length} · Pass{" "}
                {quiz?.passing_percentage ?? "-"}%
            </p>

            <details className="card mb-6 p-5">
                <summary className="cursor-pointer select-none text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    <span className="inline-flex items-center gap-2">
                        <Upload size={15} />
                        Bulk Import (JSON)
                    </span>
                </summary>

                <p className="mt-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    Paste an array of questions in this format:{" "}
                    <code className="rounded bg-muted px-1 py-0.5">
                        {"[{ question, option_a, option_b, option_c, option_d, correct_answer: 'a'|'b'|'c'|'d', marks }]" }
                    </code>
                </p>

                <textarea
                    rows={6}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    className="input-field mt-3 font-mono text-xs"
                    placeholder='[{"question":"2+2?","option_a":"3","option_b":"4","option_c":"5","option_d":"6","correct_answer":"b"}]'
                />

                <button
                    type="button"
                    onClick={handleBulkImport}
                    disabled={saving || !bulkText.trim()}
                    className="btn-primary mt-3 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving ? "Importing..." : "Import Questions"}
                </button>
            </details>

            <details className="card mb-6 p-5">
                <summary className="cursor-pointer select-none text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    <span className="inline-flex items-center gap-2">
                        <FileSpreadsheet size={15} />
                        Import from CSV / Excel
                    </span>
                </summary>

                <p className="mt-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    Upload a <strong>.csv</strong> file exported from Excel / Google
                    Sheets. Headers should be:
                </p>

                <code className="mt-1 block overflow-x-auto whitespace-nowrap rounded bg-muted px-2 py-1 text-[11px]" style={{ color: "var(--foreground)" }}>
                    question, option_a, option_b, option_c, option_d, correct_answer, marks
                </code>

                <label
                    htmlFor="csv-upload"
                    className="mt-4 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-warm-border bg-muted/50 px-6 py-8 transition hover:border-accent hover:bg-accent-muted/30"
                >
                    <FileSpreadsheet size={28} style={{ color: "var(--muted-foreground)" }} />

                    <div className="text-center">
                        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                            {csvFileName || "Click to choose a CSV file"}
                        </p>
                        <p className="mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                            .csv files only
                        </p>
                    </div>

                    <input
                        id="csv-upload"
                        type="file"
                        accept=".csv,text/csv"
                        onChange={handleCsvFile}
                        className="hidden"
                    />
                </label>

                {csvPreview && (
                    <div className="mt-4 rounded-xl border border-warm-border bg-muted p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                                Preview — {csvPreview.length} question(s) found in{" "}
                                <span style={{ color: "var(--foreground)" }}>{csvFileName}</span>
                            </p>
                        </div>

                        <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
                            {csvPreview.map((q, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-lg border border-warm-border bg-white px-3 py-2 text-xs"
                                >
                                    <p className="font-medium" style={{ color: "var(--foreground)" }}>
                                        {idx + 1}. {q.question}
                                    </p>
                                    <p className="mt-1" style={{ color: "var(--muted-foreground)" }}>
                                        A. {q.option_a} · B. {q.option_b} · C.{" "}
                                        {q.option_c} · D. {q.option_d}
                                    </p>
                                    <p className="text-emerald-600">
                                        Answer: {q.correct_answer.toUpperCase()} · Marks:{" "}
                                        {q.marks}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={handleCsvConfirm}
                                disabled={saving}
                                className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving
                                    ? "Importing..."
                                    : `Confirm Import (${csvPreview.length} questions)`}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setCsvPreview(null);
                                    setCsvFileName("");
                                }}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </details>

            {loading && questions.length === 0 ? (
                <SkeletonList count={3} />
            ) : questions.length === 0 ? (
                <div className="card px-6 py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                    This quiz has no questions yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {questions.map((question, index) => (
                        <div key={question.id} className="card p-5">
                            <div className="flex items-start gap-4">
                                <span
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-sm font-bold"
                                    style={{ color: "var(--accent)" }}
                                >
                                    {index + 1}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="font-medium" style={{ color: "var(--foreground)" }}>
                                        {question.question}
                                    </p>

                                    <div className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                                        {["a", "b", "c", "d"].map((key) => (
                                            <p
                                                key={key}
                                                className={
                                                    question.correct_answer === key
                                                        ? "font-semibold text-emerald-700"
                                                        : ""
                                                }
                                                style={question.correct_answer !== key ? { color: "var(--muted-foreground)" } : undefined}
                                            >
                                                {key.toUpperCase()}. {question[`option_${key}`]}
                                                {question.correct_answer === key && " ✓"}
                                            </p>
                                        ))}
                                    </div>

                                    <p className="mt-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
                                        Marks: {question.marks}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(question)}
                                        title="Delete"
                                        className="rounded-lg p-2.5 transition hover:bg-red-50 hover:text-red-600"
                                        style={{ color: "var(--muted-foreground)" }}
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizQuestions;
