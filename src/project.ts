import { parser } from "@lezer/javascript";
import { Code, LezerHighlighter } from "@motion-canvas/2d";
import { makeProject } from "@motion-canvas/core";

import audio from "./assets/audio/Variables.mp3";
import assignment from "./scenes/assignment?scene";
import datatypes from "./scenes/datatypes?scene";
import expressions from "./scenes/expressions?scene";
import reassignment from "./scenes/reassignment?scene";
import recap from "./scenes/recap?scene";

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [assignment, expressions, reassignment, datatypes, recap],
  audio: audio,
});
