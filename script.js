let unit = "kg";
let isLbs = false;
document.addEventListener('DOMContentLoaded', () => {
fetch("http://localhost:3000/exercises")
  .then(response => response.json())
  .then(data => renderDefault(data)
  );
});

document.addEventListener('DOMContentLoaded', () => {
  let form = document.querySelector('form.log-container')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    let weight = parseInt(e.target[0].value);
    let sets = parseInt(e.target[1].value);
    let reps = parseInt(e.target[2].value);
    handleSubmit(weight, sets, reps)
    form.reset()
  })
})

function handleSubmit(weight, sets, reps) {
  let conversion = checkForConversion(weight)
 
  let id = document.querySelector('div.title').id;
  console.log(conversion)
  fetch(`http://localhost:3000/exercises/${id}`,{
    method: "PATCH",
    headers:{
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      sets: sets,
      reps: reps,
      max: conversion
    })
  })
    .then(res => res.json())
    .then(data => updateLog(data))
}

function checkForConversion(number) {
  if (isLbs) {
    return Math.round(number * 0.453);
  } else {
    return number;
  }
}

function kilogramsToPounds(number) {
  if (isLbs) {
    return Math.round(number * 2.205)
  } else {
    return number
  }
}

function updateLog(data) {
  let volume = parseInt(document.querySelector('span#volume').textContent);
  volume = checkForConversion(volume);
  let indicator = document.querySelector('span#difference');
  indicator.textContent = "";
  if(data.max) {
    let newVolume = parseInt((data.max * data.reps)* data.sets - volume);
    let difference = kilogramsToPounds(newVolume);
    renderPage(data)
    if(difference > 0) {
      indicator.textContent = " ▲" + difference + " " + unit;
      indicator.className = "positive"
      console.log(indicator)
    } else if ( difference < 0) {
      indicator.textContent = " ▼" + Math.abs(difference) + " " + unit;
      indicator.className = "negative"
      console.log(indicator)
    } else {
      indicator.className = "neutral"
      console.log(indicator)
    }
  }
}

function renderDefault(data) {
  const list = document.getElementById('exercises');
  list.innerHTML = "";
  data.forEach((exercise) => {
    let item = document.createElement('li');
    item.textContent = exercise.name.toUpperCase();
    item.classList = "exercise-item";
    item.id = exercise.id;
    item.addEventListener('click', retrieveExercise)
    list.appendChild(item);
  })
}

function retrieveExercise(e) {
  fetch(`http://localhost:3000/exercises/${e.target.id}`)
  .then(res => res.json())
  .then(data => renderPage(data))
  }
function activeStatus(data) {
  document.querySelectorAll('.exercise-item').forEach(item => {
    item.classList.remove('active')
  })
  let activeTag = document.getElementById(data.id);
  activeTag.classList.add('active');
}

function renderPage(data) {
  activeStatus(data);
  document.getElementById('difference').textContent = "";
  document.getElementById('lrgImg').src = data.image;
  document.querySelector('div.title').textContent = data.name.toUpperCase();
  document.querySelector('div.title').id = data.id;
  document.querySelector('span#sets').textContent = data.sets;
  document.querySelector('span#reps').textContent = data.reps;
  let total = document.querySelector('span#volume')
  let max = document.getElementById('currentMax');
  if (isLbs) {
    max.textContent = Math.round(data.max * 2.205) + " " + unit;
    total.textContent = Math.round((data.max * 2.205) * data.reps) * data.sets + " " + unit;
  } else if (!isLbs) {
    max.textContent = data.max + " " + unit;
    total.textContent = (data.max * data.reps) * data.sets + " " + unit;
  }
  const instructions = document.getElementById('instruction');
  instructions.innerHTML = "";
  data.instructions.forEach(line => {
    let item = document.createElement('li');
    item.textContent = line;
    instructions.appendChild(item);
  });
  const muscleTargets = document.getElementById('muscle-targets');
  muscleTargets.innerHTML = "";
  if(data.primary) {
    let target = "prim";
    createTag(data.primary, target)
  }
  if(data.secondary) {
    let target = "sec";
    createTag(data.secondary, target)
  }
}

function createTag(data, target) {
  data.forEach(line => {
    let tag = document.createElement('span');
    tag.textContent = line;
    tag.id = target
    document.getElementById('muscle-targets').appendChild(tag);
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn');
  const btnbox = document.getElementById('button-box');
  btnbox.addEventListener('click', () => {
    let form = document.querySelector('input#weight')
    let id = document.querySelector('div.title').id
    if(unit === 'kg') {
      btn.style.left = '50px';
      unit = 'lb';
      isLbs = true;
      form.placeholder = unit;
    } else if (unit === 'lb') {
      btn.style.left = '3px';
      unit = 'kg';
      isLbs = false
      form.placeholder = unit;
    }
    convertUnits(id);
  })
})

function convertUnits(id) {
  fetch(`http://localhost:3000/exercises/${id}`)
  .then(res => res.json())
  .then(data => renderPage(data))
  }

// 1kg = 2.205lbs