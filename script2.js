// gera um array com os projetos da turma 15-b, dentre os últimos 100 liberados pela trybe
async function getRepositories(){
  const response = await fetch('https://api.github.com/orgs/tryber/repos?&sort=created&per_page=100');
  const data = await response.json();
  const repositoryFilter = data.filter((repository) => {
    if(repository.name.includes('sd-015-b')) {
      return repository.name;
    }
  }).map(({name, open_issues, url, created_at} ) => ({name, open_issues, url, created_at}));
  return repositoryFilter;
}

function showName(name) {
  const div = document.createElement('div');
  div.innerText = name.split('015-b-').pop();
  return div;
}

function showURL(name) {
  const link = document.createElement('a');
  link.innerText = 'Acesse o projeto';
  link.href = `https://github.com/tryber/${name}`;
  link.target ='_blank';
  return link;
}

function showIssues(issues) {
  const div = document.createElement('div');
  div.innerText = `total de PR abertas ${issues}`;
  return div;
}
function showDate(date) {
  const div = document.createElement('div');
  div.innerText = `projeto criado no dia ${new Intl.DateTimeFormat('pt-BR').format(new Date(date))}`
  return div; 
}

async function getStudents(name) {
  const response = await fetch(`https://api.github.com/repos/tryber/${name}/issues?&sort=comments&per_page=10`);
  const data = await response.json();
  return data.map(({user}) => ({login:user.login, avatar: user.avatar_url, url: user.html_url, followers: user.followers_url}))
}

function showLogin(login) {
  const div = document.createElement('div');
  div.innerText = `usuário: ${login}`;
  return div;
}

function showAvatar(avatar, url) {
  const link = document.createElement('a');
  link.href = url;
  link.target ='_blank';
  const img = document.createElement('img');
  img.src = avatar;
  img.alt = 'foto do perfil no github';
  link.appendChild(img);
  return link;
}

async function showFollowers(followers_url) {
  const followers = await fetch(followers_url);
  const arrayFollowers = await followers.json();
  const div = document.createElement('div');
  div.innerText = `seguidores: ${arrayFollowers.length}`;
  return div;
}

async function showStudents(name) {
  const allStudents = await getStudents(name);
  const studentsDetails = document.querySelector('.students-details');
  studentsDetails.innerText = '';
  for (let index = 0; index < allStudents.length; index += 1) {
    studentsDetails.appendChild(showAvatar(allStudents[index].avatar, allStudents[index].url));
    studentsDetails.appendChild(showLogin(allStudents[index].login));
    studentsDetails.appendChild(await showFollowers(allStudents[index].followers));
    studentsDetails.appendChild(document.createElement('br'));
  }
}

function showButton(name) {
  const button = document.createElement('button');
  button.innerText = 'Ver alguns alunos que abriram PR';
  button.addEventListener('click', () => showStudents(name));
  return button;
}


function showMore(event, open_issues, created_at, name) {
  const selected = document.querySelector('.selected');
  if(selected) {
    selected.classList.remove('selected');
  }
  event.target.classList.add('selected');
  const project = document.querySelector('.project-details');
  project.innerText = '';
  project.appendChild(showName(name));
  project.appendChild(showURL(name));
  project.appendChild(showIssues(open_issues));
  project.appendChild(showDate(created_at));
  project.appendChild(showButton(name));
}

async function listProjects() {
  const projects = document.querySelector('.projects');
  const repositories = await getRepositories();
  repositories.forEach(repository => {
    const project = document.createElement('p');
    project.innerText = repository.name;
    project.addEventListener('click', (event) =>
      showMore(event, repository.open_issues, repository.created_at, repository.name));
    projects.appendChild(project);
  });
}

listProjects();