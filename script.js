let NomeUsuario = '';
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
/*setInterval(buscardados,3000);

const elementoQueQueroQueApareca = document.querySelector(".sala");
elementoQueQueroQueApareca.scrollIntoView();*/

function processarResposta(resposta){
    const mensagens = resposta.data;

    //console.log(resposta.data);

    var status = document.querySelector(".status");
    var nome = document. querySelector(".status .nome");
    var hora = document. querySelector(".status .hora");
    var texto = document. querySelector(".texto");
    var mensagem = document.querySelector(".conversa");
    var reservada= document.querySelector(".reservada");

    

    let TamanhoVetor = resposta.data.length;
    const Sala=document.querySelector(".sala");

    for (let i=0; i<TamanhoVetor; i++){
        nome = resposta.data[i].from;
        hora = "(" + resposta.data[i].time + ")";
        texto = resposta.data[i].text;
      
            if (resposta.data[i].type==="status"){
                 Sala.innerHTML += `<div class="status">
                <p><span class="hora">${hora}</span> <span class="nome">${nome} </span> <span class="texto">${texto}</span></p>
                </div>    
                `
             } else if (resposta.data[i].type==="message"){                
                 Sala.innerHTML += `<div class="conversa">
                 <p><span class="hora">${hora}</span> <span class="nome">${nome} </span> para <span class="para">todos</span>: <span class="texto">${texto}</span></p>
                </div>`
            } else {
                 Sala.innerHTML += `<div class="reservada">
                <p><span class="hora">${hora}</span> <span class="nome">${nome} </span> reservadamente para <span class="para">${resposta.data[i].to}</span>: ${texto}</p>
                </div>`
            }
    }    
    
    
}
function ContinuaSala(){
    var permanencia = {name: NomeUsuario}
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", permanencia);
}