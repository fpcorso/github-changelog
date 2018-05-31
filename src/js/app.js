var app = new Vue({
	el: '#app',
	data: {
		user: 'fpcorso',
		repo: 'quiz_master_next',
		milestone: 50,
		issues: [],
		format: 'HTML'
	},
	methods: {
		switchFormat: function() {
			if ( 'HTML' === this.format ) {
				this.format = 'markdown';
			} else {
				this.format = 'HTML';
			}
		},
		loadIssues: function() {
			fetch( 'https://api.github.com/repos/' + this.user + '/' + this.repo + '/issues?milestone=' + this.milestone + '&state=all' )
				.then( ( response ) => {
					if ( 422 === response.status ) {
						alert( 'Error!' );
						return [];
					}
					return response.json();
				})
				.then( ( issueJson ) => {
					let returnedIssues = [];
					issueJson.forEach(issue => {
						if ( ! issue.hasOwnProperty( 'pull_request' ) ) {
							if ( 'closed' === issue.state ) {
								let label = '';
								if ( 0 < issue.labels.length ) {
									label = issue.labels[0].name;
								}
								returnedIssues.push({
									id: issue.number,
									title: issue.title,
									url: issue.url,
									label: label
								});
							}
						}
					});
					this.issues = returnedIssues;
				})
		}
	},
	mounted: function() {
		this.loadIssues();
	}
});

Vue.component( 'issue', {
	props: ['issue', 'format'],
	template: `<div class="issue"><span v-if="'markdown' == format">* Closed {{issue.label}}: {{issue.title}} ([Issue #{{issue.id}}]({{issue.url}}))</span>
	<li v-else class="fixed"><span class="two">Closed {{issue.label}}</span> {{issue.title}} <a v-bind:href="issue.url" target="_blank">Issue #{{issue.id}}</a></li></div>`
});