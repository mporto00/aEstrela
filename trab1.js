'use strict';

var estadoObjetivo = [0, 1, 2, 3, 4, 5, 6, 7, 8];
//var estadoInicial = [1, 0, 2, 3, 4, 5, 6, 7, 8];
var estadoInicial = [1, 8, 2, 0, 4, 3, 7, 6, 5];

var hash = {},
    listaDeEstadosAbertos = [],
    ehEstadoObjetivo = false,
    steps = 0,
    nodosVisitados = 0;

function movimenta(estado, estadosAbertos, posicao, steps) {
    var _estado, novoEstado;
    novoEstado = estado.slice();
    swap(novoEstado, posicao, posicao + steps);
    if (!compararEstados(novoEstado, estado.anterior)) {
        _estado = novoEstado.join('');
        if (typeof hash[_estado] === 'undefined') {
            hash[_estado] = novoEstado;
            novoEstado.anterior = estado;
            novoEstado.valorDeHeuristica = 1;
            //novoEstado.valorDeHeuristica = calculaValorDeHeuristica(novoEstado);
            novoEstado.niveis = novoEstado.anterior.niveis + 1;
            estadosAbertos.push(novoEstado);
        }
    }
}

function swap(estado, from, to) {
    var _ = estado[from];
    estado[from] = estado[to];
    estado[to] = _;
}

function compararEstados(arr1, arr2) {
    if (!arr1 || !arr2) {
        return false;
    }

    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}


function abridorDeEstados(estado) {
    var estadosAbertos = [];
    var posicao = estado.indexOf(0);
    var linha = Math.floor(posicao / 3);
    var coluna = posicao % 3;
    if (linha > 0) {
        //movimenta pra cima
        movimenta(estado, estadosAbertos, posicao, -3);
    }
    if (coluna > 0) {
        //movimenta pra esquerda
        movimenta(estado, estadosAbertos, posicao, -1);
    }
    if (linha < 2) {
        //movimenta pra baixo
        movimenta(estado, estadosAbertos, posicao, 3);
    }
    if (coluna < 2) {
        //movimenta pra direita
        movimenta(estado, estadosAbertos, posicao, 1);
    }
    return estadosAbertos;
}

function calculaValorDeHeuristica(estado) {
    // manhattanDistance
    var totalDist = 0;
    for (var i = 0; i < estado.length - 1; i++) {
        if (estado[i] !== 0) {
            var realPos = estadoObjetivo.indexOf(estado[i]);
            var realCol = realPos % 3;
            var realRow = Math.floor(realPos / 3);
            var coluna = i % 3;
            var linha = Math.floor(i / 3);
            totalDist += (Math.abs(realCol - coluna) + Math.abs(realRow - linha));
        }
    }
    return totalDist;
}

function collateSteps(estado) {
    console.log(estado.splice(0, 9));
    steps++;
    if (!estado.anterior) {
        console.log(estado, steps);
        return estado;
    }
    collateSteps(estado.anterior);
}

function buscaAEstrela(estado) {
    estado.niveis = 0;
    estado.anterior = null;
    listaDeEstadosAbertos.push(estado);
    while (ehEstadoObjetivo !== true) {
        var estadoAtual = listaDeEstadosAbertos.shift();
        nodosVisitados++;
        var estadosAbertos = abridorDeEstados(estadoAtual);
        for (var i = 0; i < estadosAbertos.length; i++) {
            if (compararEstados(estadoObjetivo, estadosAbertos[i])) {
                ehEstadoObjetivo = true;
                collateSteps(estadosAbertos[i]);
                break;
            } else {
                heap(listaDeEstadosAbertos, estadosAbertos[i]);
            }
        }
    }
}

function parent(index) {
    return Math.floor((index - 1) / 2);
}

function heap(estado, estadoSeguinte) {
    estado.push(estadoSeguinte);
    var node = estado.length - 1;
    while (parent(node) >= 0 && node > 0) {
        var parentElement = estado[parent(node)];
        var currentElement = estado[node];
        var totalWeightA = parentElement.valorDeHeuristica + parentElement.niveis;
        var totalWeightB = currentElement.valorDeHeuristica + currentElement.niveis;
        if (totalWeightA >= totalWeightB) {
            swap(estado, parent(node), node);
            node = parent(node);
            continue;
        }
        break;
    }
}

function begin(estadoInicial) {
    let tempoInicio = new Date();
    buscaAEstrela(estadoInicial);
    let tempoFinal = new Date();
    console.log('Tempo de execução ' + (tempoFinal.getTime() - tempoInicio.getTime()) + ' msec');
}

begin(estadoInicial);