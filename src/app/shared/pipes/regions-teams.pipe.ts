import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'regionsTeams',
})
export class RegionsTeamsPipe implements PipeTransform {
	transform(arr: any, regionConfig: string, teamConfig: string): any {
		try {
			if (arr.teams == null || arr.teams?.length == 0) {
				if (arr.regions?.length == 1) {
					return arr.regions[0].region_title;
				} else if (arr.regions?.length > 1) {
					return arr.regions?.length + ' ' + regionConfig;
				}
			}
			if (arr?.regions.length == 0) {
				if (arr.teams?.length == 1) {
					return arr.teams[0].team_title;
				} else if (arr.teams?.length > 1) {
					return arr.teams?.length + ' ' + teamConfig;
				}
			}
			if (arr?.regions.length == 1) {
				if (arr.teams?.length == 1) {
					return arr.teams[0].team_title + ' | ' + arr.regions[0].region_title;
				} else if (arr.teams?.length > 1) {
					return arr.teams?.length + ' ' + teamConfig + ' | ' + arr.regions[0].region_title;
				}
			}
			if (arr?.regions.length > 1) {
				if (arr.teams?.length == 1) {
					return arr.teams[0].team_title + ' | ' + arr.regions.length + ' ' + regionConfig;
				} else if (arr.teams?.length > 1) {
					return arr.teams?.length + ' ' + teamConfig + ' | ' + arr.regions?.length + ' ' + regionConfig;
				}
			}
			// if (arr.regions?.length == 1 && !arr.teams) {
			// 	return arr.regions[0].region_title;
			// }
			// if (arr.teams?.length == 1 && !arr.regions) {
			// 	return arr.teams[0].team_title;
			// }
			// if (arr.regions?.length > 0 && !arr.teams) {
			// 	return arr.regions?.length + ' ' + regionConfig;
			// }
			// if (arr.teams?.length > 0 && !arr.regions) {
			// 	return arr.teams?.length + ' ' + teamConfig;
			// }
			// if (arr.regions?.length == 1 && arr.teams?.length == 1) {
			// 	return arr.teams[0].team_title + ' | ' + arr.regions[0].region_title;
			// }
			// if (arr.regions?.length == 1 && arr.teams?.length > 0) {
			// 	return arr.teams?.length + ' ' + teamConfig + ' | ' + arr.regions[0].region_title;
			// }
			// if (arr.teams?.length == 1 && arr.regions?.length > 0) {
			// 	return arr.teams[0].team_title + ' | ' + arr.regions.length + ' ' + regionConfig;
			// }
			// if (arr.regions?.length > 0 && arr.teams?.length > 0) {
			// 	return arr.teams?.length + ' ' + teamConfig + ' | ' + arr.regions?.length + ' ' + regionConfig;
			// }
			// if (arr.teams?.length == 1 && arr.regions?.length > 1) {
			// 	return arr.teams[0].team_title + ' | ' + arr.regions.length + ' ' + regionConfig;
			// }
			// if (arr.regions?.length > 1 && arr.teams?.length > 1) {
			// 	return arr.teams?.length + ' ' + teamConfig + ' | ' + arr.regions?.length + ' ' + regionConfig;
			// }
		} catch (error) {}
	}
}
