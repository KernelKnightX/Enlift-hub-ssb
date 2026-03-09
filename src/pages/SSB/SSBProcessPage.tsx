import { useNavigate } from 'react-router';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';

const stages = [
  {
    id: 'screening',
    day: 'Day 1',
    title: 'Screening',
    subtitle: 'Stage I — Entry filter for Stage II',
    color: '#1a1a1a',
    img: 'public/PROCSSB2.png',
    imgAlt: 'PPDT Sheet — Picture Perception and Discussion Test',
    imgCaption: 'Candidates write a story based on a hazy image before joining a group discussion',
    tests: [
      {
        name: 'Officer Intelligence Rating (OIR)',
        time: '~30 min',
        body: `The OIR is a two-part written intelligence test — one verbal and one non-verbal. Questions include analogies, series completion, odd-one-out, spatial reasoning and analytical problems. It is not a memory test; it measures how quickly and accurately a candidate can reason.\n\nThe OIR is scored on a five-point scale (OIR 1 to OIR 5), with OIR 1 and 2 considered highly intelligent. Results influence Stage II but are not publicised to candidates. A consistently poor OIR across two attempts can affect call-up decisions.`
      },
      {
        name: 'Picture Perception & Discussion Test (PPDT)',
        time: '~45 min',
        body: `A hazy, ambiguous image is projected for 30 seconds. Candidates write a story around it in four minutes — the story must include a central character, a situation, a conflict, and a resolution. Stories are then narrated individually (60 seconds each), followed by a group discussion where all candidates attempt to agree on one common story.\n\nThe PPDT is not primarily a storytelling test. Assessors watch for coherent thinking, confident participation, listening ability, and the capacity to contribute positively in a group without dominating. Screened-out candidates leave the same day.`
      }
    ]
  },
  {
    id: 'psychology',
    day: 'Day 2',
    title: 'Psychological Tests',
    subtitle: 'Stage II — Written personality battery',
    img: 'public/PROCSSB3.png',
    imgAlt: 'Candidates during TAT and psychological tests at SSB',
    imgCaption: 'The psychology battery — four time-bound tests that reveal instinctive thinking patterns',
    tests: [
      {
        name: 'Thematic Apperception Test (TAT)',
        time: '~60 min',
        body: `Candidates are shown 12 pictures one by one — each for 30 seconds — and must write a meaningful story for each within 4 minutes. The final image is a blank white slide: candidates write any story they choose.\n\nThe psychologist analyses recurring themes across all 12 stories — not individual tales. Themes of initiative, responsibility, practical problem-solving, and optimism are positive indicators. Fantasy, helplessness, aggression, or unrealistic heroes are red flags. Stories should feature ordinary protagonists in believable situations who take clear, constructive action.`
      },
      {
        name: 'Word Association Test (WAT)',
        time: '~15 min',
        body: `Sixty words are flashed one at a time on a screen — each for 15 seconds. Candidates must write the first meaningful sentence that comes to mind. The test moves fast by design; there is no time for rehearsal or second-guessing.\n\nThe psychologist looks for the instinctive associations behind the sentences — whether the candidate's first-response thinking tends towards positivity, leadership, cooperation, or negativity, anxiety and self-interest. Frequency of certain themes across 60 words reveals more than any single response.`
      },
      {
        name: 'Situation Reaction Test (SRT)',
        time: '~30 min',
        body: `Sixty printed situations are given — everyday scenarios involving unexpected problems, social challenges, authority, danger, or moral dilemmas. Candidates write their instinctive reaction to each in two to three lines within 30 minutes total.\n\nThe SRT simulates real-world decision-making under time pressure. Assessors look for practical, socially aware, responsible responses. Clichéd "hero" reactions — calling the police, saving everyone, reporting to senior — are less convincing than responses that demonstrate genuine practical judgment.`
      },
      {
        name: 'Self-Description (SD)',
        time: '~15 min',
        body: `Candidates write five short paragraphs describing themselves as they believe their parents, friends, teachers, and they themselves would describe them — followed by their personal goals. There is no right or wrong answer.\n\nThe SD is compared against TAT, WAT and SRT responses. If the self-described personality is confident and decisive but the TAT stories feature passive protagonists, the inconsistency is noted. The psychologist constructs a portrait of the candidate from all four tests combined, not from any one in isolation.`
      }
    ]
  },
  {
    id: 'gto',
    day: 'Days 3 & 4',
    title: 'GTO Tasks',
    subtitle: 'Stage II — Outdoor and group tasks',
    img: 'public/PROCSSB1.png',
    imgAlt: 'GTO ground with outdoor obstacles at SSB centre',
    imgCaption: 'The GTO ground — candidates are observed across eight tasks over two days',
    tests: [
      {
        name: 'Group Discussion (GD)',
        time: '~20 min each, 2 rounds',
        body: `Two group discussions are held — typically one on a concrete topic and one on an abstract topic. There is no moderator. The group of 8–12 candidates discusses freely.\n\nThe GTO scores each candidate on contribution, quality of argument, listening behaviour, and group influence. Speaking the most is not the objective. Candidates who summarise well, invite quieter members, and steer a derailing discussion back on track score more than those who dominate volume.`
      },
      {
        name: 'Group Planning Exercise (GPE)',
        time: '~45 min',
        body: `A military-style scenario is presented on a model or map — several simultaneous problems across a geographical area, limited resources, and competing priorities. Candidates study it individually, write their own plan, then discuss as a group and present a collective solution.\n\nThe GPE tests planning intelligence, practical prioritisation, communication and the ability to both lead and adapt within a group. Candidates who fixate on their own plan without listening to the group often score poorly even if their individual plan was better.`
      },
      {
        name: 'Progressive Group Task (PGT)',
        time: '~45 min',
        body: `The group must cross a series of outdoor obstacles using available props — planks, ropes, barrels and poles — under specific rules (no touching the ground between points, load must travel with the group). Tasks increase in difficulty progressively.\n\nThe GTO watches initiative, physical contribution, idea generation, how candidates behave when their suggestion is rejected, and whether they help struggling teammates. The task completion is secondary; the process is the assessment.`
      },
      {
        name: 'Half Group Task (HGT)',
        time: '~25 min',
        body: `The group is split into two halves of 4–6, each attempting the same task simultaneously but separately. With a smaller group, every individual is more visible and individual contribution is harder to hide behind group effort.\n\nThe HGT is the GTO's opportunity to observe candidates who were quiet or overshadowed during the full group tasks. Bold leadership is less important here than consistent, practical, supportive contribution.`
      },
      {
        name: 'Lecturette',
        time: '3 min per candidate',
        body: `Each candidate privately selects one topic from a card of four and speaks to the group for exactly three minutes without preparation time beyond a brief minute to collect thoughts. Topics span current affairs, science, sports, social issues and abstract concepts.\n\nThe Lecturette assesses quality of thinking, structure, communication poise and genuine knowledge. Candidates who speak confidently about a topic they actually know — even if less glamorous — score more than those who pick a flashy topic and run out of content in 90 seconds.`
      },
      {
        name: 'Command Task',
        time: '~10 min per candidate',
        body: `Each candidate is designated Commander and privately given an obstacle task. They then select two subordinates from the group to help complete it. The GTO observes the commander's briefing, decisiveness, instruction clarity and how they manage their subordinates during execution.\n\nThis is the most individual-focused outdoor task. The subordinates are there to assist, not to lead — a commander who defers to subordinates or cannot make quick decisions is marked down. The task itself need not succeed; confident, clear leadership during a reasonable attempt is what matters.`
      },
      {
        name: 'Individual Obstacles',
        time: '~3 min per candidate',
        body: `Each candidate individually completes a course of 10 numbered obstacles, each carrying different point values based on difficulty. Candidates attempt them in any order within the time limit.\n\nStrategy matters — a candidate who attempts all 10 obstacles partially and scores across multiple is often scored higher than one who completes three perfectly and runs out of time. Courage, physical commitment and risk awareness are all observed.`
      },
      {
        name: 'Final Group Task (FGT)',
        time: '~30 min',
        body: `The FGT is structurally similar to the PGT but conducted after all other tasks — the GTO uses it as a final, synthesising observation. Candidates who have observed group dynamics across two days often perform better, but those who revert to passive or dominant behaviour at the final hour are noted.\n\nThe FGT is the GTO's last data point — it carries significant weight in confirming or revising earlier observations.`
      }
    ]
  },
  {
    id: 'interview',
    day: 'Day 4 or 5',
    title: 'Personal Interview',
    subtitle: 'Stage II — One-to-one with the IO',
    img: 'public/SSBIO.jpg',
    imgAlt: 'SSB personal interview with Interviewing Officer',
    imgCaption: 'The personal interview — typically 45 to 90 minutes, based on the candidate\'s PIQ',
    tests: [
      {
        name: 'The PIQ and how the IO uses it',
        time: '45–90 min',
        body: `On Day 1, all candidates complete a Personal Information Questionnaire — a detailed form covering family background, education, hobbies, achievements, failures, sports, reading habits and reasons for wanting a commission. The PIQ is the IO's entire briefing document. Every topic in the interview originates here.\n\nCandidates who fill the PIQ carefully and honestly give themselves a strong interview. Candidates who write impressive-sounding entries they cannot substantiate give the IO the easiest possible ammunition. The IO will ask about each hobby, each achievement, each subject mentioned — in depth.`
      },
      {
        name: 'What the interview covers',
        time: '',
        body: `The IO covers personal background, family, schooling and college, hobbies and interests, sports and physical activities, current affairs and general awareness, academic subjects, failures and how they were handled, and the candidate's specific reasons for wanting to join the armed forces — and which service and branch.\n\nThe conversation is deliberately unpredictable. The IO may shift suddenly from hobbies to geopolitics to the candidate's greatest failure. This is not a trap — it is a test of genuine breadth, intellectual honesty, and composure under mild social pressure.`
      },
      {
        name: 'What the IO is actually assessing',
        time: '',
        body: `The IO is not marking answers right or wrong. They are building a character portrait: Is this person genuinely who they say they are? Are their self-descriptions consistent with how the psychologist saw them on Day 2? Do they have real opinions, real experiences and real self-awareness?\n\nMaturity — the ability to acknowledge limitations without self-pity — is highly valued. So is honest uncertainty: a candidate who says "I don't know, but my understanding is..." scores more than one who confidently states an incorrect fact.`
      }
    ]
  },
  {
    id: 'conference',
    day: 'Final Day',
    title: 'Conference',
    subtitle: 'Final synthesis — all assessors together',
    img: 'public/PROCESSB4.png',
    imgAlt: 'SSB Conference day — board meeting for final recommendation',
    imgCaption: 'The Conference — three independent assessors reconcile five days of separate observations',
    tests: [
      {
        name: 'How the Conference works',
        time: 'Final morning',
        body: `On the final morning, the Psychologist, all Group Testing Officers and the Interviewing Officer sit together for the first time and compare their independently formed assessments of each candidate. No assessor has seen another's notes until this moment — this independence is central to the board's reliability.\n\nEach assessor presents their OLQ ratings. Significant disagreements between assessors are discussed. A candidate who displayed strong leadership with the GTO but appeared evasive in the IO's interview will face pointed discussion. The board looks for consistency as the determining factor.`
      },
      {
        name: "The candidate's appearance",
        time: '2–5 min per candidate',
        body: `Candidates are called in one at a time. The board president may ask a brief question — about a gap in performance, a specific incident during the tests, or a topic from the interview. Some candidates are dismissed in under a minute; others are questioned for five. The duration does not indicate outcome.\n\nCandidates are advised to be composed and honest. There is nothing to gain by over-explaining or arguing. The board has already formed its view; the brief interaction is a final check, not a reversal opportunity.`
      },
      {
        name: 'Recommendation outcomes',
        time: '',
        body: `Candidates are recommended, not recommended, or — rarely — held pending a medical or administrative decision. Results are announced by chest number after the conference. Recommended candidates proceed to a medical examination; those who pass are merit-listed for training.\n\nThe recommendation is based on cumulative, consistent observation across five days. A single spectacular act on one task cannot override mediocre performance across the rest. Equally, a single bad day cannot disqualify a candidate who was consistently sound throughout.`
      }
    ]
  }
];

