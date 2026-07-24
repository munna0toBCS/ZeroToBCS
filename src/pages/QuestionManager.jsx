import { useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabaseClient";
import QuestionForm from "../components/admin/QuestionForm";

const PAGE_SIZE = 100;

export default function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadQuestions = async () => {
    setLoading(true);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabase
      .from("questions")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) alert(error.message);
    else {
      setQuestions(data || []);
      setTotalCount(count || 0);
    }

    setLoading(false);
  };

  const deleteQuestion = async (id) => {
    const ok = confirm("Are you sure you want to delete this question?");
    if (!ok) return;

    const { error } = await supabase
  .from("questions")
  .delete()
  .eq("id", id)
  .select();

    if (error) {
      alert(error.message);
      return;
    }

    alert("Question deleted successfully.");
    loadQuestions();
  };
const updateQuestion = async () => {
  if (!editingQuestion) return;

  const { error } = await supabase
    .from("questions")
    .update(editingQuestion)
    .eq("id", editingQuestion.id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Question updated successfully.");
  setEditingQuestion(null);
  loadQuestions();
};
  useEffect(() => {
    loadQuestions();
  }, [page]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const text = `${q.question || ""} ${q.subject || ""} ${q.topic || ""} ${q.exam || ""}`;
      return text.toLowerCase().includes(search.toLowerCase());
    });
  }, [questions, search]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto" }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: "15px" }}>
          <div>
            <h1>Question Manager</h1>
            <p style={{ opacity: 0.7 }}>Manage ZeroToBCS question bank.</p>
          </div>

          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close Form" : "Add Question"}
          </button>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search question, subject, topic, exam..."
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "25px",
            borderRadius: "10px",
          }}
        />

        <p style={{ marginTop: "8px", opacity: 0.6, fontSize: "13px" }}>
          Search only matches questions on the current page — switch pages to search elsewhere.
        </p>

        <hr style={{ margin: "20px 0" }} />

  {(showForm || editingQuestion) && (
  <QuestionForm
    initialData={editingQuestion}
    onCancel={() => {
      setEditingQuestion(null);
      setShowForm(false);
    }}
    onSuccess={() => {
      setEditingQuestion(null);
      setShowForm(false);
      loadQuestions();
    }}
  />
)}

        {loading ? (
          <h3>Loading...</h3>
        ) : (
          <>
            <h3>
              Showing {filteredQuestions.length} of {questions.length} on this page
              &nbsp;•&nbsp; {totalCount} total in database
            </h3>

            <div style={{ overflowX: "auto", marginTop: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Question</th>
                    <th>Subject</th>
                    <th>Topic</th>
                    <th>Difficulty</th>
                    <th>Source</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredQuestions.map((q) => (
                    <tr key={q.id}>
                      <td>{q.id?.slice(0, 8)}</td>
                      <td>{q.question || q.question_text || "-"}</td>
                      <td>{q.subject || "-"}</td>
                      <td>{q.topic || "-"}</td>
                      <td>{q.difficulty || "-"}</td>
                      <td>{q.source || "-"}</td>
                      <td>
                        <button
  onClick={() => setEditingQuestion(q)}
  style={{
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "8px",
  }}
>
  Edit
</button>
                        <button
                          onClick={() => deleteQuestion(q.id)}
                          style={{
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "15px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.5 : 1,
                }}
              >
                ← Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: page >= totalPages ? "not-allowed" : "pointer",
                  opacity: page >= totalPages ? 0.5 : 1,
                }}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}