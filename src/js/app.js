const user         = document.querySelector('#user');
const repo         = document.querySelector('#repo');
const milestone    = document.querySelector('#milestone');
const issueList    = document.querySelector('#issues');
const switchButton = document.querySelector('#switch-button');

let repos      = [];
let milestones = [];
let issues     = [];

/**
 * Load user's repos from endpoint
 */
function loadRepos() {
    fetch( `https://api.github.com/users/${this.value}/repos` )
        .then( response => 200 !== response.status ? [] : response.json() )
        .then( data => {
            repos = [...data];
            repo.innerHTML = '<option selected disabled value="">Please select one</option>' + repos.reduce( (html, single) => {
                return html + `
							<option value="${single.name}">${single.name}</option>
							`;
            }, '');
        });
}

/**
 * Load repo's milestones from endpoint
 */
function loadMilestones() {
    fetch( `https://api.github.com/repos/${user.value}/${this.value}/milestones?state=all&per_page=50&direction=desc` )
        .then( ( response ) => 200 !== response.status ? [] : response.json() )
        .then( ( data ) => {
            milestones = [...data];
            milestone.innerHTML = '<option selected disabled value="">Please select one</option>' + milestones.reduce( (html, single) => {
                return html + `
							<option value="${single.number}">${single.title}</option>
							`;
            }, '');
        });
}

/**
 * Load milestone's issues from endpoint
 */
function loadIssues() {
    fetch( `https://api.github.com/repos/${user.value}/${repo.value}/issues?milestone=${this.value}&state=all` )
        .then( ( response ) => 200 !== response.status ? [] : response.json() )
        .then( ( data ) => {
            issues = [...data.filter( issue => ! issue.hasOwnProperty( 'pull_request' ) && 'closed' === issue.state )];
            displayIssues();
        });
}

function displayIssues() {
    const style = issueList.classList.contains( 'markdown' ) ? 'html' : 'markdown';
    if ( 'markdown' === style ) {
        issueList.classList.add('markdown');
    } else {
        issueList.classList.remove('markdown');
    }
    issueList.innerHTML = issues.reduce( (html, single) => {
        const label = single.labels.length > 0 ? ' ' + single.labels[0].name : '';
        html += '<li>';
        if ( 'markdown' === style ) {
            html += `* Closed${label}: ${single.title} ([Issue #${single.number}](${single.url}))`;
        } else {
            html += `<span class="issue-type">Closed${label}</span> ${single.title} <a href="${single.url}" target="_blank" class="issue-link">Issue #${single.number}</a>`;
        }
        return html + '</li>';
    }, '');
}

user.addEventListener('change', loadRepos);
user.addEventListener('keyup', loadRepos);
repo.addEventListener('change', loadMilestones);
milestone.addEventListener('change', loadIssues);
switchButton.addEventListener('click', displayIssues);