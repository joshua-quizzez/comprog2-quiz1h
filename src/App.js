import { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════════════════════════════════════════
// WEB AUDIO API - CHILL MUSIC & SOUND EFFECTS
// ══════════════════════════════════════════════════════════════════════════════

const useAudio = (isMuted) => {
  const ctxRef = useRef(null);
  const bgIntervalRef = useRef(null);
  const bgGainRef = useRef(null);

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctxRef.current;
  };

  const playTone = (freq, duration, type = 'sine', vol = 0.3, delay = 0) => {
    if (isMuted) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    } catch (e) {}
  };

  const sounds = {
    correct: () => {
      playTone(523.25, 0.12, 'sine', 0.25, 0);
      playTone(659.25, 0.12, 'sine', 0.25, 0.1);
      playTone(783.99, 0.2, 'sine', 0.25, 0.2);
    },
    wrong: () => {
      playTone(220, 0.15, 'sawtooth', 0.2, 0);
      playTone(185, 0.25, 'sawtooth', 0.2, 0.12);
    },
    click: () => {
      playTone(880, 0.05, 'sine', 0.12, 0);
    },
    finish: () => {
      [523, 659, 784, 1047].forEach((f, i) => playTone(f, 0.18, 'sine', 0.22, i * 0.1));
    },
  };

  const startBgMusic = () => {
    if (isMuted || bgIntervalRef.current) return;
    try {
      const ctx = getCtx();
      bgGainRef.current = ctx.createGain();
      bgGainRef.current.gain.setValueAtTime(0.15, ctx.currentTime);
      bgGainRef.current.connect(ctx.destination);

      const progression = [
        [261.63, 329.63, 392.00, 493.88],
        [220.00, 261.63, 329.63, 440.00],
        [174.61, 220.00, 261.63, 349.23],
        [196.00, 246.94, 293.66, 369.99],
      ];

      let chordIdx = 0;
      const playChord = () => {
        if (!bgGainRef.current) return;
        const chord = progression[chordIdx % 4];
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(bgGainRef.current);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 3);
        });
        chordIdx++;
      };

      playChord();
      bgIntervalRef.current = setInterval(playChord, 3000);
    } catch (e) {}
  };

  const stopBgMusic = () => {
    if (bgIntervalRef.current) {
      clearInterval(bgIntervalRef.current);
      bgIntervalRef.current = null;
    }
    if (bgGainRef.current) {
      try {
        bgGainRef.current.gain.exponentialRampToValueAtTime(0.001, getCtx().currentTime + 0.5);
        setTimeout(() => {
          if (bgGainRef.current) {
            bgGainRef.current.disconnect();
            bgGainRef.current = null;
          }
        }, 500);
      } catch (e) {}
    }
  };

  return { sounds, startBgMusic, stopBgMusic };
};

// ══════════════════════════════════════════════════════════════════════════════
// ALL 60 QUESTIONS - Classes, Objects, Methods & OOP Concepts
// ══════════════════════════════════════════════════════════════════════════════

