{{- define "chart.fullname" -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- printf "%s-%s" .Release.Namespace $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
