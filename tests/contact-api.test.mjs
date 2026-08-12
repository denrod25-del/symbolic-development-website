import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/contact.js";

function responseMock() {
  return {statusCode:200,headers:{},body:null,setHeader(name,value){this.headers[name]=value;},status(code){this.statusCode=code;return this;},json(value){this.body=value;return this;}};
}

test("rejects non-POST requests",async()=>{
  const response=responseMock();
  await handler({method:"GET",headers:{}},response);
  assert.equal(response.statusCode,405);
});

test("silently accepts honeypot submissions",async()=>{
  const response=responseMock();
  await handler({method:"POST",headers:{"x-forwarded-for":"192.0.2.1"},body:{website:"bot-field"}},response);
  assert.equal(response.statusCode,200);
  assert.equal(response.body.ok,true);
});

test("validates inquiry fields",async()=>{
  const response=responseMock();
  await handler({method:"POST",headers:{"x-forwarded-for":"192.0.2.2"},body:{startedAt:Date.now()-2000,name:"A",email:"invalid",message:"short"}},response);
  assert.equal(response.statusCode,400);
});

test("keeps valid requests gated until delivery is configured",async()=>{
  const response=responseMock();
  await handler({method:"POST",headers:{"x-forwarded-for":"192.0.2.3"},body:{startedAt:Date.now()-2000,name:"Alex Morgan",email:"alex@example.com",company:"Meridian",stage:"Ready to build",timeline:"Within 1–2 months",engagement:"Focused build",budget:"$40k–$100k",message:"We need help replacing a brittle operational workflow with dependable software."}},response);
  assert.equal(response.statusCode,503);
  assert.match(response.body.message,/delivery is being connected/i);
});

test("requires inquiry qualification fields",async()=>{
  const response=responseMock();
  await handler({method:"POST",headers:{"x-forwarded-for":"192.0.2.4"},body:{startedAt:Date.now()-2000,name:"Alex Morgan",email:"alex@example.com",message:"We need help replacing a brittle operational workflow with dependable software."}},response);
  assert.equal(response.statusCode,400);
  assert.match(response.body.message,/project stage/i);
});

test("rejects oversized acquisition attribution",async()=>{
  const response=responseMock();
  await handler({method:"POST",headers:{"x-forwarded-for":"192.0.2.5"},body:{startedAt:Date.now()-2000,name:"Alex Morgan",email:"alex@example.com",company:"Meridian",stage:"Ready to build",timeline:"Within 1–2 months",engagement:"Focused build",budget:"$40k–$100k",message:"We need help replacing a brittle operational workflow with dependable software.",utm_campaign:"x".repeat(241)}},response);
  assert.equal(response.statusCode,400);
});
