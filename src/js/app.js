var app = new Vue({
	el: '#app',
	data: {
		user: '',
		repo: '',
		milestone: '',
		repos: [],
		milestones: [],
		issues: [],
		format: 'markdown'
	},
	watch: {
		user: function (val) {
			this.loadRepos();
		},
		repo: function (val) {
			this.loadMilestones();
		},
		milestone: function (val) {
			this.loadIssues();
		}
	},
	methods: {
		/**
		 * Switches between HTML and Markdown
		 */
		switchFormat: function() {
			if ( 'HTML' === this.format ) {
				this.format = 'markdown';
			} else {
				this.format = 'HTML';
			}
		},
		/**
		 * Loads the repos the user owns and stores them in the app's "repos" key
		 */
		loadRepos: function() {
			// Get the repos.
			fetch( 'https://api.github.com/users/' + this.user + '/repos' )
				.then( ( response ) => {
					// Makes sure there is no error.
					if ( 422 === response.status ) {
						alert( 'Error!' );
						return [];
					}
					return response.json();
				})
				.then( ( repoJson ) => {
					// Creates an array and puts the name of each repo into the array.
					let returnedRepos = [];
					repoJson.forEach(repo => {
						returnedRepos.push( repo.name );
					});
					this.repos = returnedRepos;
				});
		},
		/**
		 * Loads the milestones in the repo and stores them in the app's "milestones" key
		 */
		loadMilestones: function() {
			// Gets the milestones.
			fetch( 'https://api.github.com/repos/' + this.user + '/' + this.repo + '/milestones?state=all&per_page=50&direction=desc' )
				.then( ( response ) => {
					// Makes sure there is no error.
					if ( 422 === response.status ) {
						alert( 'Error!' );
						return [];
					}
					return response.json();
				})
				.then( ( milestoneJson ) => {
					let returnedMilestones = [];
					milestoneJson.forEach(milestone => {
						returnedMilestones.push( { id: milestone.number, name: milestone.title } );
					});
					this.milestones = returnedMilestones;
				});
		},
		/**
		 * Loads the issues in the milestone and stores them in the app's "issues" key
		 */
		loadIssues: function() {
			// Gets the issues.
			fetch( 'https://api.github.com/repos/' + this.user + '/' + this.repo + '/issues?milestone=' + this.milestone + '&state=all' )
				.then( ( response ) => {
					// Makes sure there is no errors.
					if ( 422 === response.status ) {
						alert( 'Error!' );
						return [];
					}
					return response.json();
				})
				.then( ( issueJson ) => {
					let returnedIssues = [];
					// Cycle through each issue.
					issueJson.forEach(issue => {
						// Makes sure it is not a pull request as GitHub's API returned pull requests with the issues.
						if ( ! issue.hasOwnProperty( 'pull_request' ) ) {
							// Makes sure the issue is closed.
							if ( 'closed' === issue.state ) {

								// Gets the first label from the issue, if any.
								let label = '';
								if ( 0 < issue.labels.length ) {
									label = issue.labels[0].name;
								}
								returnedIssues.push({
									id: issue.number,
									title: issue.title,
									url: issue.html_url,
									label: label
								});
							}
						}
					});
					this.issues = returnedIssues;
				});
		}
	}
});

Vue.component( 'issue', {
	props: ['issue', 'format'],
	template: `<div class="issue"><span v-if="'markdown' == format">* Closed {{issue.label}}: {{issue.title}} ([Issue #{{issue.id}}]({{issue.url}}))</span>
	<li v-else class="fixed"><span class="two">Closed {{issue.label}}</span> {{issue.title}} <a v-bind:href="issue.url" target="_blank">Issue #{{issue.id}}</a></li></div>`
});