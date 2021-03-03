let alphabet = 'abcdefghijklmnopqrstuvwxyz';

let g_l = en;

(() => {
    const root = document.querySelector('#root');
    let pokemon_name = '';
    let health = 0;
    let score = 0;
    let timer = 130;
    let difficulty_level = 0;
    let letter_slots;
    let timer_interval;

    const landing_screen = () => {
        root.innerHTML = landing_html;

        const start_btn = document.querySelector('#btn_start');
        start_btn.addEventListener('click', () => start_screen());

        const about_btn = document.querySelector('#btn_about');
        about_btn.addEventListener('click', () => about_screen());

        const options_btn = document.querySelector('#btn_options');
        options_btn.addEventListener('click', () => options_screen());
    };

    landing_screen();

    const start_screen = () => {
        root.innerHTML = difficulty_html;
        const btn_easy = document.querySelector('#btn_easy');
        const btn_medium = document.querySelector('#btn_medium');
        const btn_hard = document.querySelector('#btn_hard');
        const btn_back = document.querySelector('#btn_back');
        btn_easy.addEventListener('click', () =>
            set_health_and_difficulty(100, 1)
        );
        btn_medium.addEventListener('click', () =>
            set_health_and_difficulty(5, 2)
        );
        btn_hard.addEventListener('click', () =>
            set_health_and_difficulty(3, 3)
        );
        btn_back.addEventListener('click', () => landing_screen());
    };

    const about_screen = () => {
        root.innerHTML = about_html;
        const btn_back = document.querySelector('#btn_back');
        btn_back.addEventListener('click', () => landing_screen());
    };

    const options_screen = () => {
        root.innerHTML = options_html;
        const btn_back = document.querySelector('#btn_back');
        btn_back.addEventListener('click', () => landing_screen());
    };

    const set_health_and_difficulty = (health_amount, difficulty_lvl) => {
        difficulty_level = difficulty_lvl;
        health = health_amount;
        const start_container = document.querySelector('#start_container');
        start_container.innerHTML = '';
        const health_text = text_after_difficulty_html(
            health_amount,
            difficulty_lvl
        );
        const button_html = btn_html('start_the_game', 'Start', '');
        start_container.innerHTML = health_text + button_html;

        document
            .querySelector('#start_the_game')
            .addEventListener('click', () => start_game());
    };

    const start_game = async () => {
        root.innerHTML = loading_html();

        const api_response = await make_api_call();

        if (!api_response) {
            reset_game();
            landing_screen();
            return;
        }

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
        if (!timer_interval) {
            set_timer();
        }
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
            handle_error();
        }
    };

    const handle_error = () => {
        const body = document.getElementsByTagName('body')[0];
        const toaster = toaster_html(
            "Something wen't wrong :/",
            'Please try again...'
        );
        body.appendChild(toaster);
        const toaster_dom = document.querySelector('#toaster');
        setTimeout(() => {
            toaster_dom.classList.add('animate-hide_toaster');
        }, 4000);
        setTimeout(() => {
            toaster_dom.remove();
        }, 5000);
    };

    const create_slots_array = () => {
        const slots_array = [];
        letter_slots = new Array(pokemon_name.split('').length).fill();

        for (let i in pokemon_name.split('')) {
            let slot = `<div class="slot" id="slot"></div>`;
            if (pokemon_name.split('')[i] === '-') {
                slot = `<div class="slot" id="slot"> - </div>`;
                letter_slots[i] = '-';
            }
            slots_array.push(slot);
        }

        return slots_array;
    };

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
            const button = btn_html('', item, 'w-2 h-2');
            matrix.push(button);
        });
        return matrix;
    };

    const try_letter = (letter, btn_clicked) => {
        const buttons = document.querySelector('#letter_matrix');
        buttons.children[btn_clicked].removeEventListener('click', try_letter);
        buttons.children[btn_clicked].children[0].setAttribute(
            'disabled',
            true
        );

        if (pokemon_name.split('').includes(letter)) {
            for (let i in pokemon_name.split('')) {
                if (pokemon_name.split('')[i] === letter) {
                    mark_guessed_letter(letter, i);
                    add_score(difficulty_level);
                    add_time(difficulty_level * 2);
                    letter_slots[i] = letter;
                    if (!letter_slots.includes(undefined)) {
                        handle_win();
                    }
                }
            }
        } else {
            remove_one_health();
        }
        if (health === 0) {
            handle_loss();
        }
    };

    const set_timer = () => {
        timer_interval = setInterval(() => {
            const timer_in_dom = document.querySelector('#timer_value');
            timer--;
            if (timer === 0) {
                handle_loss();
                clearInterval(timer_interval);
            } else {
                if (timer_in_dom) {
                    const formatted_timer = timer < 10 ? `0${timer}` : timer;
                    timer_in_dom.innerHTML = formatted_timer;
                }
            }
        }, 1000);
    };

    const mark_guessed_letter = (letter, letter_index) => {
        const slots = document.querySelector('#slots');
        slots.children[letter_index].classList.add('checked');
        slots.children[letter_index].innerHTML = letter;
    };

    const add_score = (points_to_add) => {
        const score_container_dom = document.querySelector(
            '#score_value_container'
        );
        const score_value_dom = document.querySelector('#score_value');

        score += points_to_add;
        score_value_dom.innerHTML = score;

        const create_animation_html = add_score_animtaion_html(
            `+${points_to_add}`
        );
        score_container_dom.appendChild(create_animation_html.html);

        const find_animation = document.querySelector(
            `#${create_animation_html.html_id}`
        );

        setTimeout(() => {
            score_container_dom.removeChild(find_animation);
        }, 2000);
    };

    const add_time = (time_to_add) => {
        const timer_container_dom = document.querySelector(
            '#timer_value_container'
        );
        const timer_value_dom = document.querySelector('#timer_value');

        timer += time_to_add * 2;
        timer_value_dom.innerHTML = timer;

        const create_animation_html = add_score_animtaion_html(
            `+${time_to_add * 2}`
        );
        timer_container_dom.appendChild(create_animation_html.html);

        const find_animation = document.querySelector(
            `#${create_animation_html.html_id}`
        );

        setTimeout(() => {
            timer_container_dom.removeChild(find_animation);
        }, 2000);
    };

    const handle_win = () => {
        start_game();
    };

    const remove_one_health = () => {
        const health_container_dom = document.querySelector(
            '#health_value_container'
        );
        const health_value_dom = document.querySelector('#health_value');
        health--;
        health_value_dom.innerHTML = health;

        const create_animation_html = add_score_animtaion_html('-1');
        health_container_dom.appendChild(create_animation_html.html);

        const find_animation = document.querySelector(
            `#${create_animation_html.html_id}`
        );
        setTimeout(() => {
            health_container_dom.removeChild(find_animation);
        }, 2000);
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
})();
