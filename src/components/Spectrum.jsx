import { COMFORT_LEVELS, UNSURE } from "../data/content";

// A discrete choice along a spectrum. Not cumulative, not a score.
// value is a level string, UNSURE, or "".
export default function Spectrum({ value, onChange }) {
  const isUnsure = value === UNSURE;
  const idx = COMFORT_LEVELS.indexOf(value);

  return (
    <div>
      <div className="spectrum" role="radiogroup" aria-label="Comfort level">
        <div className="spectrum-line" />
        <div className="spectrum-nodes">
          {COMFORT_LEVELS.map((level, i) => (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={!isUnsure && i === idx}
              aria-label={level}
              className={"node" + (!isUnsure && i === idx ? " on" : "")}
              onClick={() => onChange(level)}
            />
          ))}
        </div>
      </div>
      <div className="anchor-row">
        <span>{COMFORT_LEVELS[0]}</span>
        <span>{COMFORT_LEVELS[COMFORT_LEVELS.length - 1]}</span>
      </div>
      <div className="row-between" style={{ marginTop: 8 }}>
        <span className="now">{value ? `Now: ${value}` : "Not set yet"}</span>
        <button
          type="button"
          className="unsure"
          aria-pressed={isUnsure}
          onClick={() => onChange(isUnsure ? "" : UNSURE)}
        >
          {UNSURE}
        </button>
      </div>
    </div>
  );
}
