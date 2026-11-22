import { useMemo, useState } from 'react';
import { useStore, saveKid } from '../data/store';
import type { Grade, Kid, Subject } from '../core/types';
import { GRADES, GRADE_LABEL } from '../core/types';
import { SUBJECTS, SUBJECT_BY_ID } from '../core/subjects';
import { dailyMinutes, needsHelp, subjectReport, weeklyStats, type SkillRow } from '../core/report';
import { levelInfo, playedDays, streakInfo, totalXp } from '../core/progress';
import { dayKey } from '../core/random';
import { Avatar } from '../ui/Avatar';

/** The grown-ups' progress report: where each kid is and how they're doing. */
export function ParentReport() {
  const kids = useStore((s) => s.kids);
  const [kidId, setKidId] = useState(kids[0]?.id);
  const kid = kids.find((k) => k.id === kidId) ?? kids[0];
  if (!kid) return <section className="card"><p>No players yet.</p></section>;
  return (
    <div className="report">
      <div className="kid-tabs">
        {kids.map((k) => (
          <button key={k.id} className={`kid-tab ${k.id === kid.id ? 'on' : ''}`} onClick={() => setKidId(k.id)}>
            <Avatar config={k.avatar} size={30} /> {k.name}
          </button>
        ))}
      </div>
      <KidReport kid={kid} />
    </div>
  );
}

function KidReport({ kid }: { kid: Kid }) {
  const allRounds = useStore((s) => s.rounds);
  const skills = useStore((s) => s.skills[kid.id]) ?? {};
  const rounds = useMemo(() => allRounds.filter((r) => r.kidId === kid.id), [allRounds, kid.id]);
  const level = levelInfo(totalXp(rounds));
  const streak = streakInfo(playedDays(rounds), dayKey());
  const days = dailyMinutes(rounds);
  const weeks = weeklyStats(rounds);
  const help = needsHelp(skills);
  const thisWeek = weeks[weeks.length - 1];

  return (
    <>
      <div className="stat-tiles">
        <Tile big={`Level ${level.level}`} small={`${rounds.length} rounds played`} />
        <Tile big={`🔥 ${streak.current} days`} small={`Best streak: ${streak.best}`} />
        <Tile big={`${days[days.length - 1].minutes} min`} small="Played today" />
        <Tile big={`${thisWeek.rounds} rounds`} small={`This week · ${thisWeek.accuracy === null ? 'no answers yet' : `${Math.round(thisWeek.accuracy * 100)}% right first try`}`} />
      </div>

      <section className="card">
        <h3>💡 Needs a little help</h3>
        {help.length === 0 ? <p>Nothing stands out. Every skill they’ve practiced is going well (60% or better on the first try).</p> : (
          <ul className="help-list">
            {help.slice(0, 6).map((r) => (
              <li key={r.skill.id}>
                <b>{SUBJECT_BY_ID[r.skill.subject].emoji} {r.skill.name}</b> ({GRADE_LABEL[r.skill.grade]}): {Math.round((r.accuracy ?? 0) * 100)}% right first try over the last {r.answered} answers
              </li>
            ))}
          </ul>
        )}
        <p className="hint">The games already slow down and give hints on these. Practicing together or talking it through can help too.</p>
      </section>

      <div className="chart-row">
        <section className="card">
          <h3>⏱️ Minutes played, last 7 days</h3>
          <BarChart data={days.map((d) => ({ label: d.label, value: d.minutes, tip: `${d.label}: ${d.minutes} min, ${d.rounds} rounds` }))} unit="min" />
        </section>
        <section className="card">
          <h3>📈 Rounds per week</h3>
          <BarChart data={weeks.map((w) => ({ label: w.label, value: w.rounds, tip: `Week of ${w.label}: ${w.rounds} rounds, ${w.accuracy === null ? 'no answers' : `${Math.round(w.accuracy * 100)}% right first try`}` }))} unit="" />
        </section>
        <section className="card">
          <h3>🎯 Right on the first try, per week</h3>
          <BarChart data={weeks.map((w) => ({ label: w.label, value: w.accuracy === null ? 0 : Math.round(w.accuracy * 100), empty: w.accuracy === null, tip: `Week of ${w.label}: ${w.accuracy === null ? 'no answers' : `${Math.round(w.accuracy * 100)}%`}` }))} unit="%" max={100} />
        </section>
      </div>

      {SUBJECTS.map((s) => <SubjectCard key={s.id} kid={kid} subject={s.id} />)}
    </>
  );
}

