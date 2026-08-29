# Demo sandbox

Open `/demo?demo=1` to load the Moonbeam Studio sample handoff. It includes two
delivered milestones, one recorded acceptance, invoice `MB-042`, payment
instructions, and one follow-up. Both delivery-proof links lead to durable
same-origin sample evidence pages shipped with the app.

The banner says **Demo** at every point. **Reset demo** removes and reseeds only
the `demo:invoice-handoff-sheet:sheets` local-storage key. **Start for real**
removes the demo key, then switches to `invoice-handoff-sheet:sheets`; it never
copies demo data there. A later demo visit starts with a fresh sample. Ordinary
**Demo** links preserve saved demo edits; only **Reset demo** reseeds the sample.

The service worker caches the application shell and sample illustration on the
first visit. The demo can then reload offline. No account or network service is
needed to edit, export, or reset it.
