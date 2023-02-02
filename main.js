alert("Classic Pacman Game \nInstructions: Use keys W,A,S,D for movement. Enjoy!!!")

const canvas = document.getElementById("game");
const context = canvas.getContext('2d');

const score = document.getElementById("score");


canvas.width = innerWidth;
canvas.height = innerHeight;

class Obstacles {
    static width = 40;
    static height = 40;
    constructor({position, image}){
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image;
    }
    draw(){
        // context.fillStyle = 'blue';
        // context.fillRect(this.position.x,this.position.y,this.width,this.height);
        context.drawImage(this.image,this.position.x,this.position.y)
    }
}

class Pacman{
    constructor({position,speed}){
        this.position = position;
        this.speed = speed;
        this.radius = 15;
        this.radians = 0.70
        this.openRate = 0.12
        this.rotation = 0;
    }
    draw(){
        context.save();
        context.translate(this.position.x,this.position.y);
        context.rotate(this.rotation);
        context.translate(-this.position.x,-this.position.y);
        context.beginPath();
        context.arc(this.position.x,this.position.y,this.radius,this.radians,
            Math.PI * 2 -this.radians);
        context.lineTo(this.position.x,this.position.y);
        context.fillStyle = 'Yellow';
        context.fill();
        context.closePath();
        context.restore();
    }
    update(){
        this.draw();
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        if(this.radians < 0 || this.radians > .70)
        this.openRate = -this.openRate;

        this.radians += this.openRate;
    }
}

class Ghost{
    static baseSpeed = 2;
    constructor({position,speed,color='red'}){
        this.position = position;
        this.speed = speed;
        this.radius = 15;
        this.color = color;
        this.prevCollisions = [];
        this.baseSpeed = 2;
        this.scared = false;
    }
    draw(){
        context.beginPath();
        context.arc(this.position.x,this.position.y,this.radius,0,
            Math.PI * 2);
        context.fillStyle =this.scared ? 'blue' : this.color;
        context.fill();
        context.closePath();
    }
    update(){
        this.draw();
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
    }
}

class Pellets{
    constructor({position}){
        this.position = position;
        this.radius = 3;
    }
    draw(){
        context.beginPath();
        context.arc(this.position.x,this.position.y,this.radius,0,
            Math.PI * 2);
        context.fillStyle = 'white';
        context.fill();
        context.closePath();
    }
}


class PowerUp{
    constructor({position}){
        this.position = position;
        this.radius = 7;
    }
    draw(){
        context.beginPath();
        context.arc(this.position.x,this.position.y,this.radius,0,
            Math.PI * 2);
        context.fillStyle = 'white';
        context.fill();
        context.closePath();
    }
}

const keys = {
    w:{
        pressed: false
    },
    a:{
        pressed: false
    },
    s:{
        pressed: false
    },
    d:{
        pressed: false
    }
}

let last = '';
let realscore = 0;
const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
  ]

