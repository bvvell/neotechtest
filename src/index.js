//style
require("./styles/index.scss");
require('es6-promise').polyfill();
require('isomorphic-fetch');

import {tns} from "../node_modules/tiny-slider/src/tiny-slider"


//polyfil for ie 11 
if (window.Element && !Element.prototype.closest) {
  Element.prototype.closest =
  function(s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i,
        el = this;
    do {
      i = matches.length;
      while (--i >= 0 && matches.item(i) !== el) {};
    } while ((i < 0) && (el = el.parentElement));
    return el;
  };
}
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}
//polyfil for ie 11 



let slider;

function initCarousel() {
    slider = tns({
        container: '#match-slider',
        items: 3,
        gutter: 20,
        slideBy: 1,
        fixedWidth: 270,
        controls: false,
        nav: false
    });
}

function formatDate(date) {
    const month = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
    const strToDate = new Date(Number(date));
    const dd = strToDate.getDate();
    const mm = strToDate.getMonth();
    const hours = strToDate.getHours();
    let minutes = strToDate.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    return {"date": dd + ' ' + month[mm], "time": hours + ' : ' + minutes};
}

function teamInfo(data, team) {
    let logo;
    let item = document.createElement('div');
    let logoWrap = document.createElement('div');
    let itemLogo = document.createElement('img');
    let itemName = document.createElement('div');
    itemLogo.classList.add('team-logo');
    logoWrap.classList.add('team-logo-wrap');
    itemName.classList.add('team-name');
    item.classList.add('team');
    item.classList.add(team + '-team');

    if (team === 'home') {
        logo = 'homeLogo';
    } else {
        logo = 'awayLogo';
    }

    itemLogo.src = data[logo];
    itemName.innerText = data[team];
    logoWrap.appendChild(itemLogo);
    item.appendChild(logoWrap);
    item.appendChild(itemName);
    return item;
}

function gameInfo(data) {
    let gameInfo = document.createElement('div');
    let gameLeague = document.createElement('div');
    let gameDate = document.createElement('div');
    let gameTime = document.createElement('div');
    gameInfo.classList.add('game-info');
    gameLeague.classList.add('game-league');
    gameDate.classList.add('game-date');
    gameTime.classList.add('game-time');

    gameLeague.innerText = data.league;
    gameDate.innerText = formatDate(data.kickoff).date;
    gameTime.innerText = formatDate(data.kickoff).time;
    gameInfo.appendChild(gameLeague);
    gameInfo.appendChild(gameDate);
    gameInfo.appendChild(gameTime);
    return gameInfo;
}

function coefficients(data) {
    let coefficients = document.createElement('div');
    let homeWin = document.createElement('div');
    let awayWin = document.createElement('div');
    let drawGame = document.createElement('div');
    coefficients.classList.add('coefficients');
    coefficients.classList.add('game-coefficients');
    homeWin.classList.add('home-win');
    homeWin.classList.add('coefficient');
    awayWin.classList.add('away-win');
    awayWin.classList.add('coefficient');
    drawGame.classList.add('draw-game');
    drawGame.classList.add('coefficient');

    homeWin.innerText = data.odd1;
    awayWin.innerText = data.odd2;
    drawGame.innerText = data.oddx;
    coefficients.appendChild(homeWin);
    coefficients.appendChild(drawGame);
    coefficients.appendChild(awayWin);
    return coefficients;
}

function createSlider(data) {
    data.forEach(function (dataGame) {
        let game = document.createElement('div');
        let gameWrap = document.createElement('div');
        game.classList.add('game');
        game.appendChild(teamInfo(dataGame, 'home'));
        game.appendChild(gameInfo(dataGame));
        game.appendChild(teamInfo(dataGame, 'away'));
        game.appendChild(coefficients(dataGame));
        gameWrap.appendChild(game);
        document.getElementById('match-slider').appendChild(gameWrap);
    })
}

document.querySelector('.slide-prev').onclick = function () {
    slider.goTo('prev');
};

document.querySelector('.slide-next').onclick = function () {
    slider.goTo('next');
};

document.querySelector('#name').onblur = function () {
    if (this.value) {
        this.classList.add('not-empty');
    } else {
        this.classList.remove('not-empty');
    }
};

let dropdown = document.querySelector('.drop-down');
let dropdownButton = document.querySelector('.drop-down-button');
let dropdownItem = '.item';

function hideDropDown() {
    let dropDownItems = document.querySelectorAll('.drop-down-list .item');
    dropDownItems.forEach(function (item) {
        item.classList.remove('active');
    })
}

dropdown.addEventListener('click', function (event) {
    let closest = event.target.closest(dropdownItem);
    if (closest && dropdown.contains(closest)) {
        dropdown.classList.toggle('show');
        hideDropDown();
        closest.classList.add('active');
    }
    if (event.target === dropdownButton) {
        dropdown.classList.toggle('show')
    }

});


fetch('assets/json/data.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        createSlider(data);
        initCarousel();
    })
    .catch(function (error) {
        console.error(error)
    });
