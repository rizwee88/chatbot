 var bgImages=document.querySelectorAll('.bg-slider img');
    var current=0;
    setInterval(()=>{
      bgImages[current].classList.remove('active');
      current=(current+1)%bgImages.length;
      bgImages[current].classList.add('active');
    },8000);

    var cities=[{name:'Karachi',score:0},{name:'Lahore',score:0},{name:'Islamabad',score:0},{name:'Faisalabad',score:0}];
    var questions=[
      {q:'Is the city located near the sea?',map:{Karachi:2}},
      {q:'Is it the federal capital with Margalla Hills?',map:{Islamabad:2}},
      {q:'Is it known for textile industries and a famous Clock Tower?',map:{Faisalabad:2}},
      {q:'Is it the cultural capital with historical sites like Badshahi Mosque?',map:{Lahore:2}},
      {q:'Is it a major business hub?',map:{Karachi:1,Lahore:1}},
      {q:'Is the city in Punjab?',map:{Lahore:1,Faisalabad:1}},
      {q:'Is it a planned city with modern architecture?',map:{Islamabad:1}},
      {q:'Is it known for festivals or historical heritage?',map:{Lahore:1}},
      {q:'Is it famous for beaches or seaside areas?',map:{Karachi:2}},
      {q:'Is it known for industrial strength and agriculture links?',map:{Faisalabad:1}}
    ];

    var qIndex=0;
    var qaList=document.getElementById('qaList');
    var result=document.getElementById('result');
    var clickSound=document.getElementById('clickSound');

    function renderQuestion(){
      if(qIndex>=questions.length){makeGuess();return;}
      var item=questions[qIndex];
      var li=document.createElement('li');
      li.innerHTML=`<div class='question'>${item.q}</div>`;
      var btns=document.createElement('div');
      btns.className='answer-buttons';
      ['Yes','No','Not sure'].forEach(ans=>{
        var b=document.createElement('button');
        b.className='btn '+(ans==='Yes'?'yes':ans==='No'?'no':'maybe');
        b.textContent=ans;
        b.onclick=()=>{clickSound.play();selectAnswer(ans,item,li);};
        btns.appendChild(b);
      });
      li.appendChild(btns);
      qaList.appendChild(li);
    }

    function selectAnswer(ans,item,li){
      li.querySelectorAll('button').forEach(b=>b.disabled=true);
      if(ans==='Yes')cities.forEach(c=>c.score+=(item.map[c.name]||0));
      else if(ans==='No')cities.forEach(c=>c.score-=(item.map[c.name]||0)*0.2);
      else cities.forEach(c=>c.score+=0.05);
      qIndex++;
      setTimeout(renderQuestion,700);
    }

    function makeGuess(){
      var sorted=[...cities].sort((a,b)=>b.score-a.score);
      var top=sorted[0];
      var second=sorted[1];
      if(top.score-second.score<0.5){
        result.innerHTML=`I am not compvarely sure. My top guesses are: ${sorted.map(s=>s.name).join(', ')}.`;
      } else {
        result.innerHTML=`I think you were thinking of <span style='color:#3b82f6;'>${top.name}</span>! 🎉`;
        startConfetti();
      }
      document.getElementById('restart').style.display='block';
    }

    function restart(){
      qaList.innerHTML=''; result.innerHTML=''; document.getElementById('restart').style.display='none';
      cities.forEach(c=>c.score=0); qIndex=0; renderQuestion();
    }

    // Confetti animation
    var canvas=document.getElementById('confetti');
    var ctx=canvas.getContext('2d');
    canvas.width=window.innerWidth; canvas.height=window.innerHeight;
    var confettiPieces=[];
    function startConfetti(){
      confettiPieces=[];
      for(var i=0;i<150;i++){
        confettiPieces.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height-canvas.height,color:`hsl(${Math.random()*360},100%,60%)`,size:6+Math.random()*4,speed:2+Math.random()*3});
      }
      animateConfetti();
      setTimeout(()=>confettiPieces=[],4000);
    }

    function animateConfetti(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      confettiPieces.forEach(p=>{
        ctx.fillStyle=p.color;
        ctx.fillRect(p.x,p.y,p.size,p.size);
        p.y+=p.speed;
        if(p.y>canvas.height)p.y=-10;
      });
      if(confettiPieces.length>0)requestAnimationFrame(animateConfetti);
    }

    renderQuestion();