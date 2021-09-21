# cocos-boilerplate

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