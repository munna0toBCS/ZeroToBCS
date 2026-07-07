import { useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../services/supabaseClient";
import { validateQuestions } from "../services/importValidationService";
import { checkDuplicateQuestions } from "../services/duplicateQuestionService";

export default function QuestionImporter() {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setFileName(file.name);

      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
      });

      const sheet =
        workbook.Sheets[workbook.SheetNames[0]];

      const parsedRows = XLSX.utils.sheet_to_json(sheet, {
        defval: "",
      });

      setRows(parsedRows);

      const validation =
        validateQuestions(parsedRows);

      const duplicateResult =
        await checkDuplicateQuestions(
          validation.validRows
        );

      setReport({
        ...validation,
        validRows: duplicateResult.newQuestions,
        duplicateDatabase:
          duplicateResult.duplicates,
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const importQuestions = async () => {
    if (!report) {
      alert("Upload a file first.");
      return;
    }

    if (report.validRows.length === 0) {
      alert("No new questions to import.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("questions")
      .insert(report.validRows);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      `Successfully Imported ${report.validRows.length} Questions`
    );

    setRows([]);
    setFileName("");
    setReport(null);
  };

  return (
        <div style={{ maxWidth: "1100px", margin: "40px auto" }}>
      <div className="card">
        <h1>Bulk Question Import</h1>

        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "12px",
            color: "#1e3a8a",
          }}
        >
          <strong>Supported Formats</strong>
          <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
            <li>Excel: .xlsx, .xls</li>
            <li>CSV: .csv</li>
          </ul>
        </div>

        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          style={{ marginTop: "25px" }}
        />

        {fileName && (
          <h3 style={{ marginTop: "20px" }}>
            File: {fileName}
          </h3>
        )}

        {report && (
          <div
            className="card"
            style={{
              marginTop: "20px",
              background: "#f8fafc",
              color: "#0f172a",
            }}
          >
            <h3>Import Report</h3>

            <p>Total Rows: {report.total}</p>
            <p>Valid in File: {report.valid}</p>
            <p>Duplicate in File: {report.duplicates.length}</p>
            <p>Duplicate in Database: {report.duplicateDatabase?.length || 0}</p>
            <p>Ready to Import: {report.validRows.length}</p>
            <p>Errors: {report.errors.length}</p>
          </div>
        )}
                {rows.length > 0 && (
          <>
            <h3 style={{ marginTop: "20px" }}>
              Preview: {rows.length} rows
            </h3>

            <div style={{ overflowX: "auto", marginTop: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Subject</th>
                    <th>Topic</th>
                    <th>Question</th>
                    <th>Answer</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.slice(0, 10).map((row, index) => (
                    <tr key={index}>
                      <td>{row.exam}</td>
                      <td>{row.subject}</td>
                      <td>{row.topic}</td>
                      <td>{row.question}</td>
                      <td>{row.answer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={importQuestions}
              disabled={loading}
              style={{ marginTop: "25px", width: "100%" }}
            >
              {loading ? "Importing..." : "Import New Questions"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}