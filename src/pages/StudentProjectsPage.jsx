import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext.jsx';
import { useProjects } from '../contexts/ProjectsContext.jsx';
import StatCard from '../components/shared/StatCard.jsx';

export default function OverviewPage() {
  const { user } = useAuth();

  // ✅ Backend data
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get("https://backend-full-stack-production.up.railway.app/students")
      .then(res => {
        console.log("API DATA:", res.data); // debug
        setStudents(res.data);
      })
      .catch(err => console.error("API ERROR:", err));
  }, []);

  return (
    <div className="page">
      <section className="panel overview-panel">

        <div className="page-header">
          <h1>
            Welcome back, {students[0]?.name || user?.name || "User"} 👋
          </h1>
          <p>
            A clean, official workspace for tracking student projects, showcasing portfolios, and keeping mentors in the loop.
          </p>
        </div>

        {/* ✅ Dynamic Cards */}
        <div className="stats-grid">

          <StatCard
            label="TOTAL PROJECTS"
            value={students.length}
          />

          <StatCard
            label="IN PROGRESS"
            value={students.length}
          />

          <StatCard
            label="SUBMITTED"
            value={0}
          />

          <StatCard
            label="APPROVED"
            value={0}
          />

          <StatCard
            label="DRAFTS"
            value={0}
          />

        </div>

      </section>
    </div>
  );
}