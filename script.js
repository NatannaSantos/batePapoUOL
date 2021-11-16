let NomeUsuario = '';
let PessoaEscolhida = "Todos";
let privado = 'message';

EntrarNaSala();
 

function EntrarNaSala(){
    let usuario = prompt("Digite seu nome:");
    var Dados = {name: usuario}; 
       
   EntrarServidor(usuario);
}
function EntrarServidor(usuario){    
    var Dados = {name: usuario}; 
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", Dados);
    requisicao.then(tratarSucesso);
    requisicao.catch(tratarErro);
    NomeUsuario = usuario;
}

function tratarSucesso(autenticacao){
    buscardados();
    setInterval(ContinuaSala,5000);
}
function tratarErro(erro){
    let usuario = prompt("Nome em uso, digite outro nome:");
    EntrarServidor(usuario);  
}

function buscardados(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promessa.then(processarResposta);   
}


function processarResposta(resposta){
    const mensagens = resposta.data;

    var status = document.querySelector(".status");
    var nome = document. querySelector(".status .nome");
    var hora = document. querySelector(".status .hora");
    var texto = document. querySelector(".texto");
    var mensagem = document.querySelector(".conversa");
    var reservada= document.querySelector(".reservada");

    

    let TamanhoVetor = resposta.data.length;
    const Sala=document.querySelector(".sala");

    Sala.innerHTML = '';



    for (let i=0; i<TamanhoVetor; i++){
        nome = resposta.data[i].from;
        hora = "(" + resposta.data[i].time + ")";
        texto = resposta.data[i].text;
      
            if (resposta.data[i].type==="status"){
                 Sala.innerHTML += `<div class="status" id="Mensagem${i}">
                <p><span class="hora">${hora}</span> <span class="nome">${nome} </span> <span class="texto">${texto}</span></p>
                </div>    
                `
             } else if (resposta.data[i].type==="message"){                
                 Sala.innerHTML += `<div class="conversa" id="Mensagem${i}" data-identifier="message">
                 <p><span class="hora">${hora}</span> <span class="nome">${nome} </span> para <span class="para">todos</span>: <span class="texto">${texto}</span></p>
                </div>`
            } else {
                 Sala.innerHTML += `<div class="reservada" id="Mensagem${i}">
                <p><span class="hora">${hora}</span> <span class="nome">${nome} </span> reservadamente para <span class="para">${resposta.data[i].to}</span>: ${texto}</p>
                </div>`
            }

            
    } 
    
    const elementoQueQueroQueApareca = document.getElementById("Mensagem99");
    elementoQueQueroQueApareca.scrollIntoView();      
}
setInterval(buscardados,3000);
function ContinuaSala(){
    var permanencia = {name: NomeUsuario}
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", permanencia);
}
function EnviarMensagem(){ 
   console.log("pessoa: " +PessoaEscolhida);   
    let Mensagem = document.querySelector(".Mensagem");   
    
    var Mensagem_Enviada = {
                            from: NomeUsuario, 
                            to: PessoaEscolhida, 
                            text: Mensagem.value, 
                            type: privado
                        };
        
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", Mensagem_Enviada);
    requisicao.then(buscardados);
    requisicao.catch(ErroMensagem);
    Mensagem.value = '';
}

function ErroMensagem(){
    window.location.reload();
}


function MostrarUsuarioAtivo(){
    const ParteTransparente = document.querySelector(".Participantes_ativos");
    const Participantes = document.querySelector(".Participantes");
   

    ParteTransparente.classList.remove("escondido");
    Participantes.classList.remove("escondido");

    ParticipanteAtivo();  
}

function ParticipanteAtivo(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    promessa.then(BuscaParticipante);    
}
setInterval(ParticipanteAtivo,10000);

function EsconderUsuarioAtivo(){
    const ParteTransparente = document.querySelector(".Participantes_ativos");
    const Participantes = document.querySelector(".Participantes");

    ParteTransparente.classList.add("escondido");
    Participantes.classList.add("escondido");
}
function SelecionarParticipante(selecionado){
    const ParticipanteSelecionado = document.querySelector(".selecao_participante .selecao"); 
    if(ParticipanteSelecionado!==null){
        ParticipanteSelecionado.classList.remove("selecao");
    }
    selecionado.classList.add("selecao");

    PessoaEscolhida = selecionado.childNodes[3].innerHTML;
    
}

function BuscaParticipante(retorno){
  
    let TamanhoVetor = retorno.data.length;
   
    const Participante=document.querySelector(".selecao_participante");

    Participante.innerHTML = `<div class ="icone" onclick="SelecionarParticipante(this)">
    <ion-icon name="people"></ion-icon>
    <p>Todos</p>  
    <div class ="Marca"> <ion-icon name="checkmark"></ion-icon></div>                        
    </div>`
    
    for (let i=0; i<TamanhoVetor; i++){
        nome = retorno.data[i].name;

        Participante.innerHTML += `<div class ="icone" onclick="SelecionarParticipante(this)">
        <ion-icon name="person-circle"></ion-icon>
        <p>${nome}</p>  
        <div class ="Marca"> <ion-icon name="checkmark"></ion-icon></div>                        
    </div> `
        
    }
    
}

function SelecionarPrivacidade(selecionado){
    const PrivacidadeSelecionada = document.querySelector(".selecao_privacidade .selecao"); 
    if(PrivacidadeSelecionada!==null){
       PrivacidadeSelecionada.classList.remove("selecao");
    }
    selecionado.classList.add("selecao");
    if(selecionado.childNodes[3].innerHTML === "Público"){
        privado="message";
    }else{
        privado="private_message";
    }

}

document.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
    
        var EnvioInput = document.querySelector("#submit");
      
      EnvioInput.click();
    
    }
  });