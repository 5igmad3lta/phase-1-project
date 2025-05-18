fetch("http://localhost:3000/exercises")
  .then(response => response.json())
  .then(data => renderDefault(data)
  );

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
