// requires: vue.js

var app = new Vue({
	el: '#app',
	data: {
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
		}
	}
});

Vue.component( 'issue', {
	props: ['issue', 'format'],
	template: `<div class="issue"><span v-if="'markdown' == format">* Closed {{issue.label}}: {{issue.title}} ([Issue #{{issue.number}}]({{issue.url}}))</span>
	<li v-else class="fixed"><span class="two">Closed {{issue.label}}</span> {{issue.title}} <a v-bind:href="issue.url" target="_blank">Issue #{{issue.number}}</a></li></div>`
});