function createImage(src){
    const image = new Image();
    image.src = src;
    return image;
}
const pellets = [];
const boundaries = [];
const powerUps = [];
const ghosts = [
    new Ghost({
        position:{
            x: Obstacles.width*5 + Obstacles.width/2,
            y: Obstacles.height*8 + Obstacles.height/2,
        },
        speed:({
            x:Ghost.baseSpeed,y:0
        }),
    }),
    new Ghost({
        position:{
            x: Obstacles.width*5 + Obstacles.width/2,
            y: Obstacles.height*8 + Obstacles.height/2,
        },
        speed:({
            x:-Ghost.baseSpeed,y:0
        }),
        color: 'orange'
    }),
    new Ghost({
        position:{
            x: Obstacles.width*5 + Obstacles.width/2,
            y: Obstacles.height*8 + Obstacles.height/2,
        },
        speed:({
            x:Ghost.baseSpeed,y:0
        }),
        color: 'pink'
    })
];
const pacman = new Pacman({
    position:{
        x: Obstacles.width + Obstacles.width/2,
        y: Obstacles.height + Obstacles.height/2,
    },
    speed:{
        x:0,
        y:0
    }
});
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      switch (symbol) {
        case '-':
          boundaries.push(
            new Obstacles({
              position: {
                x: Obstacles.width * j,
                y: Obstacles.height * i
              },
              image: createImage('./img/pipeHorizontal.png')
            })
          )
          break
        case '|':
          boundaries.push(
            new Obstacles({
              position: {
                x: Obstacles.width * j,
                y: Obstacles.height * i
              },
              image: createImage('./img/pipeVertical.png')
            })
          )
          break
        case '1':
          boundaries.push(
            new Obstacles({
              position: {
                x: Obstacles.width * j,
                y: Obstacles.height * i
              },
              image: createImage('./img/pipeCorner1.png')
            })
          )
          break
        case '2':
          boundaries.push(
            new Obstacles({
              position: {
                x: Obstacles.width * j,
                y: Obstacles.height * i
              },
              image: createImage('./img/pipeCorner2.png')
            })
          )
          break
        case '3':
          boundaries.push(
            new Obstacles({
              position: {
                x: Obstacles.width * j,
                y: Obstacles.height * i
              },
              image: createImage('./img/pipeCorner3.png')
            })
          )
          break
        case '4':
          boundaries.push(
            new Obstacles({
              position: {
                x: Obstacles.width * j,
                y: Obstacles.height * i
              },
              image: createImage('./img/pipeCorner4.png')
            })
          )
          break
        case 'b':
          boundaries.push(
            new Obstacles({
              position: {
                x: Obstacles.width * j,
                y: Obstacles.height * i
              },
              image: createImage('./img/block.png')
            })
          )
          break
        case '[':
          boundaries.push(
            new Obstacles({
              position: {
                x: j * Obstacles.width,
                y: i * Obstacles.height
              },
              image: createImage('./img/capLeft.png')
            })
          )
          break
        case ']':
          boundaries.push(
            new Obstacles({
              position: {
                x: j * Obstacles.width,
                y: i * Obstacles.height
              },
              image: createImage('./img/capRight.png')
            })
          )
          break
        case '_':
          boundaries.push(
            new Obstacles({
              position: {
                x: j * Obstacles.width,
                y: i * Obstacles.height
              },
              image: createImage('./img/capBottom.png')
            })
          )
          break
        case '^':
          boundaries.push(
            new Obstacles({
              position: {
                x: j * Obstacles.width,
                y: i * Obstacles.height
              },
              image: createImage('./img/capTop.png')
            })
          )
          break
        case '+':
          boundaries.push(
            new Obstacles({
              position: {
                x: j * Obstacles.width,
                y: i * Obstacles.height
              },
              image: createImage('./img/pipeCross.png')
            })
          )
          break
        case '5':
          boundaries.push(
            new Obstacles({
              position: {
                x: j * Obstacles.width,
                y: i * Obstacles.height
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorTop.png')
            })
          )
          break
        case '6':
          boundaries.push(
            new Obstacles({
              position: {
                x: j * Obstacles.width,
                y: i * Obstacles.height
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorRight.png')
            })
          )
          break
        case '7':
          boundaries.push(
            new Obstacles({
              position: {
                x: j * Obstacles.width,
                y: i * Obstacles.height
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorBottom.png')
            })
          )
          break
        case '8':
          boundaries.push(
            new Obstacles({
              position: {
                x: j * Obstacles.width,
                y: i * Obstacles.height
              },
              image: createImage('./img/pipeConnectorLeft.png')
            })
          )
          break
        case '.':
          pellets.push(
            new Pellets({
              position: {
                x: j * Obstacles.width + Obstacles.width / 2,
                y: i * Obstacles.height + Obstacles.height / 2
              }
            })
          )
          break
          case 'p':
                 powerUps.push(
                       new PowerUp({
                             position:{
                                 x: 40 * j + Obstacles.width/2,
                                       y: 40 * i + Obstacles.height/2
                         }
                              }) 
                                 )
                     break;
      }
    })
  })


