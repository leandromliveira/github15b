// gera um array com os projetos da turma 15-b, dentre os últimos 100 liberados pela trybe
async function getRepositories(){
  let repositoryFilter = [];
  const response = await fetch('https://api.github.com/orgs/tryber/repos?&sort=created&per_page=100');
  const data = await response.json();
  repositoryFilter = data.filter((repository) => {
    if(repository.name.includes('sd-015-b')) {
      return repository.name;
    }
  }).map(({name, open_issues, url, created_at} ) => ({name, open_issues, url, created_at}));
  return repositoryFilter;
}

function showURL(name) {
  const link = document.createElement('a');
  link.innerText = 'Acesse ao Projeto';
  link.href = `github.com/tryber/${name}`;
  link.target ='_blank';
  return link;
}

function showIssues(issues) {
  const span = document.createElement('span');
  span.innerText = `total de PR abertas ${issues}`;
  return span;
}
//2021-09-23T16:26:19Z
function showDate(date) {
  date.split('').forEach((element, index)=>{
    const year = '';
    const month = '';
    const day = '';
    if(index < 3) {
      year += element;
    } 
  })
}


function showMore(open_issues, url, created_at, name) {
  const project = document.querySelector('.project');
  const url2 = showURL(name);
  const issues = showIssues(open_issues);
  const date = showDate(created_at);
  
  // const arrayDeVariaveis = [url, open_issues, created_at, 'alunos'];
  // arrayDeVariaveis.forEach(element => {
  //   const span = document.createElement('span');
  //   span.innerText = element;
  //   project.appendChild(span);    
  // });
}

async function listProjects() {
  const projects = document.querySelector('.projects');
  const repositories = await getRepositories();
  repositories.forEach(repository => {
    const project = document.createElement('p');
    const selected = document.querySelector('.selected');
    if(selected) {
      selected.classList.remove('selected');
    }
    project.innerText = repository.name;
    project.classList.add(selected);
    project.addEventListener('click', () =>
      showMore(repository.open_issues, repository.url, repository.created_at, repository.name));
    projects.appendChild(project);
  });
}

listProjects();