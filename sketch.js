////////////////////////////////////////////////////////////////// VARIAVEIS /////////////////////////////////////////////
//------------------------Control------------------
let pronto = false;
let reiniciar;
//------------------------Vidio--------------------
let video;
//------------------------Mãos---------------------
let handpose;
let handCenters = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
let handSizes = [0, 0];
//------------------------Peixe--------------------
let peixeAdulto1 ="p.png";
let peixebebe1 ="p1.png";
let peixes = [];
maxP = 6;
let extinto=false;
//------------------------Fundo--------------------
let camadas =[];
let menu;
let texto=[];
let desf;
let poluicao= false;


////////////////////////////////////////////////////////////////// PRELOAD ///////////////////////////////////////////////

function preload() {

  //--------------------------------Fundos------------
  for(let i = 0; i < 2; i++){
    camadas[i] = loadImage((i+1)+".png");
    texto[i]= loadImage("m"+i+".png");
  }
  camadas[2] =loadImage("3.jpg");
  camadas[3] =loadImage("4.png");
  menu=loadImage("fundo.jpg");
  desf=loadImage("d.png");
}



////////////////////////////////////////////////////////////////// SETUP /////////////////////////////////////////////////

function setup() {

  //-------------------------------Gerais-------------
  createCanvas(800, 600);
  imageMode(CENTER);

  //-------------------------------Vidio--------------
  video = createCapture(VIDEO);
  // Esconde a visualização padrão da câmera no canvas
  video.hide();

  //-------------------------------Mãos---------------
  // Inicializa a detecção de mão com o modelo
  handpose = ml5.handpose(video, modelReady);
  // Configura a função de callback para lidar com as previsões da detecção de mão
  handpose.on('predict', gotHands);

  //-------------------------------Peixes-------------
  // Adicione alguns peixes ao ArrayList
  for (let i = 0; i < maxP; i++) {
    peixes.push(new Peixe(peixeAdulto1));
  }



}
////////////////////////////////////////////////////////////////// RESULTADOS /////////////////////////////////////////////

function modelReady() {
  //Verifica se houve resultados na consola
  console.log('Model is ready!');
  pronto = true;

  
}

////////////////////////////////////////////////////////////////// MÃOS DETCTADAS /////////////////////////////////////////////
function gotHands(results) {
  if (results.length > 0) {
    // Loop através de todas as mãos detectadas
    for (let i = 0; i < results.length; i++) {
      // Acessa o centro da mão
      handCenters[i].x = results[i].landmarks[9][0];
      handCenters[i].y = results[i].landmarks[9][1];

      // Calcula o tamanho da mão (distância entre os landmarks 0 e 5)
      let fingerTip = createVector(results[i].landmarks[0][0], results[i].landmarks[0][1]);
      let thumbBase = createVector(results[i].landmarks[5][0], results[i].landmarks[5][1]);
      handSizes[i] = dist(fingerTip.x, fingerTip.y, thumbBase.x, thumbBase.y);

      
      handCenters[i].x = map(handCenters[i].x, 0, width, width, 0);

      //---------------------------------------------Desenho------------------------  
    if(!extinto){
      noStroke();
      fill(103, 222, 170,150); 
      ellipse(handCenters[i].x, handCenters[i].y, handSizes[i], handSizes[i]); 
     }
      //---------------------------------------------Peixes------------------------  
      //Verifica colisão entre peixes e mão
      for (let p = 0; p < peixes.length; p++) {
        if (peixes[p].colidirM(handCenters[i], handSizes[i])) {

          // Há colisão entre o peixe e a mão
          peixes.splice(p, 1);
        }
      }
    }
  }
}


////////////////////////////////////////////////////////////////// DRAW /////////////////////////////////////////////////////////

