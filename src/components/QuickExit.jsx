import { IconExit } from "./Icons";

// A safety affordance: leave the app immediately for a neutral site.
// Replaces history so a Back button does not return here.
export default function QuickExit() {
  function leave() {
    try {
      window.location.replace("https://weather.com");
    } catch {
      window.location.href = "https://weather.com";
    }
  }
  return (
    <button className="quick-exit" onClick={leave} aria-label="Quickly leave this site">
      <IconExit /> Quick exit
    </button>
  );
}
