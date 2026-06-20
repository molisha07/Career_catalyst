"use client";
import React, { useState, useEffect } from "react";
import { Search, Sliders, User, Award, ShieldAlert, Sparkles, Filter, FileText } from "lucide-react";

export default function TalentSearch() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [skills, setSkills] = useState("");
  const [cgpaMin, setCgpaMin] = useState("7.0");
  const [branch, setBranch] = useState("");
  const [certs, setCerts] = useState("");

  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const parts = [];
      if (skills) parts.push(`skills=${encodeURIComponent(skills)}`);
      if (cgpaMin) parts.push(`cgpa_min=${cgpaMin}`);
      if (branch) parts.push(`branch=${encodeURIComponent(branch)}`);
      if (certs) parts.push(`certifications=${encodeURIComponent(certs)}`);

      const query = parts.length ? `?${parts.join("&")}` : "";
      const res = await fetch(`http://localhost:8000/api/jobs/recruiters/talent-search${query}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      setStudents(data);
    } catch (e) {
      // fallback mock students
      const mock = [
        {
          id: 4,
          name: "Molisha",
          college: "K. J. Somaiya College of Engineering",
          branch: "Artificial Intelligence And Data Science",
          cgpa: 7.9,
          skills: "Machine Learning, AI, Python, Data Science",
          certifications: "Machine Learning, AI",
          projects: "AI Placement Grading Engine, ATS Parsing Engine",
          experience: "Deep Learning Research Intern at Somaiya Lab",
          resume_url: "/uploads/draft_resume.pdf",
          profile_completion: 80.0
        },
        {
          id: 2,
          name: "Krisha",
          college: "K. J. Somaiya College of Engineering",
          branch: "Electronics",
          cgpa: 8.8,
          skills: "VLSI Technology, Verilog, UAV Technology, Machine Learning",
          certifications: "Python, VLSI Technology",
          projects: "UAV Autonomous Guidance Systems",
          experience: "Intern at Tata Consultancy Services",
          resume_url: "/uploads/krisha_resume.pdf",
          profile_completion: 80.0
        }
      ];
      setStudents(mock);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-800 text-xs">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-sans">Talent Discovery Database</h2>
        <p className="text-xs text-slate-500 mt-0.5">Explore Somaiya student profiles directly with advanced academic and technical keyword search</p>
      </div>

      {/* Advanced Filter Pane */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-650 font-bold">Skills / Tech</label>
            <input
              type="text" value={skills} onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Python, React"
              className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-650 font-bold">Minimum CGPA</label>
            <input
              type="number" step="0.1" value={cgpaMin} onChange={(e) => setCgpaMin(e.target.value)}
              placeholder="e.g. 7.5"
              className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-650 font-bold">Branch discipline</label>
            <input
              type="text" value={branch} onChange={(e) => setBranch(e.target.value)}
              placeholder="e.g. Computer Science"
              className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-650 font-bold">Certifications</label>
            <input
              type="text" value={certs} onChange={(e) => setCerts(e.target.value)}
              placeholder="e.g. AWS, Cisco"
              className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="btn-primary py-2.5 rounded-xl font-bold tracking-wide flex items-center justify-center gap-1.5 max-w-[200px]"
        >
          <Search size={14} /> Discovery Talent
        </button>
      </div>

      {/* Discovery Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center text-slate-500 py-20 text-xs">
          <div className="h-6 w-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-2" />
          Filtering Somaiya profiles...
        </div>
      ) : students.length === 0 ? (
        <p className="text-slate-400 text-center py-12 text-xs italic bg-white border border-slate-200 rounded-2xl">No candidate profiles match the criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4 hover:border-red-500 transition">
              <div>
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <User size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-snug">{student.name}</h4>
                    <span className="text-[9px] text-slate-400 font-semibold">{student.college || 'K. J. Somaiya College'}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 leading-relaxed text-slate-600">
                  <div><strong>Branch:</strong> {student.branch}</div>
                  <div><strong>CGPA:</strong> {student.cgpa}</div>
                  <div><strong>Skills:</strong> {student.skills?.split(",").slice(0, 4).join(", ")}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedStudent(student)}
                  className="p-2 w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold rounded-xl text-center"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-6 z-50 text-xs">
          <div className="max-w-xl w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-bold text-sm"
            >
              Close
            </button>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-6">
              <div className="h-10 w-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-sm">
                <User size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedStudent.name}</h3>
                <span className="text-[10px] text-slate-400 font-semibold">{selectedStudent.college || 'Somaiya College'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs mb-6 leading-relaxed">
              <div className="flex flex-col gap-3">
                <div>
                  <strong className="text-slate-400 uppercase text-[9px] font-bold">Branch & CGPA:</strong>
                  <p className="text-slate-850 font-bold mt-0.5">{selectedStudent.branch} • CGPA: {selectedStudent.cgpa}</p>
                </div>
                <div>
                  <strong className="text-slate-400 uppercase text-[9px] font-bold">Skills:</strong>
                  <p className="text-slate-700 font-semibold mt-0.5">{selectedStudent.skills}</p>
                </div>
                <div>
                  <strong className="text-slate-400 uppercase text-[9px] font-bold">Certifications:</strong>
                  <p className="text-slate-700 font-semibold mt-0.5">{selectedStudent.certifications || 'None added'}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <strong className="text-slate-400 uppercase text-[9px] font-bold">Academic Projects:</strong>
                  <p className="text-slate-700 font-medium mt-0.5">{selectedStudent.projects || 'None'}</p>
                </div>
                <div>
                  <strong className="text-slate-400 uppercase text-[9px] font-bold">Work Experience:</strong>
                  <p className="text-slate-700 font-medium mt-0.5">{selectedStudent.experience || 'Fresher'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              {selectedStudent.resume_url && (
                <a
                  href={selectedStudent.resume_url} target="_blank" rel="noopener noreferrer"
                  className="p-2.5 px-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-650 text-center flex items-center justify-center gap-1.5"
                >
                  <FileText size={14} /> View Resume
                </a>
              )}
              <button
                onClick={() => { setSelectedStudent(null); }}
                className="btn-primary p-2.5 px-6 rounded-xl font-bold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
