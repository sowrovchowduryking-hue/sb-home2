/* ==========================================
   SB CAR - SIMPLE WORKING GAME
========================================== */

"use strict";

/* ---------- GAME DATA ---------- */

const cars = [
    { name: "SB Starter", icon: "🚗", price: 0, speed: 60 },
    { name: "SB Street", icon: "🏎‍🟀", price: 12000, speed: 72 },
    { name: "SB Sport", icon: "🚘", price: 20000, speed: 78 },
    { name: "SB GT", icon: "🏎‍🟀", price: 28000, speed: 84 },
    { name: "SB Muscle", icon: "🚗", price: 35000, speed: 88 },
    { name: "SB Super", icon: "🏎‍🟀", price: 50000, speed: 95 },
    { name: "SB Hyper", icon: "🏎‍🟀", price: 80000, speed: 100 },
    { name: "SB Electric", icon: "🚘", price: 42000, speed: 92 },
    { name: "SB Rally", icon: "🚙", price: 30000, speed: 80 },
    { name: "SB Offroad", icon: "🚙", price: 32000, speed: 76 },
    { name: "SB SUV", icon: "🚘", price: 40000, speed: 74 },
    { name: "SB Roadster", icon: "🏎‍🟀", price: 47000, speed: 90 },
    { name: "SB Classic", icon: "🚗", price: 18000, speed: 68 },
    { name: "SB Luxury", icon: "🚘", price: 55000, speed: 82 },
    { name: "SB Track", icon: "🏎‍🟀", price: 65000, speed: 98 },
    { name: "SB Pickup", icon: "🛻", price: 22000, speed: 70 },
    { name: "SB City", icon: "🚙", price: 16000, speed: 64 },
    { name: "SB Coupe", icon: "🚘", price: 44000, speed: 87 },
    { name: "SB Racer", icon: "🏎‍🟀", price: 100000, speed: 102 },
    { name: "SB Ultimate", icon: "🏎‍🟀", price: 150000, speed: 110 }
];

const maps = [
    { name: "Bangladesh", flag: "🇧🇩", price: 0 },
    { name: "Japan", flag: "🇯🇵", price: 20000 },
    { name: "UAE", flag: "🇦🇪", price: 35000 },
    { name: "USA", flag: "🇺🇸", price: 50000 },
    { name: "UK", flag: "🇬🇧", price: 70000 },
    { name: "Germany", flag: "🇩🇪", price: 90000 }
];


/* ---------- SAVE DATA ---------- */

let game = {
    money: 5000,
    level: 1,
    xp: 0,
    races: 0,
    wins: 0,
    trips: 0,
    selectedCar: 0,
    unlockedCars: [0],
    unlockedMaps: [0],
    name: "SB Driver",
    photo: "",
    friends: []
};


function saveGame() {
    localStorage.setItem(
        "SB_CAR_SAVE",
        JSON.stringify(game)
    );
}


function loadGame() {

    try {

        const saved =
            localStorage.getItem("SB_CAR_SAVE");

        if (saved) {

            const data =
                JSON.parse(saved);

            game = {
                ...game,
                ...data
            };

        }

    } catch (error) {

        console.log("Save error:", error);

    }

}


/* ---------- BASIC FUNCTIONS ---------- */

function moneyUpdate() {

    const money =
        document.getElementById("money");

    if (money) {
        money.textContent =
            game.money.toLocaleString();
    }

}


function message(text) {

    const toast =
        document.getElementById("toast");

    if (!toast) {
        alert(text);
        return;
    }

    toast.textContent = text;
    toast.classList.add("show");

    setTimeout(function () {

        toast.classList.remove("show");

    }, 2000);

}


/* ---------- PAGE SYSTEM ---------- */

