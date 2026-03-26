window.DEMO_EXTENSION_DATA = {
  bookmarkCount: 24,
  prompt: `Summarize these X bookmarks into:
1. TL;DR
2. Major themes
3. Key links/resources mentioned
4. Recommended next steps
5. General advice

Also group similar bookmarks together and mention repeated topics.`,
  systemPrompt:
    "You summarize a user's saved X bookmarks into a useful, structured digest. Return clear markdown with these sections: TL;DR, Major Themes, Key Links and Resources, Recommended Next Steps, and General Advice. Be concise but specific.",
  model: "gpt-4.1-mini",
  apiKeyMask: "sk-demo-xxxxxxxxxxxxxxxx",
  summary: `TL;DR
- AI agents, evals, and productized workflows dominate this bookmark set.
- The clearest opportunities are around workflow automation, eval tooling, and practical distribution.

Major Themes
- Agent product patterns for research, coding, and operator workflows
- Evaluation infrastructure and reliability for LLM systems
- Distribution ideas around creator workflows and niche B2B pain points

Key Links and Resources
- Repeated discussion around eval harnesses and agent observability
- Several posts on practical AI products with strong workflow fit
- Multiple links about browser automation and user-owned data flows

Recommended Next Steps
- Group bookmarks into 3 bets: workflow tool, eval product, and distribution channel
- Turn the top 10 bookmarks into a one-page insight memo
- Identify 2 ideas with a clear buyer and a narrow first release

General Advice
- Favor tools that save repeated time instead of one-off novelty
- Keep the first version narrowly scoped and measurable
- Validate the workflow before investing in a larger platform build.`
};
