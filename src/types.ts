export type Milestone = { id: string; title: string; deliveredOn: string; evidence: string; acceptedBy: string; acceptedOn: string };
export type FollowUp = { id: string; date: string; method: string; note: string; outcome: string };
export type Sheet = {
  id: string; project: string; client: string; clientEmail: string; invoiceId: string;
  amount: string; currency: string; issuedOn: string; dueOn: string; instructions: string;
  status: 'open' | 'paid' | 'overdue'; milestones: Milestone[]; followUps: FollowUp[]; createdAt: string; updatedAt: string;
};

export const blankSheet = (): Sheet => ({
  id: crypto.randomUUID(), project: '', client: '', clientEmail: '', invoiceId: '', amount: '', currency: 'USD',
  issuedOn: new Date().toISOString().slice(0, 10), dueOn: '', instructions: '', status: 'open', milestones: [], followUps: [],
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
});

export const sampleSheet = (): Sheet => ({
  id: 'demo-moonbeam', project: 'Moonbeam Studio website launch', client: 'Moonbeam Studio', clientEmail: 'taylor@moonbeam.studio',
  invoiceId: 'MB-042', amount: '2400.00', currency: 'USD', issuedOn: '2026-08-10', dueOn: '2026-08-24',
  instructions: 'Please pay by bank transfer. Reference MB-042. Reply to this sheet if anything needs review.', status: 'overdue',
  milestones: [
    { id: 'm1', title: 'Final responsive site delivered', deliveredOn: '2026-08-09', evidence: 'https://example.com/moonbeam/final-preview', acceptedBy: 'Taylor Morgan', acceptedOn: '2026-08-10' },
    { id: 'm2', title: 'Source files and handover notes delivered', deliveredOn: '2026-08-10', evidence: 'https://example.com/moonbeam/handover-files', acceptedBy: '', acceptedOn: '' }
  ],
  followUps: [
    { id: 'f1', date: '2026-08-25', method: 'Email', note: 'Sent the handoff sheet and asked for a payment update.', outcome: 'Awaiting reply' }
  ], createdAt: '2026-08-10T09:00:00.000Z', updatedAt: '2026-08-25T09:00:00.000Z'
});
