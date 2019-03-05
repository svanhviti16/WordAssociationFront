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
  fetch('http://localhost:3001/fletta')
  .then(function(response) {
    return response.json();
  })
  .then(word => {
    console.log("Frumfletta: " + word.fletta.frumfletta);
    console.log("Skyldflettur: " + word.fletta.skyldflettur);
    //words.push([word.fletta.frumfletta, word.fletta.skyldflettur]);
    wordDict["frum"] = word.fletta.frumfletta;
    wordDict["skyld"] = word.fletta.skyldflettur;
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
      // word sanity check (lookup in BÍN?)
      // save input to db
      // check if input matches an item in the skyldflettur array
      //displaySkyldheiti();

      console.log(wordDict)
      var timeOut = 600;
      if (wordDict.skyld.includes(wordInput.value)) {
        console.log("passar");
        wordInput.value = '';
        score++;
        scoreStorage.setItem("userScore", score);
        score = scoreStorage.getItem("userScore");
        feedback.innerHTML = "Já, þetta er á skrá hjá okkur!";
        // time delay to display text
        setTimeout(function() {
          feedback.innerHTML = "";
          window.location.reload(true);
        }, timeOut); 
        
        return true;
      }
      else {
        wordInput.value = '';
        feedback.innerHTML = 'Áhugavert orð, en ekki skráð skyldheiti';
        // time delay to display text
        setTimeout(function() {
          feedback.innerHTML = "";
          window.location.reload(true);
        }, timeOut);      
        return false;
      }
    }
  })
}



function displaySkyldheiti() {
  return skyldheitiDisplay.innerHTML = wordDict.skyld;
}

