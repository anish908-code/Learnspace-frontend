import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    ArrowLeft,
    Trash2,
    Upload,
    FileSpreadsheet,
    ListChecks,
} from "lucide-react";

import {
    fetchAdminQuestions,
    bulkAddQuestions,
    removeQuestion,
    clearAdminQuestionFeedback,
} from "../../features/admin/adminQuestionSlice";
import { SkeletonList } from "../../components/common/Skeleton";
import { parseCsv, mapRowToQuestion } from "../../utils/csv";
import { PageHeader, EmptyState } from "../../components/common";
import Button, { ButtonLink } from "../../components/ui/Button";
import { SectionMarker } from "../../components/ui/Deco";

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
            <ButtonLink
                to="/admin/quizzes"
                variant="ghost"
                size="sm"
                className="-ml-3 mb-4"
            >
                <ArrowLeft size={16} />
                Back to quizzes
            </ButtonLink>

            <PageHeader
                eyebrow="assessment bank"
                title={`Questions — ${quiz?.title || "..."}`}
                subtitle={`Total questions: ${questions.length} · Pass ${quiz?.passing_percentage ?? "-"}%`}
            />

            <div className="space-y-4">
                <details className="surface-technical rounded-2xl p-5 sm:p-6">
                    <summary className="flex cursor-pointer select-none list-none items-center gap-2.5 font-display text-sm font-bold text-fg [&::-webkit-details-marker]:hidden">
                        <span className="icon-well h-8 w-8 text-accent">
                            <Upload size={15} />
                        </span>
                        Bulk Import (JSON)
                    </summary>

                    <p className="mt-4 text-xs leading-relaxed text-muted">
                        Paste an array of questions in this format:{" "}
                        <code className="numeric rounded-md border border-line bg-surface-2 px-1.5 py-0.5 text-[0.6875rem] text-fg">
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

                    <Button
                        type="button"
                        onClick={handleBulkImport}
                        disabled={saving || !bulkText.trim()}
                        loading={saving}
                        loadingText="Importing…"
                        className="mt-3"
                    >
                        Import Questions
                    </Button>
                </details>

                <details className="surface-technical rounded-2xl p-5 sm:p-6">
                    <summary className="flex cursor-pointer select-none list-none items-center gap-2.5 font-display text-sm font-bold text-fg [&::-webkit-details-marker]:hidden">
                        <span className="icon-well h-8 w-8 text-accent">
                            <FileSpreadsheet size={15} />
                        </span>
                        Import from CSV / Excel
                    </summary>

                    <p className="mt-4 text-xs leading-relaxed text-muted">
                        Upload a <strong className="font-semibold text-fg">.csv</strong>{" "}
                        file exported from Excel / Google Sheets. Headers
                        should be:
                    </p>

                    <code className="numeric mt-2 block overflow-x-auto whitespace-nowrap rounded-lg border border-line bg-surface px-3 py-2 text-[0.6875rem] text-fg">
                        question, option_a, option_b, option_c, option_d, correct_answer, marks
                    </code>

                    <label
                        htmlFor="csv-upload"
                        className="mt-5 flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong bg-surface/40 px-6 py-9 text-center transition-colors duration-200 hover:border-accent/60 hover:bg-accent/5"
                    >
                        <span className="icon-well icon-well-round h-12 w-12 text-accent">
                            <FileSpreadsheet size={22} strokeWidth={1.9} />
                        </span>

                        <div>
                            <p className="text-sm font-semibold text-fg">
                                {csvFileName || "Click to choose a CSV file"}
                            </p>
                            <p className="mt-1 text-xs text-muted">
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
                        <div className="surface-a mt-5 rounded-2xl p-4 sm:p-5">
                            <p className="text-sm font-semibold text-fg">
                                Preview — {csvPreview.length} question(s) found in{" "}
                                <span className="numeric">{csvFileName}</span>
                            </p>

                            <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
                                {csvPreview.map((q, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-xl border border-line bg-surface px-3 py-2.5 text-xs"
                                    >
                                        <p className="font-semibold text-fg">
                                            {idx + 1}. {q.question}
                                        </p>
                                        <p className="mt-1 text-muted">
                                            A. {q.option_a} · B. {q.option_b} · C.{" "}
                                            {q.option_c} · D. {q.option_d}
                                        </p>
                                        <p className="numeric mt-0.5 text-teal">
                                            Answer: {q.correct_answer.toUpperCase()} · Marks:{" "}
                                            {q.marks}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <Button
                                    type="button"
                                    onClick={handleCsvConfirm}
                                    disabled={saving}
                                    loading={saving}
                                    loadingText="Importing…"
                                >
                                    {`Confirm Import (${csvPreview.length} questions)`}
                                </Button>

                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={() => {
                                        setCsvPreview(null);
                                        setCsvFileName("");
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </details>
            </div>

            <div className="mb-5 mt-8">
                <SectionMarker index={1}>Question bank</SectionMarker>
            </div>

            {loading && questions.length === 0 ? (
                <SkeletonList count={3} />
            ) : questions.length === 0 ? (
                <EmptyState
                    icon={ListChecks}
                    title="This quiz has no questions yet."
                />
            ) : (
                <div className="stagger space-y-3">
                    {questions.map((question, index) => (
                        <div
                            key={question.id}
                            className="data-row flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:gap-4"
                        >
                            <span className="icon-well numeric h-9 w-9 shrink-0 text-sm font-bold text-accent">
                                {index + 1}
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-fg">
                                    {question.question}
                                </p>

                                <div className="mt-2.5 grid gap-1.5 text-sm sm:grid-cols-2">
                                    {["a", "b", "c", "d"].map((key) => (
                                        <p
                                            key={key}
                                            className={
                                                question.correct_answer === key
                                                    ? "font-semibold text-teal"
                                                    : "text-muted"
                                            }
                                        >
                                            {key.toUpperCase()}. {question[`option_${key}`]}
                                            {question.correct_answer === key && " ✓"}
                                        </p>
                                    ))}
                                </div>

                                <p className="numeric mt-2.5 text-[0.6875rem] text-subtle">
                                    Marks: {question.marks}
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <Button
                                    variant="destructive"
                                    size="icon-sm"
                                    type="button"
                                    onClick={() => handleDelete(question)}
                                    title="Delete"
                                    aria-label="Delete"
                                >
                                    <Trash2 size={17} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizQuestions;
