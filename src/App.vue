<template>
	<v-app>

		<div>

			<div v-if="$auth.ready()">
				<router-view></router-view>
			</div>

			<div v-if="!$auth.ready()">
				Loading ...
			</div>

		</div>

    
	</v-app>
</template>
