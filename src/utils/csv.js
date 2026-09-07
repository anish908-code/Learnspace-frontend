/**
 * Lightweight CSV parser — handles quoted fields, commas inside quotes,
 * and trims whitespace. No external dependencies.
 */

function parseRow(line) {
    const cells = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];

        if (inQuotes) {
            if (ch === '"') {
                if (i + 1 < line.length && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                current += ch;
            }
        } else {
            if (ch === '"') {
                inQuotes = true;
            } else if (ch === ",") {
                cells.push(current.trim());
                current = "";
            } else {
                current += ch;
            }
        }
    }

    cells.push(current.trim());
    return cells;
}

/**
 * Parse CSV text into an array of objects using the header row as keys.
 * Returns { headers: string[], rows: object[] }
 */
export function parseCsv(text) {
    const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

    if (lines.length < 2) {
        return { headers: [], rows: [] };
    }

    const headers = parseRow(lines[0]);
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseRow(lines[i]);
        const obj = {};

        headers.forEach((h, idx) => {
            obj[h.toLowerCase().trim()] = (values[idx] || "").trim();
        });

        rows.push(obj);
    }

    return { headers, rows };
}

/**
 * Map a CSV row (object with flexible header names) to the backend
 * question shape: { question, option_a, option_b, option_c, option_d,
 *                    correct_answer, marks }
 *
 * Accepted header aliases:
 *   question       → Question, question_text, q
 *   option_a       → Option A, a, option1, choice_a
 *   option_b       → Option B, b, option2, choice_b
 *   option_c       → Option C, c, option3, choice_c
 *   option_d       → Option D, d, option4, choice_d
 *   correct_answer → Answer, correct, correct_option, ans
 *   marks          → Marks, points, score, mark
 */
export function mapRowToQuestion(row) {
    const pick = (...keys) => {
        for (const k of keys) {
            if (row[k] !== undefined && row[k] !== "") return row[k];
        }
        return "";
    };

    const answer = pick(
        "correct_answer",
        "answer",
        "correct",
        "correct_option",
        "ans"
    )
        .toLowerCase()
        .trim();

    return {
        question: pick("question", "question_text", "q"),
        option_a: pick("option_a", "option a", "a", "option1", "choice_a"),
        option_b: pick("option_b", "option b", "b", "option2", "choice_b"),
        option_c: pick("option_c", "option c", "c", "option3", "choice_c"),
        option_d: pick("option_d", "option d", "d", "option4", "choice_d"),
        correct_answer: answer || "a",
        marks: Number(pick("marks", "points", "score", "mark")) || 1,
    };
}
