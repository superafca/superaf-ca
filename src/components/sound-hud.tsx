import { useEffect, useState } from "react";
import { sfxClick, sfxEnabled, sfxSetEnabled, sfxUnlock } from "@/lib/sfx";
import { lofiEnabled, lofiHold, lofiSetEnabled } from "@/lib/lofi";

export function SoundHud() {
  const [voice, setVoice] = useState(false);
  const [bed, setBed] = useState(false);

  useEffect(() => {
    setVoice(sfxEnabled());
    setBed(lofiEnabled());
    const resume = () => {
      if (lofiEnabled()) lofiSetEnabled(true);
    };
    window.addEventListener("pointerdown", resume);
    return () => {
      window.removeEventListener("pointerdown", resume);
      lofiHold();
    };
  }, []);

  return (
    <div className="sound-hud">
      <button
        type="button"
        className={voice ? "is-on" : undefined}
        aria-pressed={voice}
        onClick={() => {
          const next = !voice;
          sfxUnlock();
          sfxSetEnabled(next);
          setVoice(next);
          if (next) sfxClick();
        }}
      >
        {voice ? "SOUND ON" : "SOUND OFF"}
      </button>
      <button
        type="button"
        className={bed ? "is-on" : undefined}
        aria-pressed={bed}
        onClick={() => {
          const next = !bed;
          sfxUnlock();
          lofiSetEnabled(next);
          setBed(next);
        }}
      >
        ♪ LO-FI
      </button>
    </div>
  );
}
