<template>
	<div id="visavid_prefs" class="section">
		<h2>
			<a class="icon icon-visavid" />
			{{ t('integration_visavid', 'Visavid integration') }}
		</h2>
		<div class="fields">
			<div class="field">
				<ServerIcon :size="20" />
				<label for="base-url">
					{{ t('integration_visavid', 'Base API URL') }}
				</label>
				<input id="base-url"
					v-model="state.base_url"
					type="text"
					:placeholder="t('integration_visavid', 'https://...')"
					@input="onInput">
			</div>
			<div class="field">
				<LockIcon :size="20" />
				<label for="api-key">
					{{ t('integration_visavid', 'API key') }}
				</label>
				<input id="api-key"
					v-model="state.api_key"
					type="password"
					:readonly="readonly"
					:placeholder="t('integration_visavid', '...')"
					@input="onInput"
					@focus="readonly = false">
			</div>
		</div>
	</div>
</template>

<script>
import { loadState } from '@nextcloud/initial-state'
import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { delay } from '../utils'
import { showSuccess, showError } from '@nextcloud/dialogs'
// import '@nextcloud/dialogs/styles/toast.scss'

import ServerIcon from 'vue-material-design-icons/Server'
import LockIcon from 'vue-material-design-icons/Lock'

export default {
	name: 'AdminSettings',

	components: {
		ServerIcon,
		LockIcon,
	},

	props: [],

	data() {
		return {
			state: loadState('integration_visavid', 'admin-config'),
			// to prevent some browsers to fill fields with remembered passwords
			readonly: true,
		}
	},

	watch: {
	},

	mounted() {
	},

	methods: {
		onInput() {
			const that = this
			delay(() => {
				that.saveOptions()
			}, 2000)()
		},
		saveOptions() {
			const req = {
				values: {
					api_key: this.state.api_key,
					base_url: this.state.base_url,
				},
			}
			const url = generateUrl('/apps/integration_visavid/admin-config')
			axios.put(url, req).then((response) => {
				showSuccess(t('integration_visavid', 'Visavid admin options saved'))
			}).catch((error) => {
				showError(
					t('integration_visavid', 'Failed to save Visavid admin options')
						+ ': ' + (error.response?.request?.responseText ?? '')
				)
				console.debug(error)
			}).then(() => {
			})
		},
	},
}
</script>

<style scoped lang="scss">
.fields {
	display: flex;
	flex-direction: column;
	.field {
		display: flex;
		align-items: center;
		margin: 5px 0 5px 0;
		> * {
			margin: 0 5px 0 5px;
		}
		label {
			width: 150px;
		}
		input {
			width: 200px;
		}
	}
}

.icon-visavid {
	background-image: url(./../../img/app-dark.svg);
	background-size: 23px 23px;
	height: 23px;
	margin-bottom: -4px;
	filter: var(--background-invert-if-dark);
}

body.theme--dark .icon-visavid {
	background-image: url(./../../img/app.svg);
}

</style>
