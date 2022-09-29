import { ChangeEvent, useState, useEffect } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import styles from './index.module.scss';
import { Input, Button, message, Select } from 'antd';
import request from '../../service/fetch';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { connectToDatabase } from '../../lib/db';
import { IArticle } from '../../components/ArticleList';
import { ObjectId } from 'mongodb';

export interface IProps {
  article: IArticle;
  articleTags: [];
  allTags: [];
}

export async function getServerSideProps({ params }: { params: any }) {
  const articleId = params?.id;
  const client = await connectToDatabase();

  const articleCollection = client.db().collection('articles');
  const article = await articleCollection.findOne({
    _id: new ObjectId(articleId),
  });

  const tagCollection = client.db().collection('tags');
  const articleTags = await tagCollection
    .find({ tagArticles: new ObjectId(articleId) })
    .toArray();
  const allTags = await await tagCollection.find({}).toArray();
  client.close();
  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
      articleTags: JSON.parse(JSON.stringify(articleTags)),
      allTags: JSON.parse(JSON.stringify(allTags)),
    },
  };
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const ModifyEditor = ({ article, articleTags, allTags }: IProps) => {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [tagIds, setTagIds] = useState<any>(
    articleTags.map((tag: any) => tag._id)
  );
  const [loading, setLoading] = useState(false);

  const { push, query } = useRouter();
  const articleId = query?.id;

  const handlePublish = () => {
    if (!title || !content) {
      return message.warning('請輸入文章標題及內容');
    }
    setLoading(true);
    request
      .post('/api/article/update', {
        title,
        content,
        articleId,
        tagIds,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          articleId ? push(`/article/${articleId}`) : push('/');
          return message.success('更新成功');
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
          value={tagIds}
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

(ModifyEditor as any).layout = null;

export default observer(ModifyEditor);
