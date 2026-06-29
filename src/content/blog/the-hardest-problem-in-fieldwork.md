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

Most problems in software are wider than they are deep. The job is usually
plugging and wiring things together, or shovelling data from A to B: breadth, not
depth. It's historically been the driver of engineers' collective groan at
data-structures-and-algorithms interview processes, when does anyone actually
*use* this stuff? But on the rare occasion you do come across a real DS&A problem,
it's a treat, for me anyway.

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
<svg viewBox="0 0 600 330" role="img" aria-label="A single planned run: six stops visited in order along the streets">
  <rect x="1" y="1" width="598" height="328" rx="14" fill="#f4f5fb"/>
  <g><path d="M363 -20 Q 385 202 479 350" stroke="#eef0f7" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-20 111 Q 244 145 620 263" stroke="#eef0f7" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-20 144 Q 319 173 620 48" stroke="#eef0f7" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M96 -20 Q 80 177 527 350" stroke="#eef0f7" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M270 -20 Q 281 187 337 350" stroke="#eef0f7" stroke-width="5" fill="none" stroke-linecap="round"/></g>
  <g transform="translate(-103,-19)">
  <path d="M-20 312 C 120 303 240 326 360 312 C 460 306 540 318 620 312" stroke="#d9e3fb" stroke-width="11" fill="none" stroke-linecap="round"/>
  <g fill="#ececf5"><rect x="435" y="130" width="56" height="56" rx="8" transform="rotate(-3.2 463 158)"/><rect x="138" y="170" width="49" height="45" rx="8" transform="rotate(5.3 163 192)"/><rect x="390" y="35" width="83" height="43" rx="8" transform="rotate(0.1 432 57)"/><rect x="113" y="176" width="85" height="57" rx="8" transform="rotate(-6.7 155 204)"/></g>
  <g><path d="M479 238 Q 440 252 399 262" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M479 238 Q 500 196 527 158" stroke="#e2e2ee" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M479 238 Q 480 170 473 102" stroke="#e2e2ee" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M96 103 Q 148 94 197 74" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M96 103 Q 86 156 77 210" stroke="#e2e2ee" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M326 205 Q 300 233 279 266" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M326 205 Q 296 173 286 131" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M221 183 Q 248 150 286 131" stroke="#e2e2ee" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M221 183 Q 198 224 180 267" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M221 183 Q 253 222 279 266" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M197 74 Q 243 100 286 131" stroke="#e2e2ee" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M473 102 Q 497 133 527 158" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M473 102 Q 433 122 390 134" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M473 102 Q 411 86 350 67" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M279 266 Q 230 280 180 267" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M527 158 Q 456 157 390 134" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M390 134 Q 375 98 350 67" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M390 134 Q 362 173 326 205" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M180 267 Q 125 244 77 210" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M77 210 Q 150 204 221 183" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M350 67 Q 327 108 286 131" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M399 262 Q 371 223 326 205" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M399 262 Q 339 265 279 266" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M479 238 Q 524 253 620 250" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M479 238 Q 489 283 459 350" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M96 103 Q 51 101 -20 84" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M96 103 Q 111 58 111 -20" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M197 74 Q 181 29 193 -20" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M473 102 Q 518 104 620 115" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M473 102 Q 458 57 485 -20" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M527 158 Q 572 170 620 137" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M350 67 Q 356 22 350 -20" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M399 262 Q 404 307 400 350" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/></g>
  <g><path d="M479 238 Q 500 196 527 158" stroke="#dcdcec" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M326 205 Q 300 233 279 266" stroke="#dcdcec" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M473 102 Q 497 133 527 158" stroke="#dcdcec" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M473 102 Q 433 122 390 134" stroke="#dcdcec" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M390 134 Q 362 173 326 205" stroke="#dcdcec" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
  <path class="route-line route-draw" style="--len:436" d="M479 238 Q 500 196 527 158 Q 497 133 473 102 Q 433 122 390 134 Q 362 173 326 205 Q 300 233 279 266"/>
  <g><use href="#pin" class="pin-route" width="17" height="24" x="-8.5" y="-24" transform="translate(479,238)"/><text class="pin-num" x="479" y="212" text-anchor="middle">1</text><use href="#pin" class="pin-route" width="17" height="24" x="-8.5" y="-24" transform="translate(527,158)"/><text class="pin-num" x="527" y="132" text-anchor="middle">2</text><use href="#pin" class="pin-route" width="17" height="24" x="-8.5" y="-24" transform="translate(473,102)"/><text class="pin-num" x="473" y="76" text-anchor="middle">3</text><use href="#pin" class="pin-route" width="17" height="24" x="-8.5" y="-24" transform="translate(390,134)"/><text class="pin-num" x="390" y="108" text-anchor="middle">4</text><use href="#pin" class="pin-route" width="17" height="24" x="-8.5" y="-24" transform="translate(326,205)"/><text class="pin-num" x="326" y="179" text-anchor="middle">5</text><use href="#pin" class="pin-route" width="17" height="24" x="-8.5" y="-24" transform="translate(279,266)"/><text class="pin-num" x="279" y="240" text-anchor="middle">6</text></g>
  </g>
</svg>
<figcaption>One run: the chosen stops, visited in the most-efficient order, all fitting inside the working day.</figcaption>
</figure>

And that's the easy half.

We can't get through everything in a day, though. There's almost always more
work than there are hours for it, and not every case carries the same priority
or the same value to the client. So the real question isn't whether a case gets
visited, it's which cases a team takes on a given day, and in what order. Nothing
gets dropped; it's a matter of sequencing the work so the most pressing and most
valuable cases come first.

