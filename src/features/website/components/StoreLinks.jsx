import { APP_STORE_URL, PLAY_STORE_URL } from "../data";

/** The Play Store / App Store badge pair. Wrapper element is supplied by the caller. */
export default function StoreLinks({ playSrc, playAlt, appSrc, appAlt }) {
  return (
    <>
      <a className="mr-2" target="_blank" rel="noopener noreferrer" href={PLAY_STORE_URL}>
        <img src={playSrc} alt={playAlt} />
      </a>
      <a className="ml-2" target="_blank" rel="noopener noreferrer" href={APP_STORE_URL}>
        <img src={appSrc} alt={appAlt} />
      </a>
    </>
  );
}
