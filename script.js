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
    let weight = e.target[0].value;
    let sets = e.target[1].value;
    let reps = e.target[2].value;
    handleSubmit(weight, sets, reps)
    form.reset()
  })
})

function handleSubmit(weight, sets, reps) {
  let id = document.querySelector('div.title').id;
  console.log(id)
  fetch(`http://localhost:3000/exercises/${id}`,{
    method: "PATCH",
    headers:{
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      sets: sets,
      reps: reps,
      max: weight
    })
  })
    .then(res => res.json())
    .then(data => updateLog(data))
}

function updateLog(data) {
  let volume = document.querySelector('span#volume').textContent;
  let indicator = document.querySelector('span#difference');
  indicator.textContent = "";
  if(data.max) {
    let newVolume = parseInt((data.max * data.reps)* data.sets);
    const difference = newVolume - volume;
    if(difference > 0) {
      indicator.textContent = " ▲" + difference + " kg";
      indicator.className = "positive"
    } else if ( difference < 0) {
      indicator.textContent = " ▼" + Math.abs(difference) + " kg";
      indicator.className = "negative"
    } else {
      indicator.className = "neutral"
    }
  }
   renderPage(data)
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

function renderPage(data) {
  document.getElementById('lrgImg').src = data.image;
  document.querySelector('div.title').textContent = data.name.toUpperCase();
  document.querySelector('div.title').id = data.id;
  document.querySelector('span#sets').textContent = data.sets;
  document.querySelector('span#reps').textContent = data.reps;
  document.querySelector('span#currentMax').textContent = data.max;
  document.querySelector('span#volume').textContent = parseInt((data.max * data.reps) * data.sets);
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


