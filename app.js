(() => {
    const root = document.getElementById('root');
    let pokemon_name = '';
    let health = 0;
    let score = 0;

    const try_letter = (letter, btn_clicked) => {
        const slots = document.getElementById('slots');

        const buttons = document.getElementById('letter_matrix');
        buttons.children[btn_clicked].classList.add('clicked');
        buttons.children[btn_clicked].removeEventListener('click', try_letter);

        if (pokemon_name.split('').includes(letter)) {
            for (let i in pokemon_name.split('')) {
                if (pokemon_name.split('')[i] === letter) {
                    slots.children[i].classList.add('checked');
                    slots.children[i].innerHTML = letter;
                }
            }
        } else {
            health--;
            document.getElementById('health').innerHTML = `Health: ${health}`;
        }
        if (health === 0) {
            handle_loss();
        }
    };

    const handle_loss = () => {
        const html = loss_html(pokemon_name);
        root.innerHTML = html;
        const replay_button = document.querySelector('#play_again');
        replay_button.addEventListener('click', () => reset_game());
    };

    const reset_game = () => {
        health = 0;
        pokemon_name = '';
        score = 0;
        root.innerHTML = '';
        landing_screen();
    };

    const start_game = async () => {
        root.innerHTML = '';
        let alphabet = 'abcdefghijklmnopqrstuvwxyz';
        let game_html = ``;
        try {
            const res = await axios.get(
                `https://pokeapi.co/api/v2/pokemon/${
                    Math.floor(Math.random() * 898) + 1
                }`
            );
            pokemon_name = res.data.name;
            const div = [];
            for (let i in pokemon_name.split('')) {
                let child = `<div class="slot" id="slot"></div>`;
                if (pokemon_name.split('')[i] === '-') {
                    child = `<div class="slot" id="slot"> - </div>`;
                }
                div.push(child);
            }

            while (alphabet.split('').length !== 20) {
                const rand = Math.floor(
                    Math.random() * (alphabet.split('').length - 1)
                );
                const alphabet_left = alphabet.split('');
                const rand_letter = alphabet_left[rand];
                if (!res.data.name.split('').includes(rand_letter)) {
                    alphabet_left.splice(alphabet_left.indexOf(rand_letter), 1);
                    alphabet = alphabet_left.join('');
                }
            }
            alphabet = alphabet.split('').sort(() => Math.random() - 0.5);
            const matrix = [];
            alphabet.forEach((item) => {
                const button = btn_html('', item, '');
                matrix.push(button);
            });

            game_html = `
            <div class="panel">
                <div class="flex justify-center p-2">score:${score}</div>
                <div class="flex justify-center items-center p-2">
                    <img class="square-10" src="${
                        res.data.sprites.other.dream_world.front_default
                            ? res.data.sprites.other.dream_world.front_default
                            : res.data.sprites.front_default
                    }" alt="x"/>
                </div>
                <div id="slots" class="flex justify-center p-1">${div.join(
                    ''
                )}</div>
                <div class="flex justify-center">
                    <div class="matrix-grid p-2" id="letter_matrix">${matrix.join(
                        ''
                    )}</div>
                </div>
                <div class="flex justify-center p-2" id="health">Health: ${health}</div>
            </div>
            `;
            root.innerHTML = game_html;
            const dom_matrix = document.getElementById('letter_matrix');
            matrix.forEach((item, i) => {
                dom_matrix.children[i].addEventListener('click', () => {
                    try_letter(dom_matrix.children[i].children[0].innerHTML, i);
                });
            });
        } catch (err) {
            console.log(err);
        }
    };

    const setHealth = (amount) => {
        health = amount;
        const start_container = document.querySelector('#start_container');
        start_container.innerHTML = '';
        const health_text = `<div class="p-2 text-center">You will start your game with <span class="text-red">${health}</span> health</div>`;
        const button_html = `<button class="btn animate-btn-pulse" id="start_the_game">Start</button>`;
        start_container.innerHTML = health_text + button_html;

        document
            .querySelector('#start_the_game')
            .addEventListener('click', () => start_game());
    };

    let start_toggled = false;
    let about_toggled = false;
    const landing_screen = () => {
        let html = ``;
        if (start_toggled) {
            html = difficulty_html;
        }
        if (about_toggled) {
            html = about_html;
        }
        if (!about_toggled && !start_toggled) {
            html = landing_html;
        }
        root.innerHTML = html;

        if (start_toggled) {
            const btn_easy = document.getElementById('btn_easy');
            const btn_medium = document.getElementById('btn_medium');
            const btn_hard = document.getElementById('btn_hard');
            const btn_back = document.getElementById('btn_back');
            btn_easy.addEventListener('click', () => setHealth(10));
            btn_medium.addEventListener('click', () => setHealth(5));
            btn_hard.addEventListener('click', () => setHealth(3));
            btn_back.addEventListener('click', () => {
                start_toggled = !start_toggled;
                landing_screen();
            });
        } else if (about_toggled) {
            const btn_back = document.getElementById('btn_back');
            btn_back.addEventListener('click', () => {
                about_toggled = !about_toggled;
                landing_screen();
            });
        } else {
            const btn_start = document.getElementById('btn_start');
            btn_start.addEventListener('click', () => {
                start_toggled = !start_toggled;
                landing_screen();
            });
            const btn_about = document.getElementById('btn_about');
            btn_about.addEventListener('click', () => {
                about_toggled = !about_toggled;
                landing_screen();
            });
        }
    };
    landing_screen();
})();
