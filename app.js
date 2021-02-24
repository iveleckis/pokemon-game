let alphabet = 'abcdefghijklmnopqrstuvwxyz';

(() => {
    const root = document.querySelector('#root');
    let pokemon_name = '';
    let health = 0;
    let score = 0;
    let timer = 130;
    let difficulty_level = 0;

    const try_letter = (letter, btn_clicked) => {
        const buttons = document.querySelector('#letter_matrix');
        buttons.children[btn_clicked].classList.add('clicked');
        buttons.children[btn_clicked].removeEventListener('click', try_letter);
        if (pokemon_name.split('').includes(letter)) {
            for (let i in pokemon_name.split('')) {
                if (pokemon_name.split('')[i] === letter) {
                    mark_guessed_letter(letter, i);
                    add_score(difficulty_level);
                    add_time(difficulty_level * 2);
                }
            }
        } else {
            remove_one_health();
        }
        if (health === 0) {
            handle_loss();
        }
    };

    const mark_guessed_letter = (letter, letter_index) => {
        //
        const slots = document.querySelector('#slots');
        slots.children[letter_index].classList.add('checked');
        slots.children[letter_index].innerHTML = letter;
    };

    const remove_one_health = () => {
        health--;
        document.querySelector('#health').innerHTML = `Health: ${health}`;
    };

    const add_score = (points_to_add) => {
        const score_in_dom = document.querySelector('#score_count');
        score += points_to_add;
        score_in_dom.innerHTML = score;
    };

    const add_time = (time_to_add) => {
        timer += time_to_add * 2;
    };

    const handle_loss = () => {
        const html = loss_html(pokemon_name, score);
        root.innerHTML = html;
        const replay_button = document.querySelector('#play_again');
        replay_button.addEventListener('click', () => reset_game());
    };

    const reset_game = () => {
        pokemon_name = '';
        health = 0;
        score = 0;
        timer = 130;
        difficulty_level = 0;
        root.innerHTML = '';
        landing_screen();
    };

    const start_game = async () => {
        root.innerHTML = '';

        const api_response = await make_api_call();
        pokemon_name = api_response.data.name;

        const slot_array = create_slots_array();

        const matrix = create_letter_matrix(api_response.data.name);

        const pokemon_image = api_response.data.sprites.other.dream_world
            .front_default
            ? api_response.data.sprites.other.dream_world.front_default
            : api_response.data.sprites.front_default;

        const slots_html = slot_array.join('');

        const matrix_html = matrix.join('');

        root.innerHTML = game_html(
            score,
            timer,
            health,
            pokemon_image,
            slots_html,
            matrix_html
        );

        const dom_matrix = document.querySelector('#letter_matrix');

        matrix.forEach((item, i) => {
            dom_matrix.children[i].addEventListener('click', () => {
                try_letter(dom_matrix.children[i].children[0].innerHTML, i);
            });
        });

        set_timer();
    };

    const make_api_call = async () => {
        try {
            const res = await axios.get(
                `https://pokeapi.co/api/v2/pokemon/${
                    Math.floor(Math.random() * 898) + 1
                }`
            );
            return res;
        } catch (err) {
            console.log(err);
        }
    };

    const create_slots_array = () => {
        const slots_array = [];
        for (let i in pokemon_name.split('')) {
            let slot = `<div class="slot" id="slot"></div>`;
            if (pokemon_name.split('')[i] === '-') {
                slot = `<div class="slot" id="slot"> - </div>`;
            }
            slots_array.push(slot);
        }
        return slots_array;
    };

    // refactor this
    const create_letter_matrix = (mix_in_this_pokemon_name) => {
        let all_letters = alphabet;
        while (all_letters.split('').length !== 20) {
            const rand = Math.floor(
                Math.random() * (all_letters.split('').length - 1)
            );
            const alphabet_left = all_letters.split('');
            const rand_letter = alphabet_left[rand];
            if (!mix_in_this_pokemon_name.split('').includes(rand_letter)) {
                alphabet_left.splice(alphabet_left.indexOf(rand_letter), 1);
                all_letters = alphabet_left.join('');
            }
        }
        all_letters = all_letters.split('').sort(() => Math.random() - 0.5);
        const matrix = [];
        all_letters.forEach((item) => {
            const button = btn_html('', item, '');
            matrix.push(button);
        });
        return matrix;
    };

    const set_health_and_difficulty = (health_amount, difficulty_lvl) => {
        difficulty_level = difficulty_lvl;
        health = health_amount;
        const start_container = document.querySelector('#start_container');
        start_container.innerHTML = '';
        const health_text = `<div class="p-2 text-center">
                                You will start your game with
                                <span class="text-red">${health}</span>
                                health and each letter guessed will give you
                                <span class="text-red">${difficulty_level} point${
            difficulty_level > 1 ? 's' : ''
        }</span>
                            </div>`;
        const button_html = `<button class="btn animate-btn-pulse" id="start_the_game">Start</button>`;
        start_container.innerHTML = health_text + button_html;

        document
            .querySelector('#start_the_game')
            .addEventListener('click', () => start_game());
    };

    const set_timer = () => {
        const timer_in_dom = document.querySelector('#timer');
        const timer_interval = setInterval(() => {
            timer--;

            if (timer === 0) {
                handle_loss();
                clearInterval(timer_interval);
            } else {
                const formatted_timer = timer < 10 ? `0${timer}` : timer;
                timer_in_dom.innerHTML = formatted_timer;
            }
        }, 1000);
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
            const btn_easy = document.querySelector('#btn_easy');
            const btn_medium = document.querySelector('#btn_medium');
            const btn_hard = document.querySelector('#btn_hard');
            const btn_back = document.querySelector('#btn_back');
            btn_easy.addEventListener('click', () =>
                set_health_and_difficulty(10, 1)
            );
            btn_medium.addEventListener('click', () =>
                set_health_and_difficulty(5, 2)
            );
            btn_hard.addEventListener('click', () =>
                set_health_and_difficulty(3, 3)
            );
            btn_back.addEventListener('click', () => {
                start_toggled = !start_toggled;
                landing_screen();
            });
        } else if (about_toggled) {
            const btn_back = document.querySelector('#btn_back');
            btn_back.addEventListener('click', () => {
                about_toggled = !about_toggled;
                landing_screen();
            });
        } else {
            const btn_start = document.querySelector('#btn_start');
            btn_start.addEventListener('click', () => {
                start_toggled = !start_toggled;
                landing_screen();
            });
            const btn_about = document.querySelector('#btn_about');
            btn_about.addEventListener('click', () => {
                about_toggled = !about_toggled;
                landing_screen();
            });
        }
    };
    landing_screen();
})();
