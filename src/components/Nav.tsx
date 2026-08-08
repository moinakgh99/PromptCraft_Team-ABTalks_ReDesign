import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "@/store";

const ALL_LINKS = [
  { to: "/", label: "Home", roles: null },
  { to: "/dashboard", label: "Dashboard", roles: ["student"] },
  { to: "/day/12", label: "Today", roles: ["student"] },
  { to: "/recruiter", label: "Recruiters", roles: ["recruiter"] },
  { to: "/admin", label: "Admin", roles: ["admin"] },
];

export default function Nav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { role, currentStudent, logout } = useStore();
  const [open, setOpen] = useState(false);

  const visibleLinks = ALL_LINKS.filter(
    (l) => l.roles === null || (role && l.roles.includes(role))
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{ borderBottom: "1px solid rgba(99,102,241,0.15)" }}
      className="sticky top-0 z-50 backdrop-blur-md"
    >
      <div
        className="max-w-7xl mx-auto px-4 flex items-center justify-between"
        style={{ height: 56 }}
      >
        <Link to="/" className="flex items-center gap-2">
          <span
            className="text-gradient font-bold text-lg"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            ABTalks
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(99,102,241,0.2)", color: "var(--primary-light)" }}
          >
            60-Day Challenge
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {visibleLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-1.5 rounded-lg text-sm transition-all"
              style={{
                color: pathname === l.to ? "var(--primary-light)" : "#94a3b8",
                background: pathname === l.to ? "rgba(99,102,241,0.12)" : "transparent",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {l.label}
            </Link>
          ))}

          {/* Auth area */}
          {role ? (
            <div className="flex items-center gap-2 ml-2">
              {role === "student" && (
                <img src={currentStudent.avatar} alt={currentStudent.name} className="w-7 h-7 rounded-full" style={{ border: "1.5px solid rgba(99,102,241,0.5)" }} />
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-sm transition-all"
                style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif", background: "none", border: "none", cursor: "pointer" }}
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: "rgba(99,102,241,0.15)", color: "var(--primary-light)", border: "1px solid rgba(99,102,241,0.3)", fontFamily: "Space Grotesk, sans-serif" }}
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="block w-5 h-0.5 transition-all duration-300" style={{ background: "var(--primary-light)" }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1" style={{ background: "var(--nav-bg)" }}>
          {visibleLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ color: pathname === l.to ? "var(--primary-light)" : "#94a3b8", background: pathname === l.to ? "rgba(99,102,241,0.12)" : "transparent" }}
            >
              {l.label}
            </Link>
          ))}
          {role ? (
            <button
              onClick={() => { handleLogout(); setOpen(false); }}
              className="px-3 py-2 rounded-lg text-sm text-left"
              style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif", background: "none", border: "none", cursor: "pointer" }}
            >
              Log out
            </button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg text-sm" style={{ color: "var(--primary-light)" }}>
              Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