function openPage(pageName) {

    const pages =
        document.querySelectorAll(".page");

    pages.forEach(function(page) {

        page.classList.remove("active");

    });


    const selected =
        document.getElementById(pageName);

    if (selected) {
        selected.classList.add("active");
    }


    const buttons =
        document.querySelectorAll(".nav");

    buttons.forEach(function(button) {

        button.classList.remove("active");

        if (
            button.dataset.page === pageName
        ) {

            button.classList.add("active");

        }

    });


    if (pageName === "room") {
        showCars();
    }

    if (pageName === "career") {
        showCareer();
    }

    if (pageName === "profile") {
        showProfile();
    }

    if (pageName === "friends") {
        showFriends();
    }

    if (pageName === "map") {
        showMaps();
    }

}


/* ---------- MENU ---------- */

document
    .querySelectorAll(".nav")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                openPage(
                    button.dataset.page
                );

            }
        );

    });


/* ---------- CARS ---------- */

function carUnlocked(index) {

    return game.unlockedCars.includes(index);

}


function showCars() {

    const garage =
        document.getElementById("garage");

    if (!garage) return;

    garage.innerHTML = "";


    cars.forEach(function(car, index) {

        const unlocked =
            carUnlocked(index);

        const card =
            document.createElement("div");

        card.className = "car-card";


        card.innerHTML = `

            <div class="car-visual">
                ${car.icon}
            </div>

            <div class="car-name">

                <h2>
                    ${car.name}
                </h2>

                <span>
                    ${unlocked ? "✅" : "🔒"}
                </span>

            </div>

            <div class="statline">
                <span>Speed</span>
                <b>${car.speed}</b>
            </div>

            <div class="bar">
                <i style="width:${Math.min(
                    car.speed,
                    100
                )}%"></i>
            </div>

            <p>
                ${
                    unlocked
                    ? "Unlocked"
                    : "Price: " +
                      car.price.toLocaleString()
                }
            </p>

            <div class="car-actions">

                <button
                    onclick="selectCar(${index})">

                    ${
                        game.selectedCar === index
                        ? "Selected"
                        : "Select"
                    }

                </button>

                <button
                    onclick="customize(${index})">

                    Customize

                </button>

            </div>

            ${
                !unlocked
                ?
                `
                <button
                    class="primary"
                    style="width:100%;margin-top:8px"
                    onclick="buyCar(${index})">

                    Unlock Car

                </button>
                `
                :
                ""
            }

        `;


        garage.appendChild(card);

    });

}


function selectCar(index) {

    if (!carUnlocked(index)) {

        message("আগে car unlock করুন।");

        return;

    }


    game.selectedCar = index;

    saveGame();

    showCars();

    message(
        cars[index].name +
        " selected!"
    );

}


function buyCar(index) {

    const car = cars[index];


    if (game.money < car.price) {

        message(
            "এই car কেনার জন্য টাকা কম।"
        );

        return;

    }


    game.money -= car.price;

    game.unlockedCars.push(index);

    game.selectedCar = index;

    saveGame();

    moneyUpdate();

    showCars();

    message(
        car.name +
        " unlocked!"
    );

}


/* ---------- CUSTOMIZE ---------- */

function customize(index) {

    if (!carUnlocked(index)) {

        message("আগে car unlock করুন।");

        return;

    }


    const modal =
        document.getElementById("customModal");

    const title =
        document.getElementById("customTitle");

    const body =
        document.getElementById("customBody");


    title.textContent =
        cars[index].name +
        " Customize";


    body.innerHTML = `

        <div class="custom-preview">
            ${cars[index].icon}
        </div>

        <h3>🎨 Car Colour</h3>

        <div class="swatches">

            <button
                class="swatch"
                style="background:red"
                onclick="changeColour('Red')">
            </button>

            <button
                class="swatch"
                style="background:blue"
                onclick="changeColour('Blue')">
            </button>

            <button
                class="swatch"
                style="background:green"
                onclick="changeColour('Green')">
            </button>

            <button
                class="swatch"
                style="background:white"
                onclick="changeColour('White')">
            </button>

            <button
                class="swatch"
                style="background:black"
                onclick="changeColour('Black')">
            </button>

            <button
                class="swatch"
                style="background:yellow"
                onclick="changeColour('Yellow')">
            </button>

        </div>

        <h3>⚙️ Upgrade</h3>

        <div class="upgrade-grid">

            <div class="upgrade">

                <b>Engine +5</b>

                <p>500 Coins</p>

                <button
                    onclick="upgrade(500)">

                    Upgrade

                </button>

            </div>


            <div class="upgrade">

                <b>Turbo +8</b>

                <p>700 Coins</p>

                <button
                    onclick="upgrade(700)">

                    Upgrade

                </button>

            </div>


            <div class="upgrade">

                <b>Brake +5</b>

                <p>500 Coins</p>

                <button
                    onclick="upgrade(500)">

                    Upgrade

                </button>

            </div>


            <div class="upgrade">

                <b>Handling +6</b>

                <p>600 Coins</p>

                <button
                    onclick="upgrade(600)">

                    Upgrade

                </button>

            </div>

        </div>

    `;


    modal.classList.remove("hidden");

}


