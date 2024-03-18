import { request } from '@/request';

// 测试接口
export function getTestData(data: Install.testParams) {
  return request('/api/v1/cipher/external/asym/auth/encrypt', {
    method: 'POST',
    data,
  });
}

// 测试树
export function getTreeData(data: any) {
  return request('/api/tree', {
    method: 'POST',
    data,
  });
}
