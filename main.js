import './style.css';
import { quizQuestions } from './js/questions.js';

// Game state
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let quizStarted = false;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const questionContainer = document.getElementById('question-container');
const resultsScreen = document.getElementById('results-screen');
const questionNumberElement = document.getElementById('question-number');
const questionTextElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackElement = document.getElementById('feedback');
const nextButton = document.getElementById('next-btn');
const timerElement = document.querySelector('#timer span');
const scoreElement = document.querySelector('#score span');
const finalScoreElement = document.getElementById('final-score');
const scoreMessageElement = document.getElementById('score-message');
const startButton = document.getElementById('start-btn');
const restartButton = document.getElementById('restart-btn');

// Add event listeners
startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', resetQuiz);

// Start the quiz
function startQuiz() {
  welcomeScreen.classList.add('hidden');
  questionContainer.classList.remove('hidden');
  quizStarted = true;
  
  // Reset game state
  currentQuestionIndex = 0;
  score = 0;
  scoreElement.textContent = score;
  
  // Load first question
  loadQuestion(currentQuestionIndex);
}

// Reset the quiz
function resetQuiz() {
  resultsScreen.classList.add('hidden');
  quizStarted = false;
  startQuiz();
}

// Load a question
function loadQuestion(index) {
  const question = quizQuestions[index];
  
  // Update question number
  questionNumberElement.textContent = `Question ${index + 1}/${quizQuestions.length}`;
  
  // Update question text
  questionTextElement.textContent = question.question;
  
  // Clear previous options
  optionsContainer.innerHTML = '';
  
  // Add options
  question.options.forEach((option, i) => {
    const optionElement = document.createElement('div');
    optionElement.classList.add('option');
    optionElement.classList.add('slide-in');
    optionElement.textContent = option;
    optionElement.dataset.index = i;
    optionElement.addEventListener('click', checkAnswer);
    optionsContainer.appendChild(optionElement);
    
    // Add delay to stagger animation
    optionElement.style.animationDelay = `${i * 0.1}s`;
  });
  
  // Hide feedback and next button
  feedbackElement.classList.add('hidden');
  nextButton.classList.add('hidden');
  
  // Start timer
  startTimer();
}

// Check the selected answer
function checkAnswer(event) {
  // Stop the timer
  clearTimeout(timer);
  
  const selectedOptionIndex = parseInt(event.target.dataset.index);
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  // Disable all options
  const options = document.querySelectorAll('.option');
  options.forEach(option => {
    option.classList.add('disabled');
  });
  
  // Show correct and incorrect answers
  options[currentQuestion.correctAnswer].classList.add('correct');
  
  // Check if answer is correct
  if (selectedOptionIndex === currentQuestion.correctAnswer) {
    // Correct answer
    score += 10;
    scoreElement.textContent = score;
    
    // Show feedback
    feedbackElement.textContent = `Correct! ${currentQuestion.explanation}`;
    feedbackElement.className = 'correct';
  } else {
    // Incorrect answer
    options[selectedOptionIndex].classList.add('incorrect');
    
    // Show feedback
    feedbackElement.textContent = `Incorrect. ${currentQuestion.explanation}`;
    feedbackElement.className = 'incorrect';
  }
  
  feedbackElement.classList.remove('hidden');
  
  // Show next button if not the last question
  if (currentQuestionIndex < quizQuestions.length - 1) {
    nextButton.classList.remove('hidden');
  } else {
    // Show end screen after a delay if it's the last question
    setTimeout(showResults, 2000);
  }
}

// Move to next question
function nextQuestion() {
  currentQuestionIndex++;
  
  if (currentQuestionIndex < quizQuestions.length) {
    loadQuestion(currentQuestionIndex);
  } else {
    showResults();
  }
}

// Show results screen
function showResults() {
  questionContainer.classList.add('hidden');
  resultsScreen.classList.remove('hidden');
  
  finalScoreElement.textContent = `${score}/${quizQuestions.length * 10}`;
  
  // Generate score message based on score
  const percentage = (score / (quizQuestions.length * 10)) * 100;
  
  if (percentage >= 90) {
    scoreMessageElement.textContent = "Amazing! You're an SEO expert!";
  } else if (percentage >= 70) {
    scoreMessageElement.textContent = "Great job! You have a solid understanding of SEO!";
  } else if (percentage >= 50) {
    scoreMessageElement.textContent = "Good effort! You know the basics of SEO.";
  } else {
    scoreMessageElement.textContent = "Keep learning! SEO has a lot of nuances.";
  }
}

// Start timer
function startTimer() {
  // Reset timer
  timeLeft = 30;
  timerElement.textContent = timeLeft;
  
  // Remove warning class if it exists
  timerElement.parentElement.classList.remove('warning');
  
  // Clear existing timer
  clearTimeout(timer);
  
  // Update timer every second
  function updateTimer() {
    timeLeft--;
    timerElement.textContent = timeLeft;
    
    // Add warning class when time is running out
    if (timeLeft <= 10) {
      timerElement.parentElement.classList.add('warning');
    }
    
    if (timeLeft <= 0) {
      // Time's up
      clearTimeout(timer);
      
      // Auto-select wrong answer
      const options = document.querySelectorAll('.option');
      const currentQuestion = quizQuestions[currentQuestionIndex];
      
      // Disable all options
      options.forEach(option => {
        option.classList.add('disabled');
      });
      
      // Show correct answer
      options[currentQuestion.correctAnswer].classList.add('correct');
      
      // Show feedback
      feedbackElement.textContent = `Time's up! ${currentQuestion.explanation}`;
      feedbackElement.className = 'incorrect';
      feedbackElement.classList.remove('hidden');
      
      // Show next button if not the last question
      if (currentQuestionIndex < quizQuestions.length - 1) {
        nextButton.classList.remove('hidden');
      } else {
        // Show end screen after a delay if it's the last question
        setTimeout(showResults, 2000);
      }
    } else {
      // Continue timer
      timer = setTimeout(updateTimer, 1000);
    }
  }
  
  // Start the timer
  timer = setTimeout(updateTimer, 1000);
}
