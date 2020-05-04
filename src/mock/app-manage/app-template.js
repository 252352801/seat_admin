
import Mock from 'mockjs'
console.log(Mock)
const mock = Mock.mock;
(() => {
  const data = {
    status: true,
    code: 200,
    data: [
      '注册应用模版1',
      '注册应用模版2'
    ]
  }
  mock('/api/v1/cmdb/ansible/rolesname/', 'get', data)
})();
(() => {
  const data = {
    status: true,
    code: 200,
    data: {
      default: {
        type: 'javascript',
        content: 'var a=b'
      },
      yaml: {
        type: 'yaml',
        content: ''
      },
      shell: {
        type: 'shell',
        content: 'env=test'
      }
    }
  }
  //
  mock(/\/api\/v1\/cmdb\/ansible\/rolesdetail\/\?name=.*/, 'get', function (conf) {
    console.log(conf)
    return data
  })
})()
