import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/health.js";

function responseMock() {
  return {statusCode:200,headers:{},body:null,setHeader(name,value){this.headers[name]=value;},status(code){this.statusCode=code;return this;},json(value){this.body=value;return this;}};
}

test("rejects non-GET requests",()=>{
  const response=responseMock();
  handler({method:"POST"},response);
  assert.equal(response.statusCode,405);
});

test("reports an unavailable delivery configuration",()=>{
  const original={key:process.env.RESEND_API_KEY,to:process.env.CONTACT_TO_EMAIL,from:process.env.CONTACT_FROM_EMAIL};
  delete process.env.RESEND_API_KEY; delete process.env.CONTACT_TO_EMAIL; delete process.env.CONTACT_FROM_EMAIL;
  const response=responseMock(); handler({method:"GET"},response);
  assert.equal(response.statusCode,503); assert.equal(response.body.emailDelivery,"unavailable");
  if(original.key!==undefined) process.env.RESEND_API_KEY=original.key;
  if(original.to!==undefined) process.env.CONTACT_TO_EMAIL=original.to;
  if(original.from!==undefined) process.env.CONTACT_FROM_EMAIL=original.from;
});

test("reports a configured delivery pipeline",()=>{
  const original={key:process.env.RESEND_API_KEY,to:process.env.CONTACT_TO_EMAIL,from:process.env.CONTACT_FROM_EMAIL};
  process.env.RESEND_API_KEY="test"; process.env.CONTACT_TO_EMAIL="team@example.com"; process.env.CONTACT_FROM_EMAIL="hello@example.com";
  const response=responseMock(); handler({method:"GET"},response);
  assert.equal(response.statusCode,200); assert.equal(response.body.ok,true);
  for(const [name,value] of [["RESEND_API_KEY",original.key],["CONTACT_TO_EMAIL",original.to],["CONTACT_FROM_EMAIL",original.from]]) value===undefined?delete process.env[name]:process.env[name]=value;
});
