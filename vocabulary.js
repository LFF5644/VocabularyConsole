#!/usr/bin/env node
const fs=require("fs");
const static={};
static.var={};
static.var.vocs=[];
static.file={};
static.file.vocs="vocabularys.json";

function ReadFile(file,coding,errMode="throw"){
	return new Promise((resolve,reject)=>{
		fs.readFile(file,coding,
			(err,data)=>{
				if(err){
					if(errMode=="return"){resolve(false)}
					else if(errMode=="throw"){reject(err)}
					else if(errMode=="exit"){
						console.log(`[ReadFile][EXIT]: '${file}' cant read EXIT`);
						process.exit();
						reject(err);
					}
					else{
						console.log("[ReadFile][ARGS][ERROR]: errMode is not allowed");
						reject(err);
					}
				}else{
					resolve(data);
				}
			}
		);
	});
}

async function loadStatic(){
	let res=await ReadFile(static.file.vocs,"utf-8","exit");
	console.log(`[loadStatic][load]: '${static.file.vocs}' loaded`);
	try{
		res=JSON.parse(res)
	}catch(e){
		console.log("MEEP BOOP")
	}

}
loadStatic();