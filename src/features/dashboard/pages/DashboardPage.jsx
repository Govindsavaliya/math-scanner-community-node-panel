import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Icon } from "@/components/ui";
import PageHeader from "@/components/common/PageHeader";
import Avatar from "@/components/common/Avatar";
import EmptyState from "@/components/common/EmptyState";
import StatusBadge from "@/components/common/StatusBadge";
import { cn } from "@/utils/cn";
import { paths } from "@/app/router/paths";
import { timeAgo } from "@/utils/date";
import { useDashboard } from "../api";

const TONES = {
  indigo: "bg-primary/10 text-primary",
  green: "bg-success/10 text-success",
  amber: "bg-warning/10 text-warning",
  sky: "bg-info/10 text-info",
  rose: "bg-danger/10 text-danger",
};

const n = (value) => Number(value) || 0;
const format = (value) => n(value).toLocaleString();
const stripHtml = (text) => String(text ?? "").replace(/<[^>]*>/g, "").trim();

/** Series drawn in the trend chart. */
const SERIES = [
  { key: "users", label: "Users", color: "var(--primary)" },
  { key: "questions", label: "Questions", color: "var(--info)" },
  { key: "answers", label: "Answers", color: "var(--success)" },
];

const LOGIN_COLORS = ["var(--primary)", "var(--info)", "var(--warning)", "var(--success)"];

function Growth({ value }) {
  if (value === null || value === undefined) return null;
  const up = value >= 0;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-[12px] font-semibold", up ? "text-success" : "text-danger")}>
      <Icon name={up ? "chevron-up" : "chevron-down"} size={14} />
      {Math.abs(value)}%
    </span>
  );
}

function KpiCard({ to, icon, tone, label, stats, loading }) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-4 rounded-xl border border-line bg-surface p-5 shadow-card no-underline transition-colors duration-150 hover:border-primary/40"
    >
      <div className="flex items-center justify-between">
        <span className={cn("flex size-9 items-center justify-center rounded-lg", TONES[tone])}>
          <Icon name={icon} size={18} />
        </span>
        <Growth value={stats?.growth_7d_percent} />
      </div>
      <div>
        <p className="mb-1 text-[13px] font-medium text-muted">{label}</p>
        {loading ? (
          <div className="h-8 w-20 animate-pulse rounded-md bg-surface-2"></div>
        ) : (
          <p className="mb-0 text-[28px] leading-none font-semibold tracking-tight text-ink tabular-nums">{format(stats?.total)}</p>
        )}
        {!loading && (
          <p className="mt-2 mb-0 text-[12px] text-muted">
            <span className="font-medium text-ink">+{format(stats?.new_today)}</span> today · {format(stats?.active)} active
            {stats?.inactive ? ` · ${format(stats.inactive)} inactive` : ""}
          </p>
        )}
      </div>
    </Link>
  );
}

function SectionCard({ title, description, action, children, className }) {
  return (
    <Card className={className}>
      <Card.Header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="m-0 text-[16px] leading-tight font-semibold text-ink">{title}</h2>
          {description && <p className="mt-1 mb-0 text-[13px] text-muted">{description}</p>}
        </div>
        {action}
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  );
}

const W = 640;
const H = 220;
const PAD = { top: 12, right: 12, bottom: 24, left: 32 };

