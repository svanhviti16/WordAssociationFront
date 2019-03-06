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
  scoreDisplay.innerHTML = score;
  console.log("in init")
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
    console.log("Frumfletta: " + word.frumfletta);
    console.log("Skyldflettur: " + word.skyldflettur);
    wordDict["frum"] = word.frumfletta;
    wordDict["skyld"] = word.skyldflettur;
    currentWord.innerHTML = wordDict.frum;
    return wordDict;
  }).catch(err => {
    console.log("Error fetching word from server.")
  });
}


function matchWords(wordDict) {
  wordInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      console.log(wordInput.value);
      if (!wordInput.value) {
        return;
      }
      fetch(`http://localhost:5042/user_word/${wordInput.value}`)
      .then(function(response) {
        return response.json();
      })
      .then(result => {
        isValid = result.is_valid;
        console.log(isValid);
        return isValid;
      })
      .then(isValid => {
        console.log(wordDict)
        var timeOut = 1000;
        if (wordDict.skyld.includes(wordInput.value)) {
          wordInput.value = '';
          score++;
          scoreStorage.setItem("userScore", score);
          score = scoreStorage.getItem("userScore");
          feedback.innerHTML = "Já, þetta er á skrá hjá okkur!"; 
        }

        else if (isValid) {
          console.log(isValid + " " + wordInput.value)
          wordInput.value = '';
          feedback.innerHTML = 'Áhugavert orð, en ekki skráð skyldheiti';
          // time delay to display text      
        }

        else {
          console.log(isValid + " " + wordInput.value)
          wordInput.value = '';
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

