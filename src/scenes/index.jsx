import StarfieldScene from "./StarfieldScene.jsx";
import PianoScene from "./PianoScene.jsx";
import VinylScene from "./VinylScene.jsx";

// Registry: a date's `scene` field maps to one of these bespoke experiences.
// Dates without a `scene` fall back to the default layout.
export const SCENES = {
  starfield: StarfieldScene,
  piano: PianoScene,
  vinyl: VinylScene,
};
