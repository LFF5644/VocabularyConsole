#!/usr/bin/env node
// Project Created 3.12.2022 AT 9:50
const vocFile="/home/lff/Programmes/rtjscomp/public/p/Vocabulary/s190-191.vocs";
const {readFileSync}=require("fs");

function input(text){
	return new Promise((succ,err)=>{
		const readline=require("readline").createInterface({
			"input": process.stdin,
			"output": process.stdout,
		});
		readline.question(text,(res)=>{
			succ(res);
			readline.close();
		});
	})
}
function replaceAir(text){
	let oldText="";
	while(1){
		oldText=text;
		if(text.startsWith(" ")){
			text=text.substr(1);
		}
		if(text.endsWith(" ")){
			const len=text.length-1;
			text=text.substr(0,len);
		}
		if(text===oldText){break}
	}
	return text;
}
function loadVocs(vocFile){
	let vocs="";
	try{
		vocs=readFileSync(vocFile,"utf8");
	}catch(e){
		throw new Error("vocFile cant read from file")
	}
	const vocList=[];
	const ignoreChars=[
		"//",
		"#",
		"$", // nur erstmal so;
	];
	let line="";
	for(line of vocs.split("\n")){
		if(
			!line||
			!line.includes("|")||
			ignoreChars.some(item=>line.startsWith(item))
		){
			continue;
		}
		let vocsInLine=line.split("|");
		const vocs=vocsInLine.map(item=>
			item
				.split(";")
				.map(replaceAir)
		);
		vocList.push(vocs);
	}
	return vocList;
}
async function main(vocs){
	console.log("Sprache Auswählen\nBitte 0 oder 1 eingaben")
	const language=Number(await input("[0-1] >"));
	if(
		isNaN(language)||(
			language>1||
			language<0
		)
	){
		console.log("\nNur Zahlen zwischen 0-1 werden angenommen!\nEXIT!");
		process.exit();
	}
	let points=0.0;
	let pointsMax=0;
	let voc=[];
	
	askUser:
	for(voc of vocs){
		const vocsToAsk=voc[language];
		const vocsCorrect=voc[language===1?0:1];
		const length_vocsToAsk=vocsToAsk.length;
		const askVocIndex=Math.min(length_vocsToAsk-1,Math.floor(Math.random()*length_vocsToAsk))
		const askVoc=vocsToAsk[askVocIndex];
		const pointsInfo=()=>{console.log("Punkte inzgesamt: "+points+" von "+pointsMax+" Punkten");}
		
		process.stdout.write("\n");
		console.log(`Bitte Übersetze "${askVoc}"`);
		const userInput=await input("$ ");
		process.stdout.write("\n");
		if(vocsCorrect.some(item=>
			item==userInput||
			item.toLowerCase()==userInput.toLowerCase()
		)){
			console.log("PERFECT 1 PUNKT!");
			points+=1;
		}
		else{
			console.log("Leider Falsch :C");
			console.log(`Richtig ist: "${vocsCorrect[0]}"${vocsCorrect.length>1?", und mehr...":""}`)
		}

		pointsMax+=1;
		pointsInfo();
	}
	console.log("das wars auch schon!");
}

const vocs=loadVocs(vocFile);
main(vocs);


