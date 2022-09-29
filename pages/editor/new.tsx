import { ChangeEvent, useState, useEffect } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import styles from './index.module.scss';
import { Input, Button, message, Select } from 'antd';
import request from '../../service/fetch';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/index';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [tagIds, setTagIds] = useState([]);

  const { push } = useRouter();

  const store = useStore();
  const { userId } = store.user.userInfo;

  useEffect(() => {
    request.get('api/tag/get').then((res: any) => {
      if (res?.code === 0) {
        setAllTags(res?.data.allTags);
      }
    });
  }, []);

  const handlePublish = () => {
    if (!title || !content) {
      return message.warning('請輸入文章標題及內容');
    }
    setLoading(true);
    request
      .post('/api/article/publish', {
        title,
        content,
        tagIds,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          userId ? push(`/user/${userId}`) : push('/');
          return message.success('發布成功');
        } else {
          setLoading(false);
          return message.error(res?.msg || '發布失敗');
        }
      })
      .catch(() => message.error('未知的錯誤'));
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (content: any) => {
    setContent(content);
  };

  const handleSelectTag = (value: []) => {
    setTagIds(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.operator}>
        <Input
          className={styles.title}
          placeholder='請輸入文章標題'
          value={title}
          onChange={handleTitleChange}
        />
        <Select
          className={styles.tag}
          placeholder='請選擇標籤'
          mode='multiple'
          allowClear
          onChange={handleSelectTag}
        >
          {allTags?.map((tag: any) => (
            <Select.Option key={tag?._id} value={tag?._id}>
              {tag?.title}
            </Select.Option>
          ))}
        </Select>
        <Button
          className={styles.button}
          type='primary'
          onClick={handlePublish}
          loading={loading}
        >
          發布
        </Button>
      </div>
      <MDEditor height={1080} value={content} onChange={handleContentChange} />
    </div>
  );
};

(NewEditor as any).layout = null;

export default observer(NewEditor);