function changeColour(colour) {

    message(
        "Car colour changed to " +
        colour
    );

}


function upgrade(price) {

    if (game.money < price) {

        message("Money কম আছে।");

        return;

    }


    game.money -= price;

    saveGame();

    moneyUpdate();

    message("Upgrade complete! ⚙️");

}


const closeModal =
    document.getElementById("closeModal");

if (closeModal) {

    closeModal.addEventListener(
        "click",
        function() {

            document
                .getElementById("customModal")
                .classList.add("hidden");

        }
    );

}


/* ---------- CAREER ---------- */

function showCareer() {

    const levels =
        document.getElementById("levels");

    if (!levels) return;

    levels.innerHTML = "";


    for (
        let i = 1;
        i <= 7;
        i++
    ) {

        const unlocked =
            game.level >= i;


        const card =
            document.createElement("div");

        card.className = "level";


        if (!unlocked) {
            card.classList.add("locked");
        }


        card.innerHTML = `

            <h2>
                Level ${i}
            </h2>

            <p>
                🏁 Race Challenge
            </p>

            <p>
                ⏱️ Time Limit:
                ${100 - i * 5} seconds
            </p>

            ${
                unlocked
                ?
                `
                <button
                    class="primary"
                    onclick="
                    startRace(${100 - i * 5})">

                    Start Race

                </button>
                `
                :
                `
                <p>
                    🔒 Locked
                </p>
                `
            }

        `;


        levels.appendChild(card);

    }

}


/* ---------- RACE ---------- */

let raceActive = false;

let raceTime = 0;

let raceLimit = 90;

let raceTimer = null;

let playerX = 50;


function startRace(time = 90) {

    openPage("play");

    raceLimit = time;

    raceTime = time;

    raceActive = true;

    playerX = 50;


    const player =
        document.getElementById("player");

    if (player) {

        player.style.left =
            "calc(50% - 30px)";

    }


    createTraffic();

    clearInterval(raceTimer);


    updateTimer();


    raceTimer =
        setInterval(function() {

            if (!raceActive) {
                return;
            }

            raceTime--;

            updateTimer();


            if (raceTime <= 0) {

                finishRace(false);

            }

        }, 1000);

}


function updateTimer() {

    const timer =
        document.getElementById("raceTimer");

    if (!timer) return;

    timer.textContent =
        "00:" +
        String(
            Math.max(
                0,
                raceTime
            )
        ).padStart(2, "0");

}


function finishRace(win) {

    if (!raceActive) {
        return;
    }


    raceActive = false;

    clearInterval(raceTimer);


    game.races++;


    if (win) {

        game.wins++;

        game.money += 700;

        game.xp += 30;

        message(
            "🏆 You Win! +700 Coins"
        );

    } else {

        message(
            "⏱️ Time Over!"
        );

    }


    while (game.xp >= 100) {

        game.xp -= 100;

        game.level++;

        message(
            "🎉 Level Up! " +
            game.level
        );

    }


    saveGame();

    moneyUpdate();

    showProfile();

}