function Tile({ big, small }: { big: string; small: string }) {
  return <div className="tile-stat"><b>{big}</b><span>{small}</span></div>;
}

/** A small single-series bar chart. Values are printed above each bar, so no legend or axis is needed. */
function BarChart({ data, unit, max }: { data: { label: string; value: number; tip: string; empty?: boolean }[]; unit: string; max?: number }) {
  const top = Math.max(max ?? 0, ...data.map((d) => d.value), 1);
  return (
    <div className="bars" role="table" aria-label="chart">
      {data.map((d, i) => (
        <div key={i} className="bar-col" role="row" title={d.tip}>
          <span className="bar-val" role="cell">{d.empty ? '–' : `${d.value}${unit === '%' ? '%' : ''}`}</span>
          <span className="bar-track"><span className={`bar ${d.value === 0 ? 'zero' : ''}`} style={{ height: `${(d.value / top) * 100}%` }} /></span>
          <span className="bar-label" role="cell">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

const STATUS: Record<SkillRow['status'], { icon: string; label: string }> = {
  mastered: { icon: '✅', label: 'Mastered' },
  practicing: { icon: '🔄', label: 'Practicing' },
  'not-started': { icon: '⬜', label: 'Not started' },
};

function SubjectCard({ kid, subject }: { kid: Kid; subject: Subject }) {
  const skills = useStore((s) => s.skills[kid.id]) ?? {};
  const r = subjectReport(kid, subject, skills);
  const info = SUBJECT_BY_ID[subject];
  const [open, setOpen] = useState(false);
  const pct = r.totalAtGrade ? r.masteredAtGrade / r.totalAtGrade : 0;
  return (
    <section className="card subject-card">
      <button className="subject-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="subject-title">{info.emoji} {info.name}</span>
        <span className="subject-sum">
          Working on <b>{GRADE_LABEL[r.workingGrade]}</b> · {r.masteredAtGrade} of {r.totalAtGrade} skills mastered
        </span>
        <span className="mini-bar"><span style={{ width: `${pct * 100}%`, background: info.color }} /></span>
        <span className="chev">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <>
          <label className="grade-pick">
            Start {info.name.toLowerCase()} at{' '}
            <select value={r.grade} onChange={(e) => {
              const g = e.target.value as Grade;
              const gradeBySubject = { ...kid.gradeBySubject };
              if (g === kid.grade) delete gradeBySubject[subject]; else gradeBySubject[subject] = g;
              saveKid({ ...kid, gradeBySubject, updatedAt: Date.now() });
            }}>
              {GRADES.map((g) => <option key={g} value={g}>{GRADE_LABEL[g]}{g === kid.grade ? ' (their grade)' : ''}</option>)}
            </select>
          </label>
          <table className="skill-table">
            <thead><tr><th>Skill</th><th>Grade</th><th>Status</th><th>First-try</th></tr></thead>
            <tbody>
              {r.rows.map((row) => (
                <tr key={row.skill.id}>
                  <td>{row.skill.name}</td>
                  <td>{GRADE_LABEL[row.skill.grade]}</td>
                  <td>{STATUS[row.status].icon} {STATUS[row.status].label}</td>
                  <td>{row.accuracy === null ? '–' : `${Math.round(row.accuracy * 100)}% (${row.answered})`}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="hint">“Mastered” means 80%+ right on the first try over the last 20 answers, on at least 2 different days.</p>
        </>
      )}
    </section>
  );
}