const css = `
  .sp { min-height: 100vh; background: #fafaf8; color: #1a1a1a; font-family: Georgia, serif; }
  .sp > * { box-sizing: border-box; }

  .sp-back { padding: 24px 48px 0; }
  .sp-back-btn { background: none; border: none; cursor: pointer; font-size: 14px; color: #666; letter-spacing: 0.05em; font-family: system-ui, sans-serif; }
  .sp-back-btn:hover { color: #1a1a1a; }

  /* HERO */
  .sp-hero { padding: 56px 48px 0; }
  .sp-eyebrow { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #888; font-family: system-ui; margin-bottom: 20px; }
  .sp-h1 { font-size: clamp(1.9rem, 3.5vw, 3.2rem); font-weight: 400; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 28px; max-width: 720px; }
  .sp-lead { font-size: 1.1rem; line-height: 1.85; color: #444; max-width: 680px; margin-bottom: 48px; font-style: italic; }

  /* ANCHOR NAV */
  .sp-anav { display: flex; border-top: 1px solid #e0ddd8; border-bottom: 1px solid #e0ddd8; overflow-x: auto; }
  .sp-anav a { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; font-family: system-ui; color: #666; text-decoration: none; padding: 14px 20px; border-right: 1px solid #e0ddd8; white-space: nowrap; flex-shrink: 0; }
  .sp-anav a:hover { color: #1a1a1a; background: #f5f3f0; }

  /* MAIN */
  .sp-main { padding: 0 48px; }

  /* STAGE */
  .sp-stage { padding: 72px 0 0; border-top: 1px solid #e0ddd8; }
  .sp-stage:first-child { border-top: none; padding-top: 64px; }

  /* STAGE HEADER */
  .sp-stage-hdr { display: grid; grid-template-columns: 200px 1fr; gap: 60px; margin-bottom: 48px; align-items: start; }
  .sp-stage-left { }
  .sp-stage-day { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #888; font-family: system-ui; margin-bottom: 8px; }
  .sp-stage-title { font-size: 2rem; font-weight: 400; letter-spacing: -0.02em; margin-bottom: 6px; }
  .sp-stage-sub { font-size: 13px; color: #888; font-family: system-ui; }
  .sp-stage-right { }

  /* STAGE IMAGE */
  .sp-stage-img-wrap { width: 100%; overflow: hidden; background: #ccc; margin-bottom: 56px; }
  .sp-stage-img-wrap img { width: 100%; height: 360px; object-fit: cover; object-position: center; display: block; }
  .sp-stage-img-cap { font-size: 12px; color: #888; font-family: system-ui; padding: 10px 0 0; }

  /* TESTS */
  .sp-tests { display: flex; flex-direction: column; gap: 0; margin-bottom: 72px; }
  .sp-test { display: grid; grid-template-columns: 280px 1fr; gap: 60px; padding: 36px 0; border-top: 1px solid #e8e6e1; }
  .sp-test-left { }
  .sp-test-name { font-size: 1rem; font-weight: 600; margin-bottom: 6px; line-height: 1.3; }
  .sp-test-time { font-size: 12px; color: #888; font-family: system-ui; letter-spacing: 0.04em; }
  .sp-test-right { }
  .sp-test-para { font-size: 0.975rem; line-height: 1.85; color: #333; margin-bottom: 14px; }
  .sp-test-para:last-child { margin-bottom: 0; }

  /* TIP BOX */
  .sp-tip { background: #f0ede8; border-left: 3px solid #1a1a1a; padding: 20px 24px; margin: 4px 0 0; font-size: 0.9rem; line-height: 1.75; color: #333; }

  /* CTA */
  .sp-cta { padding: 64px 0 80px; border-top: 1px solid #e0ddd8; display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
  .sp-cta-h { font-size: 1.35rem; font-weight: 400; margin-bottom: 6px; }
  .sp-cta-sub { font-size: 0.9rem; color: #666; }
  .sp-cta-btns { display: flex; gap: 14px; flex-shrink: 0; }
  .sp-btn-dark { padding: 13px 26px; background: #1a1a1a; color: #fff; border: none; cursor: pointer; font-size: 13px; letter-spacing: 0.04em; font-family: system-ui; }
  .sp-btn-out { padding: 13px 26px; background: transparent; color: #1a1a1a; border: 1px solid #1a1a1a; cursor: pointer; font-size: 13px; letter-spacing: 0.04em; font-family: system-ui; }

  /* PROGRESS STRIP */
  .sp-progress { display: flex; align-items: stretch; background: #e0ddd8; gap: 1px; margin: 48px 0 0; }
  .sp-progress-item { background: #fafaf8; flex: 1; padding: 16px 14px; }
  .sp-progress-day { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #999; font-family: system-ui; margin-bottom: 4px; }
  .sp-progress-label { font-size: 12px; font-weight: 500; }

  /* ── RESPONSIVE ── */
  @media (max-width: 960px) {
    .sp-stage-hdr { grid-template-columns: 1fr; gap: 0; }
    .sp-stage-title { font-size: 1.7rem; }
    .sp-test { grid-template-columns: 220px 1fr; gap: 36px; }
  }

  @media (max-width: 760px) {
    .sp-back { padding: 20px 24px 0; }
    .sp-hero { padding: 40px 24px 0; }
    .sp-main { padding: 0 24px; }
    .sp-h1 { font-size: clamp(1.5rem, 5vw, 2.2rem); }
    .sp-test { grid-template-columns: 1fr; gap: 12px; }
    .sp-test-time { margin-bottom: 4px; }
    .sp-stage-img-wrap img { height: 260px; }
    .sp-progress { flex-wrap: wrap; }
    .sp-progress-item { flex: 1 1 40%; min-width: 120px; }
    .sp-cta { flex-direction: column; align-items: flex-start; }
    .sp-anav a { padding: 12px 14px; font-size: 11px; }
  }

  @media (max-width: 520px) {
    .sp-back { padding: 16px 16px 0; }
    .sp-hero { padding: 28px 16px 0; }
    .sp-main { padding: 0 16px; }
    .sp-h1 { font-size: 1.5rem; }
    .sp-lead { font-size: 0.95rem; }
    .sp-stage-title { font-size: 1.4rem; }
    .sp-stage-img-wrap img { height: 200px; }
    .sp-test-name { font-size: 0.95rem; }
    .sp-cta-btns { flex-direction: column; width: 100%; }
    .sp-btn-dark, .sp-btn-out { width: 100%; text-align: center; }
    .sp-progress-item { flex: 1 1 45%; }
  }
`;

