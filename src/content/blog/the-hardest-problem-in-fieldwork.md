---
title: The hardest problem in fieldwork isn't the fieldwork
description: Why planning a day of field visits turns out to be a genuinely hard computer science problem, and what we did about it.
pubDate: 2026-06-25
author: will-faithfull
tags:
  - engineering
  - optimisation
draft: false
---

It's easy, when you build software for a living, to spend your whole week on
process — tickets, reviews, deploys, the standup about the standup. So I'll admit
I was a bit too pleased with myself recently when I got to spend a few days on a
problem that's actually hard. The kind people were writing papers about long
before there were computers fast enough to run the solutions.

Here it is, in plain terms.

We help organisations in water, energy and financial services carry out
fieldwork at scale: visits to addresses, often under a warrant, that have to be
done by the right people, in person, and inside a tight legal window. Imagine a
team with a van and an eight-hour day. In front of them is a list of hundreds,
sometimes thousands, of addresses they could visit. The question sounds simple:

> Which visits should this team do today, and in what order?

It isn't simple. It's probably one of the hardest questions we deal with.

## Why it's hard

Start with just the order. Once you've picked a dozen addresses, finding the
shortest route that visits them all is the [Travelling Salesman Problem](https://en.wikipedia.org/wiki/Travelling_salesman_problem).
It's one of the most studied problems in computer science, because it's much
nastier than it looks. The number of possible routes grows factorially as you
add stops, so it gets out of hand fast. Twenty addresses can be put in order in
more than two quintillion ways. If you could check a billion of them a second,
you'd still be going the best part of a century later.

<svg width="0" height="0" aria-hidden="true" style="position:absolute"><defs>
<symbol id="pin" viewBox="0 0 24 34"><path d="M12 1C6 1 1.5 5.6 1.5 11.4 1.5 19.2 12 33 12 33S22.5 19.2 22.5 11.4C22.5 5.6 18 1 12 1Z"/><circle cx="12" cy="11.5" r="4.1" fill="#fff"/></symbol>
</defs></svg>

<figure class="route-fig">
<svg viewBox="0 0 600 330" role="img" aria-label="A single planned run: six numbered stops visited in the cheapest order as one loop">
  <rect x="1" y="1" width="598" height="328" rx="14" fill="#fff" stroke="var(--line)"/>
  <g stroke="#e7eff0" stroke-width="2">
    <path d="M0 110 H600"/><path d="M0 220 H600"/>
    <path d="M200 0 V330"/><path d="M400 0 V330"/>
  </g>
  <path class="route-line route-draw" style="--len:900" d="M150 150 L246 96 L360 70 L470 120 L500 220 L372 256 Z"/>
  <g>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(150,150)"/>
    <text class="pin-num" x="150" y="140" text-anchor="middle">1</text>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(246,96)"/>
    <text class="pin-num" x="246" y="86" text-anchor="middle">2</text>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(360,70)"/>
    <text class="pin-num" x="360" y="60" text-anchor="middle">3</text>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(470,120)"/>
    <text class="pin-num" x="470" y="110" text-anchor="middle">4</text>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(500,220)"/>
    <text class="pin-num" x="500" y="210" text-anchor="middle">5</text>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(372,256)"/>
    <text class="pin-num" x="372" y="246" text-anchor="middle">6</text>
  </g>
</svg>
<figcaption>One run: the chosen stops, visited in the cheapest order, all fitting inside the working day.</figcaption>
</figure>

And that's the easy half.

We can't get through everything in a day, though. There's almost always more
work than there are hours for it, and not every case carries the same priority
or the same value to the client. So the real question isn't whether a case gets
visited, it's which cases a team takes on a given day, and in what order. Nothing
gets dropped — it's a matter of sequencing the work so the most pressing and most
valuable cases come first.

That changes the problem. It's no longer plain Travelling Salesman, it's one of
the [vehicle routing problems](https://en.wikipedia.org/wiki/Vehicle_routing_problem#VRP_variants):
specifically a prize-collecting route, closer to what's called the orienteering
problem. You're not just looking for the cheapest way to visit a fixed list,
you're choosing how to spend a finite day so the most valuable and most pressing
work gets done first. And "value" isn't one number. It's a trade-off between
things that pull in different directions:

- the priority of the case
- how close it is to a hard legal deadline (a warrant only lasts so long, and if
  it lapses you start the whole thing again)
- how tightly the day's work clusters geographically
- the value of the case to the client

and a few more besides. Push hard on any one of them and the plan gets worse
somewhere else.

Warrant work adds another layer on top of that. A single visit can require three
different field operatives, from three different companies, at the same address
at the same time: a warrant officer, a locksmith, and an engineer to carry out
the work itself. So you're not arranging one team's day, you're coordinating the
availability of three separate organisations against the same route on the same
date. If any one of them can't make it, the visit can't go ahead.

<figure class="route-fig">
<svg viewBox="0 0 600 330" role="img" aria-label="A field of candidate stops; the highest-priority ones are taken onto today's route, the rest are scheduled for later">
  <rect x="1" y="1" width="598" height="328" rx="14" fill="#fff" stroke="var(--line)"/>
  <g stroke="#e7eff0" stroke-width="2">
    <path d="M0 110 H600"/><path d="M0 220 H600"/>
    <path d="M200 0 V330"/><path d="M400 0 V330"/>
  </g>
  <path class="route-line route-draw delay" style="--len:720" d="M168 168 L262 118 L382 104 L468 168 L360 238 Z"/>
  <g>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(168,168)"/>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(262,118)"/>
    <use href="#pin" class="pin-hi" width="30" height="42" x="-15" y="-42" transform="translate(382,104)"/>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(468,168)"/>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(360,238)"/>
  </g>
  <g opacity="0.92">
    <use href="#pin" class="pin-skip" width="22" height="31" x="-11" y="-31" transform="translate(120,86)"/>
    <use href="#pin" class="pin-skip" width="22" height="31" x="-11" y="-31" transform="translate(300,52)"/>
    <use href="#pin" class="pin-skip" width="22" height="31" x="-11" y="-31" transform="translate(520,86)"/>
    <use href="#pin" class="pin-skip" width="22" height="31" x="-11" y="-31" transform="translate(516,266)"/>
    <use href="#pin" class="pin-skip" width="22" height="31" x="-11" y="-31" transform="translate(208,288)"/>
    <use href="#pin" class="pin-skip" width="22" height="31" x="-11" y="-31" transform="translate(96,182)"/>
  </g>
</svg>
<div class="legend">
  <span><i class="swatch" style="background:var(--teal)"></i> on today's run</span>
  <span><i class="swatch" style="background:var(--amber)"></i> high value / urgent</span>
  <span><i class="swatch" style="background:var(--skip)"></i> scheduled for later</span>
</div>
<figcaption>More work than fits one day. The engine takes the highest-priority cases first, and the rest are planned into following days.</figcaption>
</figure>

On top of that there are hard rules you simply can't break: regulated start and
finish times, contractual working hours, the client's own processes and
policies, HSE protections. Break any one of them and the plan isn't just worse,
it's invalid.

So you've got to choose the right subset for a given day from cases with several
competing notions of priority, stay inside the rules, and then solve a famously
hard ordering problem on whatever you chose. And not once: again and again,
because the moment a case settles or cancels the best answer shifts and you want
to replan. Across a whole region. Several times a day.

That's the part I got properly excited about. It's a lovely problem to chew on.

## What we built (and what I'll keep to myself)

I'll keep the inner workings to myself, but the general shape I'm happy to share.

We built a planning engine that knows nothing about warrants, or water, or
energy. It understands the abstract problem — value, time, distance, eligibility,
hard limits — and the domain-specific bits are fed in as configuration. That
matters more than it sounds. The same engine can plan a smart meter installation
campaign, a warrant enforcement round and a maintenance schedule all at once,
each with its own rules, and those rules can be tuned by the people who
understand the work rather than rewritten by engineers every time something
changes.

It isn't tied to a fixed idea of what a good plan looks like, either. We can give
it any number of targets we like and weight them to match what a particular
customer actually values, rather than baking in one notion of "good" and making
everyone live with it.

It plans against real road travel times rather than straight-line distances,
which counts for a lot once there are rivers, motorways and one-way systems in
the way. It finds the genuinely best order for each run, not an approximation of
it. And it doesn't just produce an answer and walk off: it puts a proposed plan
in front of a person, with its reasoning attached, and waits for a yes or no
before anything is committed. The computer does the heavy arithmetic and a human
stays in charge of the decision.

The bit I'm most pleased with is the bit you'll never see. Doing this once, for a
dozen stops, is a student exercise. Doing it across thousands of cases, replanned
many times a day, fast enough that nobody's sat watching a loading spinner:
that's where the actual engineering is, and that's the bit that stays in the
cupboard.

## Why this matters to you

If you're a client, the short version is that you get more of the right work done
in a day for the same cost, and the cases running up against a legal deadline
don't get quietly missed.

If you're one of our field agencies, it means the work that reaches you turns up
already arranged into sensible, geographically coherent days, instead of a pile
of addresses you have to sort out yourselves.

And for me, it was a good reminder of something that's easy to forget when you're
buried in a backlog: there's often a small and genuinely hard problem hiding
underneath otherwise ordinary operational software. Getting to spend a few days
on one is a treat, not a chore.
