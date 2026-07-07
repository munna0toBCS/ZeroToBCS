import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";

const emptyForm = {
  exam: "BCS",
  subject: "",
  topic: "",
  difficulty: "Medium",
  question: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  answer: "A",
  explanation: "",
  source: "ZeroToBCS",
  year: "",
};

export default function QuestionForm({
  initialData = null,
  onSuccess,
  onCancel,
}) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const isEditMode = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,
        year: initialData.year || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const required = [
      "subject",
      "topic",
      "question",
      "option_a",
      "option_b",
      "option_c",
      "option_d",
      "answer",
      "explanation",
    ];

    const missing = required.filter(
      (field) => !String(form[field] || "").trim()
    );

    if (missing.length > 0) {
      alert(`Please fill: ${missing.join(", ")}`);
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);

    const payload = {
      exam: form.exam,
      subject: form.subject,
      topic: form.topic,
      difficulty: form.difficulty,
      question: form.question,
      option_a: form.option_a,
      option_b: form.option_b,
      option_c: form.option_c,
      option_d: form.option_d,
      answer: form.answer,
      explanation: form.explanation,
      source: form.source,
      year: form.year ? Number(form.year) : null,
    };

    const { error } = isEditMode
      ? await supabase
          .from("questions")
          .update(payload)
          .eq("id", initialData.id)
      : await supabase.from("questions").insert([payload]);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(isEditMode ? "Question updated." : "Question added.");

    if (!isEditMode) setForm(emptyForm);

    onSuccess?.();
  };

  return (
    <div className="card" style={{ marginBottom: "25px" }}>
      <h2>{isEditMode ? "Edit Question" : "Add Question"}</h2>

      <input placeholder="Exam" value={form.exam} onChange={(e) => handleChange("exam", e.target.value)} />
      <input placeholder="Subject" value={form.subject} onChange={(e) => handleChange("subject", e.target.value)} />
      <input placeholder="Topic" value={form.topic} onChange={(e) => handleChange("topic", e.target.value)} />

      <select value={form.difficulty} onChange={(e) => handleChange("difficulty", e.target.value)}>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>

      <textarea placeholder="Question" value={form.question} onChange={(e) => handleChange("question", e.target.value)} />

      <input placeholder="Option A" value={form.option_a} onChange={(e) => handleChange("option_a", e.target.value)} />
      <input placeholder="Option B" value={form.option_b} onChange={(e) => handleChange("option_b", e.target.value)} />
      <input placeholder="Option C" value={form.option_c} onChange={(e) => handleChange("option_c", e.target.value)} />
      <input placeholder="Option D" value={form.option_d} onChange={(e) => handleChange("option_d", e.target.value)} />

      <select value={form.answer} onChange={(e) => handleChange("answer", e.target.value)}>
        <option>A</option>
        <option>B</option>
        <option>C</option>
        <option>D</option>
      </select>

      <textarea placeholder="Explanation" value={form.explanation} onChange={(e) => handleChange("explanation", e.target.value)} />

      <input placeholder="Source" value={form.source} onChange={(e) => handleChange("source", e.target.value)} />
      <input placeholder="Year" value={form.year} onChange={(e) => handleChange("year", e.target.value)} />

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : isEditMode ? "Update Question" : "Save Question"}
        </button>

        {isEditMode && (
          <button onClick={onCancel} style={{ background: "#64748b" }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}