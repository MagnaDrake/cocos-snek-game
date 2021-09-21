# cocos-boilerplate
Welcome to Cocos Boilerplate!

The purpose of this boilerplate is to facilitate in setting up new cocos projects, and to help those who just started on the entry task.

Scripts within the `lib` directory are to be regularly updated as our expertise in Cocos grow, but the goal is to keep it thin and effective.

Scripts within the `sample` directory contain examples of objects created using both `lib` and native cocos components.

If there are any suggestions for `lib` or `sample` updates, feel free to create a merge request to be reviewed.

The sample can be accessed at https://play.test.co.id/cocos-boilerplate/

Good luck!


-------------------------------
Information below is to facilitate the deployment of newly created projects.

Things that need to be changed (can ctrl+f cocos-boilerplate in the given files for easier tracking)

-------------------------------
Configs to change:

pipeline.yaml: 
- change project.name
- change project.repo_path
- change domain.path

package.json: 
- change name

.gitlab-ci.yml: 
- change variables.APP_NAME


-------------------------------
Manifest to change:

Rename manifest/cocos-boilerplate to manifest/[project-name]

values.yaml:
- change appName
- change image.repository
- change ingress.path

[env].yaml:
- change appName
- change virtualService.path

Chart.yaml:
- change description
- change name


-------------------------------
Templates to change:

build-templates/web-mobile/index.ejs:
- change <title></title>

preview-template/index.ejs:
- change <title></title>