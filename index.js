const DB_VERSION = 1;
const DB_NAME = "GameButtonDatabase";
const COLLECTION_GAMES = "games";

function openDatabase() {
    return new Promise(function(resolve, reject) {
        let request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = function(event) {
            alert("An error has occured opening the database");
            reject();
        }

        request.onsuccess = function(event) {
            resolve(event.target.result);
        }

        request.onupgradeneeded  = function(event) {
            let db = event.target.result;
            if (event.oldVersion <= 1) {
                let gamesStore = db.createObjectStore(COLLECTION_GAMES, { keyPath: "name" });
                //gamesStore.createIndex("name", "name", { unique: true });
            }
        }
    });
}


/**
 * Gets a list of games in the users library.
 * @return {Promise} Promise object which contains a list of strings containing the games in the users library
 */
function getGamesList() {
    return new Promise(async function(resolve, reject) {
        let db = await openDatabase();
        let transaction = db.transaction([COLLECTION_GAMES],"readwrite");
        let gamesStore = transaction.objectStore(COLLECTION_GAMES);

        let gamesRequest = gamesStore.getAll();

        gamesRequest.onerror = function(event) {
            alert("An error occured fetching the list of games from the database");
            reject();
        }

        gamesRequest.onsuccess = function(event) {
            let gameNames = event.target.result.map( game => game.name );
            resolve(gameNames);
        }
    });
}

/**
 * Added a game to the database
 * @param {String[]} names List of names of games to add to the database
 */
async function addGames(names) {
    let db = await openDatabase();
    let transaction = db.transaction([COLLECTION_GAMES],"readwrite");
    let gamesStore = transaction.objectStore(COLLECTION_GAMES);

    for(i in names) {
        let game = {
            name: names[i]
        }
        let request = gamesStore.put(game);
        request.onsuccess = function(event) {
            console.log('Game added');
        }
    }
    
}

function pick(items) {
    let index = Math.floor(Math.random() * items.length);
    let game = items[index];
    return game;
}

const app = new Vue({
    el: '#app',
    data: {
        game: '',
        library: []
    },
    methods: {
        async pickGame() {
            console.log('picking game');
            let games = await getGamesList()
            let game = pick(games);
            console.log(game);
            this.game = game;
        },
        async addGame() {
            addGame('tactical intervension');
        }
    }
})