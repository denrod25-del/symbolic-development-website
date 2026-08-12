const limits=new Map();
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean=value=>String(value||"").trim();
const escapeHtml=value=>clean(value).replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);

export default async function handler(request,response) {
  const started=Date.now();
  const requestId=clean(request.headers["x-vercel-id"]||request.headers["x-request-id"]);
  const log=(level,message,details={})=>console[level==="error"?"error":"log"](JSON.stringify({level,message,route:"/api/contact",requestId:requestId||undefined,...details,durationMs:Date.now()-started}));
  response.setHeader("Cache-Control","no-store");
  if(request.method!=="POST") { log("info","method_not_allowed",{status:405}); return response.status(405).json({message:"Method not allowed."}); }
  const ip=clean(request.headers["x-forwarded-for"]).split(",")[0] || "unknown";
  const now=Date.now(); const existing=limits.get(ip) || []; const recent=existing.filter(timestamp=>now-timestamp<15*60*1000);
  if(recent.length>=5) { log("info","rate_limited",{status:429}); return response.status(429).json({message:"Too many requests. Please wait a few minutes and try again."}); }
  recent.push(now); limits.set(ip,recent);
  let body; try{body=typeof request.body==="string"?JSON.parse(request.body):request.body||{};}catch{log("info","invalid_json",{status:400});return response.status(400).json({message:"Invalid request."});}
  if(clean(body.website)) { log("info","honeypot_accepted",{status:200}); return response.status(200).json({ok:true}); }
  const startedAt=Number(body.startedAt); if(!startedAt || now-startedAt<800 || now-startedAt>2*60*60*1000) return response.status(400).json({message:"Please refresh the page and try again."});
  const name=clean(body.name),email=clean(body.email),company=clean(body.company),message=clean(body.message),kind=body.kind==="booking"?"booking":"contact";
  if(name.length<2 || name.length>80 || !emailPattern.test(email) || email.length>160 || message.length<20 || message.length>4000 || company.length>120) return response.status(400).json({message:"Please check the highlighted information and try again."});
  const preferredDate=clean(body.preferredDate),preferredWindow=clean(body.preferredWindow),stage=clean(body.stage),timeline=clean(body.timeline),engagement=clean(body.engagement),budget=clean(body.budget),referral=clean(body.referral);
  if([preferredWindow,stage,timeline,engagement,budget].some(value=>value.length>120) || referral.length>80) return response.status(400).json({message:"Please check the highlighted information and try again."});
  if(kind==="booking" && (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate) || !preferredWindow || !engagement)) return response.status(400).json({message:"Choose a focus, preferred date, and time window."});
  if(kind==="contact" && (!stage || !timeline || !engagement || !budget)) return response.status(400).json({message:"Choose a project stage, timing, engagement, and investment range."});
  const apiKey=process.env.RESEND_API_KEY,to=process.env.CONTACT_TO_EMAIL,from=process.env.CONTACT_FROM_EMAIL;
  if(!apiKey || !to || !from) { log("error","delivery_not_configured",{status:503,kind}); return response.status(503).json({message:"Secure email delivery is being connected. Please email us directly for now."}); }
  const details=kind==="booking"?`<p><strong>Focus:</strong> ${escapeHtml(engagement)}<br><strong>Preferred date:</strong> ${escapeHtml(preferredDate)}<br><strong>Preferred window:</strong> ${escapeHtml(preferredWindow)}${referral?`<br><strong>Referral:</strong> ${escapeHtml(referral)}`:""}</p>`:`<p><strong>Project stage:</strong> ${escapeHtml(stage)}<br><strong>Preferred start:</strong> ${escapeHtml(timeline)}<br><strong>Engagement:</strong> ${escapeHtml(engagement)}<br><strong>Investment range:</strong> ${escapeHtml(budget)}</p>`;
  const result=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${apiKey}`,"Content-Type":"application/json"},body:JSON.stringify({from,to:[to],reply_to:email,subject:kind==="booking"?`Working session request — ${name}`:`New project inquiry — ${name}`,html:`<div style="font-family:Arial,sans-serif;max-width:640px"><h1>${kind==="booking"?"Working session request":"Project inquiry"}</h1><p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Company:</strong> ${escapeHtml(company)||"Not provided"}</p>${details}<p><strong>Context</strong></p><p style="white-space:pre-wrap">${escapeHtml(message)}</p></div>`})});
  const data=await result.json().catch(()=>({})); if(!result.ok) { log("error","delivery_failed",{status:502,kind,providerStatus:result.status}); return response.status(502).json({message:"Email delivery failed. Please email us directly.",detail:data.message}); }
  log("info","delivery_succeeded",{status:200,kind});
  return response.status(200).json({ok:true,id:data.id});
}
