import http from '@/http'
const { request } = http
export default {
  generateVersion: data => request({
    url: '/api/v1/cmdb/asset/version/name/',
    method: 'post',
    data
  }),
  getGrayVersions: query => request({
    url: '/api/v1/cmdb/bd/gray/deployment/versions/',
    method: 'get',
    query
  }),
  getGrayVersionsWithDetail: query => request({
    url: '/api/v1/cmdb/bd/gray/deployment/version/details/',
    method: 'get',
    query
  }),
  getLog: query => request({
    url: '/api/v1/cmdb/task/log/details/',
    method: 'get',
    query
  }),
  getUsers: query => request({
    url: '/api/v1/cmdb/users/list/',
    method: 'get',
    query
  }),
  getJiraUsers: query => request({
    url: '/api/v1/cmdb/bd/jira/users/',
    method: 'get',
    query
  }),
  getDictionary: dictName => request({
    url: '/api/v1/cmdb/unified/dict/details/',
    method: 'get',
    query: {
      dict_type: dictName
    }
  }),
  getLogTrace: query => request({
    url: '/api/v1/cmdb/log/dynamics/',
    method: 'get',
    query
  }),
  computeCloudCost: query => request({
    url: '/api/v1/cmdb/unified/cloud/costcounts/',
    method: 'get',
    query
  }),
  getReleaseFlowAutoConfig: query => request({
    url: '/api/v1/cmdb/unified/onekey/release/autocfgs/',
    method: 'get',
    query
  }),
  getStashProject: query => request({
    url: '/api/v1/cmdb/asset/project/stashs/',
    method: 'get',
    query
  }),
  getJiraProject: query => request({
    url: '/api/v1/cmdb/asset/project/jiras/',
    method: 'get',
    query
  }),
  getWikiProject: query => request({
    url: '/api/v1/cmdb/asset/project/wikis/',
    method: 'get',
    query
  }),
  getFieldValueSuggestion: query => request({
    url: 'api/v1/cmdb/unified/recommend/name/',
    method: 'get',
    query
  })
}