/** Dependency-free line chart of the 30-day trend with a hover read-out. */
function TrendChart({ series }) {
  const [hover, setHover] = useState(null);
  if (!series?.length) return <EmptyState icon="inbox" title="No trend data" hint="Activity of the last 30 days appears here." />;

  const max = Math.max(1, ...series.flatMap((point) => SERIES.map((s) => n(point[s.key]))));
  const top = Math.ceil(max / 4) * 4 || 4;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (series.length === 1 ? innerW / 2 : (i / (series.length - 1)) * innerW);
  const y = (value) => PAD.top + innerH - (n(value) / top) * innerH;
  const path = (key) => series.map((point, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(point[key]).toFixed(1)}`).join(" ");
  const ticks = [0, 1, 2, 3, 4].map((i) => (top / 4) * i);

  const onMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const index = Math.round(((ratio * W - PAD.left) / innerW) * (series.length - 1));
    setHover(Math.min(series.length - 1, Math.max(0, index)));
  };

  const point = hover === null ? null : series[hover];
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-4 text-[12px] text-muted">
        {SERIES.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: s.color }}></span>
            {s.label}
          </span>
        ))}
        {point && (
          <span className="ms-auto font-medium text-ink">
            {point.date}: {SERIES.map((s) => `${s.label} ${n(point[s.key])}`).join(" · ")}
          </span>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Users, questions and answers over the last 30 days" className="h-auto w-full">
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(tick)} y2={y(tick)} stroke="var(--border)" strokeWidth="1" />
            <text x={PAD.left - 6} y={y(tick) + 4} textAnchor="end" fontSize="10" fill="var(--gray)">{Math.round(tick)}</text>
          </g>
        ))}
        {[0, Math.floor((series.length - 1) / 2), series.length - 1].map((i) => (
          <text key={i} x={x(i)} y={H - 6} textAnchor={i === 0 ? "start" : i === series.length - 1 ? "end" : "middle"} fontSize="10" fill="var(--gray)">
            {series[i].date.slice(5)}
          </text>
        ))}
        {SERIES.map((s) => (
          <path key={s.key} d={path(s.key)} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} stroke="var(--gray)" strokeDasharray="3 3" />
            {SERIES.map((s) => (
              <circle key={s.key} cx={x(hover)} cy={y(series[hover][s.key])} r="3.5" fill={s.color} />
            ))}
          </g>
        )}
        <rect x="0" y="0" width={W} height={H} fill="transparent" onMouseMove={onMove} onMouseLeave={() => setHover(null)} />
      </svg>
    </div>
  );
}

/** Donut of users per login type. */
function LoginDonut({ rows }) {
  const total = rows.reduce((sum, row) => sum + n(row.count), 0);
  if (!total) return <EmptyState icon="users" title="No users yet" hint="Login types appear here." />;
  const R = 52;
  const C = 2 * Math.PI * R;
  const segments = rows.map((row, i) => {
    const before = rows.slice(0, i).reduce((sum, r) => sum + n(r.count), 0);
    return { row, length: (n(row.count) / total) * C, offset: (before / total) * C };
  });
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <svg viewBox="0 0 140 140" role="img" aria-label="Users by login type" className="size-36">
        <circle cx="70" cy="70" r={R} fill="none" stroke="var(--surface-2)" strokeWidth="16" />
        {segments.map(({ row, length, offset }, i) => (
          <circle
            key={row.login_type}
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke={LOGIN_COLORS[i % LOGIN_COLORS.length]}
            strokeWidth="16"
            strokeDasharray={`${length} ${C - length}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 70 70)"
          />
        ))}
        <text x="70" y="68" textAnchor="middle" fontSize="20" fontWeight="600" fill="var(--dark)">{format(total)}</text>
        <text x="70" y="85" textAnchor="middle" fontSize="10" fill="var(--gray)">users</text>
      </svg>
      <ul className="m-0 list-none space-y-2 p-0 text-[13px]">
        {rows.map((row, i) => (
          <li key={row.login_type} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: LOGIN_COLORS[i % LOGIN_COLORS.length] }}></span>
            <span className="text-muted capitalize">{row.login_type || "Unknown"}</span>
            <span className="ms-2 font-semibold text-ink tabular-nums">
              {format(row.count)} <span className="font-normal text-muted">({Math.round((n(row.count) / total) * 100)}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RateRow({ label, value }) {
  return (
    <li className="text-[13px]">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-muted">{label}</span>
        <span className="font-semibold text-ink tabular-nums">{n(value)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${Math.min(100, n(value))}%` }}></div>
      </div>
    </li>
  );
}

function AttentionItem({ to, icon, tone, label, value }) {
  return (
    <Link to={to} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 no-underline transition-colors hover:border-primary/40">
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", TONES[tone])}>
        <Icon name={icon} size={18} />
      </span>
      <div className="min-w-0">
        <p className="m-0 text-[20px] leading-tight font-semibold text-ink tabular-nums">{format(value)}</p>
        <p className="m-0 truncate text-[12px] text-muted">{label}</p>
      </div>
    </Link>
  );
}

function RecentList({ title, to, items, empty, render }) {
  return (
    <SectionCard
      title={title}
      action={
        <Link to={to} className="text-[13px] font-medium text-primary no-underline hover:underline">
          View all
        </Link>
      }
    >
      {items?.length ? <ul className="m-0 list-none space-y-4 p-0">{items.map(render)}</ul> : <p className="m-0 text-[13px] text-muted">{empty}</p>}
    </SectionCard>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: body, isLoading, isFetching, refetch } = useDashboard();

  // Legacy behaviour: a 429 envelope sends the user to the website root.
  const rateLimited = body?.response_code === 429;
  useEffect(() => {
    if (rateLimited) navigate(paths.website);
  }, [rateLimited, navigate]);

  const d = rateLimited ? {} : (body?.response_data ?? {});
  const summary = d.summary ?? {};
  const questions = summary.questions ?? {};
  const engagement = d.engagement ?? {};
  const recent = d.recent ?? {};

  return (
    <>
      <PageHeader
        title="Overview"
        description={
          d.generated_at
            ? `Monitor your Math Scanner platform. Updated ${timeAgo(d.generated_at)}.`
            : "Monitor your Math Scanner platform and manage your application."
        }
        actions={
          <Button variant="outline-secondary" onClick={() => refetch()} disabled={isFetching} aria-label="Refresh dashboard">
            <span className="flex items-center gap-2">
              <Icon name="refresh" size={16} className={isFetching ? "animate-spin" : ""} />
              Refresh
            </span>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard to={paths.users} icon="users" tone="sky" label="Total Users" stats={summary.users} loading={isLoading} />
        <KpiCard to={paths.mathsCommunity.list} icon="chat" tone="amber" label="Community Questions" stats={questions} loading={isLoading} />
        <KpiCard to={paths.mathsCommunity.list} icon="message" tone="green" label="Community Answers" stats={summary.answers} loading={isLoading} />
        <KpiCard to={paths.contactUsData} icon="mail" tone="indigo" label="Contact Messages" stats={summary.contact_us} loading={isLoading} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AttentionItem to={paths.mathsCommunity.list} icon="message-off" tone="amber" label="Unanswered questions" value={questions.unanswered} />
        <AttentionItem to={paths.mathsCommunity.list} icon="warning" tone="rose" label={`Reported questions (${format(questions.hidden_by_reports)} hidden)`} value={questions.reported} />
        <AttentionItem to={paths.mathsCommunity.list} icon="badge" tone="green" label="Solved questions" value={questions.solved} />
        <AttentionItem to={paths.trash} icon="trash" tone="sky" label="Items in Trash" value={summary.trash?.total} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard title="Last 30 days" description="New users, questions and answers per day." className="xl:col-span-2">
          {isLoading ? <div className="h-56 animate-pulse rounded-lg bg-surface-2"></div> : <TrendChart series={d.trend?.series} />}
        </SectionCard>
        <SectionCard title="Users by login type" description="How people sign in.">
          {isLoading ? <div className="h-36 animate-pulse rounded-lg bg-surface-2"></div> : <LoginDonut rows={d.users_by_login_type ?? []} />}
        </SectionCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard title="Engagement" description={`${n(engagement.answers_per_question)} answers per question on average.`}>
          <ul className="m-0 list-none space-y-4 p-0">
            <RateRow label="Questions answered" value={engagement.answered_rate_percent} />
            <RateRow label="Questions solved" value={engagement.solved_rate_percent} />
            <RateRow label="Active users" value={engagement.active_user_rate_percent} />
          </ul>
        </SectionCard>
        <SectionCard title="Top contributors" description="Most questions and answers." className="xl:col-span-2">
          {d.top_contributors?.length ? (
            <ul className="m-0 list-none space-y-3 p-0">
              {d.top_contributors.map((user) => (
                <li key={user.user_id} className="flex items-center gap-3">
                  <Avatar src={user.user_image} name={user.user_name} />
                  <span className="min-w-0 flex-1 truncate font-medium text-ink">{user.user_name}</span>
                  <span className="text-[13px] text-muted tabular-nums">
                    {format(user.questions)} questions · {format(user.answers)} answers
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 text-[13px] text-muted">No contributions yet.</p>
          )}
        </SectionCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <RecentList
          title="Recent users"
          to={paths.users}
          items={recent.users}
          empty="No users yet."
          render={(user) => (
            <li key={user.id} className="flex items-center gap-3">
              <Avatar name={user.user_name} />
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-[14px] font-medium text-ink">{user.user_name}</p>
                <p className="m-0 truncate text-[12px] text-muted">{user.user_email}</p>
              </div>
              <StatusBadge tone={user.status === 1 ? "success" : "neutral"} dot={false}>
                {user.status === 1 ? "Active" : "Inactive"}
              </StatusBadge>
            </li>
          )}
        />
        <RecentList
          title="Recent questions"
          to={paths.mathsCommunity.list}
          items={recent.questions}
          empty="No questions yet."
          render={(question) => (
            <li key={question.id}>
              <p className="m-0 line-clamp-2 text-[14px] text-ink">{stripHtml(question.question)}</p>
              <p className="m-0 mt-0.5 text-[12px] text-muted">
                {question.user_name} · {timeAgo(question.created_at)} · {format(question.answers)} answers
              </p>
            </li>
          )}
        />
        <RecentList
          title="Recent messages"
          to={paths.contactUsData}
          items={recent.contact_us}
          empty="No messages yet."
          render={(message) => (
            <li key={message.id}>
              <p className="m-0 line-clamp-2 text-[14px] text-ink">{message.message}</p>
              <p className="m-0 mt-0.5 text-[12px] text-muted">
                {message.name} · {timeAgo(message.created_at)}
              </p>
            </li>
          )}
        />
      </div>
    </>
  );
}
