const API_URL = location.origin + '/api/ai';
document.getElementById('app').innerHTML = '<h2>App Loaded</h2><div id="content"></div>';
async function test(){ try{ const r = await fetch('/api/quote'); const j = await r.json(); document.getElementById('content').innerText = j.quote; }catch(e){ document.getElementById('content').innerText = 'Quote error'; } }
test();
