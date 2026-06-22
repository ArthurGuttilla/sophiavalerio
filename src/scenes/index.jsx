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
import ChecklistScene from "./ChecklistScene.jsx";
import AnniversaryScene from "./AnniversaryScene.jsx";
import ReunionScene from "./ReunionScene.jsx";
import GalleryScene from "./GalleryScene.jsx";
import BoxingScene from "./BoxingScene.jsx";
import BoardingScene from "./BoardingScene.jsx";
import ResetScene from "./ResetScene.jsx";
import WineScene from "./WineScene.jsx";
import SecretScene from "./SecretScene.jsx";
import BallScene from "./BallScene.jsx";
import TripScene from "./TripScene.jsx";

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
  checklist: ChecklistScene,
  anniversary: AnniversaryScene,
  reunion: ReunionScene,
  gallery: GalleryScene,
  boxing: BoxingScene,
  boarding: BoardingScene,
  reset: ResetScene,
  wine: WineScene,
  secret: SecretScene,
  ball: BallScene,
  trip: TripScene,
  game: GameScene,
  market: (props) => <AmbientScene {...props} preset="market" />,
  coffee: (props) => <AmbientScene {...props} preset="coffee" />,
  italian: (props) => <AmbientScene {...props} preset="italian" />,
};
