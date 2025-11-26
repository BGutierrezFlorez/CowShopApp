export function notificarRolUI(msg, color = '#0d6efd') {
  const d = document.createElement('div');
  d.textContent = msg;
  Object.assign(d.style, {
    position:'fixed',bottom:'20px',right:'20px',background:color,color:'#fff',
    padding:'10px 16px',borderRadius:'6px',fontSize:'13px',zIndex:9999
  });
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),2600);
}
