# The Bar for Writing Software Just Fell

Vibe coding makes an idea into a product in an afternoon. Agentic QA makes the machine check its own work. The ceiling moved. The floor did not, and that is where the builders who last are standing.

Published 2026-09-09 by Hoardy. Canonical: https://hoardy.ai/blog/the-bar-for-writing-software-just-fell/
Tags: Vibe Coding, Engineering, Quality, Essay

This essay is our answer to an argument that has split the industry in two. Half the discourse says the new tools make everyone a builder; the other half says they are producing slop at scale. Both sides are describing the same tool. What they disagree about is whether quality is a property of the tool, or of the person holding it. We build software for a living, and we have a clear answer: the tool raised the ceiling, and the floor is still entirely human.

## What is vibe coding, exactly?

Vibe coding is a way of writing software where you describe what you want in natural language and let an AI model generate the code, iterating on the behaviour you observe rather than editing source directly. Andrej Karpathy, who coined the term in early 2025, described it as "fully giving in to the vibes": embracing the new capability rather than fighting it.

That definition matters, because most arguments about vibe coding never settle what it is. Done honestly, it is a new interaction model for building. Done carelessly, it is a way to generate a confident-looking demo that collapses the moment it meets real users, real data, or a real deadline.

## Agentic QA: the machine checks itself

The interesting development is not that AI writes code. It is that AI can now be pointed back at its own output. Agentic QA is the practice of using AI agents to test, verify, and audit software: checking that what was claimed to be built is actually what works.

The tests are written into the sprint instead of bolted on before launch. The CI/CD pipeline blocks merges that fail. Performance budgets are enforced, not hoped for. Security checks run continuously, not as a pre-launch scare.

We have built forty-plus products this way, and it costs more on paper. It costs far less in client retention, rework, and the 2am page-down calls you never get when the foundation is solid.

## The part that is still human

Here is what the pro-vibe and anti-vibe camps both miss. Speed to create was never the scarce resource in software. Judgment was. The machine can now write the code; it still cannot know when a number in the demo will not survive contact with the real data.

Software that lasts was never made by speed. It was made by judgment, by rigour, and by someone who cared about the thing itself. That part is still human. It always will be.

![A geometric breakdown of the Hoardy crane: eight fold petals radiating from the origami mark, the preliminary fold every form begins from.](/blog/the-bar-for-writing-software-just-fell/origami-fold.png)

Every finished thing is a series of earlier decisions nobody sees. The crane in our mark is folded from a flat square; no one looking at the finished bird thinks about the square, but the square is where the whole thing was decided. Software is no different. The finished product hides the discipline that made it, and that discipline is the entire product.

> The machine can now write the code. It cannot yet decide what is worth building, or hold the finished thing to the standard of the idea.

We built Hoardy around that belief. Not to get work done. There are enough firms that get work done. We are here for the ideas people carry for years before they are ready to say them out loud. We listen until the vision stops being yours on paper and becomes ours in understanding. Then we shape it with the character of the person who imagined it. What ships is not a deliverable. It is a curated piece, a product treated the way an artist treats a canvas.

Rick Rubin wrote that the goal of art is not perfection. The goal is to share who we are and how we see the world. Software, at its best, is exactly that: a way of seeing, given form. He also said the object is not to make art, but to be in that wonderful state. We build to stay in that state, project after project, for the people brave enough to bring something new into existence.

## What this means for founders

If you are a founder reading the hype, here is the practical version. The new tools genuinely lower the cost of a first version. That is real, and it is worth using. What they do not lower is the cost of being wrong in production: broken authentication, a demo that cannot scale, an AI feature that answers confidently from documents it was never allowed to see.

The teams that win the next decade will be the ones that treat AI as a reason to raise their standards, not lower them. They will test what the machine generates, check the numbers across documents, and keep a human accountable for the whole. That is not caution. That is craft.

## Success was never overnight

Every era gets the tool it deserves, and the tool is never the whole story. Success is a vision held daily, and a belief that does not flinch when the work gets quiet. Technology is not a department inside a business. It is the way a business thinks, moves, and matters, and the businesses that last are the ones that treat what they build like it will be seen, used, and remembered.

We are building a company for that long arc: AI-native engineering, web and product development, design, and quality assurance under one accountable team. If you are building something that matters to you, something you would want made with as much care as it was imagined, we would like to understand it before you brief us.

[Start a project](https://hoardy.ai/#contact). We answer within a day.

## Questions founders actually ask

**Is vibe coding production-ready?**

Excellent for prototypes and early versions; dangerous when it is treated as a substitute for engineering discipline. Production-ready software still needs architecture, testing, security review, and someone accountable for the whole.

**What is the difference between vibe coding and agentic engineering?**

Vibe coding generates software from natural-language descriptions, with the human iterating on behaviour. Agentic engineering uses AI agents across the whole lifecycle: writing code, but also testing, reviewing, and maintaining it. One makes a demo; the other maintains a system.

**Does AI-generated code need testing?**

More than human-written code, not less. A model can produce a confident answer that is subtly wrong in ways a human reviewer is more likely to catch, which is exactly why agentic QA exists.

**How does Hoardy guarantee quality on AI-assisted builds?**

Quality is a gate, not a step. Work only merges when the tests, performance budgets, and security checks pass, and a human decides what is ready to ship.

---

Contact: maaz@hoardy.ai · https://hoardy.ai/#contact
