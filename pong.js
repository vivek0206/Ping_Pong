const cvs=document.getElementById("pong");
const ctx=cvs.getContext("2d");

function drawRect(x,y,w,h,color){
    ctx.fillStyle=color;
    ctx.fillRect(x,y,w,h);
}
const WINNING_SCORE=10;
var showingWinScreen = false;

const user={
    x:0,
    y:cvs.height/2-100/2,
    width:10,
    height:100,
    color:"WHITE",
    score:0
    
}
const com={
    x:cvs.width-10,
    y:cvs.height/2-100/2,
    width:10,
    height:100,
    color:"WHITE",
    score:0
    
}
const net={
    x:cvs.width/2-1,
    y:0,
    width:2,
    height:10,
    color:"WHITE"
}
const ball={
    x:cvs.width/2,
    y:cvs.height/2,
    radius:10,
    spped:5,
    velocityX:5,
    velocityY:5,
    color:"WHITE"
}


function handleMouseClick(evt) {
            if(showingWinScreen) {
                com.score=0;
                user.score=0;
                showingWinScreen = false;
            }
        }

function drawNet(){
    for(let i=0; i<=cvs.height; i+=15){
        drawRect(net.x,net.y+i,net.width,net.height,net.color);
    }
}

function drawCircle(x,y,r,color){
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
}
function drawText(text,x,y,color){
    ctx.fillStyle=color;
    ctx.font="40px fantasy";
    ctx.fillText(text,x,y);
}

function render(){
    drawRect(0,0,cvs.width,cvs.height,"black");
    
    
    drawNet();
    
    drawText(user.score,cvs.width/4,cvs.height/5,"WHITE");
    drawText(com.score,3*cvs.width/4,cvs.height/5,"WHITE");
    
    if(showingWinScreen){
                ctx.fillStyle="RED";
                if(user.score >= WINNING_SCORE){
                    ctx.fillText("Won!",0,cvs.height/2);
                }else if(com.score >= WINNING_SCORE){
                    ctx.fillText("Won!",cvs.width/2,cvs.height/4);
                }
                
                drawText("Click to continue",cvs.width/4,cvs.height/2,"WHITE");
                return;
            }
    
    drawRect(user.x,user.y,user.width,user.height,"WHITE");
    drawRect(com.x,com.y,com.width,com.height,"WHITE");
    
    drawCircle(ball.x,ball.y,ball.radius,ball.color);

}
cvs.addEventListener("mousemove",movePaddle);
cvs.addEventListener("mousedown",handleMouseClick);
function movePaddle(evt){
    let rect=cvs.getBoundingClientRect();
    user.y=evt.clientY-rect.top-user.height/2;
}
function collision(b,p){
    b.top=b.y-b.radius;
    b.bottom=b.y+b.radius;
    b.left=b.x-b.radius;
    b.right=b.x+b.radius;
    
    p.top=p.y;
    p.bottom=p.y+p.height;
    p.left=p.x;
    p.right=p.x+p.width;
    
    return b.right>p.left&&b.bottom>p.top &&b.left<p.right&&b.top<p.bottom;
}
function resetBall(){
    if(com.score >= WINNING_SCORE || user.score >= WINNING_SCORE){
                showingWinScreen = true;
            }
    ball.x=cvs.width/2;
    ball.y=cvs.height/2;
    
    ball.speed=3;
    ball.velocityX=-ball.velocityX;
}
function update(){
    
    if(showingWinScreen){
                return;
            }
    ball.x+=ball.velocityX;
    ball.y+=ball.velocityY;
    
    let computerLevel=0.1;
    com.y+=(ball.y-(com.y+com.height/2))*computerLevel;
    
    if(ball.y<0&&ball.velocityY<0)
        {  
            ball.velocityY=-ball.velocityY;
        }
    if(ball.y>cvs.height&&ball.velocityY>0)
        {
            ball.velocityY=-ball.velocityY;
        }
    
    
    if(ball.x<10)
        {
            if(ball.y>user.y&&ball.y<user.y+user.height){
                ball.velocityX=-ball.velocityX;
                let collidePoint = (ball.y - (user.y + user.height/2));
                ball.velocityY = collidePoint*0.2;
            }else{
                com.score++;
                resetBall();
            }
        }
    if(ball.x>cvs.width-10)
        {
            if(ball.y>com.y&&ball.y<com.y+com.height){
                ball.velocityX=-ball.velocityX;
                let collidePoint = (ball.y - (com.y + com.height/2));
                ball.velocityY = collidePoint*0.2;
            }else{
                user.score++;
                resetBall();
            }
        }
    
    
}

function game(){
    update();
    render();
}
const framePerSecond=50;
setInterval(game,1000/framePerSecond);

