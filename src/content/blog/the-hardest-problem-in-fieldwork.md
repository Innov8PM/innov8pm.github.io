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
  <rect x="1" y="1" width="598" height="328" rx="14" fill="#f3f6fb"/>
  <g fill="#e9eef6">
    <rect x="216" y="150" width="92" height="56" rx="10" transform="rotate(-5 262 178)"/>
    <rect x="340" y="138" width="96" height="52" rx="10" transform="rotate(4 388 164)"/>
    <rect x="48" y="48" width="84" height="50" rx="10" transform="rotate(-3 90 73)"/>
    <rect x="512" y="150" width="62" height="64" rx="10" transform="rotate(6 543 182)"/>
  </g>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-20 60 C 90 76 168 54 250 74 C 320 92 372 70 440 72" stroke="#e9eef6" stroke-width="6"/>
    <path d="M60 350 C 92 300 120 274 150 252" stroke="#e9eef6" stroke-width="6"/>
    <path d="M-20 200 C 110 184 196 224 300 206 C 404 188 512 216 620 192" stroke="#e9eef6" stroke-width="6"/>
    <path d="M250 -20 C 250 26 234 52 206 76" stroke="#edf1f8" stroke-width="5"/>
    <path d="M40 -20 C 54 70 40 150 72 248" stroke="#edf1f8" stroke-width="5"/>
    <path d="M520 350 C 526 304 502 282 472 266" stroke="#edf1f8" stroke-width="5"/>
    <path d="M360 300 C 396 286 420 264 432 236" stroke="#edf1f8" stroke-width="5"/>
    <path d="M-20 252 C 60 246 96 238 132 248" stroke="#edf1f8" stroke-width="4"/>
    <path d="M182 140 C 120 152 60 138 -20 150" stroke="#e2e8f2" stroke-width="8"/>
    <path d="M300 90 C 298 56 306 26 300 -20" stroke="#e2e8f2" stroke-width="8"/>
    <path d="M430 132 C 492 120 560 132 620 118" stroke="#e2e8f2" stroke-width="8"/>
    <path d="M500 236 C 506 276 498 316 506 350" stroke="#e2e8f2" stroke-width="8"/>
    <path d="M-20 322 C 110 308 240 334 360 318 C 460 306 540 328 620 314" stroke="#d7edf0" stroke-width="11" opacity="0.7"/>
    <path d="M110 255 C 116 214 120 184 130 150 C 150 130 200 122 240 120 C 270 118 262 176 250 215 C 296 206 344 196 380 180 C 414 162 446 130 470 100 C 512 150 520 232 470 270 C 380 300 198 302 110 255" stroke="#dbe3ee" stroke-width="11"/>
  </g>
  <path class="route-line route-draw" style="--len:1180" d="M110 255 C 116 214 120 184 130 150 C 150 130 200 122 240 120 C 270 118 262 176 250 215 C 296 206 344 196 380 180 C 414 162 446 130 470 100 C 512 150 520 232 470 270 C 380 300 198 302 110 255"/>
  <g>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(110,255)"/>
    <text class="pin-num" x="110" y="235" text-anchor="middle">1</text>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(130,150)"/>
    <text class="pin-num" x="130" y="130" text-anchor="middle">2</text>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(240,120)"/>
    <text class="pin-num" x="240" y="100" text-anchor="middle">3</text>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(250,215)"/>
    <text class="pin-num" x="250" y="195" text-anchor="middle">4</text>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(380,180)"/>
    <text class="pin-num" x="380" y="160" text-anchor="middle">5</text>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(470,100)"/>
    <text class="pin-num" x="470" y="80" text-anchor="middle">6</text>
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
  <rect x="1" y="1" width="598" height="328" rx="14" fill="#f3f6fb"/>
  <g fill="#e9eef6">
    <rect x="300" y="170" width="92" height="56" rx="10" transform="rotate(7 346 198)"/>
    <rect x="150" y="58" width="78" height="48" rx="10" transform="rotate(-8 189 82)"/>
    <rect x="430" y="56" width="96" height="52" rx="10" transform="rotate(5 478 82)"/>
    <rect x="56" y="250" width="80" height="60" rx="10" transform="rotate(-5 96 280)"/>
  </g>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-20 70 C 150 120 340 210 620 280" stroke="#e2e8f2" stroke-width="9"/>
    <path d="M150 -20 C 180 110 300 220 360 350" stroke="#e9eef6" stroke-width="6"/>
    <path d="M620 60 C 500 96 440 150 410 210" stroke="#e9eef6" stroke-width="6"/>
    <path d="M260 120 C 264 84 256 48 262 -20" stroke="#edf1f8" stroke-width="5"/>
    <path d="M400 150 C 470 140 540 150 620 138" stroke="#e2e8f2" stroke-width="8"/>
    <path d="M200 200 C 150 214 96 206 -20 220" stroke="#edf1f8" stroke-width="5"/>
    <path d="M440 250 C 446 286 470 312 540 330" stroke="#edf1f8" stroke-width="5"/>
    <path d="M-20 200 C 60 244 110 300 150 350" stroke="#d7edf0" stroke-width="12" opacity="0.7"/>
    <path d="M110 260 C 150 240 178 222 200 200 C 226 174 240 144 260 120 C 308 132 360 138 400 150 C 440 162 452 210 440 250 C 380 280 220 290 110 260" stroke="#dbe3ee" stroke-width="11"/>
  </g>
  <path class="route-line route-draw delay" style="--len:870" d="M110 260 C 150 240 178 222 200 200 C 226 174 240 144 260 120 C 308 132 360 138 400 150 C 440 162 452 210 440 250 C 380 280 220 290 110 260"/>
  <g>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(110,260)"/>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(200,200)"/>
    <use href="#pin" class="pin-hi" width="30" height="42" x="-15" y="-42" transform="translate(260,120)"/>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(400,150)"/>
    <use href="#pin" class="pin-route" width="26" height="37" x="-13" y="-37" transform="translate(440,250)"/>
  </g>
  <g opacity="0.92">
    <use href="#pin" class="pin-skip" width="22" height="31" x="-11" y="-31" transform="translate(330,62)"/>
    <use href="#pin" class="pin-skip" width="22" height="31" x="-11" y="-31" transform="translate(470,108)"/>
    <use href="#pin" class="pin-skip" width="22" height="31" x="-11" y="-31" transform="translate(525,196)"/>
    <use href="#pin" class="pin-skip" width="22" height="31" x="-11" y="-31" transform="translate(360,305)"/>
    <use href="#pin" class="pin-skip" width="22" height="31" x="-11" y="-31" transform="translate(74,190)"/>
    <use href="#pin" class="pin-skip" width="22" height="31" x="-11" y="-31" transform="translate(180,300)"/>
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
