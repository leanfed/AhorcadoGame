; (function () {
    'use strict'

    var words = [
        'ALURA', 'ROSAS', 'AVION', 'ARBOL', 'CAR', 'FRUTAS', 'PELOTA'
    ]

    window.validarPalabra = function validarPalabra() {

        var palabraEntrante = document.getElementById('nuevaPalabra').value;
        var flag2 = false;
        var flag3 = false;


        if (palabraEntrante.length > 8 && !flag2) {
            swal('El máximo permitido es de 8 caracteres!')
            flag2 = true;
        }

        for (let i = 0; i < palabraEntrante.length; i++) {

            if (/[^A-ZÑ]/.test(palabraEntrante[i]) && !flag3) {
                swal('¡Valor no válido, ingresar exclusivamente la palabra en letras mayúsculas!');
                flag3 = true;
                break;
            } else {
                if (palabraEntrante !== '' && palabraEntrante.length < 9) {
                    words.push(palabraEntrante)
                    document.getElementById('bot3').style.display = 'none';
                    document.getElementById('bot1').style.display = 'block';
                    document.getElementById('person').style.display = 'inline-block';
                    document.getElementsByClassName('letter').display = 'inline-block';
                    newGame()
                }
            }
        }
    }

    //Variable para guardar configuración actual 

    var game = null;

    //Variable para ver si se ha enviado una alerta

    var end = false;

    var $html = {
        person: document.getElementById('person'),
        adivinado: document.querySelector('.adivinado'),
        errado: document.querySelector('.errado')
    }

    function construirHombre(game) {

        //rotación de estados e imagenes

        var $elemento
        $elemento = $html.person

        var state = game.estado

        if (state === 8) {
            state = game.previo
        }

        $elemento.src = './estados/img/0' + state + '.jpg' 

        //Letras adivinadas

        var palabra = game.palabra
        var adivinado = game.adivinado
        $elemento = $html.adivinado

        //Borramos los elementos anteriores

        $elemento.innerHTML = ''

        for (let letra of palabra) {
            let $span = document.createElement('span')
            let $txt = document.createTextNode('')
            if (adivinado.indexOf(letra) >= 0) {
                $txt.nodeValue = letra
            }
            $span.setAttribute('class', 'letter guessed')
            $span.appendChild($txt)
            $elemento.appendChild($span)

        }

        //Letras erradas

        var errado = game.errado
        $elemento = $html.errado

        //Borramos los elementos anteriores

        $elemento.innerHTML = ''
        for (let letra of errado) {
            let $span = document.createElement('span')
            let $txt = document.createTextNode(letra)
            $span.setAttribute('class', 'letter wrong')
            $span.appendChild($txt)
            $elemento.appendChild($span)
        }

    }

    // Función de transición

    function guess(game, letter) {
        
        var estado = game.estado;

        //Si se ganó o perdió no habrá cambios

        if (estado === 1 || estado === 8) {
            return
        }

        var adivinado = game.adivinado
        var errado = game.errado

        //Si se adivinó o erró una letra el juego debe mantenerse

        if (adivinado.indexOf(letter) >= 0 || errado.indexOf(letter) >= 0) {
            return
        }

        var palabra = game.palabra

        //Si es una letra de la palabra

        if (palabra.indexOf(letter) >= 0) {
            let ganado = true

            //Analizamos el estado

            for (let l of palabra) {
                if (adivinado.indexOf(l) < 0 && l !== letter) {
                    ganado = false
                    game.previo = game.estado

                    break;
                }

            }
            //Si ganó, lo indicamos con estado = 8

            if (ganado) {
                game.estado = 8;

            }

            //Agregamos letra a la lista de letras adivinadas

            adivinado.push(letter)
        } else {

            //Si no es letra de la palabra se actualiza el estado a uno más cerca de la horca

            game.estado--

            //Se agrega la letra a la lista de letras erradas

            errado.push(letter)
        }

    }


    window.onkeypress = function guessLetter(we) {
        if(document.getElementById('bot3').style.display == "block")
            return; 
        
        var word = we.key
        word = word.toUpperCase()

        if (/[^A-ZÑ]/.test(word)) {
            return
        }

        guess(game, word)
        var estado = game.estado

        if (estado == 8 && !end) {
            setTimeout(winAlerta, 500)
            end = true
        } else if (estado == 1 && !end) {
            
            setTimeout(loserAlert, 500)
            end = true
        }

        construirHombre(game)
    }

    window.newGame = function newGame() {
        document.getElementById('bot1').style.display = 'block'
        document.getElementById('bot2').style.display = 'none'
        document.getElementById('person').style.display = 'inline-block';
        document.getElementsByClassName('letter').display = 'inline-block';
        document.getElementById('adiv').style.display = 'block';
        document.getElementById('errad').style.display = 'block';

        var palabra = alternateWords()

        game = {}
        game.palabra = palabra
        game.estado = 7
        game.adivinado = []
        game.errado = []
        end = false
        construirHombre(game)
        

    }

    function alternateWords() {
        var index = ~~(Math.random() * words.length)
        return words[index]
    }

    function winAlerta() {
        swal('¡Felicidades ganaste!')
        document.getElementById('adiv').style.display = 'none';
        document.getElementById('errad').style.display = 'none';
        inicio();
    }

    function loserAlert() {
        swal('¡Perdiste! La palabra era: ' + game.palabra)
        document.getElementById('adiv').style.display = 'none';
        document.getElementById('errad').style.display = 'none';
        inicio();
    }

    window.rendirse = function rendirse() {
        document.getElementById('bot1').style.display = 'none'
        document.getElementById('bot2').style.display = 'block'
        document.getElementById('person').style.display = 'none';
        document.getElementsByClassName('letter').display = 'none';
    }

    window.redireccionar = function redireccionar() {
        document.getElementById('bot1').style.display = 'none'
        document.getElementById('bot2').style.display = 'none'
        document.getElementById('person').style.display = 'none';
        document.getElementsByClassName('letter').display = 'none';
        document.getElementById('bot3').style.display = 'block'
    }

    window.abandonar = function abandonar() {
        swal('¡Te rendiste! la palabra era: ' + game.palabra)
        document.getElementById('adiv').style.display = 'none';
        document.getElementById('errad').style.display = 'none';
        inicio()

    }

    window.inicio = function inicio() {
        document.getElementById('bot1').style.display = 'none'
        document.getElementById('bot2').style.display = 'block'
        document.getElementById('person').style.display = 'none';
        document.getElementsByClassName('letter').display = 'none';
        document.getElementById('bot3').style.display = 'none'

    }

}())