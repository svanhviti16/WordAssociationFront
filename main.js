// Basic game structure based on Brad Traversy's speed-typing game tutorial: https://www.youtube.com/watch?v=Yw-SYSG-028

window.addEventListener('load', init);

// Global scope variables
let time = 10;
let score = 0;
let isPlaying;
scoreStorage = window.localStorage;

// DOM elements
const wordInput = document.querySelector('#word-input')
const currentWord = document.querySelector('#current-word')
const scoreDisplay = document.querySelector('#score')
const scoreText = document.querySelector('#scoreText')
const timeDisplay = document.querySelector('#time')
const message = document.querySelector('#message')
const feedback = document.querySelector('#feedback')
const seconds = document.querySelector('#seconds')
const skyldheitiDisplay = document.querySelector('#skyldheiti')
var wordDict = {}
var isValid;

// Initialize Game
function init() {
  // getting user score from local storage
  score = scoreStorage.getItem("userScore");
  if (score >= 1) {
      scoreDisplay.innerHTML = score;
  }
  else {
      scoreDisplay.innerHTML = "0";
  }
  // display random word
  showWord(wordDict);
  // check typed words - waiting for user to press enter
  matchWords(wordDict);
}

// match word to skyldheiti
// random index word
function showWord(wordDict) {
  fetch('http://localhost:5042/skyldflettur')
  .then(function(response) {
    return response.json();
  })
  .then(word => {
    wordDict["frum"] = word.frumfletta;
    wordDict["skyld"] = word.skyldflettur;
    // contains the count
    wordDict["userdata"] = word.notendaord;

    currentWord.innerHTML = wordDict.frum;
    return wordDict;
  }).catch(err => {
    console.log("Error fetching word from server.")
  });
}

function matchWords(wordDict) {
  wordInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      if (!wordInput.value) {
        return;
      }
      //for cheating:
      //console.log(wordDict)

      fetch(`http://localhost:5042/userword/${wordInput.value}+${wordDict.frum}`)
      .then(function(response) {
        return response.json();
      })
      .then(result => {
        isValid = result.is_valid;
        return isValid;
      })
      .then(isValid => {
        var timeOut = 1400;
        if (wordDict.skyld.includes(wordInput.value)) {
          wordInput.value = '';
          score++;
          scoreStorage.setItem("userScore", score);
          score = scoreStorage.getItem("userScore");
          feedback.className="green-text";
          feedback.innerHTML = "Já, þetta er á skrá sem skyldheiti!";
        }

        else if (wordDict.userdata[wordInput.value]) {
          feedback.className="purple-text";
          if (wordDict.userdata[wordInput.value] == 1) {
            feedback.innerHTML = `${wordDict.userdata[wordInput.value]} annar hefur skrifað þetta orð!`;
          }
          else {
            feedback.innerHTML = `${wordDict.userdata[wordInput.value]} aðrir hafa skrifað þetta orð!`;
          }
        }
        else if (isValid) {
          wordInput.value = '';
          feedback.className="blue-text";
          feedback.innerHTML = 'Áhugavert orð, við skráum það niður';
        }

        // TODO someday: multi-word inputs not in skyldheiti
        else {
          wordInput.value = '';
          feedback.className="red-text";
          feedback.innerHTML = "Þetta er nú eitthvað skrýtið orð."
        }

        setTimeout(function() {
          feedback.innerHTML = "";
          window.location.reload(true);
        }, timeOut);
      })
    }
  })
}

function displaySkyldheiti() {
  return skyldheitiDisplay.innerHTML = wordDict.skyld;
}