function draw() {
  noStroke();
  rectMode(CENTER);
  if (pronto && extinto==false) {                                   //--------------Na pesca

//------------------------------------------------------Poluição
if(peixes.length<=3){poluicao=true;} else {poluicao=false;}

    // Limpa o frame anterior
    background(255);
//------------------------------------------------------Fundo 1 e 2
image(camadas[2], width/2, height/2-50, width/1.5, height/1.5);
if(poluicao){fill(242, 228, 187,40);}else{fill(0, 204, 255,40);}

rect(width/2, height/2, width, height);

image(camadas[1], width/2, height/2, width/1.3, height/1.3);
if(poluicao){fill(217, 177, 102,60);}else{fill(0, 182, 217,60);}

rect(width/2, height/2, width, height);


    // Desenha e move cada peixe
    for (let peixe of peixes) {
      peixe.desenhar();
      peixe.mover();
      peixe.tempo();
    }

  //------------------------------------------------------Fundo 3
  image(camadas[3], width/2, height/2, width, height);
  image(desf, width/2, height/2, width, height);
  if(poluicao){fill(242, 237, 213,60)}else{fill(0, 133, 163,60);}
rect(width/2, height/2, width, height);
  //------------------------------------------------------Colisões

    // Verifica colisões entre os peixes
    for (let i = 0; i < peixes.length; i++) {
      for (let j = i + 1; j < peixes.length; j++) {
        if (peixes[i].colidir(peixes[j]) && (peixes[i].vida == true && peixes[j].vida == true) && (peixes[i].casal == false && peixes[j].casal == false) && peixes.length <= 12) {
          peixes.push(new Peixe(peixebebe1, false, peixes[i].x - 15, peixes[i].y - 15));
          peixes[i].casal = true;
          peixes[j].casal = true;
          peixes[i].tempoCasado = millis();
          peixes[j].tempoCasado = millis();
        }
      }
    }
  //---------------------------------------------------------Extenção
  //Caso se apenhe os peixes todos 
  if(peixes.length <=  1){
    extinto=true;
    reiniciar=millis();
  } 

  } else if(pronto== false && extinto== false) {                           //--------------No inicio
    image(menu, width/2, height/2, width, height);
     //-----------------------------------------------Texto-------------------
     image(texto[0], width/2, height/2, width, height);

  } else {                                                                 //--------------Extinguindo os peixes

         //-----------------------------------------------Texto-------------------
         fill(255,10);
         rect(width/2, height/2, width/1.2, height/1.2);
         fill(255,180); 
         rect(width/2, height/2, width/1.5, height/1.5);
         image(texto[1], width/2, height/2, width, height);


 //Apos 20 segundos de texto...
  if (millis() - reiniciar > 20000) {
  // Adicione alguns peixes ao ArrayList
  for (let i = 0; i < 5; i++) {
    peixes.push(new Peixe(peixeAdulto1));
  }

  //Recomeça 
  extinto = false;
  reiniciar = millis();

  }
  }


}


////////////////////////////////////////////////////////////////// PEIXES /////////////////////////////////////////////////////////
class Peixe {
  constructor(imagem, vida = true, x = null, y = null) {
    if (x !== null && y !== null) {
      // Segundo construtor
      this.r = random(20, 40);
      this.x = x;
      this.y = y;
    } else {
      // Primeiro construtor
      this.r = random(90, 170);
      this.x = random(this.r, width - this.r);
      this.y = random(this.r, height - this.r);
    }
    //geral
    this.vx = int(random(1, 7));
    this.vy = int(random(1, 7));
    this.vida = vida;
    this.casal = false;
    this.tempoVida = millis();
    this.tempoCasado = 0;
    this.imagem = loadImage(imagem);
    this.sintido = true;
  

    
  }

  // Função para desenhar o peixe na tela
  desenhar() {

    push();
    if(this.sintido==false){
      translate(this.x, this.y);
      scale(-1, 1);
      translate(-this.x, -this.y);
    }

    let h = this.r *( this.imagem.height / this.imagem.width);
    image(this.imagem,this.x, this.y, this.r, h);

    pop();

    
  }

  // Função para mover o peixe pela tela
  mover() {
    this.x += this.vx;
    this.y += this.vy;

    // Inverte a direção do peixe ao atingir as bordas da tela
    if (this.x > width - this.r || this.x < this.r) {
      this.vx *= -1;
      if(this.vx>0){ this.sintido=true;} else{ this.sintido=false;}
    }

    if (this.y > height - this.r || this.y < this.r) {
      this.vy *= -1;
    
     
    }

    //Evitar travas de limites 
    if (this.x > width - this.r) {
      this.x = width - this.r;
    } else if (this.x < this.r) { this.x = this.r; } else if (this.y > height - this.r) { this.y = height - this.r } else if (this.y < this.r) { this.y = this.r }
  }

  // Função para verificar se o peixe colidiu 
  colidir(outroCometa) {
    return dist(this.x, this.y, outroCometa.x, outroCometa.y) <= this.r + outroCometa.r;
  }

  // Função para lidar com a colisão entre peixe e mão
  colidirM(mao, maoS) {
    return dist(this.x, this.y, mao.x, mao.y) <= this.r + maoS / 2;

  }

  //Função para atualizar tempo de vida 
  tempo() {
    //10 segundos 
    if (!this.vida && millis() - this.tempoVida > 10000) {
      this.r = random(90, 175);
       if(this.vida == false){this.imagem=loadImage(peixeAdulto1); this.vida = true;}

    } else if (this.casal && millis() - this.tempoCasado > 10000 && this.vida) {
      this.casal = false;
    }
  }

  mudar(img){
 
  }

}