// map.forEach((row, index) =>{
//     row.forEach((symbol, j)=>{
//         switch(symbol){
//             case '-':
//                 boundaries.push(
//                     new Obstacles({
//                         position:{
//                             x: Obstacles.width * j,
//                             y: Obstacles.height * index
//                         },
//                         image: createImage('./img/pipeHorizontal.png')
//                         }) 
//                 )
//                 break;
//                 case '|':
//                     boundaries.push(
//                         new Obstacles({
//                             position:{
//                                 x: Obstacles.width * j,
//                                 y: Obstacles.height * index
//                             },
//                             image: createImage('./img/pipeVertical.png')
//                             }) 
//                     )
//                     break;
//                     case '1':
//                         boundaries.push(
//                             new Obstacles({
//                                 position:{
//                                     x: Obstacles.width* j,
//                                     y: Obstacles.height * index
//                                 },
//                                 image: createImage('./img/pipeCorner1.png')
//                                 }) 
//                         )
//                         break;
//                         case '2':
//                             boundaries.push(
//                                 new Obstacles({
//                                     position:{
//                                         x: Obstacles.width * j,
//                                         y: Obstacles.height * index
//                                     },
//                                     image: createImage('./img/pipeCorner2.png')
//                                     }) 
//                             )
//                             break;
//                             case '3':
//                                 boundaries.push(
//                                     new Obstacles({
//                                         position:{
//                                             x: Obstacles.width * j,
//                                             y: Obstacles.height * index
//                                         },
//                                         image: createImage('./img/pipeCorner3.png')
//                                         }) 
//                                 )
//                                 break;
//                                 case '4':
//                                     boundaries.push(
//                                         new Obstacles({
//                                             position:{
//                                                 x: Obstacles.width * j,
//                                                 y: Obstacles.height * index
//                                             },
//                                             image: createImage('./img/pipeCorner4.png')
//                                             }) 
//                                     )
//                                     break;
//                                     case 'b':
//                                         boundaries.push(
//                                             new Obstacles({
//                                                 position:{
//                                                     x: Obstacles.width * j,
//                                                     y: Obstacles.height * index
//                                                 },
//                                                 image: createImage('./img/block.png')
//                                                 }) 
//                                         )
//                                         break;
//                                         case '.':
//                                             pellets.push(
//                                                 new Pellets({
//                                                     position:{
//                                                         x: 40 * j + Obstacles.width/2,
//                                                         y: 40 * index + Obstacles.height/2
//                                                     }
//                                                     }) 
//                                             )
//                                             break;
//                                             case 'p':
//                                                 powerUps.push(
//                                                     new PowerUp({
//                                                         position:{
//                                                             x: 40 * j + Obstacles.width/2,
//                                                             y: 40 * index + Obstacles.height/2
//                                                         }
//                                                         }) 
//                                                 )
//                                                 break;
//         }
//     })
// })
// function collision({circle,rectangle}){
//     return (circle.position.y - circle.radius + circle.speed.y <= rectangle.position.y+rectangle.height
//     && circle.position.x + circle.radius +circle.speed.x >= rectangle.position.x 
//     && circle.position.y + circle.radius + circle.speed.y >= rectangle.position.y 
//     && circle.position.x - circle.radius + circle.speed. x <= rectangle.position.x + rectangle.width)
// }
function collision({circle,rectangle}){
    const padding = Obstacles.width/2 - circle.radius - 1;
    return (circle.position.y - circle.radius + circle.speed.y <= rectangle.position.y+rectangle.height + padding
    && circle.position.x + circle.radius +circle.speed.x >= rectangle.position.x -padding
    && circle.position.y + circle.radius + circle.speed.y >= rectangle.position.y - padding
    && circle.position.x - circle.radius + circle.speed. x <= rectangle.position.x + rectangle.width + padding)
}

