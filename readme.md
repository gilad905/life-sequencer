## Game of Life Sequencer

This is a step sequencer that uses the algorithm of [John Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) to generate evolving patterns.<br>
The top four rows are a sawtooth synth, the middle four are drum samples and the bottom four are a sine synth.<br>
Clicking on cells will toggle their state, allowing to make live changes to the sequence.

At first glance it might sound pretty random, but after some playing around I find it interesting to listen to "natural" developments.<br>
For example, sometimes periods of calmness or minimal percussion will start. Other times the whole "song" will die out on its own.<br>
Often, there will be gradual changes of melody or beat where you can hear existing patterns repeating but slowly changing with every new bar.<br>
This is especially noticeable with longer evolve intervals (16 and above).

---

Made by Gilad Mayani.

The sequencer was made using the [Tone.js](https://tonejs.github.io/) framework,
also using [Tone.js UI](https://github.com/Tonejs/ui) components and some [audio samples](https://github.com/Tonejs/audio) from their examples.

Source code is available on [GitHub](https://github.com/gilad905/life-sequencer).

[Live Example](https://gilad905.github.io/life-sequencer)
