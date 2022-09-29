import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Input, Button, message, Spin } from 'antd';
import request from '../../service/fetch';
import styles from './index.module.scss';

interface IFormValues {
  job: string;
  introduce: string;
  nickname: string;
}

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 4 },
};

const UserProfile = () => {
  const [fetching, setFetching] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setFetching(true);
    request
      .get('/api/user/detail')
      .then((res: any) => {
        if (res?.code === 0) {
          form.setFieldsValue(res?.data);
        }
      })
      .then(() => setFetching(false));
  }, [form]);

  const handleSubmit = (values: IFormValues) => {
    setFetching(true);
    request
      .post('/api/user/update', { ...values })
      .then((res: any) => {
        if (res?.code === 0) {
          message.success('修改成功');
        } else {
          message.error(res?.msg || '發生預期之外的錯誤');
        }
      })
      .then(() => setFetching(false));
  };

  return (
    <div className='content-layout'>
      <div className={styles.userProfile}>
        <h2>個人資料</h2>
        <Spin spinning={fetching} size='large'>
          <Form
            {...formLayout}
            form={form}
            className={styles.form}
            onFinish={handleSubmit}
          >
            <Form.Item label='暱稱' name='nickname'>
              <Input placeholder='請輸入暱稱' />
            </Form.Item>
            <Form.Item label='職位' name='job'>
              <Input placeholder='請輸入職位' />
            </Form.Item>
            <Form.Item label='個人介紹' name='introduce'>
              <Input.TextArea placeholder='請輸入個人介紹' rows={4} />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type='primary' htmlType='submit'>
                保存修改
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default observer(UserProfile);