let animationID
function animate(){
    animationID = requestAnimationFrame(animate);
    console.log(animationID)
    context.clearRect(0,0,canvas.width,canvas.height)
    
    if(keys.w.pressed && last === 'w'){
        for(let i = 0; i < boundaries.length;i++) {
            const boundary = boundaries[i];
            if(
            collision({
                circle: {...pacman,speed:{
                    x:0,y:-5
                }},
                rectangle: boundary
            })  
         ){
            pacman.speed.y = 0
            break;
         } else{
            pacman.speed.y =-5
         }
        }
    } else if(keys.a.pressed && last === 'a'){
        for(let i = 0; i < boundaries.length;i++) {
            const boundary = boundaries[i];
            if(
            collision({
                circle: {...pacman,speed:{
                    x:-5,y:0
                }},
                rectangle: boundary
            })  
         ){
            pacman.speed.x = 0
            break;
         } else{
            pacman.speed.x =-5
         }
        }
    }else if(keys.s.pressed && last === 's'){
        for(let i = 0; i < boundaries.length;i++) {
            const boundary = boundaries[i];
            if(
            collision({
                circle: {...pacman,speed:{
                    x:0,y:5
                }},
                rectangle: boundary
            })  
         ){
            pacman.speed.y = 0
            break;
         } else{
            pacman.speed.y =5
         }
        }
    }else if(keys.d.pressed && last === 'd'){
        for(let i = 0; i < boundaries.length;i++) {
            const boundary = boundaries[i];
            if(
            collision({
                circle: {...pacman,speed:{
                    x:5,y:0
                }},
                rectangle: boundary
            })  
         ){
            pacman.speed.x = 0
            break;
         } else{
            pacman.speed.x =5
         }
        }
    }

    if(pellets.length === 0){
        cancelAnimationFrame(animationID);
    }

    for(let i = ghosts.length - 1;0 <= i;i--){
        const ghost = ghosts[i];
    if(Math.hypot(ghost.position.x - pacman.position.x,
        ghost.position.y - pacman.position.y) < ghost.radius + pacman.radius)
        {
            if(ghost.scared){
                ghosts.splice(i,1)
            } else {
            cancelAnimationFrame(animationID);
            }
        }
    }
    for(let i = powerUps.length - 1;0 <= i;i--){
        const powerUp = powerUps[i];
        powerUp.draw();

        if(Math.hypot(powerUp.position.x - pacman.position.x,
            powerUp.position.y - pacman.position.y) < powerUp.radius + pacman.radius)
            {
                powerUps.splice(i,1); 
                    ghosts.forEach(ghost =>{
                        ghost.scared = true;

                        setTimeout(()=>{
                            ghost.scared = false;
                        },3000)
                    })

            }
    }

for(let i = pellets.length - 1;0 <= i;i--){
    const pellet = pellets[i];
    pellet.draw();

    if(Math.hypot(pellet.position.x - pacman.position.x,
        pellet.position.y - pacman.position.y) < pellet.radius + pacman.radius)
        {
            pellets.splice(i,1);
            realscore += 10;
            score.innerHTML = realscore;
        }
}

    boundaries.forEach((boundary) =>{
        boundary.draw();
            if(
                collision({
                    circle: pacman,
                    rectangle: boundary
                })
            ) { pacman.speed.y = 0;
                pacman.speed.x = 0;}
    })
    pacman.update();            
            

    ghosts.forEach((ghost)=>{
        ghost.update();



        const collision2 = [];
        boundaries.forEach((boundary) => {
            if( !collision2.includes('right') &&
                collision({
                    circle: {...ghost,speed:{
                        x:ghost.baseSpeed,y:0
                    }},
                    rectangle: boundary
                })  
             )
             {
                collision2.push('right')
             }

             if(!collision2.includes('left') &&
                collision({
                    circle: {...ghost,speed:{
                        x:-ghost.baseSpeed,y:0
                    }},
                    rectangle: boundary
                })  
             )
             {
                collision2.push('left')
             }

             if( !collision2.includes('up') &&
                collision({
                    circle: {...ghost,speed:{
                        x:0,y:-ghost.baseSpeed
                    }},
                    rectangle: boundary
                })  
             )
             {
                collision2.push('up')
             }

             if( !collision2.includes('down') &&
                collision({
                    circle: {...ghost,speed:{
                        x:0,y:ghost.baseSpeed
                    }},
                    rectangle: boundary
                })  
             )
             {
                collision2.push('down')
             }
        })
        if(collision2.length > ghost.prevCollisions.length){
         ghost.prevCollisions = collision2;
        }

        if(JSON.stringify(collision2) !== JSON.stringify(ghost.prevCollisions)){
            // console.log('gogo');

            console.log(collision2);
            console.log(ghost.prevCollisions);

            if(ghost.speed.x > 0)ghost.prevCollisions.push('right');
            else if(ghost.speed.x < 0)ghost.prevCollisions.push('left');
            else if(ghost.speed.y > 0)ghost.prevCollisions.push('down');
            else if(ghost.speed.y < 0)ghost.prevCollisions.push('up');

            const pathways = ghost.prevCollisions.filter(collision1 =>{
                            return !collision2.includes(collision1);
        })
        console.log({ pathways });

        const direction = pathways[Math.floor(Math.random() * pathways.length)]
        console.log(direction);

        switch(direction){
                        case'down':
                            ghost.speed.y = ghost.baseSpeed;
                            ghost.speed.x = 0;
                            break;
                        case'up':
                            ghost.speed.y = -ghost.baseSpeed;
                            ghost.speed.x = 0;
                            break;  
                        case'right':
                            ghost.speed.y = 0;
                            ghost.speed.x = ghost.baseSpeed;
                            break;                    
                        case'left':
                            ghost.speed.y = 0;
                            ghost.speed.x = -ghost.baseSpeed;
                            break;                    
                    }
        ghost.prevCollisions = [];
    }
    })
    if(pacman.speed.x>0) pacman.rotation = 0;
    else if(pacman.speed.x <0) pacman.rotation = Math.PI;
    else if(pacman.speed.y >0) pacman.rotation = Math.PI/2;
    else if(pacman.speed.y <0) pacman.rotation = Math.PI * 1.5;
}
animate();
addEventListener('keydown',({key})=>{
    switch(key){
        case 'w':
            keys.w.pressed = true
            last = 'w';
            break;
        case 'a':
            keys.a.pressed = true
            last = 'a';
            break;
        case 's':
            keys.s.pressed = true
            last = 's';
            break;
        case 'd':
            keys.d.pressed = true
            last = 'd';
            break;           
    }
})
addEventListener('keyup',({key})=>{
    switch(key){
        case 'w':
            keys.w.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
        case 's':
            keys.s.pressed = false
            break;
        case 'd':
            keys.d.pressed = false
            break;           
    }
})  