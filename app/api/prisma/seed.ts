import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleMeetings = [
  {
    // Early-morning meeting (07:30 JST == 2026-04-19T22:30:00Z). Regression fixture for
    // the date off-by-one bug: a UTC-based formatter shows 2026-04-19 instead of 2026-04-20.
    title: 'Early Morning Standup (07:30 JST)',
    body: `Quick early standup before the customer call.

Verifies the meeting date renders as 2026-04-20 (JST/local), not the UTC day (2026-04-19).`,
    meetingDate: new Date('2026-04-20T07:30:00+09:00'),
  },
  {
    title: 'Sprint Planning - Q2 Goals',
    body: `Discussed Q2 priorities and team capacity.

Main focus areas:
- Customer onboarding improvements
- Performance optimization for the dashboard
- New billing system rollout (target: end of June)

Action items assigned to team leads. Next sync on Friday.`,
    meetingDate: new Date('2026-04-15T10:00:00+09:00'),
  },
  {
    title: 'Tech Stack Review',
    body: `Reviewed current stack and discussed potential migrations.

Conclusions:
- Stay on current Next.js version for now
- Evaluate Prisma alternatives in Q3
- Postgres upgrade scheduled for next quarter`,
    meetingDate: new Date('2026-04-12T14:30:00+09:00'),
  },
  {
    title: 'Customer Feedback Discussion',
    body: `Reviewed feedback from last month's user interviews.

Top 3 pain points:
1. Cannot find old meeting notes (search is missing)
2. Date display is confusing (showing wrong day)
3. UI breaks with long titles

Action: prioritize these for next sprint.`,
    meetingDate: new Date('2026-04-10T11:00:00+09:00'),
  },
  {
    title: 'Detailed Quarterly Business Review with Multiple Stakeholders Including Executive Leadership and Department Heads',
    body: `Comprehensive review of Q1 performance.

Key metrics:
- MRR growth: +12%
- Churn rate: 3.2% (down from 4.1%)
- NPS: 42

Challenges discussed:
- Search functionality is the #1 request
- Some users report data inconsistencies
- Mobile experience needs work`,
    meetingDate: new Date('2026-04-08T09:00:00+09:00'),
  },
  {
    title: 'Engineering Sync',
    body: `Weekly engineering sync.

Updates:
- Backend API refactor 70% complete
- Frontend test coverage now at 65%
- CI pipeline improvements deployed

Blockers:
- Need DBA review for migration script
- Waiting on design for new search UI`,
    meetingDate: new Date('2026-04-05T16:00:00+09:00'),
  },
  {
    title: 'Design Review: Search Feature',
    body: `Reviewed initial mockups for search functionality.

Decisions:
- Full-text search over title and body
- Inline highlighting deferred to v2
- Empty state needs work

Next: prototype by end of week.`,
    meetingDate: new Date('2026-04-03T13:00:00+09:00'),
  },
  {
    title: 'On-call Postmortem: API Latency Spike',
    body: `Discussed last week's API latency incident.

Root cause: missing index on meetings.meetingDate
Resolution: added index, deployed
Impact: ~12 minutes of degraded performance

Action items:
- Add latency monitoring alerts
- Review other heavy queries for similar issues`,
    meetingDate: new Date('2026-04-01T10:30:00+09:00'),
  },
  {
    title: '1on1 with Manager',
    body: `Career development discussion.

Topics covered:
- Promotion timeline
- Skills to develop in next 6 months
- Project ownership opportunities

Next 1on1: in 2 weeks.`,
    meetingDate: new Date('2026-03-28T15:00:00+09:00'),
  },
  {
    title: 'Product Roadmap Planning',
    body: `Q3 roadmap discussion.

Big bets:
- AI-powered meeting summaries
- Mobile app launch
- SSO support for enterprise

Need to align with sales team on enterprise features.`,
    meetingDate: new Date('2026-03-25T10:00:00+09:00'),
  },
  {
    title: 'Sprint Retrospective',
    body: `What went well:
- Shipped billing fix on time
- Good cross-team collaboration

What could improve:
- Estimation was off on auth refactor
- Code review turnaround was slow

Action items: timebox estimation sessions, set up review SLA.`,
    meetingDate: new Date('2026-03-22T14:00:00+09:00'),
  },
  {
    title: 'Hiring Loop Sync',
    body: `Reviewed candidates from last week's loops.

Decisions:
- Candidate A: hire (frontend role)
- Candidate B: pass
- Candidate C: needs additional interview

Next steps: extend offer to A by Friday.`,
    meetingDate: new Date('2026-03-20T11:00:00+09:00'),
  },
  {
    title: 'Vendor Evaluation: Monitoring Tools',
    body: `Compared 3 monitoring vendors.

Shortlist:
- Datadog: most features, expensive
- New Relic: good value, decent UX
- Grafana Cloud: most flexible, requires more setup

Recommendation: pilot New Relic for 1 month.`,
    meetingDate: new Date('2026-03-18T13:30:00+09:00'),
  },
]

async function main() {
  const count = await prisma.meeting.count()
  if (count > 0) {
    console.log(`Skipping seed: ${count} meetings already exist`)
    return
  }

  for (const m of sampleMeetings) {
    await prisma.meeting.create({ data: m })
  }
  console.log(`Seeded ${sampleMeetings.length} meetings`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
