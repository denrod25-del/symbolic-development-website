export default function handler(request,response) {
  response.setHeader("Cache-Control","no-store");
  if(request.method!=="GET") return response.status(405).json({ok:false,message:"Method not allowed."});
  const emailConfigured=Boolean(process.env.RESEND_API_KEY&&process.env.CONTACT_TO_EMAIL&&process.env.CONTACT_FROM_EMAIL);
  return response.status(emailConfigured?200:503).json({
    ok:emailConfigured,
    service:"symbolic-development",
    emailDelivery:emailConfigured?"configured":"unavailable",
  });
}
