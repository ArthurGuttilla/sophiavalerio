import StarfieldScene from "./StarfieldScene.jsx";
import PianoScene from "./PianoScene.jsx";
import VinylScene from "./VinylScene.jsx";
import StoryScene from "./StoryScene.jsx";
import KissScene from "./KissScene.jsx";
import OceanScene from "./OceanScene.jsx";
import AgendaScene from "./AgendaScene.jsx";
import AiScene from "./AiScene.jsx";
import ChatScene from "./ChatScene.jsx";
import GameScene from "./GameScene.jsx";
import AmbientScene from "./AmbientScene.jsx";
import PromiseScene from "./PromiseScene.jsx";

// Registry: a date's `scene` field maps to one of these bespoke experiences.
// Dates without a `scene` fall back to the default layout.
export const SCENES = {
  starfield: StarfieldScene,
  piano: PianoScene,
  vinyl: VinylScene,
  story: StoryScene,
  kiss: KissScene,
  ocean: OceanScene,
  agenda: AgendaScene,
  ai: AiScene,
  chat: ChatScene,
  promise: PromiseScene,
  game: GameScene,
  market: (props) => <AmbientScene {...props} preset="market" />,
  coffee: (props) => <AmbientScene {...props} preset="coffee" />,
  italian: (props) => <AmbientScene {...props} preset="italian" />,
};
