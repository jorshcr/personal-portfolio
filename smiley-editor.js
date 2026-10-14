(() => {
  function init() {
  const button = document.querySelector('.about-smiley-button');
  if (!button || button.dataset.smileyReady) return;
  button.dataset.smileyReady = 'true';
  const image = button.querySelector('img');
  const key = 'portfolio-about-smiley-v1';
  const defaults = () => ({"strokes": [[[66.7, 83.9], [68.1, 83.9], [70.7, 83.9], [73.7, 83.9], [78.9, 88.0], [80.0, 92.8], [79.6, 96.1], [79.3, 98.4], [75.2, 103.5], [73.7, 105.4], [72.2, 106.1], [70.7, 106.1], [69.3, 105.0], [67.8, 103.5], [66.7, 100.9], [65.9, 98.7], [65.6, 95.8], [65.9, 94.3], [67.0, 92.4], [68.5, 90.9], [69.6, 89.8], [71.1, 90.2], [72.2, 90.6], [73.3, 91.7], [74.4, 93.5], [74.8, 95.0], [74.4, 95.8], [73.3, 97.2], [71.1, 98.4], [69.3, 99.1], [67.4, 99.1], [66.7, 98.7], [67.4, 98.7], [66.7, 98.7], [66.3, 98.4], [65.9, 98.0], [65.6, 97.6], [65.2, 96.9], [66.7, 92.8], [67.0, 92.1]], [[205.6, 86.9], [206.3, 86.5], [208.1, 86.5], [210.4, 86.5], [212.6, 87.2], [214.4, 88.0], [215.6, 89.1], [215.9, 90.6], [211.9, 96.5], [207.8, 99.1], [203.3, 101.3], [199.3, 103.5], [194.4, 105.0], [190.7, 104.7], [188.9, 104.3], [187.8, 103.2], [187.0, 101.7], [187.4, 99.5], [188.5, 96.9], [190.4, 93.2], [193.7, 88.4], [197.0, 85.0], [200.0, 83.5], [202.2, 82.8], [204.1, 82.8], [205.6, 83.5], [206.7, 85.0], [206.7, 88.0], [205.9, 93.2], [203.3, 97.2], [200.7, 99.8], [198.5, 101.7], [197.0, 102.8], [197.8, 102.1], [197.0, 102.4], [196.7, 102.1], [196.3, 101.7], [196.7, 100.9], [197.0, 99.5], [197.8, 98.0], [198.9, 94.7]], [[64.8, 94.3], [65.2, 94.7], [66.3, 96.1], [67.8, 98.0], [68.5, 100.2], [68.5, 102.4], [68.1, 104.3], [67.8, 105.8], [67.0, 106.9], [66.3, 107.2], [65.6, 107.6], [64.8, 107.6], [63.7, 106.9], [63.0, 105.8], [62.2, 104.3], [61.9, 102.4], [61.9, 100.6], [61.9, 98.7], [62.6, 96.9], [63.7, 95.4], [65.2, 93.9], [66.7, 92.8], [68.1, 92.1], [69.6, 92.1], [70.7, 92.1], [72.6, 92.1]], [[101.9, 170.6], [101.9, 172.8], [101.9, 188.7], [103.0, 195.4], [104.4, 200.2], [106.3, 205.4], [108.9, 210.6], [113.0, 214.3], [118.5, 217.2], [125.9, 220.6], [134.1, 223.2], [141.5, 223.9], [148.5, 222.8], [154.4, 219.8], [160.0, 215.0], [165.2, 209.1], [169.3, 200.6], [173.0, 190.2], [175.6, 178.4], [178.1, 166.5], [181.1, 155.8], [181.9, 153.2]]], "size": 70, "roundness": 0, "width": 22, "color": "#dda912"});
  let saved = defaults();
  try {
    const item = JSON.parse(localStorage.getItem(key));
    if (item && Array.isArray(item.strokes)) saved = {...saved,...item};
  } catch {}

  function smooth(points, amount) {
    const radius = Math.round(Number(amount)*10/100);
    if (!radius || points.length < 4) return points;
    return points.map((point,i) => {
      if (i===0 || i===points.length-1) return point;
      const sample = points.slice(Math.max(0,i-radius), Math.min(points.length,i+radius+1));
      return [sample.reduce((n,p)=>n+p[0],0)/sample.length, sample.reduce((n,p)=>n+p[1],0)/sample.length];
    });
  }
  function svg(data) {
    const paths = data.strokes.filter(s=>s.length>1).map(points => {
      const d = smooth(points,data.roundness).map(([x,y],i) => `${i?'L':'M'}${Number(x).toFixed(1)} ${Number(y).toFixed(1)}`).join(' ');
      return `<path d="${d}"/>`;
    }).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280"><g fill="none" stroke="${data.color}" stroke-width="${data.width}" stroke-linecap="round" stroke-linejoin="round">${paths}</g></svg>`;
  }
  function apply(data) {
    image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg(data));
    button.style.setProperty('--about-smiley-size',`${data.size}px`);
  }
  apply(saved);

  button.addEventListener('click', () => {
    const dialog = document.createElement('dialog');
    dialog.className = 'smiley-editor';
    dialog.innerHTML = `<h2>Draw your smiley</h2><p>Draw with your mouse, finger, or stylus. Undo strokes or clear the canvas to start again.</p>
      <canvas width="280" height="280" aria-label="Smiley drawing area"></canvas>
      <div class="smiley-editor-controls">
        <label>Size <input name="size" type="range" min="24" max="96"><output></output></label>
        <label>Roundness <input name="roundness" type="range" min="0" max="100"><output></output></label>
        <label>Line thickness <input name="width" type="range" min="4" max="28"><output></output></label>
        <label>Color <input name="color" type="color"></label>
      </div><div class="smiley-editor-actions"><button type="button" data-action="undo">Undo stroke</button><button type="button" data-action="clear">Clear</button><button type="button" data-action="reset">Reset smiley</button><button type="button" data-action="cancel">Cancel</button><button type="button" data-action="save">Use this smiley</button></div>`;
    document.body.append(dialog);
    const canvas = dialog.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    let draft = structuredClone(saved), active = null;
    const controls = [...dialog.querySelectorAll('.smiley-editor-controls input')];
    controls.forEach(input => {input.value=draft[input.name]; input.addEventListener('input',()=>{draft[input.name]=input.name==='color'?input.value:Number(input.value);render()});});
    function render() {
      ctx.clearRect(0,0,280,280);
      ctx.strokeStyle=draft.color; ctx.lineWidth=draft.width; ctx.lineCap='round'; ctx.lineJoin='round';
      draft.strokes.forEach(points => {
        const line=smooth(points,draft.roundness);
        ctx.beginPath(); line.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();
      });
      controls.forEach(input=>{const output=input.nextElementSibling;if(output?.tagName==='OUTPUT')output.value=input.value+(input.name==='roundness'?'%':'px')});
    }
    function point(event) {
      const rect=canvas.getBoundingClientRect();
      return [Math.max(0,Math.min(280,(event.clientX-rect.left)*280/rect.width)),Math.max(0,Math.min(280,(event.clientY-rect.top)*280/rect.height))];
    }
    canvas.addEventListener('pointerdown',event=>{if(event.button!==0)return;canvas.setPointerCapture(event.pointerId);active=[point(event)];draft.strokes.push(active);render()});
    canvas.addEventListener('pointermove',event=>{if(!active)return;active.push(point(event));render()});
    for(const type of ['pointerup','pointercancel'])canvas.addEventListener(type,()=>{active=null});
    dialog.querySelector('.smiley-editor-actions').addEventListener('click',event=>{
      const action=event.target.dataset.action;
      if(action==='undo')draft.strokes.pop();
      if(action==='clear')draft.strokes=[];
      if(action==='reset') { draft=defaults();controls.forEach(input=>input.value=draft[input.name]); }
      if(action==='cancel')dialog.close();
      if(action==='save') {
        saved=structuredClone(draft);apply(saved);
        try{localStorage.setItem(key,JSON.stringify(saved))}catch{}
        dialog.close();
      }
      render();
    });
    dialog.addEventListener('close',()=>{dialog.remove();button.focus()});
    render();dialog.showModal();
  });
  }
  window.initAboutSmiley = init;
  init();
  document.addEventListener('DOMContentLoaded', init);
})();