const questions = [
  // PROGRAMMING PARADIGMS (1-8)
  {type:"Definition",num:1,q:"A programming paradigm refers to:",c:["The speed of program execution","Different approaches to structuring and organizing code","The type of computer language used","The size of a program"],a:1},
  {type:"Definition",num:2,q:"Which programming paradigm executes operations one after another in sequence and uses variables?",c:["Functional Programming","Object-oriented Programming","Procedural Programming","Logic Programming"],a:2},
  {type:"Definition",num:3,q:"The basic construct in Procedural Programming is:",c:["Classes","Objects","Procedures (functions, modules, subroutines)","Expressions"],a:2},
  {type:"Definition",num:4,q:"Functional Programming focuses on:",c:["Declarations and expressions rather than execution of statements","Step-by-step procedures","Object creation","Variable manipulation"],a:0},
  {type:"Definition",num:5,q:"In Functional Programming, functions are treated as:",c:["Second-class citizens","First-class citizens that can be assigned to variables or passed as arguments","Only for calculations","Not important"],a:1},
  {type:"Definition",num:6,q:"Object-oriented Programming (OOP) is an extension of:",c:["Functional Programming","Logic Programming","Procedural Programming","Assembly Language"],a:2},
  {type:"Application",num:7,q:"Which languages support OOP?",c:["Erlang and Haskel","Java, Python, VB.NET, and C#","BASIC and Pascal only","Only Java"],a:1},
  {type:"Comparison",num:8,q:"In naming conventions, what is 'Function Call' in Procedural Programming called in OOP?",c:["Method","Message Passing","Instance Variable","Class"],a:1},

  // OOP VS PROCEDURAL (9-13)
  {type:"Comparison",num:9,q:"Procedural Programming emphasizes:",c:["Data rather than procedures","Procedures rather than data","Only security","Only objects"],a:1},
  {type:"Comparison",num:10,q:"OOP uses which approach?",c:["Top-down approach","Bottom-up approach","Random approach","Sequential approach"],a:1},
  {type:"Comparison",num:11,q:"Which statement is TRUE about OOP?",c:["Data is not secured","It does not model real-world entities","It models real-world entities","Programs are decomposed into functions"],a:2},
  {type:"Definition",num:12,q:"An advantage of OOP is:",c:["Increased code duplication","Reduced data security","Modularized programs using classes and objects","More complex development"],a:2},
  {type:"Definition",num:13,q:"OOP provides data security through:",c:["Public access to all data","Encapsulation that makes data inaccessible to non-member functions","Removing all functions","Making everything global"],a:1},

  // CLASS, OBJECT, METHOD CONCEPTS (14-22)
  {type:"Definition",num:14,q:"A class is BEST described as:",c:["A specific instance of an object","A blueprint or template for objects with common properties","A method that creates objects","A variable type"],a:1},
  {type:"Definition",num:15,q:"An object is:",c:["A blueprint for classes","A specific and concrete instance of a class","A method in a program","A programming paradigm"],a:1},
  {type:"Definition",num:16,q:"A method is:",c:["A variable","A self-contained block of code that carries out actions","A class definition","An object instance"],a:1},
  {type:"Analogy",num:17,q:"If a class is compared to a blueprint, an object is:",c:["Another blueprint","A house built from that blueprint","The architect","The construction materials"],a:1},
  {type:"Application",num:18,q:"In the Automobile class example, 'Make, Model, Year, Color' are:",c:["Methods","Objects","Attributes/Properties","Classes"],a:2},
  {type:"Application",num:19,q:"In the Automobile class example, 'Forward, Backward, Gas Status' are:",c:["Objects","Methods","Attributes","Classes"],a:1},
  {type:"Analogy",num:20,q:"Objects can be compared to _____, while methods are similar to _____:",c:["Verbs, Nouns","Adjectives, Adverbs","Nouns, Verbs","Numbers, Letters"],a:2},
  {type:"Definition",num:21,q:"Data members of an object are:",c:["Its operations/actions","Its characteristics/features","Its methods","Its classes"],a:1},
  {type:"Definition",num:22,q:"Function members of an object are:",c:["Its characteristics","Its operations/actions","Its attributes","Its properties"],a:1},

  // OOP CORE CONCEPTS (23-31)
  {type:"Definition",num:23,q:"Data Abstraction means:",c:["Including only essential details without background details","Showing all internal workings","Removing all data","Making everything public"],a:0},
  {type:"Definition",num:24,q:"Data Encapsulation is:",c:["Making all data public","Wrapping data and functions into a class, performing data hiding","Removing functions from classes","Separating data from methods"],a:1},
  {type:"Definition",num:25,q:"Inheritance allows:",c:["Classes to share attributes and methods of existing classes with more specific features","Objects to change their class","Methods to become classes","Data to be deleted"],a:0},
  {type:"Definition",num:26,q:"In inheritance, the class that inherits properties FROM another class is called:",c:["Base class or parent class","Derived class, child class, or subclass","Super class only","Independent class"],a:1},
  {type:"Definition",num:27,q:"Polymorphism means:",c:["One form only","Many forms - same word/symbol interpreted differently based on context","No forms","Random forms"],a:1},
  {type:"Application",num:28,q:"Operator overloading example: the + operator performs addition for numbers, but for strings like 'Just'+'ice', it:",c:["Gives an error","Performs string concatenation resulting in 'Justice'","Deletes the strings","Converts to numbers"],a:1},
  {type:"Application",num:29,q:"Function overloading means:",c:["One function with one return type","Two or more functions with the same name but different return types or arguments","Functions that don't work","Deleting functions"],a:1},
  {type:"Example",num:30,q:"In the Employee inheritance example, if Manager, Supervisor, and Clerk inherit from Employee, Employee is the:",c:["Derived class","Child class","Base class or parent class","Subclass"],a:2},
  {type:"Definition",num:31,q:"Information hiding is:",c:["Deleting all information","Assigning private access so other classes cannot access field values","Making everything public","Removing all classes"],a:1},

  // METHODS IN DETAIL (32-40)
  {type:"Definition",num:32,q:"A method header (method declaration) provides:",c:["The method body","Information about how other methods can interact with it","The main() method","Object instances"],a:1},
  {type:"CodeID",num:33,q:"In 'public static void main(String[] args)', what does 'public' mean?",c:["The method is slow","Any other class can use it","The method is hidden","It's a variable"],a:1},
  {type:"CodeID",num:34,q:"In 'public static void main(String[] args)', what does 'static' mean?",c:["The method never changes","The method can be used without instantiating an object","The method is fast","It requires an object"],a:1},
  {type:"CodeID",num:35,q:"In 'public static void main(String[] args)', what does 'void' mean?",c:["The method is empty","The method returns no data","The method returns an integer","The method is public"],a:1},
  {type:"Definition",num:36,q:"A calling method that invokes another method is also called:",c:["Server method","Client method","Object method","Class method"],a:1},
  {type:"Definition",num:37,q:"The method body is:",c:["The method header","The statements between curly braces that carry out the work","The method name","The return type"],a:1},
  {type:"Definition",num:38,q:"The body of a method is also called its:",c:["Declaration","Header","Implementation","Call"],a:2},
  {type:"Application",num:39,q:"If a method needs to display company hours, a good method name would be:",c:["method1()","x()","displayHours()","void()"],a:2},
  {type:"CodeID",num:40,q:"Can a method be placed INSIDE another method in Java?",c:["Yes, always","No, methods cannot be placed inside other methods","Yes, but only main()","Sometimes"],a:1},

  // CODE IDENTIFICATION: CompanyInfo Examples (41-46)
  {type:"CodeID",num:41,q:"In the CompanyInfo class, 'displayHours()' is an example of:",c:["An object","A method being called","A variable","A class"],a:1},
  {type:"CodeID",num:42,q:"The full name (fully qualified identifier) of displayHours() in CompanyInfo class is:",c:["displayHours()","CompanyInfo()","CompanyInfo.displayHours()","main.displayHours()"],a:2},
  {type:"CodeID",num:43,q:"In 'public static void displayHours()', displayHours is the:",c:["Return type","Access modifier","Method name","Parameter"],a:2},
  {type:"Application",num:44,q:"What is an advantage of creating separate methods?",c:["Makes programs longer","Methods make code reusable and easier to follow","Increases complexity","Slows down execution"],a:1},
  {type:"CodeID",num:45,q:"Which method always executes FIRST in any Java application?",c:["displayHours()","The last method in the file","main()","Any method"],a:2},
  {type:"Definition",num:46,q:"Methods that retrieve/return values are called:",c:["Mutator methods or setters","Accessor methods or getters","Constructor methods","Static methods"],a:1},

  // CLASSES AND OBJECTS CODE (47-55)
  {type:"Definition",num:47,q:"Methods that set or change field values are called:",c:["Accessor methods or getters","Mutator methods or setters","Constructor methods","Main methods"],a:1},
  {type:"CodeID",num:48,q:"In 'public class Employee', what is 'Employee'?",c:["A method","The class name","An object","A variable"],a:1},
  {type:"CodeID",num:49,q:"In 'private int empNum;', empNum is a:",c:["Method","Class","Data field (instance variable)","Constructor"],a:2},
  {type:"CodeID",num:50,q:"Why use 'private' for empNum instead of 'public'?",c:["It's faster","It provides security - other classes cannot directly access it","It's required by Java","No reason"],a:1},
  {type:"CodeID",num:51,q:"In 'public int getEmpNum()', this method is:",c:["A setter/mutator","A getter/accessor that returns the empNum","A constructor","A class"],a:1},
  {type:"CodeID",num:52,q:"In 'public void setEmpNum(int emp)', this method is:",c:["A getter/accessor","A setter/mutator that sets the empNum","A constructor","A field"],a:1},
  {type:"CodeID",num:53,q:"'Employee clerk = new Employee();' - what is 'Employee' (first one)?",c:["Object name","The data type/class","A method","A field"],a:1},
  {type:"CodeID",num:54,q:"'Employee clerk = new Employee();' - what is 'clerk'?",c:["The class","The object's name/identifier","A method","A constructor"],a:1},
  {type:"CodeID",num:55,q:"'Employee clerk = new Employee();' - what does 'new' do?",c:["Deletes memory","Allocates memory for the object","Calls a method","Nothing"],a:1},

  // ADVANCED CODE & CONCEPTS (56-60)
  {type:"CodeID",num:56,q:"'Employee clerk = new Employee();' - what is 'Employee()' after new?",c:["A method call","The constructor that creates the Employee object","An object","A field"],a:1},
  {type:"Definition",num:57,q:"A constructor is:",c:["A regular method","A special method that creates and initializes objects","A variable","A field"],a:1},
  {type:"CodeID",num:58,q:"In 'clerk.setEmpNum(345);' what does the dot (.) mean?",c:["Addition","Accessing the object's method","Subtraction","Nothing"],a:1},
  {type:"Definition",num:59,q:"Employee is a reference type, while int is a:",c:["Reference type","Primitive type","Object type","Class type"],a:1},
  {type:"CodeID",num:60,q:"If a field is declared WITHOUT the 'static' keyword in a class, it means:",c:["The field is shared by all objects","Each object has its own copy of that field","The field cannot be used","It's a constant"],a:1},
];

