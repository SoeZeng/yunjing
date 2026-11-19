import { useEffect, useMemo, useState } from "react";
import { days, dayByNumber, daysForSkill, weeks } from "./days.js";
import { loadProgress, saveProgress } from "./progress.js";
import { cases, glossary, names, outcomes, quiz } from "./reference.js";
import { skills, skillById } from "./skills.js";

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash || "#/");
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [hash]);
  return hash.replace(/^#/, "") || "/";
}

function useProgress() {
  const [progress, setProgress] = useState(loadProgress);
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);
  const api = useMemo(
    () => ({
      progress,
      toggleDay(n) {
        setProgress((prev) => ({
          ...prev,
          days: { ...prev.days, [n]: !prev.days[n] },
        }));
      },
      toggleOutcome(id) {
        setProgress((prev) => ({
          ...prev,
          outcomes: { ...prev.outcomes, [id]: !prev.outcomes[id] },
        }));
      },
      chooseQuiz(id, index) {
        setProgress((prev) => ({
          ...prev,
          quiz: { ...prev.quiz, [id]: index },
        }));
      },
    }),
    [progress],
  );
  return api;
}

function Shell({ path, doneCount, children }) {
  const current = (id) => (path === id ? "true" : undefined);
  return (
    <>
      <a className="skip" href="#content">跳到正文</a>
      <header className="top">
        <a className="mark" href="#/">云径</a>
        <nav>
          <a href="#/" aria-current={current("/")}>起点</a>
          <a href="#/plan" aria-current={current("/plan")}>三十天</a>
          <a href="#/map" aria-current={current("/map")}>两成</a>
          <a href="#/glossary" aria-current={current("/glossary")}>词表</a>
        </nav>
        <a className="count" href="#/plan">
          {doneCount}/30
        </a>
      </header>
      <main id="content">{children}</main>
      <footer>
        <p>一个月的目标不是把招聘启事里的“精通”变成真的，而是留下能建、能发、能看、能查、能交接的骨架。</p>
      </footer>
    </>
  );
}

