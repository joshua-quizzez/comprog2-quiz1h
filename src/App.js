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
// ALL 55 QUESTIONS - Complete OOP Coverage
// ══════════════════════════════════════════════════════════════════════════════

const questions = [
  // HANDOUT 1: CLASSES, OBJECTS, METHODS (1-30)
  {type:"Definition",num:1,q:"A class is:",c:["A specific instance","A blueprint or template for objects with common properties","A method","A variable"],a:1},
  {type:"Definition",num:2,q:"An object is:",c:["A blueprint","A specific and concrete instance of a class","A function","A data type"],a:1},
  {type:"Definition",num:3,q:"A method is:",c:["A variable","A class definition","A self-contained block of code that carries out actions","An object instance"],a:2},
  {type:"Definition",num:4,q:"Data members of an object are:",c:["Its operations/actions","Its characteristics/features","Its methods","Its classes"],a:1},
  {type:"Definition",num:5,q:"Function members of an object are:",c:["Its characteristics","Its operations/actions","Its attributes","Its properties"],a:1},
  {type:"CodeID",num:6,q:"In `public static void main(String[] args)`, `public` means:",c:["The method is private","Any other class can use it","The method is slow","It requires an object"],a:1},
  {type:"CodeID",num:7,q:"In `public static void main(String[] args)`, `static` means:",c:["The method changes","The method can be used without instantiating an object","The method is fast","It requires an object"],a:1},
  {type:"CodeID",num:8,q:"In `public static void main(String[] args)`, `void` means:",c:["The method is empty","The method returns no data","The method returns an integer","The method is public"],a:1},
  {type:"Definition",num:9,q:"Accessor methods (getters):",c:["Set values","Retrieve/return values","Delete values","Create objects"],a:1},
  {type:"Definition",num:10,q:"Mutator methods (setters):",c:["Set or change field values","Only retrieve values","Delete fields","Create classes"],a:0},
  {type:"CodeID",num:11,q:"In `Employee someEmployee = new Employee();`, `Employee` (first one) is:",c:["Object name","The data type/class","A method","A field"],a:1},
  {type:"CodeID",num:12,q:"In `Employee someEmployee = new Employee();`, `someEmployee` is:",c:["The class","The object's name/identifier","A method","A constructor"],a:1},
  {type:"CodeID",num:13,q:"In `Employee someEmployee = new Employee();`, `new` does:",c:["Deletes memory","Allocates memory for the object","Calls a method","Nothing"],a:1},
  {type:"CodeID",num:14,q:"In `Employee someEmployee = new Employee();`, `Employee()` is:",c:["A method call","The constructor that creates the object","An object","A field"],a:1},
  {type:"Definition",num:15,q:"A constructor is:",c:["A regular method","A special method that creates and initializes objects","A variable","A field"],a:1},
  {type:"Definition",num:16,q:"The `private` access specifier means:",c:["Any class can access","No other classes can access the field's values except methods of the same class","The field is public","The field is deleted"],a:1},
  {type:"Definition",num:17,q:"Information hiding is:",c:["Deleting data","Assigning private access so other classes cannot access field values","Making everything public","Removing classes"],a:1},
  {type:"Definition",num:18,q:"Data abstraction is:",c:["Including only essential details without background details","Showing all internal workings","Removing all data","Making everything public"],a:0},
  {type:"Definition",num:19,q:"Data encapsulation is:",c:["Making all data public","Wrapping data and functions into a class, performing data hiding","Removing functions","Separating data from methods"],a:1},
  {type:"Definition",num:20,q:"Polymorphism means:",c:["One form only","Many forms - same word/symbol interpreted differently based on context","No forms","Random forms"],a:1},
  {type:"CodeID",num:21,q:"In the Fish/Tilapia example, `class Tilapia extends Fish`, `extends` means:",c:["Tilapia deletes Fish","Tilapia inherits from Fish","Fish inherits from Tilapia","They are unrelated"],a:1},
  {type:"CodeID",num:22,q:"In `freshwater.name = \"Tippy\";`, `name` is:",c:["A method","A field inherited from Fish superclass","A local variable","A constructor"],a:1},
  {type:"CodeID",num:23,q:"In `freshwater.swim();`, `swim()` is:",c:["A field","A method inherited from Fish superclass","A variable","A class"],a:1},
  {type:"Definition",num:24,q:"A fully qualified identifier:",c:["Is just the method name","Includes class name, dot, and method name","Is just the class name","Has no structure"],a:1},
  {type:"Definition",num:25,q:"The method body is:",c:["The method header","Statements between curly braces that carry out the work","The method name","The return type"],a:1},
  {type:"Definition",num:26,q:"A reference type is:",c:["A primitive type like int","A class type like Employee","Only integers","Only strings"],a:1},
  {type:"Definition",num:27,q:"A primitive type is:",c:["A class type","Built-in types like int, double","A reference type","An object"],a:1},
  {type:"CodeID",num:28,q:"Can a method be placed INSIDE another method in Java?",c:["Yes, always","No, methods cannot be placed inside other methods","Yes, but only main()","Sometimes"],a:1},
  {type:"Definition",num:29,q:"A data field is `static` if:",c:["It occurs once per object","It occurs once per class","It never changes","It is private"],a:1},
  {type:"Definition",num:30,q:"A data field is `non-static` if:",c:["It occurs once per class","It occurs once per object","It is always public","It is deleted"],a:1},

  // HANDOUT 2: INHERITANCE (31-45)
  {type:"Definition",num:31,q:"Inheritance allows:",c:["Deletion of classes","One class to acquire all behaviors and attributes of another class","Creation of variables","Only methods to be shared"],a:1},
  {type:"CodeID",num:32,q:"The `extends` keyword:",c:["Deletes a class","Establishes inheritance between classes","Creates a variable","Removes methods"],a:1},
  {type:"Definition",num:33,q:"A superclass is:",c:["A class that inherits from another","The class that is inherited FROM (parent/base class)","Always private","A method"],a:1},
  {type:"Definition",num:34,q:"A subclass is:",c:["The class that inherits properties FROM another (child/derived class)","The class that is inherited from","Never inherits","A constructor"],a:0},
  {type:"Definition",num:35,q:"Inheritance provides which relationship?",c:["Has-A","Is-A","Uses-A","Deletes-A"],a:1},
  {type:"Application",num:36,q:"If `Car extends Vehicle`, then:",c:["Vehicle IS A Car","Car IS A Vehicle","They are unrelated","Car deletes Vehicle"],a:1},
  {type:"Definition",num:37,q:"Inheritance promotes:",c:["Code duplication","Code reusability by allowing subclass to reuse fields/methods of superclass","Code deletion","Code hiding"],a:1},
  {type:"Definition",num:38,q:"Method overriding happens when:",c:["Methods are deleted","The same method is present in both superclass and subclass with same name and signature","Methods are created","Classes are removed"],a:1},
  {type:"CodeID",num:39,q:"The `@Override` annotation:",c:["Deletes the method","Indicates the method overrides a superclass method","Creates a new class","Is required for all methods"],a:1},
  {type:"CodeID",num:40,q:"In the Fish/Tilapia override example, when `freshwater.swim()` is called:",c:["Fish's swim() is executed","Tilapia's swim() is executed (the overridden version)","Both are executed","Neither is executed"],a:1},
  {type:"CodeID",num:41,q:"The `super` keyword is used to:",c:["Delete the superclass","Call the method of the superclass from the subclass","Create a new object","Remove inheritance"],a:1},
  {type:"CodeID",num:42,q:"In `super.swim();` inside Tilapia's swim() method:",c:["It deletes swim()","It calls Fish's swim() method","It creates a new method","It does nothing"],a:1},
  {type:"Application",num:43,q:"If Tilapia extends Fish, and freshwater is a Tilapia object, can freshwater access Fish's methods?",c:["No, never","Yes, because Tilapia inherits from Fish","Only if Fish is public","Only if methods are static"],a:1},
  {type:"Application",num:44,q:"In inheritance, which is inherited by the subclass?",c:["Only private fields","Only public methods","All non-private fields and methods","Nothing"],a:2},
  {type:"Definition",num:45,q:"Code reusability in inheritance means:",c:["Writing the same code multiple times","The subclass can reuse fields/methods from superclass without rewriting them","Deleting code","Hiding code"],a:1},

  // HANDOUT 2: INTERFACES (46-55)
  {type:"Definition",num:46,q:"An interface is:",c:["A concrete class","A collection of abstract methods (without body) and constant values","A regular method","An object"],a:1},
  {type:"Definition",num:47,q:"The `interface` keyword is used to:",c:["Create a class","Create an interface","Delete a method","Create an object"],a:1},
  {type:"Definition",num:48,q:"Can objects of interfaces be created?",c:["Yes, always","No, interfaces must be implemented by other classes","Sometimes","Only if public"],a:1},
  {type:"CodeID",num:49,q:"The `implements` keyword is used to:",c:["Delete an interface","Apply/implement an interface in a class","Create a variable","Remove methods"],a:1},
  {type:"Definition",num:50,q:"Abstract methods in an interface:",c:["Have a method body","Have NO method body (declaration only)","Are private","Cannot be used"],a:1},
  {type:"CodeID",num:51,q:"If `class Box implements Shape`, Box must:",c:["Delete Shape","Provide implementation for all abstract methods in Shape","Ignore Shape","Create new interfaces"],a:1},
  {type:"Application",num:52,q:"Can a class implement multiple interfaces?",c:["No, only one","Yes, using commas: `class Z implements X, Y`","Never allowed","Only if interfaces are empty"],a:1},
  {type:"CodeID",num:53,q:"In `interface Basketball extends Sports`, Basketball:",c:["Deletes Sports","Extends Sports interface, inheriting its members","Implements Sports","Removes methods"],a:1},
  {type:"Application",num:54,q:"If a class implements Basketball (which extends Sports), it must implement methods from:",c:["Only Basketball","Both Basketball and Sports","Neither","Only Sports"],a:1},
  {type:"Definition",num:55,q:"The main purpose of interfaces is to:",c:["Delete classes","Define a contract/set of functionalities that must be implemented","Create objects directly","Hide all code"],a:1},
];