const stageTips = {
  screening: 'Assessors are not looking for the best story — they are watching how confidently you narrate it and how thoughtfully you participate in the group. Even an average story presented with clarity and poise can get you screened in.',
  psychology: 'The four psychological tests are compared against each other. A candidate who appears bold in the SD but writes passive TAT stories will be flagged. Write and respond as you genuinely are, not as you think an officer "should" be.',
  gto: 'GTO tasks are not about athletic performance or task success. Assessors have seen thousands of candidates fail the tasks. They are watching your behaviour — your initiative, your restraint, your consistency — not your obstacle-crossing technique.',
  interview: 'The best preparation for the personal interview is a well-filled PIQ and genuine self-knowledge. Know your hobbies deeply, your failures honestly, and your reasons for wanting a commission clearly. The IO is not an adversary — they are a senior officer trying to understand who you are.',
  conference: 'There is no preparation for the Conference itself. The work is already done. Walk in composed, answer briefly and honestly if questioned, and trust that five days of genuine effort will speak for itself.'
};

export default function SSBProcessPage() {
  const navigate = useNavigate();

  return (
    <>
      <NavbarSection />
      <div className="sp">
        <style>{css}</style>

        <div className="sp-back pt-16">
        <button className="sp-back-btn" onClick={() => navigate('/')}>← Back to Home</button>
      </div>

      {/* HERO */}
      <header className="sp-hero">
        <div className="sp-eyebrow">Indian Armed Forces · Officer Selection</div>
        <h1 className="sp-h1">The 5-Day SSB Process</h1>
        <p className="sp-lead">
          Every stage of the SSB is calibrated to observe a different dimension of the same person. Understanding what each stage is actually measuring — not just what it consists of — is the foundation of effective preparation.
        </p>

        {/* Progress strip */}
        <div className="sp-progress">
          {[['Day 1', 'Screening'], ['Day 2', 'Psychology'], ['Days 3–4', 'GTO Tasks'], ['Day 4–5', 'Interview'], ['Final Day', 'Conference']].map(([day, label]) => (
            <div className="sp-progress-item" key={day}>
              <div className="sp-progress-day">{day}</div>
              <div className="sp-progress-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Anchor nav */}
        <nav className="sp-anav" style={{ marginTop: '1px' }}>
          {stages.map(s => (
            <a href={`#${s.id}`} key={s.id}>{s.title}</a>
          ))}
        </nav>
      </header>

      <main className="sp-main">
        {stages.map((stage, si) => (
          <section id={stage.id} className="sp-stage" key={stage.id}>

            {/* Stage header */}
            <div className="sp-stage-hdr">
              <div className="sp-stage-left">
                <div className="sp-stage-day">{stage.day}</div>
                <div className="sp-stage-title">{stage.title}</div>
                <div className="sp-stage-sub">{stage.subtitle}</div>
              </div>
            </div>

            {/* Stage image */}
            <div className="sp-stage-img-wrap">
              <img
                src={stage.img}
                alt={stage.imgAlt}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="sp-stage-img-cap">{stage.imgCaption}</div>
            </div>

            {/* Tests */}
            <div className="sp-tests">
              {stage.tests.map((test, ti) => (
                <div className="sp-test" key={ti}>
                  <div className="sp-test-left">
                    <div className="sp-test-name">{test.name}</div>
                    {test.time && <div className="sp-test-time">{test.time}</div>}
                  </div>
                  <div className="sp-test-right">
                    {test.body.split('\n\n').map((para, pi) => (
                      <p className="sp-test-para" key={pi}>{para}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Assessor tip */}
              <div className="sp-tip">
                <strong>What assessors are actually watching:</strong> {stageTips[stage.id]}
              </div>
            </div>

          </section>
        ))}

        {/* CTA */}
        <section className="sp-cta">
          <div>
            <h3 className="sp-cta-h">Put it into practice</h3>
            <p className="sp-cta-sub">Work through TAT, WAT and SRT exercises — or learn about the OLQs that every stage is designed to evaluate.</p>
          </div>
          <div className="sp-cta-btns">
            <button className="sp-btn-dark" onClick={() => navigate('/register')}>Start Practising →</button>
            <button className="sp-btn-out" onClick={() => navigate('/ssb-qualities')}>Officer Qualities</button>
          </div>
        </section>
      </main>
      <FooterSection />
      </div>
    </>
  );
}