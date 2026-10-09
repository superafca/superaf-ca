import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import "./sandbox.css";

type Skin = "default" | "spring" | "summer" | "autumn" | "winter";
const skins: Skin[] = ["default", "spring", "summer", "autumn", "winter"];
const names: Record<Skin, string> = {default:"Future Nostalgia",spring:"Spring / Renewal",summer:"Summer / Electric",autumn:"Autumn / Copper",winter:"Winter / Chrome"};
function seasonal(): Skin { const month = new Date().getMonth(); return month < 2 || month === 11 ? "winter" : month < 5 ? "spring" : month < 8 ? "summer" : "autumn"; }
function Rebuild() {
  const [skin,setSkin] = useState<Skin>("default");
  const [auto,setAuto] = useState(false);
  useEffect(() => {
    try { const saved = window.localStorage.getItem("superaf-sandbox-skin"); if(saved === "auto"){setAuto(true);setSkin(seasonal());}else if(skins.includes(saved as Skin)){setSkin(saved as Skin);} } catch { /* storage optional */ }
  },[]);
  function select(next: Skin | "auto"){setAuto(next==="auto");setSkin(next==="auto"?seasonal():next);try{window.localStorage.setItem("superaf-sandbox-skin",next);}catch{/* storage optional */}}
  return <div className="sa-rebuild" data-skin={skin}>
    <div className="sa-topline"><span>SUPERAF / CALGARY</span><span>THE FUTURE LOOKS BETTER PROTECTED</span><span>DESIGN LAB 001</span></div>
    <header className="sa-nav"><Link to="/sandbox" className="sa-logo" aria-label="SUPERAF sandbox home">SUPER<span>AF</span><b>✳</b></Link><nav aria-label="Main navigation"><a href="#services">SERVICES</a><a href="#studio">OUR STUDIO</a><a href="#seasons">THEME LAB</a></nav><Link to="/estimate" className="sa-nav-cta">GET AN ESTIMATE <span aria-hidden>↗</span></Link></header>
    <main>
      <section className="sa-hero" aria-labelledby="sa-hero-title"><div className="sa-orbit sa-orbit-one"/><div className="sa-orbit sa-orbit-two"/><div className="sa-hero-content"><p className="sa-eyebrow"><span className="sa-dot"/> AUTOMOTIVE FILM STUDIO / YYC</p><h1 id="sa-hero-title">GOOD<br/>LOOKS.<br/><em>BUILT TO</em><br/>LAST<span className="sa-period">.</span></h1><p className="sa-intro">Protection with personality. Paint protection film, window tint and glass protection—applied with precision in Calgary.</p><div className="sa-actions"><Link to="/estimate" className="sa-button">BUILD YOUR ESTIMATE <span>↗</span></Link><a href="#services" className="sa-text-link">EXPLORE THE STUDIO ↓</a></div></div><div className="sa-hero-visual"><div className="sa-image-frame"><img src="/images/box-hero.jpg" alt="SUPERAF automotive film studio product presentation" /></div><div className="sa-visual-tag">FORM + FUNCTION<br/>NO COMPROMISE</div><span className="sa-vertical">S / A / F — EST. CALGARY</span></div><div className="sa-hero-bottom"><span>01 / THE NEW STANDARD</span><span>SCROLL TO DISCOVER ↓</span></div></section>
      <div className="sa-ticker" aria-label="Services"><div>PAINT PROTECTION <span>✳</span> WINDOW TINT <span>✳</span> GLASS PROTECTION <span>✳</span> MADE FOR THE ROAD <span>✳</span></div></div>
      <section className="sa-services" id="services"><div className="sa-section-heading"><p>01 / WHAT WE DO</p><h2>YOUR CAR.<br/><i>OUR CANVAS.</i></h2><span>Technical protection, a little more personality.</span></div><div className="sa-service-grid"><Link to="/ppf" className="sa-service"><span className="sa-num">01 / PROTECT</span><strong>PAINT<br/>PROTECTION</strong><span>PPF designed for the everyday and the extraordinary.</span><b>EXPLORE ↗</b></Link><Link to="/tint" className="sa-service"><span className="sa-num">02 / REFINE</span><strong>WINDOW<br/>TINT</strong><span>Comfort, privacy and a cleaner silhouette.</span><b>EXPLORE ↗</b></Link><Link to="/windshield" className="sa-service"><span className="sa-num">03 / SHIELD</span><strong>GLASS<br/>PROTECTION</strong><span>Extra confidence between you and the road.</span><b>EXPLORE ↗</b></Link></div></section>
      <section className="sa-studio" id="studio"><div><p className="sa-eyebrow">02 / INDEPENDENT BY DESIGN</p><h2>NOT YOUR<br/>AVERAGE<br/><i>FILM SHOP.</i></h2><p>We believe protecting your vehicle should feel as considered as choosing it. Independent craft, modern materials and an eye for the details.</p><Link to="/estimate" className="sa-button">LET'S TALK ABOUT YOUR CAR ↗</Link></div><div className="sa-studio-art"><span className="sa-art-star">✳</span><span>MADE TO<br/>STAND OUT.</span><small>SUPERAF / CALGARY</small></div></section>
      <section className="sa-theme-lab" id="seasons"><div className="sa-section-heading"><p>03 / THEME LAB</p><h2>ALWAYS<br/><i>IN SEASON.</i></h2><span>Same SUPERAF. Different atmosphere. Explore the skins.</span></div><div className="sa-theme-controls" role="group" aria-label="Choose website appearance">{skins.map(s=><button key={s} type="button" className={skin===s&&!auto?"sa-selected":""} aria-pressed={skin===s&&!auto} onClick={()=>select(s)}>{s==="default"?"CORE":s.toUpperCase()}</button>)}<button type="button" className={auto?"sa-selected":""} aria-pressed={auto} onClick={()=>select("auto")}>AUTO ↻</button></div><p className="sa-theme-name">CURRENT SKIN — {names[skin]} {auto?"(AUTOMATIC)":""}</p></section>
      <section className="sa-final"><p>YOUR NEXT MOVE STARTS HERE.</p><h2>MAKE IT<br/>SUPER<span>AF.</span></h2><Link to="/estimate" className="sa-button">GET YOUR ESTIMATE ↗</Link></section>
    </main><footer className="sa-footer"><span>© {new Date().getFullYear()} SUPERAF.CA</span><span>INDEPENDENT AUTOMOTIVE FILM STUDIO / CALGARY</span><Link to="/">CURRENT WEBSITE ↗</Link></footer>
  </div>;
}
export const Route = createFileRoute("/sandbox")({component:Rebuild});
