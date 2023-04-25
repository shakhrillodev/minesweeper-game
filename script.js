window.addEventListener('DOMContentLoaded', ()=>{

  let loader = document.querySelector('.loader');
  setTimeout(()=>{loader.style.opacity = '0';
              setTimeout(()=>{loader.style.display = 'none'}, 1000)        
  }, 100)

let seconds = document.querySelector('.seconds')
let startmodal = document.querySelector('.start')
let startBtn = document.querySelector('.belowimg button')
let bombsleft = document.querySelector('.count p')
let allbombsleft = 10;
let counttimer = 0;
let modal = document.querySelector('.modal')
let bg = document.querySelector('.bg')
let safelyopened = 0;
let timer
let stopTimer
let isstarted = 0

///////////////////// OPERATING SOUNDS ///////////////////////////
class sound{
  constructor(src){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
  
  }
  play = function(){
      this.sound.play();
  }
  stop = function(){
      this.sound.pause();
  }    
}

let backgroundSound = new sound("sounds/background.mp3"),
    winSound = new sound("sounds/win.mp3"),
    loseSound = new sound("sounds/Fail.mp3"),
    boomSound = new sound("sounds/Boom.mp3"),
    pop = new sound("sounds/pop.mp3");


//______________________________________________________________//
//////////////////////// START BUTTON CONFIGURATION , ADDING TIMER /////////////////////////
startBtn.addEventListener('click', ()=>{
  startmodal.style.opacity = '0'
  backgroundSound.play()
  setTimeout(()=>{startmodal.style.display = 'none'}, 1500)
  
  function startTimer() {
    timer = setTimeout(() => {
      counttimer++;
      seconds.innerHTML = `${counttimer}`;
      startTimer();
    }, 1000);
  }

  if(isstarted===0){
    isstarted = 1;
  startTimer()}

  stopTimer = function() {
    clearTimeout(timer);
  }
  

})
//____________________________________________________________________________//


//////////////////////// FILL BACKGROUND FIELD  COLOR////////////////////////
let field = document.querySelector('.field')
let fieldcover = document.querySelector('.field-cover')

class boxes{
    constructor(clas, x, y, inside){
        this.clas = clas
        this.x = x 
        this.y = y 
        this.inside = inside       
    }

    render(){
        let hidden = document.createElement('div');
        hidden.classList.add('mines')
        hidden.classList.add(this.clas)
        field.append(hidden)
    }
}

class boxescover{
  constructor(clas, x, y, inside){
      this.clas = clas
      this.x = x 
      this.y = y         
      this.inside = inside
  }

  render(){
      let hidden1 = document.createElement('div');
      hidden1.classList.add('mines-cover')
      hidden1.classList.add(this.clas)
      fieldcover.append(hidden1)
  }
}

let color = [['lightblue', 'darkcyan'], ['darkcyan', 'lightblue']]
let covercolor = [['green', 'coral'], ['coral', 'green']]
let temparr = [, ]
let temp = 'lightblue'
let icounter = 0
let dimension1 = []
let cover = []
for(let i=0;i<8;i++){
    temparr = color[i%2]
    for(let j=0;j<10;j++){
        temp = temparr[j%2]
        dimension1[icounter] = new boxes(temp, i, j, 0)
        dimension1[icounter].render()
        icounter++
    }
}


icounter = 0;
temp = 'coral'
for(let i=0;i<8;i++){
  temparr = covercolor[i%2]
  for(let j=0;j<10;j++){
      temp = temparr[j%2]
      cover[icounter] = new boxescover(temp, i, j)
      cover[icounter].render()
      icounter++
  }
}

let minescover = document.querySelectorAll('.mines-cover')

//___________________________________________________________//


//////////////////// BOMBA LOKATSIYALARINI YARATISH //////////////////////
let bombsloc = [10]
let mines = document.querySelectorAll('.mines')
let limit;
    for(let i=0;i<10;i++){
        bombsloc[i] = parseInt(Math.random()*80)
        limit=i-1;
        while(limit>=0){
            if(bombsloc[limit]==bombsloc[i]){
                i--;
                break;
            }
            limit--;
        }
    }

//________________________________________________________________//

///////////////// WHOLE COORDINATORS AND SETTERS ///////////////
bombsloc.forEach((bomb)=>{
    dimension1[bomb].inside = '💣'
})

let bomb2d = [8], counter = 0;

for(let i=0;i<8;i++){
    bomb2d[i] = []
    for(let j=0;j<10;j++){
        bomb2d[i][j] = dimension1[counter].inside
        counter++;
    }
}

for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 10; j++) {
      if (bomb2d[i][j] === '💣') {
        // update adjacent elements
        for (let x = i - 1; x <= i + 1; x++) {
          for (let y = j - 1; y <= j + 1; y++) {
            // check if current element is valid and not a bomb
            if (x >= 0 && y >= 0 && x < 8 && y < 10 && bomb2d[x][y] !== '💣') {
              bomb2d[x][y]++;
            }
          }
        }
      }
    }
  }

