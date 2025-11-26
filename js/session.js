// session.js
// Manejo común de sesión: lee token/nombre desde localStorage, actualiza header y user-card, y mantiene contador del carrito.
(function(){
  function parseJwtPayload(token){
    try{
      const parts = token.split('.'); if(parts.length!==3) return null;
      const payload = parts[1].replace(/-/g,'+').replace(/_/g,'/');
      const decoded = atob(payload);
      const uri = decodeURIComponent(decoded.split('').map(function(c){ return '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2); }).join(''));
      return JSON.parse(uri);
    }catch(e){ return null; }
  }

  function getCartCount(){
    try{
      const arr = JSON.parse(localStorage.getItem('cowShopCart')||'[]');
      if(!Array.isArray(arr)) return 0;
      return arr.reduce((s,i)=>s + (i.quantity||1), 0);
    }catch(e){ return 0; }
  }

  function updateCartBadge(){
    const el = document.querySelector('.cart-count');
    if(!el) return;
    const total = getCartCount();
    el.textContent = total;
    el.style.display = total>0 ? 'inline-block' : 'none';
  }

  function debugLog(...args){
    try{ if(window.console && console.debug) console.debug('[session]', ...args); }catch(e){}
  }

  // Determine API base URL. If the page sets window.COWSHOP_API_BASE, use it.
  // Otherwise, if the page is served over http(s) assume same origin + /api, else fall back to localhost backend.
  const API_BASE = (function(){
    if(window.COWSHOP_API_BASE) return window.COWSHOP_API_BASE.replace(/\/+$/,'');
    try{
      if(location && (location.protocol === 'http:' || location.protocol === 'https:')){
        return `${location.protocol}//${location.host}/api`;
      }
    }catch(e){}
    return 'http://localhost:5000/api';
  })();
  debugLog('API_BASE set to', API_BASE);

  function createHeaderUserLink(displayName, initials, roleText){
    const headerAuth = document.getElementById('header-auth');
    if(!headerAuth) return null;
    let link = document.getElementById('headerUserLink');
    if(!link){
      link = document.createElement('a');
      link.id = 'headerUserLink';
      link.className = 'btn btn-outline-light ms-2 d-flex align-items-center';
      link.style.gap = '8px';
      headerAuth.appendChild(link);
    }
    link.innerHTML = `<span class="header-avatar">${initials}</span><span class="d-none d-md-inline">${displayName}</span> <span class="badge bg-secondary ms-2 d-none d-md-inline">${roleText||'—'}</span>`;
    link.href = 'paneldeusuario.html';
    return link;
  }

  function removeHeaderUserLink(){
    const link = document.getElementById('headerUserLink');
    if(link) link.remove();
  }

  function showUserCard(profile){
    const card = document.getElementById('userCard');
    if(!card) return;
    const nameEl = document.getElementById('uc-name');
    const emailEl = document.getElementById('uc-email');
    const roleEl = document.getElementById('uc-role');
    const avatarEl = document.getElementById('uc-avatar');
    if(nameEl) nameEl.textContent = profile.Nombre || profile.displayName || 'Usuario';
    if(emailEl) emailEl.textContent = profile.Correo || profile.email || '';
    if(roleEl) roleEl.textContent = 'Rol: ' + (profile.Tipo_Usuario || profile.rol || '—');
    if(avatarEl){
      const initials = ( (profile.Nombre||profile.displayName||'U').split(' ').slice(0,2).map(n=>n[0]).join('') || 'U').toUpperCase();
      avatarEl.textContent = initials;
    }
    card.classList.remove('d-none');
  }

  function hideUserCard(){
    const card = document.getElementById('userCard');
    if(!card) return;
    card.classList.add('d-none');
  }

  function doLogout(){
    localStorage.removeItem('cowshop_token');
    localStorage.removeItem('cowshop_user_name');
    // Optionally clear cart or keep it
    // localStorage.removeItem('cowShopCart');
    // Notify other tabs
    try{ localStorage.setItem('cowshop_logout_ts', Date.now().toString()); }catch(e){}
    // Redirect to login
    window.location.href = 'login.html';
  }

  async function tryFetchProfile(userId, token){
    // Try multiple API bases to be resilient when the backend is at a different port
    const candidates = [API_BASE, 'http://localhost:5000/api', 'https://localhost:44349/api', 'http://127.0.0.1:5000/api'];
    for(const base of candidates){
      try{
        if(!base) continue;
        const url = `${base.replace(/\/+$/,'')}/usuario/${userId}`;
        debugLog('trying profile URL', url);
        const resp = await fetch(url, { headers: { 'Accept':'application/json', 'Authorization':'Bearer '+token } });
        debugLog('response status from', url, resp.status);
        if(resp.ok){
          const json = await resp.json();
          debugLog('profile fetched from', url, json);
          return json;
        }
        // If 404 or other, continue to next candidate
      }catch(err){
        debugLog('error fetching from candidate', base, err && err.message ? err.message : err);
        // try next candidate
      }
    }
    // As a diagnostic step, try fetching the list endpoint on the primary API_BASE
    try{
      const listUrl = `${API_BASE}/usuario`;
      debugLog('diagnostic: fetching user list from', listUrl);
      const listResp = await fetch(listUrl, { headers: { 'Accept':'application/json', 'Authorization':'Bearer '+token } });
      debugLog('diagnostic list status', listResp.status);
      if(listResp.ok){
        const all = await listResp.json();
        debugLog('diagnostic: all users count', Array.isArray(all) ? all.length : 'not-array');
      }
    }catch(e){ debugLog('diagnostic fetch list failed', e); }
    return null;
  }

  async function refreshSessionUI(){
    updateCartBadge();
    const token = localStorage.getItem('cowshop_token');
    const storedName = localStorage.getItem('cowshop_user_name');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    if(!token){
      debugLog('no token found');
      if(loginBtn) loginBtn.classList.remove('d-none');
      if(registerBtn) registerBtn.classList.remove('d-none');
      removeHeaderUserLink();
      hideUserCard();
      // If the page declares it requires auth, redirect to login with returnUrl
      try{
        const requireAuth = document.body && document.body.dataset && document.body.dataset.requireAuth;
        if(requireAuth && requireAuth.toString() === '1'){
          const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
          debugLog('page requires auth, redirecting to login with returnUrl=', returnUrl);
          window.location.href = `login.html?returnUrl=${returnUrl}`;
          return;
        }
      }catch(e){ /* ignore */ }
      return;
    }

    // Check token expiry (exp is expected in seconds since epoch)
    try{
      const payloadCheck = parseJwtPayload(token) || {};
      const nowSec = Date.now() / 1000;
      if(payloadCheck.exp && nowSec > payloadCheck.exp){
        // token expired -> logout
        doLogout();
        return;
      }
    }catch(e){ /* ignore and continue */ }


    if(loginBtn) loginBtn.classList.add('d-none');
    if(registerBtn) registerBtn.classList.add('d-none');

    const payload = parseJwtPayload(token) || {};
    const userId = payload.id || payload.ID || payload.ID_Usuario || null;

  debugLog('token present, payload id=', payload.id || payload.ID || payload.ID_Usuario);
  // Try get profile from backend, fallback to storedName + payload
    let profile = null;
    if(userId !== null){
      profile = await tryFetchProfile(userId, token);
    }
    if(!profile){
      profile = { Nombre: storedName || payload.unique_name || payload.name || 'Usuario', Correo: payload.email || '', Tipo_Usuario: payload.rol || '' };
    }

    const displayName = profile.Nombre || 'Usuario';
    const initials = (displayName.split(' ').slice(0,2).map(n=>n[0]).join('') || 'U').toUpperCase();
    const roleText = profile.Tipo_Usuario || payload.rol || '—';

    createHeaderUserLink(displayName, initials, roleText);
    showUserCard(profile);

    // Attach logout on logoutBtn if exists
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn){
      logoutBtn.removeEventListener('click', doLogout);
      logoutBtn.addEventListener('click', doLogout);
    }
  }

  // Listen for storage changes (other tabs)
  window.addEventListener('storage', (e)=>{
    if(e.key === 'cowshop_token' || e.key === 'cowshop_user_name' || e.key === 'cowShopCart' || e.key === 'cowshop_logout_ts'){
      // refresh UI
      refreshSessionUI();
    }
  });

  // Init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function(){
    refreshSessionUI();
  });

  // Expose logout globally
  window.cowshopLogout = doLogout;
})();