That changes the problem. It's no longer plain Travelling Salesman, it's one of
the [vehicle routing problems](https://en.wikipedia.org/wiki/Vehicle_routing_problem#VRP_variants):
specifically a prize-collecting route, closer to what's called the orienteering
problem. You're not just looking for the most-efficient way to visit a fixed list,
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
<svg viewBox="0 0 600 330" role="img" aria-label="A field of candidate stops; the highest-priority ones are taken onto today’s route, the rest are scheduled for later">
  <rect x="1" y="1" width="598" height="328" rx="14" fill="#f4f5fb"/>
  <path d="M-20 51 C 120 42 240 72 360 51 C 460 40 540 64 620 51" stroke="#d9e3fb" stroke-width="11" fill="none" stroke-linecap="round"/>
  <g fill="#ececf5"><rect x="183" y="196" width="66" height="55" rx="8" transform="rotate(5.8 216 223)"/><rect x="255" y="108" width="78" height="57" rx="8" transform="rotate(-2.9 294 137)"/><rect x="133" y="109" width="62" height="50" rx="8" transform="rotate(0.7 164 135)"/><rect x="187" y="155" width="53" height="57" rx="8" transform="rotate(6.4 213 184)"/></g>
  <g><path d="M85 164 Q 124 190 154 227" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M85 164 Q 66 115 69 63" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M85 164 Q 135 120 175 66" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M69 63 Q 122 68 175 66" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M69 63 Q 145 96 222 126" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M286 69 Q 256 99 222 126" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M286 69 Q 230 72 175 66" stroke="#e2e2ee" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M286 69 Q 342 56 398 64" stroke="#e2e2ee" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M222 126 Q 247 155 266 188" stroke="#e2e2ee" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M222 126 Q 202 93 175 66" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M345 178 Q 306 190 266 188" stroke="#e2e2ee" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M345 178 Q 331 220 342 263" stroke="#e2e2ee" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M345 178 Q 390 201 439 209" stroke="#e2e2ee" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M513 248 Q 475 230 439 209" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M513 248 Q 488 181 467 113" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M513 248 Q 428 263 342 263" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M154 227 Q 206 242 255 265" stroke="#e2e2ee" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M154 227 Q 212 212 266 188" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M398 64 Q 433 87 467 113" stroke="#e2e2ee" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M398 64 Q 363 117 345 178" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M467 113 Q 448 160 439 209" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M467 113 Q 403 139 345 178" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M342 263 Q 299 265 255 265" stroke="#e2e2ee" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M342 263 Q 311 218 266 188" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M255 265 Q 249 225 266 188" stroke="#e9e9f3" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M85 164 Q 40 170 -20 184" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M513 248 Q 558 248 620 227" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M513 248 Q 517 293 512 350" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M154 227 Q 158 272 150 350" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M398 64 Q 385 19 419 -20" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M467 113 Q 457 68 461 -20" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M342 263 Q 344 308 323 350" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M175 66 Q 181 21 190 -20" stroke="#e7e7f1" stroke-width="6" fill="none" stroke-linecap="round"/></g>
  <g><path d="M345 178 Q 306 190 266 188" stroke="#dcdcec" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M154 227 Q 206 242 255 265" stroke="#dcdcec" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M398 64 Q 363 117 345 178" stroke="#dcdcec" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M342 263 Q 299 265 255 265" stroke="#dcdcec" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M342 263 Q 311 218 266 188" stroke="#dcdcec" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
  <path class="route-line route-draw delay" style="--len:511" d="M154 227 Q 206 242 255 265 Q 299 265 342 263 Q 311 218 266 188 Q 306 190 345 178 Q 363 117 398 64"/>
  <g><use href="#pin" class="pin-route" width="17" height="24" x="-8.5" y="-24" transform="translate(154,227)"/><use href="#pin" class="pin-route" width="17" height="24" x="-8.5" y="-24" transform="translate(255,265)"/><use href="#pin" class="pin-hi" width="34" height="47" x="-17" y="-47" transform="translate(342,263)"/><use href="#pin" class="pin-route" width="17" height="24" x="-8.5" y="-24" transform="translate(266,188)"/><use href="#pin" class="pin-route" width="17" height="24" x="-8.5" y="-24" transform="translate(345,178)"/><use href="#pin" class="pin-route" width="17" height="24" x="-8.5" y="-24" transform="translate(398,64)"/></g><g opacity="0.92"><use href="#pin" class="pin-skip" width="14" height="20" x="-7" y="-20" transform="translate(85,164)"/><use href="#pin" class="pin-skip" width="14" height="20" x="-7" y="-20" transform="translate(69,63)"/><use href="#pin" class="pin-skip" width="14" height="20" x="-7" y="-20" transform="translate(286,69)"/><use href="#pin" class="pin-skip" width="14" height="20" x="-7" y="-20" transform="translate(222,126)"/><use href="#pin" class="pin-skip" width="14" height="20" x="-7" y="-20" transform="translate(513,248)"/><use href="#pin" class="pin-skip" width="14" height="20" x="-7" y="-20" transform="translate(467,113)"/></g>
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
energy. It understands the abstract problem (value, time, distance, eligibility,
hard limits), and the domain-specific bits are fed in as configuration. That
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

And for me, it's a reminder of why a formal computer science education isn't
necessarily a waste of time in this profession. It can give you the tools to
recognise the formal shape of certain problem classes, an intuition that has
become supremely powerful in the age of AI.
