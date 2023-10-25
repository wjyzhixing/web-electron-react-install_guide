import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { specifiedOrder } from './const';
import './App.css';
import React, { Fragment, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Upload,
  TreeSelect,
  Input,
  Row,
  Col,
  Tree,
  Radio,
  Form,
  InputNumber,
  Select,
  Descriptions,
  Spin,
  Card,
} from 'antd';

const Hello = () => {
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [agree, setAgree] = useState(false);
  const [selectedDirectory, setSelectedDirectory] = useState('');
  // 第四步
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  // 根据此顺序进行后续跳转
  const [jumpKeys, setJumpKeys] = useState([]);
  // 三选一
  const [serverChoose, setServerChoose] = useState('单机');
  const [pageTag, setPageTag] = useState(false);
  // 数据统计
  const [pageName, setPageName] = useState('');
  // 表单数据
  const [formValues, setFormValues] = useState<any>({
    step1: null,
    step2: null,
    step3: null,
    step4: null,
  });
  // 标记是否结束
  const [finish, setFinish] = useState<any>(null);
  const [updateCount, setUpdateCount] = useState(1);

  const nextStep = () => {
    console.log(page, jumpKeys, jumpKeys[page - 5], pageTag);
    form
      .validateFields()
      .then((res) => {
        // window.electronAPI.setTitle('hello');
        if (jumpKeys[page - 5] === '服务器' && !pageTag) {
          setPageTag(true);
        } else {
          setPageTag(false);
          setPage(page + 1);
        }

        if (jumpKeys[page - 5] === jumpKeys[jumpKeys?.length - 1]) {
          setPageName('sum');
        } else if (jumpKeys[page - 5 - 1] === jumpKeys[jumpKeys?.length - 1]) {
          setPageName('setuping');
        }
        console.log(formValues);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const prevStep = () => {
    console.log(jumpKeys[page - 5], 'page', page);
    if (jumpKeys[page - 5] === '服务器' && pageTag) {
      setPageTag(false);
      // setPage(page - 1);
    } else {
      setPageTag(true);
      setPage(page - 1);
    }
    if (jumpKeys[page - 5 - 2] === jumpKeys[jumpKeys?.length - 1]) {
      setPageName('sum');
    }

    if (page === 5) {
      setFormValues({
        step1: null,
        step2: null,
        step3: null,
        step4: null,
      });
    }
  };

  const cancel = () => {
    window.electron.ipcRenderer.sendMessage('close-window');
  };

  const handleDirectorySelect = () => {
    window.electron.ipcRenderer.sendMessage('open-directory-dialog');
    // setSelectedDirectory(directory);
  };

  useEffect(() => {
    window.electron.ipcRenderer.once('selected-directory', (arg: any) => {
      // 处理从主进程返回的所选目录路径
      setSelectedDirectory(arg);
    });
  }, []);

  // useEffect(() => {
  window.electron.ipcRenderer.once('selected-directory', (arg: any) => {
    // 处理从主进程返回的所选目录路径
    setSelectedDirectory(arg);
  });
  // 监听主进程的响应
  window.electron.ipcRenderer.once('encrypt-response', (arg) => {
    console.log('Received API response:', arg, finish);
    finish?.map((i: Record<string, string>) => {
      if (i?.name === '服务器') {
        i.finish = '成功';
      }
    });
    setFinish(JSON.parse(JSON.stringify(finish)));
    // setUpdateCount(updateCount + 1);
  });
  // 监听主进程的响应
  window.electron.ipcRenderer.once('encrypt-response2', (arg) => {
    console.log('Received API response2:', arg, finish);
    finish?.map((i: Record<string, string>) => {
      if (i?.name === '企业管理器') {
        console.log('hello');
        i.finish = '成功';
      }
    });
    setFinish(JSON.parse(JSON.stringify(finish)));
    // setUpdateCount(updateCount + 1);
  });
  // 监听主进程的响应
  window.electron.ipcRenderer.once('encrypt-response3', (arg) => {
    console.log('Received API response3:', arg, finish);
    finish?.map((i: Record<string, string>) => {
      if (i?.name === '数据库迁移服务') {
        i.finish = '成功';
      }
    });
    setFinish(JSON.parse(JSON.stringify(finish)));
    // setUpdateCount(updateCount + 1);
  });
  // 监听主进程的响应
  window.electron.ipcRenderer.once('encrypt-response4', (arg) => {
    console.log('Received API response4:', arg, finish);
    finish?.map((i: Record<string, string>) => {
      if (i?.name === '数据库监控服务') {
        i.finish = '失败';
      }
    });
    setFinish(JSON.parse(JSON.stringify(finish)));
    // setUpdateCount(updateCount + 1);
  });
  // });

  // useEffect(() => {
  //   console.log('update');
  // }, [setUpdateCount]);

  // 第四步
  const treeData = [
    {
      title: '服务器',
      key: '服务器',
    },
    {
      title: '客户端',
      key: '客户端',
      children: [
        {
          title: '企业管理器',
          key: '企业管理器',
        },
      ],
    },
    {
      title: '数据库服务端',
      key: '数据库服务端',
      children: [
        {
          title: '数据库迁移服务',
          key: '数据库迁移服务',
        },
        {
          title: '数据库监控服务',
          key: '数据库监控服务',
        },
      ],
    },
    {
      title: '手册',
      key: '手册',
    },
  ];
  const onCheck = (checkedKeysValue: any) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
    const sortedArray = checkedKeysValue
      ?.filter(
        (i: any) =>
          [
            '企业管理器',
            '服务器',
            '数据库迁移服务',
            '数据库监控服务',
          ]?.includes(i),
      )
      .slice()
      .sort((a: any, b: any) => {
        return specifiedOrder.indexOf(a) - specifiedOrder.indexOf(b);
      });
    setJumpKeys(sortedArray);
    setFinish(
      sortedArray.map((i: any) => ({
        name: i,
        finish: false,
      })),
    );
  };

  const onSelect = (selectedKeysValue: any, info: any) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };

  const onServerChange = (e: any) => {
    console.log('radio checked', e.target.value);
    setServerChoose(e.target.value);
  };

  const handleFormChange = (step: any, values: any) => {
    console.log(values);
    setFormValues({
      ...formValues,
      [step]: values,
    });
  };

  return (
    <div>
      {page === 1 && (
        <div className="centered-container">
          <div style={{ textAlign: 'left' }}>
            <div style={{ margin: '50px 50px 50px 0' }}>欢迎使用安装向导</div>
            <div style={{ margin: '50px 50px 50px 0' }}>
              这个安装向导将指引您完成集群安装
            </div>
            <div style={{ margin: '50px 50px 50px 0' }}>
              在安装之前，请检查端口是否占用
            </div>
            <div style={{ margin: '50px 50px 150px 0' }}>
              在安装之前，请检查端口是否占用
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
            <Button type="primary" onClick={nextStep}>
              下一步
            </Button>
          </div>
        </div>
      )}
      {page === 2 && (
        <div className="centered-container-second">
          <div style={{ textAlign: 'left' }}>
            <h1>产品协议</h1>
            <Checkbox
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            >
              我同意产品协议
            </Checkbox>
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
            <Button onClick={prevStep}>上一步</Button>
            <Button type="primary" onClick={nextStep} disabled={!agree}>
              下一步
            </Button>
            <Button onClick={cancel}>取消</Button>
          </div>
        </div>
      )}
      {page === 3 && (
        <div className="centered-container-second">
          <div style={{ textAlign: 'left' }}>
            <h1>上传 Key 文件</h1>
            <Upload>
              <Button>上传文件</Button>
            </Upload>
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
            <Button onClick={prevStep}>上一步</Button>
            <Button type="primary" onClick={nextStep}>
              下一步
            </Button>
            <Button onClick={cancel}>取消</Button>
          </div>
        </div>
      )}
      {page === 4 && (
        <div className="centered-container-second">
          <div className="left-align">
            <Row gutter={16}>
              <Col span={2} style={{ margin: 'auto' }}>
                <div>安装目录:</div>
              </Col>
              <Col span={19}>
                <div>
                  <Input
                    placeholder="选择安装目录"
                    value={selectedDirectory}
                    readOnly
                  />
                </div>
              </Col>
              <Col span={3}>
                <Button onClick={handleDirectorySelect}>选择安装路径</Button>
              </Col>
            </Row>
            <div style={{ padding: '20px 20px 20px 0px', fontSize: '14px' }}>
              选择要安装的组件
            </div>
            <Tree
              checkable
              autoExpandParent={true}
              defaultExpandAll={true}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeData}
            />
          </div>
          <div className="bottom-right">
            <Button onClick={prevStep}>上一步</Button>
            <Button
              type="primary"
              disabled={selectedDirectory === '' || jumpKeys?.length === 0}
              onClick={nextStep}
            >
              下一步
            </Button>
            <Button onClick={cancel}>取消</Button>
          </div>
        </div>
      )}

      {page > 4 && jumpKeys[page - 5] === '服务器' && !pageTag && (
        <div className="centered-container-second">
          <div className="left-align">
            <div style={{ fontSize: 16, marginBottom: 20 }}>
              服务器类型选择:
            </div>
            <Row gutter={24}>
              <div style={{ margin: '0 10px' }}>选择服务器模式</div>

              <Radio.Group onChange={onServerChange} value={serverChoose}>
                <Radio value={'单机'}>单机</Radio>
                <Radio value={'轻量级'}>轻量级</Radio>
                <Radio value={'集群'}>集群</Radio>
                {/* <Radio value={4}>D</Radio> */}
              </Radio.Group>
            </Row>
          </div>
          <div className="bottom-right">
            <Button onClick={prevStep}>上一步</Button>
            <Button type="primary" onClick={nextStep}>
              下一步
            </Button>
            <Button onClick={cancel}>取消</Button>
          </div>
        </div>
      )}

      {page > 4 &&
        jumpKeys[page - 5] === '服务器' &&
        serverChoose === '单机' &&
        pageTag && (
          <div className="centered-container-second">
            <div className="left-align">
              <div style={{ fontSize: 16, marginBottom: 20 }}>单机集群配置</div>
              <Form
                form={form}
                labelAlign="left"
                onValuesChange={(changedValues, allValues) =>
                  handleFormChange('step1', allValues)
                }
                labelCol={{ span: 5 }} // 控制标签的布局
                wrapperCol={{ offset: 7, span: 11 }} // 控制表单控件的布局
              >
                <Form.Item
                  label="可选服务存储元数据端口"
                  name="seaboxsql_port"
                  rules={[
                    {
                      required: true,
                      message: '请输入可选服务存储元数据端口',
                    },
                  ]}
                  initialValue={2309}
                >
                  <InputNumber
                    placeholder="请输入可选服务存储元数据端口"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Form>
            </div>
            <div className="bottom-right">
              <Button onClick={prevStep}>上一步</Button>
              <Button
                type="primary"
                onClick={() => {
                  console.log(form.getFieldsValue());
                  handleFormChange('step1', form.getFieldsValue());
                  nextStep();
                }}
              >
                下一步
              </Button>
              <Button onClick={cancel}>取消</Button>
            </div>
          </div>
        )}

      {page > 4 &&
        jumpKeys[page - 5] === '服务器' &&
        serverChoose === '轻量级' &&
        pageTag && (
          <div className="centered-container-second">
            <div className="left-align">
              <div style={{ fontSize: 16, marginBottom: 20 }}>
                轻量级集群配置
              </div>
              <div style={{ fontSize: 14 }}>
                无需设置参数，点击下一步即同意配置，进行后续安装配置，若不同意则点击上一步取消勾选
              </div>
            </div>
            <div className="bottom-right">
              <Button onClick={prevStep}>上一步</Button>
              <Button
                type="primary"
                onClick={() => {
                  handleFormChange('step1', { config: '无需配置' });
                  nextStep();
                }}
              >
                下一步
              </Button>
              <Button onClick={cancel}>取消</Button>
            </div>
          </div>
        )}

      {page > 4 &&
        jumpKeys[page - 5] === '服务器' &&
        serverChoose === '集群' &&
        pageTag && (
          <div className="centered-container-second">
            <div
              className="left-align"
              style={{ marginBottom: 20, overflowY: 'auto' }}
            >
              <div style={{ fontSize: 16, marginBottom: 20 }}>集群配置</div>
              <Form
                form={form}
                labelAlign="left"
                labelCol={{ span: 5 }} // 控制标签的布局
                wrapperCol={{ offset: 7, span: 11 }} // 控制表单控件的布局
                onValuesChange={(changedValues, allValues) => {
                  console.log(changedValues, 'changedValues', allValues);
                  if (Object.keys(changedValues)?.includes('hostNodes')) {
                    form.setFieldsValue({
                      address: undefined,
                      scdcs_master: undefined,
                      executor_hostname: undefined,
                      executor_monitor_host: undefined,
                      monitor_hostname: undefined,
                      vip_group: undefined,
                    });
                  }
                  handleFormChange('step1', {
                    ...allValues,
                  });
                }}
                // initialValues={{
                //   vip_group: [
                //     { hostname: 111, network: 'net1' },
                //     { hostname: 222, network: 'net2' },
                //   ],
                // }}
              >
                <>
                  <Form.Item
                    label="主机节点"
                    name="hostNodes"
                    rules={[
                      {
                        required: true,
                        message: '请输入主机节点，按中文逗号隔开',
                      },
                    ]}
                  >
                    <Input placeholder="形如node1,node2,按英文逗号隔开" />
                  </Form.Item>
                  <Form.Item
                    label="数据目录"
                    name="data_dir"
                    rules={[
                      {
                        required: true,
                        message: '请输入数据目录',
                      },
                    ]}
                  >
                    <Input placeholder="请输入数据目录" />
                  </Form.Item>
                  <Form.Item
                    label="SCDCS服务端口"
                    name="scdcs_service_port"
                    rules={[
                      {
                        required: true,
                        message: '请输入SCDCS服务端口',
                      },
                    ]}
                    initialValue={2379}
                  >
                    <InputNumber placeholder="请输入SCDCS服务端口" />
                  </Form.Item>
                  <Form.Item
                    label="SCDCS通讯端口"
                    name="scdcs_phone_port"
                    rules={[
                      {
                        required: true,
                        message: '请输入SCDCS通讯端口',
                      },
                    ]}
                    initialValue={2380}
                  >
                    <InputNumber placeholder="请输入SCDCS通讯端口" />
                  </Form.Item>
                  <Form.Item
                    label="SCDCS安装节点"
                    name="scdcs_master"
                    rules={[
                      {
                        required: true,
                        message: '请选择SCDCS安装节点',
                      },
                    ]}
                  >
                    <Select placeholder="请选择SCDCS安装节点" mode="multiple">
                      {formValues?.step1?.hostNodes
                        ?.split(',')
                        .map((host: any, index: number) => (
                          <Select.Option key={index} value={host.trim()}>
                            {host.trim()}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="SCDCS安装地址"
                    name="scdcs_address"
                    rules={[
                      {
                        required: true,
                        message: '请输入SCDCS安装地址',
                      },
                    ]}
                  >
                    <Input placeholder="请输入SCDCS安装地址" />
                  </Form.Item>
                  <Form.Item
                    label="Executor服务端口"
                    name="executor_port"
                    rules={[
                      {
                        required: true,
                        message: '请输入Executor服务端口',
                      },
                    ]}
                    initialValue={8800}
                  >
                    <InputNumber placeholder="请输入Executor服务端口" />
                  </Form.Item>
                  <Form.Item
                    label="每节点部署Executor数目"
                    name="executor_number"
                    rules={[
                      {
                        required: true,
                        message: '请输入每节点部署Executor数目',
                      },
                    ]}
                    initialValue={1}
                  >
                    <InputNumber placeholder="请输入每节点部署Executor数目" />
                  </Form.Item>
                  <Form.Item
                    label="每节点部署Executor镜像数"
                    name="executor_mirror"
                    rules={[
                      {
                        required: true,
                        message: '请输入每节点部署Executor镜像数',
                      },
                    ]}
                    initialValue={2}
                  >
                    <InputNumber placeholder="请输入每节点部署Executor镜像数" />
                  </Form.Item>
                  <Form.Item
                    label="Executor主机名"
                    name="executor_hostname"
                    rules={[
                      {
                        required: true,
                        message: '请选择Executor主机名',
                      },
                    ]}
                  >
                    <Select placeholder="请选择Executor主机名">
                      {formValues?.step1?.hostNodes
                        ?.split(',')
                        .map((host: string, index: number) => (
                          <Select.Option key={index} value={host.trim()}>
                            {host.trim()}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Executor monitor_host"
                    name="executor_monitor_host"
                    rules={[
                      {
                        required: true,
                        message: '请选择executor_monitor_hoste',
                      },
                    ]}
                  >
                    <Select
                      placeholder="请选择executor_monitor_hoste"
                      mode="multiple"
                    >
                      {formValues?.step1?.hostNodes
                        ?.split(',')
                        .map((host: string, index: number) => (
                          <Select.Option key={index} value={host.trim()}>
                            {host.trim()}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Monitor主机名"
                    name="monitor_hostname"
                    rules={[
                      {
                        required: true,
                        message: '请选择Monitor主机名',
                      },
                    ]}
                  >
                    <Select placeholder="请选择Monitor主机名">
                      {formValues?.step1?.hostNodes
                        ?.split(',')
                        .map((host: string, index: number) => (
                          <Select.Option key={index} value={host.trim()}>
                            {host.trim()}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="vip地址"
                    name="vip_addr"
                    rules={[
                      {
                        required: true,
                        message: '请输入vip地址',
                      },
                    ]}
                  >
                    <Input placeholder="请输入vip地址" />
                  </Form.Item>
                  <Form.List name="vip_group">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <div style={{ display: 'flex', width: '100%' }}>
                            <div style={{ width: '80%' }}>
                              <Form.Item
                                {...restField}
                                name={[name, 'hostname']}
                                label="vip hostname"
                                wrapperCol={{ offset: 10, span: 9 }}
                                rules={[
                                  {
                                    required: true,
                                    message: '请选择vip hostname',
                                  },
                                ]}
                              >
                                <Select placeholder="请选择vip hostname">
                                  {formValues?.step1?.hostNodes
                                    ?.split(',')
                                    .map((host: string, index: number) => (
                                      <Select.Option
                                        key={index}
                                        value={host.trim()}
                                      >
                                        {host.trim()}
                                      </Select.Option>
                                    ))}
                                </Select>
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'network']}
                                label="network分组"
                                wrapperCol={{ offset: 10, span: 9 }}
                                rules={[
                                  {
                                    required: true,
                                    message: '请输入network',
                                  },
                                ]}
                              >
                                <Input placeholder="请输入network" />
                              </Form.Item>
                            </div>
                            <div className="remove">
                              <Button
                                type="dashed"
                                onClick={() => remove(name)}
                                block
                              >
                                删除
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block>
                            新增一个vip_host
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </>
              </Form>
            </div>
            <div className="bottom-right">
              <Button onClick={prevStep}>上一步</Button>
              <Button type="primary" onClick={nextStep}>
                下一步
              </Button>
              <Button onClick={cancel}>取消</Button>
            </div>
          </div>
        )}

      {page > 4 && jumpKeys[page - 5] === '企业管理器' && (
        <div className="centered-container-second">
          <div className="left-align">
            <div style={{ fontSize: 16, marginBottom: 20 }}>企业管理器配置</div>
            <div style={{ fontSize: 14 }}>
              无需设置参数，点击下一步即同意配置，进行后续安装配置，若不同意则点击上一步取消勾选
            </div>
          </div>
          <div className="bottom-right">
            <Button onClick={prevStep}>上一步</Button>
            <Button
              type="primary"
              onClick={() => {
                handleFormChange('step4', { config: '无需配置' });
                nextStep();
              }}
            >
              下一步
            </Button>
            <Button onClick={cancel}>取消</Button>
          </div>
        </div>
      )}

      {page > 4 && jumpKeys[page - 5] === '数据库迁移服务' && (
        <div className="centered-container-second">
          <div className="left-align">
            <div style={{ fontSize: 16, marginBottom: 20 }}>
              数据库迁移服务配置
            </div>
            <Form
              form={form}
              labelAlign="left"
              onValuesChange={(changedValues, allValues) =>
                handleFormChange('step2', allValues)
              }
              labelCol={{ span: 5 }} // 控制标签的布局
              wrapperCol={{ offset: 7, span: 11 }} // 控制表单控件的布局
            >
              <Form.Item
                label="数据库迁移服务端口"
                name="server_port"
                rules={[
                  {
                    required: true,
                    message: '请输入可选服务存储元数据端口',
                  },
                ]}
                initialValue={9088}
              >
                <InputNumber
                  placeholder="请输入可选服务存储元数据端口"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Form>
          </div>
          <div className="bottom-right">
            <Button onClick={prevStep}>上一步</Button>
            <Button
              type="primary"
              onClick={() => {
                console.log(form.getFieldsValue());
                handleFormChange('step2', form.getFieldsValue());
                nextStep();
              }}
            >
              下一步
            </Button>
            <Button onClick={cancel}>取消</Button>
          </div>
        </div>
      )}

      {page > 4 && jumpKeys[page - 5] === '数据库监控服务' && (
        <div className="centered-container-second">
          <div className="left-align">
            <div style={{ fontSize: 16, marginBottom: 20 }}>
              数据库监控服务配置
            </div>
            <Form
              form={form}
              labelAlign="left"
              onValuesChange={(changedValues, allValues) =>
                handleFormChange('step3', allValues)
              }
              labelCol={{ span: 5 }} // 控制标签的布局
              wrapperCol={{ offset: 7, span: 11 }} // 控制表单控件的布局
            >
              <Form.Item
                label="Prometheus端口"
                name="prometheus_port"
                rules={[
                  {
                    required: true,
                    message: '请输入Prometheus端口',
                  },
                ]}
                initialValue={9090}
              >
                <InputNumber
                  placeholder="请输入可选服务存储元数据端口"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                label="Redis端口"
                name="redis_port"
                rules={[
                  {
                    required: true,
                    message: '请输入Redis端口',
                  },
                ]}
                initialValue={6379}
              >
                <InputNumber
                  placeholder="请输入可选服务存储元数据端口"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                label="Redis密码"
                name="redis_password"
                rules={[
                  {
                    required: true,
                    message: '请输入Redis密码',
                  },
                ]}
              >
                <Input.Password
                  placeholder="请输入Redis密码"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                label="SeaboxSql端口"
                name="seabox_sql_port"
                rules={[
                  {
                    required: true,
                    message: '请输入SeaboxSql端口',
                  },
                ]}
                initialValue={7300}
              >
                <InputNumber
                  placeholder="请输入SeaboxSql端口"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                label="SDMSWebApi端口"
                name="sdms_webapi_port"
                rules={[
                  {
                    required: true,
                    message: '请输入SDMSWebApi端口',
                  },
                ]}
                initialValue={18000}
              >
                <InputNumber
                  placeholder="请输入SDMSWebApi端口"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                label="SDMSServer端口"
                name="sdms_server_port"
                rules={[
                  {
                    required: true,
                    message: '请输入SDMSServer端口',
                  },
                ]}
                initialValue={19000}
              >
                <InputNumber
                  placeholder="请输入SDMSServer端口"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                label="IbexAgent端口"
                name="ibex_agent_port"
                rules={[
                  {
                    required: true,
                    message: '请输入IbexAgent端口',
                  },
                ]}
                initialValue={2090}
              >
                <InputNumber
                  placeholder="请输入IbexAgent端口"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Form>
          </div>
          <div className="bottom-right">
            <Button onClick={prevStep}>上一步</Button>
            <Button
              type="primary"
              onClick={() => {
                console.log(form.getFieldsValue());
                handleFormChange('step3', form.getFieldsValue());
                nextStep();
              }}
            >
              下一步
            </Button>
            <Button onClick={cancel}>取消</Button>
          </div>
        </div>
      )}

      {page > 4 &&
        !specifiedOrder?.includes(jumpKeys[page - 5]) &&
        pageName === 'sum' && (
          <div className="centered-container-second">
            <div
              className="left-align"
              style={{ overflowY: 'auto', marginBottom: 30 }}
            >
              <div style={{ fontSize: 16, marginBottom: 20 }}>安装前小结:</div>
              {formValues?.step1 && (
                <Descriptions
                  bordered
                  title="服务器配置"
                  items={Object.entries(formValues?.step1).map(
                    (i: any, index) => ({
                      key: index,
                      label: i[0],
                      children: i[1].toString(),
                    }),
                  )}
                  column={1}
                />
              )}
              {formValues?.step2 && (
                <Descriptions
                  bordered
                  title="数据库迁移配置"
                  items={Object.entries(formValues?.step2).map(
                    (i: any, index) => ({
                      key: index,
                      label: i[0],
                      children: i[1].toString(),
                    }),
                  )}
                  column={1}
                />
              )}
              {formValues?.step4 && (
                <Descriptions
                  bordered
                  title="企业管理器配置"
                  items={Object.entries(formValues?.step4).map(
                    (i: any, index) => ({
                      key: index,
                      label: i[0],
                      children: i[1].toString(),
                    }),
                  )}
                  column={1}
                />
              )}
              {formValues?.step3 && (
                <Descriptions
                  bordered
                  title="数据库监控服务配置"
                  items={Object.entries(formValues?.step3).map(
                    (i: any, index) => ({
                      key: index,
                      label: i[0],
                      children: i[1].toString(),
                    }),
                  )}
                  column={1}
                />
              )}
            </div>
            <div className="bottom-right">
              <Button onClick={prevStep}>上一步</Button>
              <Button
                type="primary"
                onClick={() => {
                  nextStep();
                  window.electron.ipcRenderer.sendMessage('encrypt', {
                    text: 'hello',
                  });
                  window.electron.ipcRenderer.sendMessage('encrypt2', {
                    text: 'hello2',
                  });
                  window.electron.ipcRenderer.sendMessage('encrypt3', {
                    text: 'hello3',
                  });
                  window.electron.ipcRenderer.sendMessage('encrypt4', {
                    text: 'hello4',
                  });
                  // 'http://localhost:3001/api/v1/cipher/external/asym/auth/encrypt',
                }}
              >
                下一步
              </Button>
              <Button onClick={cancel}>取消</Button>
            </div>
          </div>
        )}
      {/* {console.log(finish)} */}

      {page > 4 &&
        !specifiedOrder?.includes(jumpKeys[page - 5]) &&
        pageName === 'setuping' && (
          <div className="centered-container-second">
            <div
              className="left-align"
              style={{ overflowY: 'auto', marginBottom: 30 }}
            >
              {/* <Row gutter={24}> */}
              {finish !== null &&
              finish?.length !== 0 &&
              finish?.every(
                (i: Record<string, string>) =>
                  ['成功', '失败']?.includes(i?.finish),
              ) ? (
                <>
                  <div style={{ fontSize: 16, marginBottom: 20 }}>安装完成</div>

                  {finish?.map((i: Record<string, string>) => (
                    <>
                      <Card title={i?.name} style={{ margin: 10 }}>
                        <div>{i?.finish ? '安装成功' : '安装失败'}</div>
                        <Button
                          onClick={() => {
                            alert('gg');
                          }}
                        >
                          查看日志
                        </Button>
                      </Card>
                    </>
                  ))}
                </>
              ) : (
                <div>安装中，请稍后</div>
              )}
              {/* </Row> */}
            </div>
            <Spin
              spinning={
                finish !== null &&
                finish?.filter((i: Record<string, string>) => i?.finish)
                  ? false
                  : true
              }
            ></Spin>
            <div className="bottom-right">
              {/* <Button onClick={prevStep}>上一步</Button> */}
              <Button
                type="primary"
                onClick={cancel}
                disabled={
                  !(
                    finish !== null &&
                    finish?.length !== 0 &&
                    finish?.every(
                      (i: Record<string, string>) =>
                        ['成功', '失败']?.includes(i?.finish),
                    )
                  )
                }
              >
                完成
              </Button>
              <Button onClick={cancel}>取消</Button>
            </div>
          </div>
        )}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