counter = 0;

for(let i=0;i<8;i++){
    for(let j=0;j<10;j++){
        dimension1[counter].inside = bomb2d[i][j];
        counter++;
    }
}

mines.forEach((mine, i)=>{
    if(dimension1[i].inside!==0)
    mine.innerHTML = `<p>${dimension1[i].inside}</p>`
});


////////////////USER INTERACTION AND OPENING SPACES FUNCTION /////////////////////
minescover.forEach((minecover, i)=>{
    minecover.addEventListener('click', (event)=>{
      if(cover[i].inside === '🚩'){
      }
      else if(dimension1[i].inside!=='💣' && dimension1[i].inside!==0 && minecover.style.backgroundColor !== 'transparent'){
          
          minecover.style.backgroundColor = 'transparent'
          minecover.style.borderColor = 'transparent'
              safelyopened = 0
            minescover.forEach((mine)=>{
              if(mine.style.backgroundColor === 'transparent')
              safelyopened++
            })
          
          if(safelyopened===70){
          won()
          winSound.play()
          }
      }
      else if(dimension1[i].inside===0){
        open(bomb2d, dimension1[i].x, dimension1[i].y)
        counter = 0
        safelyopened = 0
        for(let j=0;j<8;j++){
          for(let q=0;q<10;q++){
          if(bomb2d[j][q]===9 || bomb2d[j][q]==='open'){
            minescover[counter].style.backgroundColor = 'transparent'
            minescover[counter].style.borderColor = 'transparent'
          }
          counter++
        }}
        minescover.forEach((mine)=>{
          if(mine.style.backgroundColor === 'transparent')
          safelyopened++
        })

        if(safelyopened===70){
        won()
        winSound.play()
      }
      }
      else if(dimension1[i].inside==='💣'){
        minecover.style.backgroundColor = 'transparent'
        minecover.style.borderColor = 'transparent'
        counter = 0
        stopTimer()
          bg.innerHTML = `<img src="images/lost.png" alt="lost">'
            <button onclick="location.reload()">Replay</button>`
            modal.style.display = 'flex'
          setTimeout(()=>{ 
          dimension1[i].inside = '💥'
          mines[i].innerHTML = `<p>${dimension1[i].inside}</p>`
          boomSound.play()
          modal.addEventListener('click', ()=>{
            setTimeout(() => {
              loseSound.play()
              modal.style.opacity = '100%'
            }, 100);
          })
          for(let j=0;j<10;j++){
            if(bombsloc[j]!==i && cover[bombsloc[j]].inside!=='🚩'){
            setTimeout(()=>{
            mines[bombsloc[j]].innerHTML = `<p>💥</p>`
            minescover[bombsloc[j]].style.backgroundColor = 'transparent'
            minescover[bombsloc[j]].style.borderColor = 'transparent'
            boomSound.play()
            }, parseInt(Math.random()*3000+1000))}
          }
          setTimeout(()=>{cover.forEach((face, i)=>{
            if(face.inside === '🚩' &&  mines[i].innerHTML !== `<p>💥</p>` && mines[i].innerHTML !== `<p>💣</p>`){
              minescover[i].innerHTML = `<p style="color: black;">X</p>`
              pop.play()
            }
          })}, 5000)
        }, 1000)
      }
    })
});
//_________________________________________________________//

