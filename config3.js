let signs = ['+', '-', '*', '/'];
let container_main = document.querySelector('.main');
let container_start = document.querySelector('.start');
let container_start_h3 = container_start.querySelector('h3');
let question_field = document.querySelector('.question');
let answer_buttons = document.querySelectorAll('.answer');
let start_button = document.querySelector('.start-btn');

let cookie = false;
let cookies = document.cookie.split("; ");

for (let i = 0; i < cookies.length; i += 1) {
    if (cookies[i].split("=")[0] == "number_high_score") {
        cookie = cookies[i].split("=")[1];
        break;
    }
}

function randint(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function getRandomSign() {
    return signs[randint(0, 3)];
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

if (cookie) {
    let data = cookie.split("/");
    container_start_h3.innerHTML = `<h3>Минулого разу ви дали ${data[1]} правильних відповідей із ${data[0]}. Точність - ${Math.round(data[1] * 100 / data[0])}%.</h3>`;
}

class Question {
    constructor() {
        let a = randint(1, 30);
        let b = randint(1, 30);
        let sign = getRandomSign();
        this.question = `${a} ${sign} ${b}`;
        if (sign == '+') { this.correct = a + b; }
        else if (sign == '-') { this.correct = a - b; }
        else if (sign == '*') { this.correct = a * b; }
        else if (sign == '/') { this.correct = a / b; }
        this.answers = [
            randint(this.correct - 20, this.correct - 1),
            randint(this.correct - 20, this.correct - 1),
            this.correct,
            randint(this.correct + 1, this.correct + 20),
            randint(this.correct + 1, this.correct + 20),
        ];
        shuffle(this.answers);
    }

    display() {
        question_field.innerHTML = this.question;
        for (let i = 0; i < this.answers.length; i += 1) {
            answer_buttons[i].innerHTML = this.answers[i];
        }
    }
}

let current_question;
let correct_answers_given;
let total_answers_given;
let gameTimeout;

start_button.addEventListener('click', function() {
    container_main.style.display = 'flex';
    container_start.style.display = 'none';
    current_question = new Question();
    current_question.display();

    correct_answers_given = 0;
    total_answers_given = 0;

    gameTimeout = setTimeout(function() {
        let new_cookie = `number_high_score=${total_answers_given}/${correct_answers_given}; max-age=1000000000`;
        document.cookie = new_cookie;
        container_main.style.display = 'none';
        container_start.style.display = 'flex';
        container_start_h3.innerHTML = `<h3>Ви дали ${correct_answers_given} правильних відповідей із ${total_answers_given}. Точність - ${Math.round(correct_answers_given * 100 / total_answers_given)}%.</h3>`;
    }, 10000);
});

for (let i = 0; i < answer_buttons.length; i += 1) {
    answer_buttons[i].addEventListener('click', function() {
        if (parseInt(answer_buttons[i].innerHTML) === current_question.correct) {
            correct_answers_given += 1;
            answer_buttons[i].style.background = '#00FF00';
            anime({
                targets: answer_buttons[i],
                background: '#FFFFFF',
                duration: 500,
                delay: 100,
                easing: 'linear'
            });
        } else {
            answer_buttons[i].style.background = '#FF0000';
            anime({
                targets: answer_buttons[i],
                background: '#FFFFFF',
                duration: 500,
                delay: 100,
                easing: 'linear'
            });
        }
        total_answers_given += 1;
        current_question = new Question();
        current_question.display();
    });
}
