let state = [7, 8, 2, 3, 5, 4, 1, 6, 0]

//fronteira aberta contem os objetos com custo, heuristica, estado e hash
//fronteira fechada contem um identificador que representa o estado fechado exemplo: 24580136
let fronteiraAberta, fronteiraFechada, estadosNoCaminho = [];
let estadosVisitados, custoAtual, maiorTamanhoFronteira = 0;
let estadoFinalId = 123456780;
let estadoFinal = [1,2,3,4,5,6,7,8,0]

let estado = {
    custo: null,
    heuristica: null,
    estado: null,
    id: null,
    anterior: null
};

function heuristicaDistancia(estados) {
    for (let i in estados){
        let distancia = 0;
        for (let j in estados[i]) {
            if (estado[j] !== 0) {
                let realPos = estadoFinal.indexOf(estado[j]);
                let realCol = realPos % 3;
                let realRow = Math.floor(realPos / 3);
                let coluna = i % 3;
                let linha = Math.floor(i / 3);
                distancia += (Math.abs(realCol - coluna) + Math.abs(realRow - linha));
            }
        }
        estados[i].heuristica = distancia;
    }
}

function heuristicaPosicao(estados) {

}

function swap(estado, from, to) {
    let _ = estado[from];
    estado[from] = estado[to];
    estado[to] = _;
}

function ordena() {
    fronteiraAberta.sort(function (a,b) {
        if(a.heuristica !== null){
            return a.heuristica-b.heuristica
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
    let novoEstado = estado.estado;
    swap(novoEstado, posicao, posicao + steps);

    //verifica se novo estado não esta em estados fechados
    if (!fronteiraFechada.includes(parseInt(novoEstado.join("")))) {
        novoEstado.anterior = estado;
        return novoEstado
    }
}

function abrirEstados(estado) {
    let estadosAbertos = [];
    let posicao = estado.indexOf(0);
    let linha = Math.floor(posicao / 3);
    let coluna = posicao % 3;
    if (linha > 0) {
        //abre novo estado movimentando pra cima
        estadosAbertos.push(movimenta(estado, posicao, -3));
    }
    if (coluna > 0) {
        //abre novo estado movimentando pra esquerda
        estadosAbertos.push(movimenta(estado, posicao, -1));
    }
    if (linha < 2) {
        //abre novo estado movimentando pra baixo
        estadosAbertos.push(movimenta(estado,  posicao, 3));
    }
    if (coluna < 2) {
        //abre novo estado movimentandodireita
        estadosAbertos.push(movimenta(estado, posicao, 1));
    }
    return estadosAbertos;
}

//tipo == custo || posicao || distancia
function buscaAEstrela(estado, tipo) {
    let identificador = estado.id = parseInt(estado.estado.join(""));
    estado.id = identificador;

    if(identificador === estadoFinalId){
        let c = tracaCaminho(estado);
        return {
            estado: estado.estado,
            estadosVisitados: estadosVisitados +1,
            caminho: c,
            tamanhoCaminho: c.length,
            maiorFronteira: maiorTamanhoFronteira
        }
    }
    fronteiraAberta.push(estado);

    if (!fronteiraFechada.includes(identificador)){
        let estadoAtual = fronteiraAberta.shift();
        estadosVisitados++;
        custoAtual++;
        //abridor de estados abre os estados e os adiciona na fronteira aberta
        let estadosAbertos = abrirEstados(estadoAtual);
        if(tipo === 'posicao'){
            heuristicaPosicao(estadosAbertos);
        }else if(tipo === 'distancia'){
            heuristicaDistancia(estadosAbertos);
        }else{
            estadosAbertos.forEach(el => el.custo = custoAtual);
        }

        fronteiraAberta = fronteiraAberta.concat(estadosAbertos);
        ordena();
        if (fronteiraAberta.length > maiorTamanhoFronteira){maiorTamanhoFronteira = fronteiraAberta.length}
        fronteiraFechada.push(identificador);
    }

    buscaAEstrela(fronteiraAberta.shift())
}
