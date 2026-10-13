import { FluidField, paintLiquidSource } from './vendor/asciify-fluid.js';
// Asciify fluid source with a lightweight light-palette glyph renderer.
const host=document.createElement('div');host.className='site-wave';host.setAttribute('aria-hidden','true');
const canvas=document.createElement('canvas');host.append(canvas);document.body.prepend(host);
const ctx=canvas.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const fontSize=9,cellWidth=6,cellHeight=11,speed=.7,cursorStrength=.12;
let width,height,cols,rows,pixels,flow,time=12,last=0,raf=0;
const chars=' .:+-=xICA$FY#@';
function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);cols=Math.ceil(width/cellWidth);rows=Math.ceil(height/cellHeight);pixels=new Uint8ClampedArray(cols*rows*4);flow=new FluidField(width/height,5);draw();}
function draw(){
 const softFlow={get active(){return flow.active},sample(x,y,out){flow.sample(x,y,out);out[0]*=cursorStrength;out[1]*=cursorStrength;out[2]*=cursorStrength}};
 paintLiquidSource(pixels,cols,rows,width/height,time,softFlow);
 ctx.clearRect(0,0,width,height);ctx.font=`${fontSize}px monospace`;ctx.textBaseline='top';
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const light=pixels[(y*cols+x)*4]/255;const glyph=chars[Math.min(chars.length-1,Math.floor(light*chars.length))];if(glyph===' ')continue;ctx.fillStyle='#ffffff';ctx.fillText(glyph,x*cellWidth,y*cellHeight);}
}
function frame(now){raf=0;if(document.hidden||reduced.matches){last=0;return;}if(now-last>=50){const dt=last?Math.min(.1,(now-last)/1000):0;time+=dt*speed;flow.step(dt);draw();last=now;}raf=requestAnimationFrame(frame);}
function sync(){cancelAnimationFrame(raf);last=0;if(reduced.matches) {flow.clear();draw();}else if(!document.hidden)raf=requestAnimationFrame(frame);}
window.addEventListener('pointermove',e=>{if(!reduced.matches)flow.move(e.clientX/width,e.clientY/height)},{passive:true});
document.addEventListener('pointerleave',()=>flow.leave());
window.addEventListener('resize',resize);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
resize();sync();