function createTraffic() {

    const traffic =
        document.getElementById("traffic");

    if (!traffic) return;


    traffic.innerHTML = "";


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const bot =
            document.createElement("div");

        bot.className = "bot";

        bot.textContent =
            i % 2 === 0
            ? "🚗"
            : "🚕";


        bot.style.left =
            (
                32 +
                (i % 3) * 15
            ) +
            "%";


        bot.style.top =
            (
                80 +
                i * 80
            ) +
            "px";


        traffic.appendChild(bot);

    }

}


function movePlayer(direction) {

    if (!raceActive) {
        return;
    }


    playerX +=
        direction * 3;


    if (playerX < 30) {
        playerX = 30;
    }

    if (playerX > 68) {
        playerX = 68;
    }


    const player =
        document.getElementById("player");

    if (player) {

        player.style.left =
            calc(${playerX}% - 30px);

    }

}


/* ---------- CONTROLS ---------- */

const leftButton =
    document.getElementById("leftBtn");

const rightButton =
    document.getElementById("rightBtn");


if (leftButton) {

    leftButton.addEventListener(
        "click",
        function() {

            movePlayer(-1);

        }
    );

}


if (rightButton) {

    rightButton.addEventListener(
        "click",
        function() {

            movePlayer(1);

        }
    );

}


document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            movePlayer(-1);

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            movePlayer(1);

        }


        if (
            event.key === "r"
        ) {

            startRace(raceLimit);

        }

    }
);


/* ---------- ONLINE MATCH ---------- */

let onlinePlayers = 0;


const addBot =
    document.getElementById("addBot");


if (addBot) {

    addBot.addEventListener(
        "click",
        function() {

            if (onlinePlayers >= 9) {

                message(
                    "Maximum 10 players!"
                );

                return;

            }


            onlinePlayers++;


            const text =
                document.getElementById(
                    "matchPlayers"
                );


            if (text) {

                text.textContent =
                    "You + " +
                    onlinePlayers +
                    " players";

            }


            const list =
                document.getElementById(
                    "roomPlayers"
                );


            if (list) {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "friend";

                item.textContent =
                    "🏎‍🟀 Racer " +
                    onlinePlayers +
                    " Ready";

                list.appendChild(item);

            }

        }
    );

}


const onlineStart =
    document.getElementById(
        "startOnline"
    );


if (onlineStart) {

    onlineStart.addEventListener(
        "click",
        function() {

            startRace(90);

        }
    );

}


/* ---------- PASSENGER ---------- */

let passengerStarted = false;


const passengerButton =
    document.getElementById(
        "passengerBtn"
    );


if (passengerButton) {

    passengerButton.addEventListener(
        "click",
        function() {

            if (!passengerStarted) {

                passengerStarted = true;

                document.getElementById(
                    "missionText"
                ).textContent =
                    "Passenger picked up!";

                document.getElementById(
                    "tripProgress"
                ).style.width =
                    "50%";

                this.textContent =
                    "Deliver Passenger";

                return;

            }


            passengerStarted = false;

            game.trips++;

            game.money += 500;

            game.xp += 15;

            document.getElementById(
                "missionText"
            ).textContent =
                "Passenger delivered!";

            document.getElementById(
                "tripProgress"
            ).style.width =
                "100%";

            this.textContent =
                "Start Passenger Trip";


            saveGame();

            moneyUpdate();

            showProfile();

            message(
                "💵 +500 Coins"
            );

        }
    );

}


/* ---------- PROFILE ---------- */

function showProfile() {

    const name =
        document.getElementById(
            "driverName"
        );

    if (name) {

        name.value =
            game.name;

    }


    const level =
        document.getElementById(
            "profileLevel"
        );

    if (level) {

        level.textContent =
            game.level;

    }


    const xp =
        document.getElementById(
            "xpText"
        );

    if (xp) {

        xp.textContent =
            game.xp +
            " / 100";

    }


    const races =
        document.getElementById(
            "raceText"
        );

    if (races) {

        races.textContent =
            game.races;

    }


    const wins =
        document.getElementById(
            "winText"
        );

    if (wins) {

        wins.textContent =
            game.wins;

    }


    const trips =
        document.getElementById(
            "tripText"
        );

    if (trips) {

        trips.textContent =
            game.trips;

    }


    const avatar =
        document.getElementById(
            "avatar"
        );

    const fallback =
        document.getElementById(
            "avatarFallback"
        );


    if (
        avatar &&
        game.photo
    ) {

        avatar.src =
            game.photo;

        avatar.classList.add(
            "show"
        );

        if (fallback) {

            fallback.style.display =
                "none";

        }

    }

}


