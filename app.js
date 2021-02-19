(() => {
    const root = document.getElementById('root');
    let pokemon_name = '';
    let health = 0;

    const try_letter = (letter, btn_clicked) => {
        const slots = document.getElementById('slots');

        console.log(btn_clicked);
        const buttons = document.getElementById('letter_matrix');
        const new_btn = `<button class="letter clicked">${letter}</button>`;
        buttons.children[btn_clicked] = new_btn;
        // test cia

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
    };

    const start_game = async () => {
        root.innerHTML = '';
        let alphabet = 'abcdefghijklmnopqrstuvwxyz';
        let html = ``;
        try {
            const res = await axios.get(
                `https://pokeapi.co/api/v2/pokemon/${
                    Math.floor(Math.random() * 898) + 1
                }`
            );
            pokemon_name = res.data.name;
            const div = [];
            for (let i in res.data.name.split('')) {
                let child = `<div class="slot" id="slot"></div>`;
                if (res.data.name.split('')[i] === '-') {
                    child = `<div class="slot checked" id="slot"> - </div>`;
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
                const button = `<button class="letter">${item}</button>`;
                matrix.push(button);
            });

            html = `
            <div>
                <div class="flex justify-center">score:</div>
                <div class="flex justify-center items-center pt">
                    <img class="square-10" src="${
                        res.data.sprites.other.dream_world.front_default
                            ? res.data.sprites.other.dream_world.front_default
                            : res.data.sprites.front_default
                    }" alt="x"/>
                </div>
                <div id="slots" class="flex justify-center pt">${div.join(
                    ''
                )}</div>
                <div class="flex justify-center">
                    <div class="matrix-grid pt" id="letter_matrix">${matrix.join(
                        ''
                    )}</div>
                </div>
                <div class="flex justify-center pt" id="health">Health: ${health}</div>
            </div>
            `;
            root.innerHTML = html;
            const dom_matrix = document.getElementById('letter_matrix');
            matrix.forEach((item, i) => {
                dom_matrix.children[i].addEventListener('click', () =>
                    try_letter(dom_matrix.children[i].innerHTML, i)
                );
            });
        } catch (err) {
            console.log(err);
        }
    };

    const setHealth = (amount) => {
        health = amount;
        const health_text = document.getElementById('health_text');
        health_text.innerHTML = `You will start with ${health} health`;
        const start_container = document.getElementById('start_button');
        const button = document.createElement('button');
        button.innerHTML = 'START';
        button.addEventListener('click', () => {
            start_game();
        });
        if (start_container.children.length === 0) {
            start_container.appendChild(button);
        } else {
            start_container.innerHTML = '';
            start_container.appendChild(button);
        }
    };

    (() => {
        const html = `
            <div id="difficulty">
                <div class="flex justify-center">
                    <img src="./assets/logo_main.png" alt="pokemon" />
                </div>
                <div class="btn-group flex justify-center pt">
                   <button id="btn_easy">EASY</button>
                   <button id="btn_medium">MEDIUM</button>
                   <button id="btn_hard">HARD</button>
                </div>
                <div class="flex justify-center items-center direction-column pt" id="health_container">
                   <div id="health_text"></div>
                   <div class="pt" id="start_button"></div>
                </div>
            </div>
        `;
        root.innerHTML = html;
        const btn_1 = document.getElementById('btn_easy');
        const btn_2 = document.getElementById('btn_medium');
        const btn_3 = document.getElementById('btn_hard');
        btn_1.addEventListener('click', () => setHealth(10));
        btn_2.addEventListener('click', () => setHealth(5));
        btn_3.addEventListener('click', () => setHealth(3));
    })();
})();