////////////////// OPENING EMPTY CELLS //////////////////////
function open(arr, x, y) {
    if (arr[x][y] == 0 || arr[x][y] == 9) {
      if(arr[x][y] === 0)
        arr[x][y] = 9
      if (x-1>=0 && y-1>=0 && arr[x-1][y-1] == 0) {
        arr[x-1][y-1] = 9;
        open(arr, x-1, y-1);
      }
      if (arr[x][y-1] == 0 && y-1>=0) {
        arr[x][y-1] = 9;
        open(arr, x, y-1);
      }
      if (x+1<8 && y-1>=0 && arr[x+1][y-1] == 0) {
        arr[x+1][y-1] = 9;
        open(arr, x+1, y-1);
      }
      if (x+1<8 && arr[x+1][y] == 0) {
        arr[x+1][y] = 9;
        open(arr, x+1, y);
      }
      if (x+1<8 && y+1<10 && arr[x+1][y+1] == 0) {
        arr[x+1][y+1] = 9;
        open(arr, x+1, y+1);
      }
      if (y+1<10 && arr[x][y+1] == 0) {
        arr[x][y+1] = 9;
        open(arr, x, y+1);
      }
      if (x-1>=0 && y+1<10 && arr[x-1][y+1] == 0) {
        arr[x-1][y+1] = 9;
        open(arr, x-1, y+1);
      }
      if ( x-1>=0 && arr[x-1][y] == 0) {
        arr[x-1][y] = 9;
        open(arr, x-1, y);
      }

      //____________________________________________________________//
      
      /////////////// OPENING AROUND EMPTY CELLS /////////////////////
      if (x-1>=0 && y-1>=0 && arr[x-1][y-1] !== 9) {
        arr[x-1][y-1] = 'open';
      }
      if (arr[x][y-1] !== 9 && y-1>=0) {
        arr[x][y-1] = 'open';
      }
      if (x+1<8 && y-1>=0 && arr[x+1][y-1] !== 9) {
        arr[x+1][y-1] = 'open';
      }
      if (x+1<8 && arr[x+1][y] !== 9) {
        arr[x+1][y] = 'open';
      }
      if (x+1<8 && y+1<10 && arr[x+1][y+1] !== 9) {
        arr[x+1][y+1] = 'open';
      }
      if (y+1<10 && arr[x][y+1] !== 9) {
        arr[x][y+1] = 'open';
      }
      if (x-1>=0 && y+1<10 && arr[x-1][y+1] !== 9) {
        arr[x-1][y+1] = 'open';
      }
      if ( x-1>=0 && arr[x-1][y] !== 9) {
        arr[x-1][y] = 'open';
      }

    }
  }
    
//_______________________________________________________________//

///////////////// ADDING EVENT LISTENER TO RIGHT CLICK, PLACING FLAG ///////////////////////////
minescover.forEach((mine, i)=>{
  mine.addEventListener('contextmenu', (event)=>{
    event.preventDefault()
    if(cover[i].inside === '🚩'){
      cover[i].inside = '';
      mine.innerHTML = `<p></p>`
      allbombsleft++
      bombsleft.innerHTML = `<p>${allbombsleft}</p>`
    }
    else if(mine.style.backgroundColor!=='transparent'){
    cover[i].inside = '🚩';
    mine.innerHTML = `<p>${cover[i].inside}</p>`
    allbombsleft--
    bombsleft.innerHTML = `<p>${allbombsleft}</p>`
  }
  })
})




//_______________________________________________________________//
// //////////////////// WON CASE /////////////////////////
function won(){
  stopTimer()
        bg.innerHTML = `<img src="images/win.png" alt="win">'
        <button onclick="location.reload()">Replay</button>`
        modal.style.display = 'flex'
        setTimeout(()=>{
          modal.style.opacity = '100%'
        }, 1000)
        
}


    
})