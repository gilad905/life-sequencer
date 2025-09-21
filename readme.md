## Game of Life Sequencer

This is a step sequencer that uses the algorithm of [John Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) to generate evolving patterns.

- The top four rows are a sawtooth synth.
- The middle four rows are drum samples.
- The bottom four rows are a sine synth.

Clicking on cells will toggle their state, allowing live changes to the sequence.

At first glance, it might sound random, but after some experimentation, you'll notice "natural" developments. For example, periods of calmness or minimal percussion may start, or the whole "song" might die out on its own. Often, there are gradual changes in melody or beat, where existing patterns repeat but slowly change with each new bar. This is especially noticeable with longer evolve intervals (16 and above).

---

Made by Gilad Mayani.

The sequencer was built with the [Tone.js](https://tonejs.github.io/) framework, also using [Tone.js UI](https://github.com/Tonejs/ui) components and some [audio samples](https://github.com/Tonejs/audio) from their examples.

Source code is available on [GitHub](https://github.com/gilad905/life-sequencer).
