// ABRIR E FECHAR CALENDÁRIO

const agenda = document.getElementById("agenda");
const calendario = document.querySelector(".calendar");
const fechar = document.getElementById("fechar");

agenda.onclick = function(event) {
    event.preventDefault();
    calendario.style.display = "block";
};

fechar.onclick = function() {
    calendario.style.display = "none";
};


// ELEMENTOS

const mesAno = document.getElementById("mes-ano");
const dias = document.getElementById("dias-calendario");
const eventos = document.getElementById("eventos");


// DATA

let data = new Date();
let ano = data.getFullYear();
let mes = data.getMonth();

const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
];


// FORMATAR DATA

function formatarData(data) {
    let partes = data.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}


// EVENTOS

const eventosCalendario = {};

dados.forEach(function(evento) {
    eventosCalendario[evento.data] = evento["evento-novo"];
});


// CARREGAR CALENDÁRIO

function carregarCalendario() {

    mesAno.textContent = meses[mes] + " de " + ano;

    let primeiroDia = new Date(ano, mes, 1).getDay();
    let ultimoDia = new Date(ano, mes + 1, 0).getDate();

    dias.innerHTML = "";

    // Espaços antes do primeiro dia

    for (let i = 0; i < primeiroDia; i++) {
        dias.innerHTML += "<div></div>";
    }

    // Dias do mês

    for (let dia = 1; dia <= ultimoDia; dia++) {

        let diaFormatado = String(dia).padStart(2, "0");
        let mesFormatado = String(mes + 1).padStart(2, "0");

        let dataCompleta =
            ano + "-" + mesFormatado + "-" + diaFormatado;

        let elemento = document.createElement("div");

        elemento.textContent = dia;

        if (eventosCalendario[dataCompleta]) {
            elemento.classList.add("evento");
        }

        elemento.onclick = function() {
            clicarDia(dataCompleta);
        };

        dias.appendChild(elemento);
    }
}


// CLICAR NO DIA

function clicarDia(data) {

    if (eventosCalendario[data]) {

        eventos.textContent =
            "Evento em " + formatarData(data) +
            ": " + eventosCalendario[data];

        return;
    }

    let novoEvento = prompt(
        "Adicionar evento para " + formatarData(data) + ":"
    );

    if (novoEvento) {

        eventosCalendario[data] = novoEvento;

        carregarCalendario();

        eventos.textContent =
            "Evento em " + formatarData(data) +
            ": " + novoEvento;
    }
}


// MÊS ANTERIOR

document.getElementById("btn-anterior").onclick = function() {

    mes--;

    if (mes < 0) {
        mes = 11;
        ano--;
    }

    carregarCalendario();
};


// PRÓXIMO MÊS

document.getElementById("btn-proximo").onclick = function() {

    mes++;

    if (mes > 11) {
        mes = 0;
        ano++;
    }

    carregarCalendario();
};


// INICIAR

carregarCalendario();


// LISTA DE EVENTOS

const listaEventos = document.getElementById("lista-eventos");
const pesquisa = document.getElementById("pesquisa");
const btnPesquisa = document.getElementById("btn-pesquisa");


// MOSTRAR EVENTOS

function mostrarEventos(lista) {

    listaEventos.innerHTML = "";

    if (lista.length == 0) {
        listaEventos.innerHTML =
            "<p>Nenhum evento encontrado.</p>";
        return;
    }

    lista.forEach(function(evento) {

        listaEventos.innerHTML += `
            <div class="banner-novo">

                <img src="${evento.imagem}" alt="${evento["evento-novo"]}">

                <h5 class="data">
                    ${formatarData(evento.data)}
                </h5>

                <h5 class="hora">
                    ${evento.hora}
                </h5>

                <h6 class="preco">
                    ${evento.preco}
                </h6>

                <h2 class="evento-novo">
                    ${evento["evento-novo"]}
                </h2>

                <button class="btn-saiba-mais" data-id="${evento.id}">
                    Saiba mais
                </button>

            </div>
        `;
    });
}


// PESQUISAR

function pesquisar() {

    let texto = pesquisa.value.toLowerCase();

    let resultado = dados.filter(function(evento) {

        return evento["evento-novo"]
            .toLowerCase()
            .includes(texto);
    });

    mostrarEventos(resultado);
}


// BOTÃO PESQUISAR

btnPesquisa.onclick = pesquisar;


// PESQUISAR ENQUANTO DIGITA

pesquisa.oninput = pesquisar;


// MOSTRAR TODOS

mostrarEventos(dados);


// FILTRAR POR CATEGORIA

const categorias = document.getElementById("categorias");

categorias.onchange = function() {

    let categoria = categorias.value.toLowerCase();
    let resultado = dados.filter(function(evento) {
        return evento.categoria.toLowerCase() == categoria;
    });

    mostrarEventos(resultado);
};


// SAIBA MAIS

listaEventos.onclick = function(event) {

    if (!event.target.classList.contains("btn-saiba-mais")) {
        return;
    }

    let id = Number(event.target.dataset.id);

    let evento = dados.find(function(item) {
        return item.id == id;
    });

    mostrarDetalhes(evento);
};


// DETALHES DO EVENTO

function mostrarDetalhes(evento) {

    document.getElementById("detalhes-titulo").textContent =
        evento["evento-novo"];

    document.getElementById("detalhes-imagem").src =
        evento.imagem;

    document.getElementById("detalhes-descricao").textContent =
        evento.detalhes;

    document.getElementById("detalhes-data").textContent =
        formatarData(evento.data);

    document.getElementById("detalhes-hora").textContent =
        evento.hora;

    document.getElementById("detalhes-preco").textContent =
        evento.preco;

    document.getElementById("detalhes-vagas").textContent =
        evento.vaga;

    document.getElementById("detalhes-evento").style.display =
        "block";
}


// FECHAR DETALHES

document.getElementById("btn-fechar-detalhes").onclick =
    function() {

        document.getElementById("detalhes-evento").style.display =
            "none";
    };
