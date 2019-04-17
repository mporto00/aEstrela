//fronteira aberta contem os objetos com custo, heuristica, estado e hash
//fronteira fechada contem um identificador que representa o estado fechado exemplo: 24580136
let fronteiraAberta = [];
let estadosNoCaminho = [];
let fronteiraFechada = [];
let estadosVisitados = 0;
let custoAtual = 0;
let maiorTamanhoFronteira = 0;
let estadoFinalId = "123456780";
let estadoFinal = [1,2,3,4,5,6,7,8,0];

let estado_teste = {
    custo: 0,
    heuristica: null,
    estado: [1,2,8,0,3,4,7,5,6],
    id: null,
    anterior: null
};

function heuristicaDistancia(estados) {
    for (let i in estados){
        let estado = estados[i].estado
        let distancia = 0;
        for (let j in estado) {
            if (estado[j] !== 0) {
                let realPos = estadoFinal.indexOf(estado[j]);
                let realCol = realPos % 3;
                let realRow = Math.floor(realPos / 3);
                let coluna = j % 3;
                let linha = Math.floor(j / 3);
                distancia += (Math.abs(realCol - coluna) + Math.abs(realRow - linha));
            }
        }
        estados[i].heuristica = distancia - estados[i].custo;

    }

}

function heuristicaPosicao(estados) {
    for (let i in estados){
        let estado = estados[i].estado;
        let posicao = 0
        for(let j in estado){
            estadoFinal[j] === estado[j] ? posicao++ : posicao += 0
        }
        estados[i].heuristica = posicao + estados[i].custo;
    }

}

function swap(estado, from, to) {
    let _ = estado[from];
    estado[from] = estado[to];
    estado[to] = _;
}

function ordena(tipo) {
    fronteiraAberta.sort(function (a,b) {
        if(a.heuristica !== null){
            if(tipo === "distancia"){
                return a.heuristica-b.heuristica
            }else if(tipo==="posicao"){
                return b.heuristica-a.heuristica
            }
        }else{
            return a.custo - b.custo
        }
    })
}

function tracaCaminho(estado) {
    estadosNoCaminho.push(estado);
    if (!estado.anterior) {
        return estadosNoCaminho;
    }
    tracaCaminho(estado.anterior);
}

function movimenta(estado, posicao, steps) {
    let novoEstado = estado.estado.slice();
    swap(novoEstado, posicao, posicao + steps);
    let id = novoEstado.join("");

    //verifica se novo estado não esta em estados fechados
    if (!fronteiraFechada.includes(id)) {
        let novo = {
            custo: null,
            heuristica: null
        };
        novo.id = id;
        novo.anterior = estado;
        novo.estado = novoEstado;
        return novo;
    }
}

function abrirEstados(estado) {
    let estadosAbertos = [];
    let posicao = estado.estado.indexOf(0);
    let custo = (estado.custo) +1;
    let linha = Math.floor(posicao / 3);
    let coluna = posicao % 3;
    if (linha > 0) {
        //abre novo estado movimentando pra cima
        let newstate = movimenta(estado, posicao, -3)
        if(newstate){newstate.custo = custo; estadosAbertos.push(newstate)};
    }
    if (coluna > 0) {
        //abre novo estado movimentando pra esquerda
        let newstate = movimenta(estado, posicao, -1)
        if(newstate){newstate.custo = custo; estadosAbertos.push(newstate)};
    }
    if (linha < 2) {
        //abre novo estado movimentando pra baixo
        let newstate = movimenta(estado, posicao, 3)
        if(newstate){newstate.custo = custo; estadosAbertos.push(newstate)};
    }
    if (coluna < 2) {
        //abre novo estado movimentandodireita
        let newstate = movimenta(estado, posicao, 1)
        if(newstate){newstate.custo = custo; estadosAbertos.push(newstate)};
    }
    return estadosAbertos;
}

//tipo ==  || posicao || distancia
function buscaAEstrela(estado, tipo = "") {
    let identificador = estado.estado.join("");
    estado.id = identificador;

    if(identificador === estadoFinalId){
        tracaCaminho(estado);
        let resultado  = {
            estado: estado.estado,
            estadosVisitados: estadosVisitados +1,
            caminho: estadosNoCaminho,
            tamanhoCaminho: estadosNoCaminho.length,
            maiorFronteira: maiorTamanhoFronteira
        };
        fronteiraAberta = [];
        estadosNoCaminho = [];
        fronteiraFechada = [];
        estadosVisitados = 0;
        custoAtual = 0;
        maiorTamanhoFronteira = 0;
        console.log(resultado);
        window.resultado = resultado;
        return resultado;
    }

    if (!fronteiraFechada.includes(identificador)){
        let estadoAtual = estado
        estadosVisitados++;
        //abridor de estados abre os estados e os adiciona na fronteira aberta
        let estadosAbertos = abrirEstados(estadoAtual);
        if(tipo === 'posicao'){
            heuristicaPosicao(estadosAbertos);
        }else if(tipo === 'distancia'){
            heuristicaDistancia(estadosAbertos);
        }

        fronteiraAberta = fronteiraAberta.concat(estadosAbertos);
        ordena(tipo);
        if (fronteiraAberta.length > maiorTamanhoFronteira){maiorTamanhoFronteira = fronteiraAberta.length}
        fronteiraFechada.push(identificador);
    }

    buscaAEstrela(fronteiraAberta.shift(),tipo)
}

//heuristicaPosicao(estado_teste)
//heuristicaDistancia(estado_teste)