const TYPE_META = {
  Definition: { color:"#3b82f6", icon:"📚", label:"Definition" },
  Application: { color:"#10b981", icon:"⚙️", label:"Application" },
  CodeID: { color:"#f59e0b", icon:"💻", label:"Code ID" },
};

const LETTERS = ["A","B","C","D"];

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(55).fill(null));
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

  function next(){sounds.click();setShowFeedback(false);if(current<54)setCurrent(c=>c+1);else{setTimerActive(false);stopBgMusic();sounds.finish();setScreen("results");}}
  function prev(){if(current>0){sounds.click();setShowFeedback(false);setCurrent(c=>c-1);}}
  function submit(){setTimerActive(false);stopBgMusic();sounds.finish();setScreen("results");}
  function restart(){setAnswers(Array(55).fill(null));setCurrent(0);setShowFeedback(false);setTimeLeft(5400);setTimerActive(false);setReviewMode(false);setScreen("intro");}

  const score=answers.reduce((a,v,i)=>v===questions[i].a?a+1:a,0);
  const pct=Math.round((score/55)*100);
  const grade=pct>=90?{label:"Excellent!",c:"#10b981",e:"🏆"}:pct>=80?{label:"Very Good!",c:"#3b82f6",e:"⭐"}:pct>=75?{label:"Passed",c:"#8b5cf6",e:"✅"}:pct>=60?{label:"Needs Review",c:"#f59e0b",e:"📚"}:{label:"Keep Studying",c:"#ef4444",e:"💪"};

  const sections=[
    {label:"Classes & Objects Basics",qs:Array.from({length:5},(_,i)=>i)},
    {label:"Methods & Access Modifiers",qs:Array.from({length:8},(_,i)=>i+5)},
    {label:"Object Creation & Constructors",qs:Array.from({length:7},(_,i)=>i+13)},
    {label:"OOP Core Concepts",qs:Array.from({length:10},(_,i)=>i+20)},
    {label:"Inheritance Fundamentals",qs:Array.from({length:15},(_,i)=>i+30)},
    {label:"Interfaces",qs:Array.from({length:10},(_,i)=>i+45)},
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
        <div style={{fontSize:"11px",letterSpacing:"4px",color:"#60a5fa",textTransform:"uppercase",marginBottom:"10px",fontWeight:600}}>IT2408 • COMPREHENSIVE</div>
        <h1 style={{fontSize:"clamp(28px,5vw,44px)",fontWeight:800,color:"#f1f5f9",marginBottom:"8px",lineHeight:1.15,textShadow:"0 0 40px rgba(59,130,246,0.4)",letterSpacing:"-0.5px"}}>OOP Complete Exam</h1>
        <p style={{color:"#94a3b8",fontSize:"15px",marginBottom:"28px",fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.3px"}}>Classes • Objects • Methods • Inheritance • Interfaces</p>
        
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:"12px",marginBottom:"24px"}}>
          {[["55","Questions"],["90","Minutes"],["1pt","Each"],["6","Sections"]].map(([v,l])=>(
            <div key={l} style={{background:"rgba(59,130,246,0.12)",border:"1px solid rgba(59,130,246,0.3)",borderRadius:"12px",padding:"14px 10px"}}>
              <div style={{fontSize:"26px",fontWeight:800,color:"#60a5fa",lineHeight:1}}>{v}</div>
              <div style={{fontSize:"10px",color:"#64748b",marginTop:"4px",textTransform:"uppercase",letterSpacing:"1px",fontWeight:600}}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"16px 20px",marginBottom:"24px",textAlign:"left"}}>
          <div style={{fontSize:"10px",fontWeight:700,color:"#60a5fa",letterSpacing:"2.5px",marginBottom:"10px",textTransform:"uppercase"}}>Complete Coverage</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
            {["Classes & Objects","Methods & Modifiers","Constructors","Inheritance & extends","Method Overriding","super Keyword","Interfaces & implements","Abstract Methods"].map(t=>(
              <div key={t} style={{fontSize:"11px",color:"#cbd5e1",display:"flex",alignItems:"center",gap:"6px"}}>
                <span style={{color:"#60a5fa"}}>✓</span>
                <span style={{fontWeight:500}}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:"rgba(251,191,36,0.1)",border:"1px solid rgba(251,191,36,0.3)",borderRadius:"12px",padding:"12px 18px",marginBottom:"26px"}}>
          <p style={{fontSize:"11px",color:"#fbbf24",fontFamily:"'JetBrains Mono',monospace",lineHeight:1.5}}>🎵 Focus music • Code examples • Fish/Tilapia scenarios • Box/Shape demos</p>
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
          <div style={{fontSize:"58px",fontWeight:800,color:grade.c,lineHeight:1}}>{score}<span style={{fontSize:"24px",color:"#64748b",fontWeight:600}}>/55</span></div>
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
          <div style={{height:"100%",width:`${(current/55)*100}%`,background:"linear-gradient(90deg,#3b82f6,#8b5cf6)",borderRadius:"8px",transition:"width 0.4s"}}/>
        </div>
        <div style={{fontSize:"11px",color:"#64748b",fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>{current+1}/55</div>
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
            <span dangerouslySetInnerHTML={{__html:q.q.replace(/`([^`]+)`/g,'<code>$1</code>')}}/>
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
          <div style={{display:"flex",gap:"4px",flexWrap:"wrap",justifyContent:"center",maxWidth:"360px"}}>
            {questions.map((_,i)=>{
              const a=answers[i];const ok=a===questions[i].a;
              const dot=a===null?"#334155":reviewMode?(ok?"#10b981":"#ef4444"):"#3b82f6";
              return <div key={i} className="dot" onClick={()=>{sounds.click();setCurrent(i);setShowFeedback(false);}}
                style={{width:i===current?"10px":"7px",height:i===current?"10px":"7px",background:dot,border:i===current?"2px solid #60a5fa":"none",flexShrink:0}}/>;
            })}
          </div>
          {current<54
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
        <p style={{fontSize:"11px",color:"#475569",textAlign:"center",marginTop:"16px",fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>{answered} of 55 answered</p>
      </div>
    </div>
  );
}