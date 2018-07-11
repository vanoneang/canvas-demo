


var WINDOW_WIDTH = 1024
var WINDOW_HEIGHT = 768
var RADIUS = 8         // 小球半径
var MARGIN_TOP = 60    // 数字距离画布上边距 
var MARGIN_LEFT = 30   // 数字距离画布左边距

var endTime = new Date()
endTime.setTime( endTime.getTime() + 3600*1000 )
var curShowTimeSeconds = 0 // 现在倒计时需要多少秒


var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]

window.onload = function () {

  WINDOW_WIDTH = document.body.clientWidth
  WINDOW_HEIGHT = document.body.clientHeight

  MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10)
  RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1

  MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5)

  var canvas = document.getElementById('canvas')
  var context = canvas.getContext('2d')

  canvas.width = WINDOW_WIDTH
  canvas.height = WINDOW_HEIGHT

  curShowTimeSeconds = getCurrentShowTimeSeconds()

  // 动画的架构
  setInterval(function(){
    render( context )
    update()
  },50)
}

function render( context ) {
  
  // ！！！每一帧重新渲染需要清零
  context.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT)

  var hours = parseInt( curShowTimeSeconds / 3600);
  var minutes = parseInt( (curShowTimeSeconds - hours * 3600)/60 )
  var seconds = curShowTimeSeconds % 60 

  renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), context )                      // 小时十 
  renderDigit( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) , context )  // 小时个

  renderDigit( MARGIN_LEFT + 30*(RADIUS + 1) , MARGIN_TOP , 10 , context )                // ：
  renderDigit( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(minutes/10) , context);
  renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , context);
  
  renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , context);
  renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , context);
  renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , context);

  // 小球的绘制
  for( var i = 0 ; i < balls.length ; i ++ ){
    context.fillStyle=balls[i].color;

    context.beginPath();
    context.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
    context.closePath();

    context.fill();
  }
}

/**
 * 绘制每一个数字
 * @param {Number} x 开始x
 * @param {Number} y 开始y
 * @param {Number} num 数字
 * @param {Object} context 上下文
 */
function renderDigit( x, y, num, context ) {
  context.fillStyle='rgb(0,102,153)' // 填充颜色
  
  for( var i = 0 ; i < digit[num].length ; i ++ )
    for(var j = 0 ; j < digit[num][i].length ; j ++ )
        if( digit[num][i][j] == 1 ){
            context.beginPath();
            context.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI )
            context.closePath()

            context.fill()
        }

}

/**
 * 获取倒计时的秒数
 */
function getCurrentShowTimeSeconds() {
  var curTime = new Date();
  var ret = endTime.getTime() - curTime.getTime();
  ret = Math.round( ret/1000 )

  return ret >= 0 ? ret : 0;
}

/**
 * 1. 时间的变化
 * 2. 新的小球
 * 3. 更新已经产生的小球运动
 */
function update(){
  var nextShowTimeSeconds = getCurrentShowTimeSeconds(); // 下一次要显示的时间（倒计时秒数）

  var nextHours = parseInt( nextShowTimeSeconds / 3600);
  var nextMinutes = parseInt( (nextShowTimeSeconds - nextHours * 3600)/60 )
  var nextSeconds = nextShowTimeSeconds % 60

  var curHours = parseInt( curShowTimeSeconds / 3600);
  var curMinutes = parseInt( (curShowTimeSeconds - curHours * 3600)/60 )
  var curSeconds = curShowTimeSeconds % 60

  // 如果当前倒计时时间不一样,生成小球
  if( nextSeconds != curSeconds ){
      if( parseInt(curHours/10) != parseInt(nextHours/10) ){
          addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHours/10) );
      }
      if( parseInt(curHours%10) != parseInt(nextHours%10) ){
          addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10) );
      }

      if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
          addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
      }
      if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
          addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
      }

      if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
          addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
      }
      if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
          addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
      }

      curShowTimeSeconds = nextShowTimeSeconds // 把当前时间置换
  }

  updateBalls(); 

  console.log(balls.length)
}

/**
 * 小球运动变化
 */
function updateBalls(){

  for( var i = 0 ; i < balls.length ; i ++ ){

      balls[i].x += balls[i].vx;
      balls[i].y += balls[i].vy;
      balls[i].vy += balls[i].g;

      if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){ // 下边沿碰撞检测
          balls[i].y = WINDOW_HEIGHT-RADIUS;
          balls[i].vy = - balls[i].vy*0.75;
      }

      if ( balls[i].x >= WINDOW_WIDTH-RADIUS) {
        balls[i].x = WINDOW_WIDTH-RADIUS
        balls[i].vx = -balls[i].vx*0.75
      }
  }
  var cnt = 0
  for(var i=0;i<balls.length;i++)
      if(balls[i].x+RADIUS>0 && balls[i].x - RADIUS < WINDOW_WIDTH) // 小球还留在画布
          balls[cnt++] = balls[i]

  while(balls.length > Math.min(300,cnt)){ // 删掉走出画布的小球
      balls.pop();
  }
}

/**
 * 生成带颜色的小球
 * @param {*} x 
 * @param {*} y 
 * @param {*} num 
 */
function addBalls( x , y , num ){

  for( var i = 0  ; i < digit[num].length ; i ++ )
      for( var j = 0  ; j < digit[num][i].length ; j ++ )
          if( digit[num][i][j] == 1 ){
              var aBall = {
                  x:x+j*2*(RADIUS+1)+(RADIUS+1),
                  y:y+i*2*(RADIUS+1)+(RADIUS+1),
                  g:1.5+Math.random(),
                  vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4, // -4 、 4
                  vy: -5, // 向上抛
                  color: colors[ Math.floor( Math.random()*colors.length ) ]
              }

              balls.push( aBall )
          }
}