const TYPE_META = {
  Definition: { color:"#3b82f6", icon:"📚", label:"Definition" },
  Application: { color:"#10b981", icon:"⚙️", label:"Application" },
  CodeID: { color:"#f59e0b", icon:"💻", label:"Code ID" },
  Comparison: { color:"#8b5cf6", icon:"⚖️", label:"Comparison" },
  Analogy: { color:"#ec4899", icon:"🔗", label:"Analogy" },
  Example: { color:"#06b6d4", icon:"📝", label:"Example" },
};

const LETTERS = ["A","B","C","D"];

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(60).fill(null));
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5400); // 90 min
  const [timerActive, setTimerActive] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const { sounds, startBgMusic, stopBgMusic } = useAudio(isMuted);

  useEffect(()=>{
    if(!timerActive)return;
    if(timeLeft<=0){setTimerActive(false);stopBgMusic();sounds.finish();setScreen("results");return;}
    const t=setTimeout(()=>setTimeLeft(s=>s-1),1000);
    return()=>clearTimeout(t);
  },[timerActive,timeLeft]);

  useEffect(()=>{
    if(screen==="exam" && !reviewMode){
      startBgMusic();
    } else {
      stopBgMusic();
    }
    return ()=>stopBgMusic();
  },[screen, reviewMode, isMuted]);

  const q=questions[current];
  const meta=TYPE_META[q.type];
  const answered=answers.filter(a=>a!==null).length;
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  function pick(i){
    if(showFeedback||reviewMode)return;
    sounds.click();
    const a=[...answers];a[current]=i;setAnswers(a);
    setShowFeedback(true);
    setTimeout(()=>{
      if(i===q.a) sounds.correct();
      else sounds.wrong();
    },100);
  }

  function next(){sounds.click();setShowFeedback(false);if(current<59)setCurrent(c=>c+1);else{setTimerActive(false);stopBgMusic();sounds.finish();setScreen("results");}}
  function prev(){if(current>0){sounds.click();setShowFeedback(false);setCurrent(c=>c-1);}}
  function submit(){setTimerActive(false);stopBgMusic();sounds.finish();setScreen("results");}
  function restart(){setAnswers(Array(60).fill(null));setCurrent(0);setShowFeedback(false);setTimeLeft(5400);setTimerActive(false);setReviewMode(false);setScreen("intro");}

  const score=answers.reduce((a,v,i)=>v===questions[i].a?a+1:a,0);
  const pct=Math.round((score/60)*100);
  const grade=pct>=90?{label:"Excellent!",c:"#10b981",e:"🏆"}:pct>=80?{label:"Very Good!",c:"#3b82f6",e:"⭐"}:pct>=75?{label:"Passed",c:"#8b5cf6",e:"✅"}:pct>=60?{label:"Needs Review",c:"#f59e0b",e:"📚"}:{label:"Keep Studying",c:"#ef4444",e:"💪"};

  const sections=[
    {label:"Programming Paradigms",qs:Array.from({length:8},(_,i)=>i)},
    {label:"OOP vs Procedural",qs:Array.from({length:5},(_,i)=>i+8)},
    {label:"Class, Object, Method",qs:Array.from({length:9},(_,i)=>i+13)},
    {label:"OOP Core Concepts",qs:Array.from({length:9},(_,i)=>i+22)},
    {label:"Methods in Detail",qs:Array.from({length:9},(_,i)=>i+31)},
    {label:"Code: CompanyInfo",qs:Array.from({length:6},(_,i)=>i+40)},
    {label:"Classes & Objects Code",qs:Array.from({length:9},(_,i)=>i+46)},
    {label:"Advanced Code",qs:Array.from({length:5},(_,i)=>i+55)},
  ];

  const css=`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#0a0e14;font-family:'Inter',sans-serif;}
    .fade{animation:fadeUp .5s ease both;}
    .qcard{animation:fadeUp .3s ease;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    .btn{transition:all .2s;cursor:pointer;}
    .btn:hover:not(:disabled){transform:translateY(-2px);filter:brightness(1.15);}
    .ch{transition:all .18s;cursor:pointer;text-align:left;width:100%;}
    .ch:hover:not(:disabled){transform:translateX(4px);filter:brightness(1.08);}
    .dot{transition:transform .15s;cursor:pointer;border-radius:50%;}
    .dot:hover{transform:scale(1.3);}
    code{font-family:'JetBrains Mono',monospace;background:rgba(255,255,255,0.05);padding:2px 6px;border-radius:4px;font-size:0.9em;}
  `;

  // INTRO
  if(screen==="intro")return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0e14,#1a1f2e,#0a0e14)",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <style>{css}</style>
      <div className="fade" style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(24px)",border:"1px solid rgba(59,130,246,0.3)",borderRadius:"20px",padding:"48px 40px",maxWidth:"680px",width:"100%",textAlign:"center",boxShadow:"0 0 60px rgba(59,130,246,0.2)"}}>
        <div style={{fontSize:"11px",letterSpacing:"4px",color:"#60a5fa",textTransform:"uppercase",marginBottom:"10px",fontWeight:600}}>IT2408</div>
        <h1 style={{fontSize:"clamp(28px,5vw,44px)",fontWeight:800,color:"#f1f5f9",marginBottom:"8px",lineHeight:1.15,textShadow:"0 0 40px rgba(59,130,246,0.4)",letterSpacing:"-0.5px"}}>OOP Mastery Exam</h1>
        <p style={{color:"#94a3b8",fontSize:"15px",marginBottom:"28px",fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.3px"}}>Classes, Objects, Methods & Code Identification</p>
        
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:"12px",marginBottom:"24px"}}>
          {[["60","Questions"],["90","Minutes"],["1pt","Each"],["8","Sections"]].map(([v,l])=>(
            <div key={l} style={{background:"rgba(59,130,246,0.12)",border:"1px solid rgba(59,130,246,0.3)",borderRadius:"12px",padding:"14px 10px"}}>
              <div style={{fontSize:"26px",fontWeight:800,color:"#60a5fa",lineHeight:1}}>{v}</div>
              <div style={{fontSize:"10px",color:"#64748b",marginTop:"4px",textTransform:"uppercase",letterSpacing:"1px",fontWeight:600}}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"16px 20px",marginBottom:"24px",textAlign:"left"}}>
          <div style={{fontSize:"10px",fontWeight:700,color:"#60a5fa",letterSpacing:"2.5px",marginBottom:"10px",textTransform:"uppercase"}}>Question Types</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
            {Object.entries(TYPE_META).map(([type,{icon,label,color}])=>(
              <div key={type} style={{fontSize:"11px",color:"#cbd5e1",display:"flex",alignItems:"center",gap:"6px"}}>
                <span style={{fontSize:"14px"}}>{icon}</span>
                <span style={{fontWeight:600,color}}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:"rgba(251,191,36,0.1)",border:"1px solid rgba(251,191,36,0.3)",borderRadius:"12px",padding:"12px 18px",marginBottom:"26px"}}>
          <p style={{fontSize:"11px",color:"#fbbf24",fontFamily:"'JetBrains Mono',monospace",lineHeight:1.5}}>🎵 Focus music • Code snippets • Instant feedback • Review mode</p>
        </div>

        <button className="btn" onClick={()=>{setScreen("exam");setTimerActive(true);}}
          style={{background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",border:"none",color:"#fff",fontSize:"15px",fontWeight:700,padding:"14px 42px",borderRadius:"50px",boxShadow:"0 8px 32px rgba(59,130,246,0.4)",letterSpacing:"0.5px"}}>
          Start Exam →
        </button>
      </div>
    </div>
  );

  // RESULTS
  if(screen==="results")return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0e14,#1a1f2e,#0a0e14)",padding:"24px 14px"}}>
      <style>{css}</style>
      <div style={{maxWidth:"720px",margin:"0 auto"}}>
        <div className="fade" style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(24px)",border:"1px solid rgba(59,130,246,0.25)",borderRadius:"20px",padding:"40px 32px",textAlign:"center",marginBottom:"16px",boxShadow:"0 0 40px rgba(59,130,246,0.15)"}}>
          <div style={{fontSize:"48px",marginBottom:"6px"}}>{grade.e}</div>
          <div style={{fontSize:"58px",fontWeight:800,color:grade.c,lineHeight:1}}>{score}<span style={{fontSize:"24px",color:"#64748b",fontWeight:600}}>/60</span></div>
          <div style={{fontSize:"17px",color:"#94a3b8",marginTop:"8px",fontFamily:"'JetBrains Mono',monospace"}}>{pct}% — <span style={{color:grade.c,fontWeight:700}}>{grade.label}</span></div>
          <div style={{background:"rgba(255,255,255,0.08)",borderRadius:"10px",height:"10px",margin:"20px 0 6px",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${grade.c},#60a5fa)`,borderRadius:"10px",transition:"width 1.2s ease"}}/>
          </div>
        </div>

        <div className="fade" style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(24px)",border:"1px solid rgba(59,130,246,0.25)",borderRadius:"18px",padding:"24px 28px",marginBottom:"16px"}}>
          <h3 style={{color:"#e2e8f0",fontSize:"17px",marginBottom:"16px",fontWeight:700}}>Performance by Section</h3>
          <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {sections.map(({label,qs})=>{
              const correct=qs.filter(i=>answers[i]===questions[i].a).length;
              const total=qs.length;const p=Math.round((correct/total)*100);
              const c=p>=80?"#10b981":p>=60?"#3b82f6":"#ef4444";
              return(
                <div key={label}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
                    <span style={{fontSize:"12px",color:"#cbd5e1",fontWeight:600}}>{label}</span>
                    <span style={{fontSize:"12px",color:c,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{correct}/{total}</span>
                  </div>
                  <div style={{background:"rgba(255,255,255,0.08)",borderRadius:"6px",height:"6px",overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${p}%`,background:c,borderRadius:"6px",transition:"width 1s ease 0.3s"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="fade" style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(24px)",border:"1px solid rgba(59,130,246,0.25)",borderRadius:"18px",padding:"24px 28px",marginBottom:"16px"}}>
          <h3 style={{color:"#e2e8f0",fontSize:"17px",marginBottom:"14px",fontWeight:700}}>Question Review</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(42px,1fr))",gap:"7px"}}>
            {questions.map((qq,i)=>{
              const ok=answers[i]===qq.a;const sk=answers[i]===null;
              return(
                <button key={i} className="btn" onClick={()=>{setCurrent(i);setShowFeedback(false);setReviewMode(true);setScreen("exam");}}
                  style={{background:sk?"rgba(100,116,139,0.25)":ok?"rgba(16,185,129,0.25)":"rgba(239,68,68,0.25)",border:`1px solid ${sk?"#475569":ok?"#10b981":"#ef4444"}`,borderRadius:"8px",color:sk?"#94a3b8":ok?"#6ee7b7":"#fca5a5",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:"11px",padding:"8px 4px"}}>
                  {i+1}
                </button>
              );
            })}
          </div>
          <p style={{fontSize:"10px",color:"#475569",marginTop:"10px",fontFamily:"'JetBrains Mono',monospace"}}>🟢 Correct  🔴 Wrong  ⬜ Skipped</p>
        </div>

        <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
          <button className="btn" onClick={restart} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#e2e8f0",fontSize:"14px",padding:"12px 26px",borderRadius:"50px",fontWeight:600}}>↺ Restart</button>
          <button className="btn" onClick={()=>{setReviewMode(true);setCurrent(0);setShowFeedback(false);setScreen("exam");}} style={{background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",border:"none",color:"#fff",fontSize:"14px",padding:"12px 26px",borderRadius:"50px",fontWeight:700}}>📖 Review Answers</button>
        </div>
      </div>
    </div>
  );

  // EXAM
  const ca=answers[current];const isCor=ca===q.a;
  return(
    <div style={{minHeight:"100vh",background:"#0a0e14"}}>
      <style>{css}</style>
      <div style={{background:"rgba(10,14,20,0.98)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(59,130,246,0.25)",padding:"12px 18px",display:"flex",alignItems:"center",gap:"14px",position:"sticky",top:0,zIndex:50,flexWrap:"wrap"}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#e2e8f0",fontSize:"13px"}}>IT2408</div>
        <div style={{flex:1,background:"rgba(255,255,255,0.08)",borderRadius:"8px",height:"7px",overflow:"hidden",minWidth:"120px"}}>
          <div style={{height:"100%",width:`${(current/60)*100}%`,background:"linear-gradient(90deg,#3b82f6,#8b5cf6)",borderRadius:"8px",transition:"width 0.4s"}}/>
        </div>
        <div style={{fontSize:"11px",color:"#64748b",fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>{current+1}/60</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"14px",fontWeight:700,color:timeLeft<300?"#fca5a5":"#60a5fa"}}>⏱ {fmt(timeLeft)}</div>
        <button className="btn" onClick={()=>setIsMuted(!isMuted)} style={{background:"rgba(59,130,246,0.18)",border:"1px solid rgba(59,130,246,0.4)",color:"#60a5fa",fontSize:"17px",padding:"5px 11px",borderRadius:"20px"}}>{isMuted?"🔇":"🔊"}</button>
        {!reviewMode
          ?<button className="btn" onClick={submit} style={{background:"rgba(239,68,68,0.18)",border:"1px solid rgba(239,68,68,0.4)",color:"#fca5a5",fontSize:"12px",padding:"6px 14px",borderRadius:"20px",fontWeight:600}}>Submit</button>
          :<button className="btn" onClick={()=>setScreen("results")} style={{background:"rgba(59,130,246,0.18)",border:"1px solid rgba(59,130,246,0.4)",color:"#60a5fa",fontSize:"12px",padding:"6px 14px",borderRadius:"20px",fontWeight:600}}>← Results</button>
        }
      </div>

      <div style={{maxWidth:"720px",margin:"0 auto",padding:"24px 16px 90px"}}>
        <div className="qcard" key={current} style={{background:"rgba(255,255,255,0.025)",border:`1px solid ${meta.color}35`,borderRadius:"18px",padding:"26px",marginBottom:"18px",boxShadow:`0 0 40px ${meta.color}12`}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:"7px",background:`${meta.color}20`,border:`1px solid ${meta.color}60`,borderRadius:"22px",padding:"4px 14px",marginBottom:"18px"}}>
            <span style={{fontSize:"15px"}}>{meta.icon}</span>
            <span style={{fontSize:"11px",color:meta.color,fontWeight:700,letterSpacing:"0.5px"}}>{meta.label}</span>
          </div>
          <p style={{fontSize:"clamp(14px,2.4vw,17px)",color:"#e2e8f0",lineHeight:1.7,marginBottom:"22px"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#60a5fa",marginRight:"8px"}}>{q.num}.</span>
            {q.q}
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
            {q.c.map((c,i)=>{
              let bg="rgba(255,255,255,0.03)",br="rgba(255,255,255,0.1)",tc="#cbd5e1",lc="#94a3b8";
              if(showFeedback||reviewMode){
                if(i===q.a){bg="rgba(16,185,129,0.18)";br="#10b981";tc="#6ee7b7";lc="#6ee7b7";}
                else if(i===ca&&i!==q.a){bg="rgba(239,68,68,0.18)";br="#ef4444";tc="#fca5a5";lc="#fca5a5";}
              }else if(ca===i){bg="rgba(59,130,246,0.18)";br="#3b82f6";tc="#60a5fa";lc="#60a5fa";}
              return(
                <button key={i} className="ch" disabled={showFeedback||reviewMode} onClick={()=>pick(i)}
                  style={{background:bg,border:`1px solid ${br}`,borderRadius:"11px",padding:"12px 16px",display:"flex",alignItems:"flex-start",gap:"10px",color:tc}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:"13px",color:lc,minWidth:"20px",marginTop:"1px"}}>{LETTERS[i]}.</span>
                  <span style={{fontSize:"14px",lineHeight:1.5,fontWeight:500}} dangerouslySetInnerHTML={{__html:c.replace(/`([^`]+)`/g,'<code>$1</code>')}}/>
                  {(showFeedback||reviewMode)&&i===q.a&&<span style={{marginLeft:"auto",fontSize:"16px"}}>✓</span>}
                  {(showFeedback||reviewMode)&&i===ca&&i!==q.a&&<span style={{marginLeft:"auto",fontSize:"16px"}}>✗</span>}
                </button>
              );
            })}
          </div>
          {(showFeedback||(reviewMode&&ca!==null))&&(
            <div style={{marginTop:"18px",padding:"12px 16px",borderRadius:"11px",background:isCor?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)",border:`1px solid ${isCor?"#10b981":"#ef4444"}50`}}>
              <p style={{fontSize:"13px",color:isCor?"#6ee7b7":"#fca5a5",fontWeight:600,fontFamily:"'JetBrains Mono',monospace"}}>
                {isCor?"✓ Correct!":`✗ Incorrect — Correct answer: ${LETTERS[q.a]}. ${q.c[q.a]}`}
              </p>
            </div>
          )}
        </div>

        <div style={{display:"flex",gap:"12px",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
          <button className="btn" onClick={prev} disabled={current===0}
            style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:current===0?"#334155":"#94a3b8",fontSize:"13px",padding:"11px 22px",borderRadius:"50px",opacity:current===0?0.4:1,fontWeight:600}}>
            ← Prev
          </button>
          <div style={{display:"flex",gap:"4px",flexWrap:"wrap",justifyContent:"center",maxWidth:"340px"}}>
            {questions.map((_,i)=>{
              const a=answers[i];const ok=a===questions[i].a;
              const dot=a===null?"#334155":reviewMode?(ok?"#10b981":"#ef4444"):"#3b82f6";
              return <div key={i} className="dot" onClick={()=>{sounds.click();setCurrent(i);setShowFeedback(false);}}
                style={{width:i===current?"10px":"7px",height:i===current?"10px":"7px",background:dot,border:i===current?"2px solid #60a5fa":"none",flexShrink:0}}/>;
            })}
          </div>
          {current<59
            ?<button className="btn" onClick={next}
                style={{background:showFeedback||reviewMode?"linear-gradient(135deg,#3b82f6,#8b5cf6)":"rgba(59,130,246,0.18)",border:"1px solid rgba(59,130,246,0.5)",color:"#60a5fa",fontSize:"13px",padding:"11px 22px",borderRadius:"50px",fontWeight:showFeedback||reviewMode?700:600}}>
                Next →
              </button>
            :<button className="btn" onClick={submit}
                style={{background:"linear-gradient(135deg,#10b981,#059669)",border:"none",color:"#fff",fontSize:"13px",padding:"11px 22px",borderRadius:"50px",fontWeight:700}}>
                Submit ✓
              </button>
          }
        </div>
        <p style={{fontSize:"11px",color:"#475569",textAlign:"center",marginTop:"16px",fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>{answered} of 60 answered</p>
      </div>
    </div>
  );
}