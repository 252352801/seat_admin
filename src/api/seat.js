import http from '@/http'
const { request } = http
export default {
  create: (data) => request({
    url: '/api/v1/seats/',
    method: 'post',
    data: data
  }),
  update: (id, data) => request({
    url: `/api/v1/seats/${id}/`,
    method: 'put',
    data: data
  }),
  del: (id, data) => request({
    url: `/api/v1/seats/${id}/`,
    method: 'delete',
    data: data
  }),
  getDetail: (id) => request({
    url: `/api/v1/seats/${id}/`,
    method: 'get'
  }),
  getList: query => request({
    url: '/api/v1/seats/',
    method: 'get',
    query
  })
}