const saveProfile =
    document.getElementById(
        "saveProfile"
    );


if (saveProfile) {

    saveProfile.addEventListener(
        "click",
        function() {

            const input =
                document.getElementById(
                    "driverName"
                );


            if (
                input &&
                input.value.trim()
            ) {

                game.name =
                    input.value.trim();

                saveGame();

                message(
                    "Profile Saved!"
                );

            }

        }
    );

}


/* ---------- PROFILE PHOTO ---------- */

const photoInput =
    document.getElementById(
        "photo"
    );


if (photoInput) {

    photoInput.addEventListener(
        "change",
        function(event) {

            const file =
                event.target.files[0];

            if (!file) {
                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function() {

                    game.photo =
                        reader.result;

                    saveGame();

                    showProfile();

                    message(
                        "Profile photo added!"
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}


/* ---------- FRIENDS ---------- */

function showFriends() {

    const list =
        document.getElementById(
            "friendsList"
        );

    if (!list) return;


    if (
        game.friends.length === 0
    ) {

        list.innerHTML =
            "<div class='friend'>No friends yet.</div>";

        return;

    }


    list.innerHTML = "";


    game.friends.forEach(
        function(friend) {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "friend";

            item.textContent =
                "👤 " +
                friend;

            list.appendChild(item);

        }
    );

}


const friendAdd =
    document.getElementById(
        "friendAdd"
    );


if (friendAdd) {

    friendAdd.addEventListener(
        "click",
        function() {

            const input =
                document.getElementById(
                    "friendInput"
                );


            if (
                !input ||
                !input.value.trim()
            ) {

                message(
                    "Friend name লিখুন।"
                );

                return;

            }


            game.friends.push(
                input.value.trim()
            );


            input.value = "";

            saveGame();

            showFriends();

            message(
                "Friend Added!"
            );

        }
    );

}


/* ---------- MAPS ---------- */

function showMaps() {

    const grid =
        document.getElementById(
            "mapGrid"
        );

    if (!grid) return;


    grid.innerHTML = "";


    maps.forEach(
        function(map, index) {

            const unlocked =
                game.unlockedMaps.includes(
                    index
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "map-card";


            if (!unlocked) {

                card.classList.add(
                    "locked"
                );

            }


            card.innerHTML = `

                <h2>
                    ${map.flag}
                    ${map.name}
                </h2>

                <p>
                    ${
                        unlocked
                        ?
                        "✅ Unlocked"
                        :
                        "🔒 " +
                        map.price.toLocaleString() +
                        " Coins"
                    }
                </p>

                ${
                    unlocked
                    ?
                    `
                    <button
                        class="primary"
                        onclick="startRace(90)">

                        Drive

                    </button>
                    `
                    :
                    `
                    <button
                        onclick="unlockMap(${index})">

                        Unlock

                    </button>
                    `
                }

            `;


            grid.appendChild(card);

        }
    );

}


function unlockMap(index) {

    const map =
        maps[index];


    if (
        game.money <
        map.price
    ) {

        message(
            "Map unlock করার মতো money নেই।"
        );

        return;

    }


    game.money -=
        map.price;


    game.unlockedMaps.push(
        index
    );


    saveGame();

    moneyUpdate();

    showMaps();

    message(
        map.name +
        " unlocked!"
    );

}


/* ---------- START ---------- */

loadGame();

moneyUpdate();

showCars();

showCareer();

showProfile();

showFriends();

showMaps();

openPage("room");

console.log(
    "SB Car successfully loaded!"
);