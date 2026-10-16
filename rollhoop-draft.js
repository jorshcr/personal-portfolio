// Draft project loaded only by the local development preview.
(() => {
  if (!['localhost', '127.0.0.1'].includes(location.hostname)) return;
  const name = 'Formula Electric Roll Hoop PCB';
  function init() {
    const projects = document.querySelector('.home-projects');
    if (!projects || document.getElementById('rollhoop-pcb')) return;
    window.projectGallerySlides[name] = [
      {src:'assets/rollhoop/rollhoop-angle-1.png',alt:'Top-down KiCad render of the local Roll Hoop PCB showing the component layout and both DTM connectors',caption:'Top-down view · component layout',contain:true},
      {src:'assets/rollhoop/rollhoop-angle-2.png',alt:'Oblique KiCad render showing the DTM connector housings and board depth',caption:'Angled view · connectors and board depth; some connector 3D models unavailable',contain:true},
      {src:'assets/rollhoop/usc-formula-electric-rollhoop.png',alt:'USC Formula Electric 2025 car with the main roll hoop behind the driver seat circled in red',caption:'Roll hoop location · USC Formula Electric 2025 photo, annotated',contain:true}
    ];
    const card = document.createElement('article');
    card.className = 'portfolio-project';
    card.id = 'rollhoop-pcb';
    card.innerHTML = `<div class="project-image-placeholder" role="img" aria-label="Formula Electric Roll Hoop PCB image to be added"></div>
      <div class="project-copy"><h2>Formula Electric Roll Hoop PCB</h2>
      <div class="project-skills" aria-label="Skills and tools"><span>KiCad</span><span>PCB Design</span><span>STM32</span><span>CAN</span><span>Power Electronics</span></div>
      <p class="project-overview">Designed a compact, two-layer roll hoop PCB for USC Formula Electric, bringing together an STM32 controller, CAN interface, shutdown-circuit connections, and indicator and buzzer outputs.</p>
      <div class="project-expansion-row"><details class="project-expansion"><summary><span class="expand-label">Read more...</span><span class="collapse-label">Show less</span></summary>
      <div class="project-expanded-content"><p><strong>Problem / Inspiration:</strong> Bring the roll hoop's electrical connections and control electronics onto one compact board, with interfaces to the dashboard, shutdown switches, indicators, and buzzers.</p>
      <p><strong>Contributions:</strong> Designed the schematic and PCB layout in KiCad. The local design combines an STM32C011F4 microcontroller, an SN65HVD230 CAN transceiver with filtering and protection, 12 V input protection and 3.3 V regulation, and MOSFET output stages. Routed the circuitry on a 106.67 × 36 mm, two-layer board with two 12-pin DTM connectors and six 2-pin Molex connections.</p>
      <p><strong>Results / Outcomes:</strong> Created the schematic and routed PCB design, with revisions preserved in the local project. These images are CAD renders of that design. Fabrication, bring-up, and vehicle-testing results are still to be added to this draft.</p></div></details><div class="project-links" aria-label="Project links"></div></div></div>`;
    const idZero = projects.querySelector('#id-0-agentic-hardware-robot');
    projects.insertBefore(card, idZero);
    window.initProjectGalleries?.();
  }
  init();
  new MutationObserver(init).observe(document.body, {childList:true});
})();
