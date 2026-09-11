//tentando arrumar a agenda
const agendaLink = document.getElementById('agenda');
        agendaLink.addEventListener('click', function() {
            document.querySelector('.calendar').style.display = 'block';
    });

const mesAnoElm = document.getElementById('mes-ano');
const diasElm = document.getElementById('dias-calendario');

const dataAtual = new Date();
const ano = dataAtual.getFullYear();
const mes = dataAtual.getMonth();

const nomesMeses = [
    "Janeiro", 
    "Fevereiro", 
    "Março", 
    "Abril", 
    "Maio", 
    "Junho", 
    "Julho", 
    "Agosto", 
    "Setembro", 
    "Outubro", 
    "Novembro", 
    "Dezembro"];
    mesAnoElm.innerText = `${nomesMeses[mes]} de ${ano}`;

    //exemplo de eventos salvos (chave: "YYYY-MM-DD")
const eventos = {
    "2026-09-15": "Reunião importante",
};

function carregarCalendario() {
    const primeiroDiaIndex = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    let diasHtml = '';

    // Espaços vazios para os dias antes do início do mês
    for (let i = 0; i < primeiroDiaIndex; i++) {
        diasHtml += `<div></div>`;
    }

    // Preenchendo os dias do mês
    for (let dia = 1; dia <= ultimoDia; dia++) {
        const diaStr = String(dia).padStart(2, '0');
        const mesStr = String(mes + 1).padStart(2, '0');
        const dataCompleta = `${ano}-${mesStr}-${diaStr}`;

        const temEvento = eventos[dataCompleta];
        const classeCss = temEvento ? 'evento' : '';

        diasHtml += `<div class="${classeCss}" onclick="cliqueDia('${dataCompleta}')">${dia}</div>`;
    }

    diasElm.innerHTML = diasHtml;
}

function cliqueDia(data) {
    if (eventos[data]) {
        document.getElementById('eventos').innerHTML = `Evento em ${data}: ${eventos[data]}`;
    } else {
        const novoEvento = prompt(`Adicionar evento para ${data}:`);
        if (novoEvento) {
            eventos[data] = novoEvento;
            carregarCalendario();
        }
    }
}

carregarCalendario();

const fechar = document.getElementById('fechar');

fechar.addEventListener('click', function() {
    document.querySelector('.calendar').style.display = 'none';
});