function Home({ progress, toggleOutcome, nextDay }) {
  const done = days.filter((day) => progress.days[day.n]).length;
  const outcomeDone = outcomes.filter((item) => progress.outcomes[item.id]).length;
  return (
    <>
      <section className="hero">
        <p className="kicker">三十天 · 初学者 · 每天约一小时</p>
        <h1>只学能带来八成效果的那两成。</h1>
        <p className="lede">
          招聘启事把云、Terraform、Kubernetes、流水线、监控和脚本都写成了专家经验。
          这个月不追这个范围，动手只用 Azure，流水线只用 Jenkins。
          九项能力各留 5 份最值得的资料，要点已经写在页面上。标明亲手做的跟着做，其余用来对照。
        </p>
        <div className="hero-row">
          <a className="button" href={`#/day/${nextDay.n}`}>
            {done === 0 ? "从第 1 天开始" : `继续第 ${nextDay.n} 天`}
          </a>
          <a className="button quiet" href="#/map">先看该放下什么</a>
          <p className="meter">
            <span style={{ width: `${(done / 30) * 100}%` }} />
            已完成 {done} 天
          </p>
        </div>
      </section>

      <section>
        <h2>四周</h2>
        <ol className="weeks">
          {weeks.map((week) => (
            <li key={week.id}>
              <a href={`#/plan`}>
                <span>第 {week.id} 周</span>
                <strong>{week.title}</strong>
                <em>{week.days}</em>
                <p>{week.aim}</p>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2>九项，以及每一项真正要会的事</h2>
        <ol className="index">
          {skills.map((skill) => (
            <li key={skill.id}>
              <a href={`#/skill/${skill.id}`}>
                <span>{skill.index}</span>
                <div>
                  <strong>{skill.title}</strong>
                  <small>{skill.en}</small>
                  <p>{skill.promise}</p>
                </div>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="section-head">
          <h2>结束时应该能做到</h2>
          <p>{outcomeDone}/8</p>
        </div>
        <ul className="checks">
          {outcomes.map((item) => (
            <li key={item.id}>
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(progress.outcomes[item.id])}
                  onChange={() => toggleOutcome(item.id)}
                />
                <span>{item.text}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function Plan({ progress, toggleDay }) {
  return (
    <>
      <header className="page-head">
        <p className="kicker">日程</p>
        <h1>三十天，每天一件能交出来的事。</h1>
        <p>勾选存在这台浏览器里。做不完就停在“完成标准”，不要把下一天的范围提前加进来。</p>
      </header>
      {weeks.map((week) => (
        <section key={week.id}>
          <div className="section-head">
            <h2>第 {week.id} 周 · {week.title}</h2>
            <p>{week.aim}</p>
          </div>
          <ol className="day-list">
            {days.filter((day) => day.week === week.id).map((day) => {
              const skill = skillById(day.skill);
              return (
                <li key={day.n} className={progress.days[day.n] ? "is-done" : undefined}>
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean(progress.days[day.n])}
                      onChange={() => toggleDay(day.n)}
                      aria-label={`第 ${day.n} 天完成`}
                    />
                  </label>
                  <a href={`#/day/${day.n}`}>
                    <span>第 {day.n} 天 · {day.minutes} 分钟</span>
                    <strong>{day.title}</strong>
                    <em>{skill.title}</em>
                  </a>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </>
  );
}

function SkillPage({ skill }) {
  const related = daysForSkill(skill.id);
  return (
    <>
      <header className="page-head">
        <p className="kicker">第 {skill.index} 项 · 第 {skill.week} 周动手</p>
        <h1>{skill.title}</h1>
        <p className="en">{skill.en}</p>
        <p>{skill.promise}</p>
      </header>
      <div className="split">
        <section>
          <h2>{skill.focusTitle}</h2>
          <ul className="focus">
            {skill.focus.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
        <section className="later">
          <h2>这个月先放下</h2>
          <ul>
            {skill.later.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      </div>
      <section>
        <h2>落在这些天</h2>
        <p className="chips">
          {related.map((day) => (
            <a key={day.n} href={`#/day/${day.n}`}>第 {day.n} 天 · {day.title}</a>
          ))}
        </p>
      </section>
      <section>
        <h2>五份资料和提炼出的要点</h2>
        <p className="note">标成“亲手做”的要打开链接跟着做。标成“读要点”的，先把下面的要点变成自己的话，时间不够就不必把原文读完。</p>
        <ol className="resources">
          {skill.resources.map((resource, index) => (
            <li key={resource.url}>
              <div className="resource-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3><a href={resource.url} target="_blank" rel="noreferrer">{resource.name}</a></h3>
                  <p className="meta">{resource.source} · {resource.minutes} · {resource.mode}</p>
                  <p>{resource.why}</p>
                </div>
              </div>
              <ul>
                {resource.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </section>
      <section className="practice">
        <h2>这一项的练习</h2>
        <p>{skill.practice}</p>
      </section>
      {skill.id === "cloud" || skill.id === "netsec" ? <NameTable /> : null}
      {skill.id === "debug" ? <CaseList /> : null}
    </>
  );
}

function NameTable() {
  return (
    <section>
      <h2>同一件事在三朵云上的名字</h2>
      <p className="note">本月只在 Azure 上动手。这张表用来读 AWS 和 Google Cloud 的文档。</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>概念</th>
              <th>Azure</th>
              <th>AWS</th>
              <th>Google Cloud</th>
            </tr>
          </thead>
          <tbody>
            {names.map((row) => (
              <tr key={row.concept}>
                <th>{row.concept}</th>
                <td>{row.azure}</td>
                <td>{row.aws}</td>
                <td>{row.gcp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CaseList() {
  const [active, setActive] = useState(cases[0].id);
  const item = cases.find((entry) => entry.id === active) || cases[0];
  return (
    <section>
      <h2>先问哪一句</h2>
      <div className="case-tabs">
        {cases.map((entry) => (
          <button
            key={entry.id}
            type="button"
            aria-pressed={entry.id === item.id}
            onClick={() => setActive(entry.id)}
          >
            {entry.title}
          </button>
        ))}
      </div>
      <div className="case">
        <p>{item.first}</p>
        <ol>
          {item.checks.map((check) => <li key={check}>{check}</li>)}
        </ol>
      </div>
    </section>
  );
}

function DayPage({ day, progress, toggleDay }) {
  const skill = skillById(day.skill);
  const prev = dayByNumber(day.n - 1);
  const next = dayByNumber(day.n + 1);
  return (
    <>
      <header className="page-head">
        <p className="kicker">第 {day.n} 天 · {day.minutes} 分钟 · {skill.title}</p>
        <h1>{day.title}</h1>
        <p>{day.goal}</p>
      </header>
      <section>
        <h2>今天做</h2>
        <ol className="steps">
          {day.steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </section>
      <section className="split">
        <div>
          <h2>完成标准</h2>
          <p>{day.done}</p>
        </div>
        <div className="later">
          <h2>容易踩空</h2>
          <p>{day.pitfall}</p>
        </div>
      </section>
      <section>
        <button
          type="button"
          className="button"
          aria-pressed={Boolean(progress.days[day.n])}
          onClick={() => toggleDay(day.n)}
        >
          {progress.days[day.n] ? "这一天已完成" : "标记这一天完成"}
        </button>
      </section>
      <section>
        <h2>对应的资料</h2>
        <p><a href={`#/skill/${skill.id}`}>打开「{skill.title}」的五份资料和要点</a></p>
      </section>
      <nav className="pager">
        {prev ? <a href={`#/day/${prev.n}`}>上一天 · {prev.title}</a> : <span />}
        {next ? <a href={`#/day/${next.n}`}>下一天 · {next.title}</a> : <a href="#/">回到起点</a>}
      </nav>
    </>
  );
}

function MapPage({ progress, chooseQuiz }) {
  const answered = quiz.filter((item) => progress.quiz[item.id] !== undefined);
  const correct = answered.filter((item) => progress.quiz[item.id] === item.answer).length;
  return (
    <>
      <header className="page-head">
        <p className="kicker">取舍</p>
        <h1>八成效果来自这些动作。</h1>
        <p>
          下面每行左边是这个月要练熟的动作，右边是明确不在三十天里的内容。
          资料仍然列出五份，是为了让你知道权威来源在哪，不是为了把五份都学完。
        </p>
      </header>
      <ol className="map">
        {skills.map((skill) => (
          <li key={skill.id}>
            <a href={`#/skill/${skill.id}`}>{skill.index} {skill.title}</a>
            <div>
              <h2>练</h2>
              <ul>{skill.focus.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <h2>先不练</h2>
              <ul>{skill.later.slice(0, 2).map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </li>
        ))}
      </ol>
      <section>
        <div className="section-head">
          <h2>六题自测</h2>
          <p>{answered.length === 0 ? "还没有作答" : `${correct}/${quiz.length} 题与要点一致`}</p>
        </div>
        <ol className="quiz">
          {quiz.map((item, index) => {
            const chosen = progress.quiz[item.id];
            return (
              <li key={item.id}>
                <h3>{index + 1}. {item.prompt}</h3>
                <div>
                  {item.choices.map((choice, choiceIndex) => {
                    const selected = chosen === choiceIndex;
                    const show = chosen !== undefined;
                    const tone = !show ? "" : choiceIndex === item.answer ? "is-right" : selected ? "is-wrong" : "";
                    return (
                      <button
                        key={choice}
                        type="button"
                        className={tone}
                        aria-pressed={selected}
                        onClick={() => chooseQuiz(item.id, choiceIndex)}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
                {chosen !== undefined ? <p className="explain">{item.explain}</p> : null}
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}

function GlossaryPage() {
  return (
    <>
      <header className="page-head">
        <p className="kicker">词表</p>
        <h1>这个月会反复用到的词。</h1>
        <p>每个词只保留够用的定义。更深的差别，回到对应的那一项资料里看。</p>
      </header>
      <dl className="glossary">
        {glossary.map((item) => (
          <div key={item.term}>
            <dt>{item.term}</dt>
            <dd>{item.def}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function Missing() {
  return (
    <header className="page-head">
      <h1>没有这一页。</h1>
      <p><a href="#/">回到起点</a></p>
    </header>
  );
}

export default function App() {
  const path = useHash();
  const { progress, toggleDay, toggleOutcome, chooseQuiz } = useProgress();
  const doneCount = days.filter((day) => progress.days[day.n]).length;
  const nextDay = days.find((day) => !progress.days[day.n]) || days[days.length - 1];

  useEffect(() => {
    if (path === "/today") window.location.hash = `#/day/${nextDay.n}`;
  }, [path, nextDay.n]);

  let body;
  if (path === "/" || path === "") body = <Home progress={progress} toggleOutcome={toggleOutcome} nextDay={nextDay} />;
  else if (path === "/plan") body = <Plan progress={progress} toggleDay={toggleDay} />;
  else if (path === "/map") body = <MapPage progress={progress} chooseQuiz={chooseQuiz} />;
  else if (path === "/glossary") body = <GlossaryPage />;
  else if (path.startsWith("/skill/")) {
    const skill = skillById(path.slice("/skill/".length));
    body = skill ? <SkillPage skill={skill} /> : <Missing />;
  } else if (path.startsWith("/day/")) {
    const day = dayByNumber(Number(path.slice("/day/".length)));
    body = day ? <DayPage day={day} progress={progress} toggleDay={toggleDay} /> : <Missing />;
  } else if (path === "/today") body = <p className="note">正在打开今天的进度。</p>;
  else body = <Missing />;

  return (
    <Shell path={path} doneCount={doneCount}>
      {body}
    </Shell>
  );
}
