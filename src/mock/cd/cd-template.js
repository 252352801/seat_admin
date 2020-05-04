
import Mock from 'mockjs'
console.log(Mock)
const mock = Mock.mock;
(() => {
  const data = {
    status: true,
    code: 200,
    data: [
      '注册CD模版1',
      '注册CD模版2'
    ]
  }
  mock('/api/v1/cmdb/cd/temp/names/', 'get', data)
})();
(() => {
  const data = {
    status: true,
    code: 200,
    data: {
      type: 'yaml',
      content: '',
      transfer: true
    }
  }
  /// api/v1/cmdb/cd/temp/ymldetail/
  mock(/\/api\/v1\/cmdb\/cd\/temp\/ymldetail\/\?name=.*/, 'get', function (conf) {
    console.log(conf)
    return data
  })
})()
